import * as path from 'path';
import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.static(path.join(process.cwd(), 'public')));
  await app.listen(3000);
}
bootstrap();
