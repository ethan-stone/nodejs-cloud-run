import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as docker from "@pulumi/docker";
import * as fs from "fs";

const repository = new gcp.artifactregistry.Repository("backend", {
  location: "us-central1",
  repositoryId: "backend",
  description: "repo for backend services",
  format: "DOCKER"
});

const apiImage = new docker.Image("api-app", {
  imageName: pulumi.interpolate`us-central1-docker.pkg.dev/${gcp.config.project}/${repository.name}/api-app`,
  build: {
    context: "../server"
  }
});

const superTokensImage = new docker.Image("supertokens-app", {
  imageName: pulumi.interpolate`us-central1-docker.pkg.dev/${gcp.config.project}/${repository.name}/supertokens-app`,
  build: {
    context: "../supertokens"
  }
});

const postgresUrl = gcp.secretmanager.Secret.get(
  "POSTGRES_URL",
  "projects/754526787746/secrets/POSTGRES_URL"
);

const googleClientSecret = gcp.secretmanager.Secret.get(
  "GOOGLE_CLIENT_ID",
  "projects/754526787746/secrets/GOOGLE_CLIENT_SECRET"
);

const superTokensServiceServiceAccount = new gcp.serviceaccount.Account(
  "supertokens-run",
  {
    accountId: "supertokens-run-id",
    displayName: "Supertokens Cloud Run Service Service Account"
  }
);

const apiServiceServiceAccount = new gcp.serviceaccount.Account("api-run", {
  accountId: "api-run-id",
  displayName: "API Cloud Run Service Service Account"
});

new gcp.secretmanager.SecretIamBinding("postgresql-secret-iam-binding", {
  project: gcp.config.project,
  secretId: postgresUrl.secretId,
  role: "roles/secretmanager.secretAccessor",
  members: [
    pulumi.interpolate`serviceAccount:${superTokensServiceServiceAccount.email}`,
    pulumi.interpolate`serviceAccount:${apiServiceServiceAccount.email}`
  ]
});

new gcp.secretmanager.SecretIamBinding("google-client-secret-iam-binding", {
  project: gcp.config.project,
  secretId: googleClientSecret.secretId,
  role: "roles/secretmanager.secretAccessor",
  members: [
    pulumi.interpolate`serviceAccount:${apiServiceServiceAccount.email}`
  ]
});

const superTokensService = new gcp.cloudrun.Service("supertokens-service", {
  location: "us-central1",
  template: {
    spec: {
      serviceAccountName: superTokensServiceServiceAccount.email,
      containers: [
        {
          image: superTokensImage.imageName,
          envs: [
            {
              name: "SUPERTOKENS_PORT",
              value: "8080"
            },
            {
              name: "POSTGRESQL_CONNECTION_URI",
              valueFrom: {
                secretKeyRef: {
                  name: postgresUrl.secretId,
                  key: "1"
                }
              }
            },
            {
              name: "POSTGRESQL_CA_CERT_URL",
              value:
                "https://cockroachlabs.cloud/clusters/ecdc1020-c942-4374-b9c1-b08993391bad/cert"
            }
          ]
        }
      ]
    }
  }
});

const apiService = new gcp.cloudrun.Service("api-service", {
  location: "us-central1",
  template: {
    spec: {
      serviceAccountName: apiServiceServiceAccount.email,
      containers: [
        {
          image: apiImage.imageName,
          envs: [
            {
              name: "NODE_ENV",
              value: "development"
            },
            {
              name: "DATABASE_URL",
              valueFrom: {
                secretKeyRef: {
                  name: postgresUrl.secretId,
                  key: "1"
                }
              }
            },
            {
              name: "GOOGLE_CLIENT_SECRET",
              valueFrom: {
                secretKeyRef: {
                  name: googleClientSecret.secretId,
                  key: "1"
                }
              }
            },
            {
              name: "GOOGLE_CLIENT_ID",
              value:
                "754526787746-nvjft7tltbri9hn4skikbmfv8fsc69qo.apps.googleusercontent.com"
            },
            {
              name: "SUPERTOKENS_CONNECTION_URI",
              value: superTokensService.statuses[0].url
            },
            {
              name: "APP_NANE",
              value: "nodejs-cloud-run"
            },
            {
              name: "API_DOMAIN",
              value: "https://api-service-a1ff4d0-m2nntdyxma-uc.a.run.app"
            },
            {
              name: "WEBSITE_DOMAIN",
              value: "http://localhost:3000"
            },
            {
              name: "API_BASE_PATH",
              value: "/v1/auth"
            },
            {
              name: "WEBSITE_BASE_PATH",
              value: "/auth"
            }
          ]
        }
      ]
    },
    metadata: {
      annotations: {
        "autoscaling.knative.dev/minScale": "0",
        "autoscaling.knative.dev/maxScale": "1"
      }
    }
  }
});

new gcp.cloudrun.IamMember("supertokens-api-access-iam", {
  service: superTokensService.name,
  location: "us-central1",
  role: "roles/run.invoker",
  member: pulumi.interpolate`serviceAccount:${apiServiceServiceAccount.email}`
});

new gcp.cloudrun.IamMember("api-public-access-iam", {
  service: apiService.name,
  location: "us-central1",
  role: "roles/run.invoker",
  member: "allUsers"
});

export const apiServiceUrl = apiService.statuses[0].url;
export const superTokensServiceUrl = superTokensService.statuses[0].url;
