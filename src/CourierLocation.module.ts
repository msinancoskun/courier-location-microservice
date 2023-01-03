import { CacheModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CourierLocationController } from './CourierLocation.controller';
import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';
import { MongooseModule } from '@nestjs/mongoose';
import { CourierLocationService } from './CourierLocation.service';
import { CourierLocation, CourierLocationSchema } from './CourierLocation.schema';
import { LoggerMiddleware } from './Middlewares/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([
      { name: CourierLocation.name, schema: CourierLocationSchema },
    ]),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: String(redisStore),
      url: process.env.REDIS_URI
    }),
  
  ],
  controllers: [CourierLocationController],
  providers: [CourierLocationService],
})

export class CourierLocationModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes("*");
  }
}
