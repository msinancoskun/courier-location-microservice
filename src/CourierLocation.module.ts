import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CourierLocationController } from './CourierLocation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationService } from './CourierLocation.service';
import {
  CourierLocation,
  CourierLocationSchema,
} from './CourierLocation.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([
      { name: CourierLocation.name, schema: CourierLocationSchema },
    ]),
  ],
  controllers: [CourierLocationController],
  providers: [LocationService],
})
export class CourierLocationModule {}
