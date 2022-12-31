import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CourierLocationController } from './CourierLocation.controller';
import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationService } from './CourierLocation.service';
import {
  CourierLocation,
  CourierLocationSchema,
} from './CourierLocation.schema';
import { KafkaModule } from './kafka/kafka.module';

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
      url: process.env.REDIS_URI,
    }),
    KafkaModule    
  ],
  controllers: [CourierLocationController],
  providers: [LocationService],
})
export class CourierLocationModule { }
