import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { convert } from 'api-spec-converter';

async function genOpenapi() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setVersion('1.0.0')
    .setTitle('API Gateway + Cloud Run')
    .setDescription('Sample API on APIGateway with a Cloud Run backend')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const convertedDocument = await convert({
    from: 'openapi_3',
    to: 'swagger_2',
    source: document,
  });

  const yamlStr = yaml.dump({ ...convertedDocument.spec });

  fs.writeFileSync('./openapi-spec.yaml', yamlStr);
}

genOpenapi();
