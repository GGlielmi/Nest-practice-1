import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EntityNotFoundInterceptor } from './interceptors/entity-not-found/entity-not-found.interceptor';
import { UniqueConstraintErrorInterceptor } from './interceptors/unique-contraint-error/unique-constraint-error.interceptor';
import { SerializerInterceptor } from './interceptors/serializer/serializer.interceptor';
import { EntityNotFoundGqlErrorFilter } from './graphql/filters/entity-not-found.filter';
import { PaginationResultInterceptor } from './interceptors/pagination-result/pagination-result.interceptor';
import { EntityNotFoundErrorFilter } from './filters/entity-not-found.filter';

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
  app.useGlobalInterceptors(new UniqueConstraintErrorInterceptor());
  app.useGlobalInterceptors(new PaginationResultInterceptor());
  app.useGlobalInterceptors(new SerializerInterceptor());
  app.useGlobalFilters(new EntityNotFoundGqlErrorFilter());
  app.useGlobalFilters(new EntityNotFoundErrorFilter());

  const config = new DocumentBuilder()
    .setTitle('Events API')
    .setDescription('API for saving social events')
    .setVersion('1.0')
    .addTag('Events')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { tagsSorter: 'alpha' },
  });

  await app.listen(3000);
}
bootstrap();
