import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  
 const app = await NestFactory.create(AppModule);
 app.useGlobalPipes(new ValidationPipe());
 app.enableVersioning({
   type: VersioningType.URI,
   prefix: 'api/v',
   defaultVersion: '1',
 });
 await app.listen(3000);
}
bootstrap();