import { Body, Controller, Get, HttpStatus, OnModuleInit, Param, Post, Res } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { CourierLocation } from './CourierLocation.schema';
import { CourierLocationService } from './CourierLocation.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import * as amqp from "amqplib"

@Controller('/courier')
export class CourierLocationController implements OnModuleInit {
  private channel: amqp.Channel;

  constructor(
    private readonly service: CourierLocationService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async onModuleInit() {

    const connection = await amqp.connect(process.env.AMQP_URL);
    this.channel = await connection.createChannel();
    this.channel.prefetch(1);
    this.channel.assertQueue("COURIER-LOCATION");
    this.channel.consume("COURIER-LOCATION", async (message) => {
      const location = JSON.parse(message.content.toString());
      if (location) {
        await this.service.saveLocation(location);
        console.log(message.content.toString());
      }
      this.channel.ack(message);
    });
  }

  @Post('/save-courier-location')
  async saveLocation(@Res() res, @Body() location: CourierLocation): Promise<any> {
    try {

      const dataControl = await this.service.getLastLocation(Number(location.courierId));

      if (dataControl) throw new Error("Bummm");

      const channel = this.channel;

      await channel.assertQueue("COURIER-LOCATION");

      channel.sendToQueue("COURIER-LOCATION", Buffer.from(JSON.stringify(location)));

      return res.status(HttpStatus.CREATED).json({
        message: 'Inserted new courier location.',
        data: location,
      });

    } catch (error) {
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
        return res.status(HttpStatus.OK).json({
          location: cachedData,
        });
      }

      const location = await this.service.getLastLocation(id);

      await this.cacheManager.set(id, location, 3000);

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

      if (cachedData) {
        console.log("cached data found. " + cachedData)
        return res.status(HttpStatus.OK).json({
          locations: cachedData,
        });
      } else {
        console.log("cached data could not be found.");
      }

      const locations = await this.service.getAllLastLocations();

      if (!locations.length) {
        return res.status(404).json({
          message: 'No data to display',
        });
      }

      await this.cacheManager.set('all_locations', locations, 3000);

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
