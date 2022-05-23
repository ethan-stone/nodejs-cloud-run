import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { convert } from 'api-spec-converter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1');

  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setVersion('1.0.0')
      .setTitle('API Gateway + Cloud Run')
      .setDescription('Sample API on APIGateway with a Cloud Run backend')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document);

    const convertedDocument = await convert({
      from: 'openapi_3',
      to: 'swagger_2',
      source: document,
    });

    const yamlStr = yaml.dump({ ...convertedDocument.spec });

    fs.writeFileSync('./openapi-spec.yaml', yamlStr);
  }

  await app.listen(8080);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
