import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import * as docker from '@pulumi/docker';
import * as fs from 'fs';

const imageName = 'api-app';

const apiImage = new docker.Image(imageName, {
  imageName: pulumi.interpolate`gcr.io/${gcp.config.project}/${imageName}`,
  build: {
    context: '../',
  },
});

const apiService = new gcp.cloudrun.Service('api-service', {
  location: 'us-central1',
  template: {
    spec: {
      containers: [
        {
          image: apiImage.imageName,
        },
      ],
    },
    metadata: {
      annotations: {
        'autoscaling.knative.dev/minScale': '0',
        'autoscaling.knative.dev/maxScale': '1',
      },
    },
  },
});

new gcp.cloudrun.IamMember('api-iam', {
  service: apiService.name,
  location: 'us-central1',
  role: 'roles/run.invoker',
  member: 'allUsers',
});

export const apiServiceUrl = apiService.statuses[0].url;

const api = new gcp.apigateway.Api('api', { apiId: 'api' });

const apiConfigStr = fs.readFileSync('../openapi-spec.yaml').toString();

const newApiConfigStr = apiServiceUrl.apply((apiServiceUrlValue) =>
  Buffer.from(
    apiConfigStr.replace('${api_backend}', apiServiceUrlValue),
  ).toString('base64'),
);

const apiConfig = new gcp.apigateway.ApiConfig('apiConfig', {
  api: api.apiId,
  apiConfigIdPrefix: 'config',
  openapiDocuments: [
    {
      document: {
        path: 'openapi-spec.yaml',
        contents: newApiConfigStr,
      },
    },
  ],
});

const apiGateway = new gcp.apigateway.Gateway('apiGateway', {
  region: 'us-central1',
  apiConfig: apiConfig.id,
  gatewayId: 'api-gw',
});

export const apiGatewayUrl = apiGateway.defaultHostname;
