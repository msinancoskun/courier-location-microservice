import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourierLocation, CourierLocationDocument } from './CourierLocation.schema';
import { Injectable } from '@nestjs/common';
import { CourierLocationRepository } from './dto/CourierLocation.repository';

@Injectable()
export class CourierLocationService {
  constructor(
    @InjectModel(CourierLocation.name)
    private model: Model<CourierLocationDocument>,
    private readonly courierLocationRepository: CourierLocationRepository
  ) { }

  async saveLocation(location: CourierLocation) {
    await this.courierLocationRepository.saveLocation(location);
  }

  async getLastLocation(
    id: keyof CourierLocation['courierId'],
  ): Promise<CourierLocation> {
    return await this.courierLocationRepository.getLastLocation(id);
  }

  async getAllLastLocations(): Promise<CourierLocation[]> {
    return await this.courierLocationRepository.getAllLastLocations();
  }
}
