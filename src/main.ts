import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new DatabaseExceptionFilter(httpAdapter));
  const config = new DocumentBuilder()
    .setTitle('Backend test task')
    .addTag('room')
    .addTag('booking')
    .addTag('stats')
    .addTag('populate')
    .build();
  SwaggerModule.setup('/docs', app, SwaggerModule.createDocument(app, config));
  await app.listen(Number(process.env.PORT || '3000'));
}
bootstrap();
