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

    const lastItemFind = await this.model.find({});

    let counter;

    if (lastItemFind.length != 0) {
      counter = (lastItemFind[lastItemFind.length - 1]?.counter || 0) + 1;
    } else {
      counter = 1;
    };

    newLocation.counter = counter;

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
