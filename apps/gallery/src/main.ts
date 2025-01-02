import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as express from 'express';
// import mongoose from 'mongoose';

config();

async function bootstrap() {
  // mongoose.set('debug', true);
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Gallery API')
    .setDescription('API description for Photo Gallery system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  app.enableCors();
  app.use(
    '/uploads',
    express.static(join(process.cwd(), 'apps', 'gallery', 'uploads'), {
      index: false, // جلوگیری از جستجوی index.html
      extensions: ['jpg', 'jpeg', 'png', 'gif'], // فقط فایل‌های خاص
    })
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
