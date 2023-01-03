import { Injectable } from "@nestjs/common";
import { OnApplicationShutdown } from "@nestjs/common/interfaces";
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopic, Kafka } from "kafkajs";

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly kafka = new Kafka({
    brokers: [process.env.KAFKA_URL]
  });

  private readonly consumers: Consumer[] = [];

  async consume(topic: ConsumerSubscribeTopic, config: ConsumerRunConfig) {
    const consumer = this.kafka.consumer({ groupId: 'courier' });
    await consumer.connect();
    await consumer.subscribe(topic);
    await consumer.run(config);

    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}