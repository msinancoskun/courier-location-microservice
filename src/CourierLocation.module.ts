import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CourierLocationController } from './courierLocation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationService } from './courierLocation.service';
import { CourierLocation, CourierLocationSchema } from './courierLocation.schema';
import { LoggerMiddleware } from './Middlewares/logger.middleware';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([
      { name: CourierLocation.name, schema: CourierLocationSchema },
    ]),
    KafkaModule,
  ],
  controllers: [CourierLocationController],
  providers: [LocationService],
})

export class CourierLocationModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes("*");
  }
}
