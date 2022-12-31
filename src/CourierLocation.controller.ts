import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { CourierLocation } from './CourierLocation.schema';
import { LocationService } from './CourierLocation.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { ProducerService } from './kafka/producer.service';

@Controller('/courier')
export class CourierLocationController {
  constructor(
    private readonly service: LocationService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly producerService: ProducerService
  ) { }

  @Post('/save-courier-location')
  async saveLocation(@Res() res, @Body() location: CourierLocation) { 
    try {

      await this.producerService.produce({
        topic: 'save-courier-location',
        messages: [
          {
            value: 'courier location is saved'
          }
        ]
      });

      const newLocation = await this.service.saveLocation(location);

      return res.status(HttpStatus.CREATED).json({
        message: 'Inserted new courier location.',
        data: newLocation,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: `Could not insert courier data for ID: ${location.courierId}`,
      });
    }
  }

  @Get('/get-courier-last-location/:courierId')
  @ApiParam({
    name: 'courierId',
    description: 'Courier Location ID',
    required: true,
    allowEmptyValue: false,
  })
  async getLastLocation(@Res() res, @Param('courierId') id) {
    try {
      const cachedData = await this.cacheManager.get(id);

      if (cachedData) {
        console.log('ye', cachedData);
        return res.status(HttpStatus.OK).json({
          location: cachedData,
        });
      } else {
        console.log('na');
      }

      const location = await this.service.getLastLocation(id);

      await this.cacheManager.set(id, location);

      return res.status(HttpStatus.OK).json({
        location,
      });
    } catch (err) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: `Could not find courier data for ID: ${id}` });
    }
  }

  @Get('/get-all-couriers-last-location')
  async getAllLastLocations(@Res() res) {
    try {
      const cachedData = await this.cacheManager.get('all_locations');
      console.log("girdi");
      if (cachedData) {
        console.log('ye', cachedData);

        return res.status(HttpStatus.OK).json({
          locations: cachedData,
        });
      } else {
        console.log('na');
      }

      const locations = await this.service.getAllLastLocations();

      if (!locations.length) {
        return res.status(404).json({
          message: 'No data to display',
        });
      }

      await this.cacheManager.set('all_locations', locations);

      return res.status(HttpStatus.OK).json({
        locations,
      });
    } catch (err) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Internal server error' });
    }
  }
}
