import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourierLocation, CourierLocationDocument } from './CourierLocation.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CourierLocationService {
  constructor(
    @InjectModel(CourierLocation.name)
    private model: Model<CourierLocationDocument>,
  ) { }

  async saveLocation(location: CourierLocation) {

    try {
      const lastItemFind = await this.model.find({});

      // ? Queue order is added to schema to show queue order is not breaking, and working correctly.
      let queueOrder: number;

      if (lastItemFind.length != 0) {
        queueOrder = (lastItemFind[lastItemFind.length - 1]?.queueOrder || 0) + 1;
      } else {
        queueOrder = 1;
      };

      await this.model.create({ ...location, queueOrder });
    } catch (error) {
      error;
    }
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
