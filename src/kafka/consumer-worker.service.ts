import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConsumerService } from "./consumer.service";
import { LocationService } from "src/CourierLocation.service";
import { resolve } from "path";

@Injectable()
export class ConsumerController implements OnModuleInit {

  constructor(
    private readonly consumerService: ConsumerService,
    private readonly service: LocationService
  ) { }

  async onModuleInit() {
    await this.consumerService.consume(
      { topic: 'courier-location' },
      {
        eachMessage: async ({ topic, partition, message }) => {

          const newLocation = JSON.parse(message.value.toString());

          // await this.service.saveLocation(newLocation);
          await new Promise(r => setTimeout(r, 3000));
          console.log("attı");

          console.log({
            value: message.value.toString(),
            topic: topic.toString(),
            partition: partition.toString()
          });
          
        }
      }
    );
  }
}