import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EntityNotFoundInterceptor } from './interceptors/entity-not-found/entity-not-found.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // without this, some number validations don't work
      },
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new EntityNotFoundInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Events API')
    .setDescription('API for saving social events')
    .setVersion('1.0')
    .addTag('Events')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
