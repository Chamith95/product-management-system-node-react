import { 
  DynamoDBDocumentClient, 
  PutCommand
} from '@aws-sdk/lib-dynamodb';
import { dynamoDBDocumentClient, TABLE_NAME } from '../configs/dynamodb.config';
import { ProductEvent } from '../models/events.model';
import { ProductAnalytics, EventLog } from '../models/analytics.model';
import { EventType } from '../models/event-type.model';
import { logger } from '../common/utils/logger';
import { calculateTTL, TTL_VALUES } from '../common/utils/ttl.util';
import { S3ArchivalService } from './s3-archival.service';

export class AnalyticsService {
  private dynamoDB: DynamoDBDocumentClient;
  private s3Archival: S3ArchivalService;

  constructor() {
    this.dynamoDB = dynamoDBDocumentClient;
    this.s3Archival = new S3ArchivalService();
  }

  async processEvent(event: ProductEvent): Promise<void> {
    try {
      logger.info('Processing event for analytics', {
        eventId: event.eventId,
        eventType: event.eventType,
        productId: event.data.productId,
      });

      await this.storeEventLog(event);

      // Archive to S3 for historical data
      await this.s3Archival.archiveEvent(event);

      switch (event.eventType) {
        case EventType.PRODUCT_CREATED:
          await this.processProductCreated(event);
          break;
        case EventType.PRODUCT_UPDATED:
          await this.processProductUpdated(event);
          break;
        case EventType.PRODUCT_DELETED:
          await this.processProductDeleted(event);
          break;
        default:
          logger.warn('Unknown event type', { eventType: (event as any).eventType });
      }

      logger.info('Event processed successfully', {
        eventId: event.eventId,
        eventType: event.eventType,
      });
    } catch (error) {
      logger.error('Error processing event', {
        eventId: event.eventId,
        eventType: event.eventType,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  private async storeEventLog(event: ProductEvent): Promise<void> {
    const eventLog: EventLog = {
      pk: event.eventId,
      sk: event.timestamp,
      eventId: event.eventId,
      eventType: event.eventType,
      timestamp: event.timestamp,
      source: event.source,
      correlationId: event.correlationId,
      eventData: event as any,
      processed: true,
      processedAt: new Date().toISOString(),
      ttl: calculateTTL(TTL_VALUES.EVENT_LOG),
    };

    await this.dynamoDB.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: eventLog,
    }));
  }

  private async processProductCreated(event: ProductEvent & { eventType: EventType.PRODUCT_CREATED }): Promise<void> {
    const analytics: ProductAnalytics = {
      pk: `${event.data.sellerId}#${event.data.productId}`,
      sk: `${event.timestamp}#${event.eventType}`,
      eventId: event.eventId,
      eventType: event.eventType,
      timestamp: event.timestamp,
      version: event.version,
      source: event.source,
      correlationId: event.correlationId,
      userId: event.userId,
      sessionId: event.sessionId,
      productId: event.data.productId,
      sellerId: event.data.sellerId,
      productName: event.data.name,
      category: event.data.category,
      price: event.data.price,
      quantity: event.data.quantity,
      eventData: event.data,
      metadata: event.metadata,
      ttl: calculateTTL(TTL_VALUES.PRODUCT_ANALYTICS),
    };

    await this.dynamoDB.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: analytics,
    }));
  }

  private async processProductUpdated(event: ProductEvent & { eventType: EventType.PRODUCT_UPDATED }): Promise<void> {
    const priceChange = event.data.changes?.price
      ? event.data.price - (event.data.previousState?.price ?? 0)
      : 0;
    const quantityChange = event.data.changes?.quantity
      ? event.data.quantity - (event.data.previousState?.quantity ?? 0)
      : 0;

    const analytics: ProductAnalytics = {
      pk: `${event.data.sellerId}#${event.data.productId}`,
      sk: `${event.timestamp}#${event.eventType}`,
      eventId: event.eventId,
      eventType: event.eventType,
      timestamp: event.timestamp,
      version: event.version,
      source: event.source,
      correlationId: event.correlationId,
      userId: event.userId,
      sessionId: event.sessionId,
      productId: event.data.productId,
      sellerId: event.data.sellerId,
      productName: event.data.name,
      category: event.data.category,
      price: event.data.price,
      quantity: event.data.quantity,
      previousQuantity: event.data.previousQuantity,
      priceChange,
      quantityChange,
      eventData: event.data,
      metadata: event.metadata,
      ttl: calculateTTL(TTL_VALUES.PRODUCT_ANALYTICS),
    };

    await this.dynamoDB.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: analytics,
    }));
  }

  private async processProductDeleted(event: ProductEvent & { eventType: EventType.PRODUCT_DELETED }): Promise<void> {
    const analytics: ProductAnalytics = {
      pk: `${event.data.sellerId}#${event.data.productId}`,
      sk: `${event.timestamp}#${event.eventType}`,
      eventId: event.eventId,
      eventType: event.eventType,
      timestamp: event.timestamp,
      version: event.version,
      source: event.source,
      correlationId: event.correlationId,
      userId: event.userId,
      sessionId: event.sessionId,
      productId: event.data.productId,
      sellerId: event.data.sellerId,
      productName: event.data.name,
      category: '', 
      eventData: event.data,
      metadata: event.metadata,
      ttl: calculateTTL(TTL_VALUES.PRODUCT_ANALYTICS),
    };

    await this.dynamoDB.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: analytics,
    }));
  }}
