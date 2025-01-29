import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/presentation/app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import redoc from 'redoc-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Brain Agriculture API')
    .setDescription('Documentação da API Brain Agriculture')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, { jsonDocumentUrl: 'docs.json' });

  app.use(
    '/api',
    redoc({
      title: 'Brain Agriculture API',
      specUrl: '/docs.json',
      nonce: '',
    }),
  );

  await app.listen(3000);
}
bootstrap();
