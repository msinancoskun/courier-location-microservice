import { NestFactory } from '@nestjs/core';
import { CourierLocationModule } from './CourierLocation.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(CourierLocationModule);

  const config = new DocumentBuilder()
    .setTitle('Courier Location Microservice')
    .setDescription(
      'Retrieve last locations of specific/all couriers and insert new courier locations.',
    )
    .setVersion('1.0')
    .addTag('default')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
