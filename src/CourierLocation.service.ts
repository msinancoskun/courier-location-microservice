import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CourierLocation,
  CourierLocationDocument,
} from './courierLocation.schema';
import { ProducerService } from './kafka/producer.service';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(CourierLocation.name)
    private model: Model<CourierLocationDocument>,
    private readonly producerService: ProducerService
  ) { }

  async saveLocation(location: CourierLocation): Promise<CourierLocation> {

    const newLocation = new this.model(location);
    return await newLocation.save();

  }

  async getLastLocation(id: string): Promise<CourierLocation> {

    return await this.model.findOne({ courierId: id }).exec();

  }

  async getAllLastLocations(): Promise<CourierLocation[]> {

    return await this.model.find().exec();

  }
}
