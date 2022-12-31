import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourierLocation, CourierLocationDocument } from './CourierLocation.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(CourierLocation.name)
    private model: Model<CourierLocationDocument>,
  ) { }

  async saveLocation(location: CourierLocation): Promise<CourierLocation> {
    const newLocation = new this.model(location);
    return await newLocation.save();
  }

  async getLastLocation(
    id: keyof CourierLocation['courierId'],
  ): Promise<CourierLocation> {
    return await this.model.findOne({ courierId: id }).exec();
  }

  async getAllLastLocations(): Promise<CourierLocation[]> {
    return await this.model.find().exec();
  }
}
