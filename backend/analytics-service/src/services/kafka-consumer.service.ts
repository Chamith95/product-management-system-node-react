import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { AnalyticsService } from './analytics.service';
import { ProductEvent } from '../models/events.model';
import { logger } from '../common/utils/logger';

export class KafkaConsumerService {
  private kafka: Kafka;
  private consumer: Consumer;
  private analyticsService: AnalyticsService;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'analytics-service',
      brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.consumer = this.kafka.consumer({ 
      groupId: process.env.KAFKA_GROUP_ID || 'analytics-service',
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });

    this.analyticsService = new AnalyticsService();
  }

  async start(): Promise<void> {
    try {
      await this.consumer.connect();
      logger.info('Kafka consumer connected');

      await this.consumer.subscribe({
        topic: process.env.KAFKA_TOPIC || 'product-events',
        fromBeginning: false,
      });

      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          await this.handleMessage(payload);
        },
      });

      logger.info('Kafka consumer started and subscribed to product-events topic');
    } catch (error) {
      logger.error('Failed to start Kafka consumer', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  async stop(): Promise<void> {
    try {
      await this.consumer.disconnect();
      logger.info('Kafka consumer disconnected');
    } catch (error) {
      logger.error('Error disconnecting Kafka consumer', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;
    
    try {
      if (!message.value) {
        logger.warn('Received message with no value', { topic, partition });
        return;
      }

      const messageValue = message.value.toString();
      logger.info('Received message', {
        topic,
        partition,
        offset: message.offset,
        key: message.key?.toString(),
        messageSize: messageValue.length,
      });

      const event: ProductEvent = JSON.parse(messageValue);
    
      await this.analyticsService.processEvent(event);

      logger.info('Message processed successfully', {
        eventId: event.eventId,
        eventType: event.eventType,
        topic,
        partition,
        offset: message.offset,
      });

    } catch (error) {
      logger.error('Error processing message', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        topic,
        partition,
        offset: message.offset,
        messageKey: message.key?.toString(),
      });

      throw error;
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      const admin = this.kafka.admin();
      await admin.connect();
      await admin.disconnect();
      return true;
    } catch (error) {
      logger.error('Health check failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }
}

