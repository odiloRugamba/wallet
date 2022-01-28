import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = +process.env.APP_PORT || 3000
  app.setGlobalPrefix('api')
  console.log('Port running on: ', port)

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Wallet')
    .setDescription('Wallet API documentation')
    .setVersion('1.0')
    .addTag('wallet')
    .build()
    
  app.useGlobalPipes(new ValidationPipe());
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)

  app.enableCors()
  
  await app.listen(port);
}
bootstrap();
