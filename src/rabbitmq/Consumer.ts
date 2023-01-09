import { OnModuleInit } from "@nestjs/common";
import * as amqp from "amqplib"
import { CourierLocationService } from "src/CourierLocation.service";

export class Consumer implements OnModuleInit {

  private channel: amqp.Channel;
  private readonly service: CourierLocationService;

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
}