import { Kafka, Consumer, KafkaConfig } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';

export class KafkaConfigService {
  private kafka: Kafka;
  private consumer: Consumer | null = null;

  constructor() {
    const config: KafkaConfig = {
      clientId: `notification-service-${uuidv4()}`,
      brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
      retry: {
        initialRetryTime: 100,
        retries: 8
      },
      connectionTimeout: 3000,
      requestTimeout: 25000,
    };

    this.kafka = new Kafka(config);
  }

  async getConsumer(groupId: string): Promise<Consumer> {
    if (!this.consumer) {
      this.consumer = this.kafka.consumer({ 
        groupId,
        sessionTimeout: 30000,
        heartbeatInterval: 3000,
      });
      await this.consumer.connect();
    }
    return this.consumer;
  }

  async disconnect(): Promise<void> {
    if (this.consumer) {
      await this.consumer.disconnect();
      this.consumer = null;
    }
  }
}

export const kafkaConfigService = new KafkaConfigService();
