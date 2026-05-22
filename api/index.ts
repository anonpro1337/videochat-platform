import 'reflect-metadata';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { AppModule } from '../apps/api/src/app.module';
import { HttpExceptionFilter } from '../apps/api/src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../apps/api/src/common/interceptors/transform.interceptor';
import { config } from '@videochat/config';

let cachedApp: express.Express;

async function bootstrap() {
  if (cachedApp) return cachedApp;

  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  app.enableCors({
    origin: config.urls.web,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-fingerprint'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  app.setGlobalPrefix('api/v1');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('VideoChat Platform API')
    .setDescription('Enterprise video chat platform API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management')
    .addTag('Matching', 'User matching')
    .addTag('Chat', 'Messaging')
    .addTag('Calls', 'Video/Voice calls')
    .addTag('Payments', 'Payments & subscriptions')
    .addTag('Admin', 'Admin dashboard')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.init();
  cachedApp = app.getHttpAdapter().getInstance();
  return cachedApp;
}

export default async function handler(req: any, res: any) {
  const app = await bootstrap();
  return app(req, res);
}
