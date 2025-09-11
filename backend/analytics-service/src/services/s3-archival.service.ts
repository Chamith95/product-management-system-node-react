import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { s3Client, HISTORICAL_BUCKET, ARCHIVE_BUCKET } from '../configs/s3.config';
import { ProductEvent } from '../models/events.model';
import { EventType } from '../models/event-type.model';
import { logger } from '../common/utils/logger';

export class S3ArchivalService {
  private s3: S3Client;

  constructor() {
    this.s3 = s3Client;
  }

  async archiveEvent(event: ProductEvent): Promise<void> {
    try {
      const s3Key = this.generateS3Key(event);
      
      await this.storeInHistoricalBucket(event, s3Key);
      await this.storeInArchiveBucket(event, s3Key);

      logger.info('Event archived to S3', {
        eventId: event.eventId,
        eventType: event.eventType,
        s3Key,
        buckets: [HISTORICAL_BUCKET, ARCHIVE_BUCKET],
      });
    } catch (error) {
      logger.error('Failed to archive event to S3', {
        eventId: event.eventId,
        eventType: event.eventType,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  private generateS3Key(event: ProductEvent): string {
    const date = new Date(event.timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    return `events/${year}/${month}/${day}/${hour}/${event.eventType}/${event.eventId}.json`;
  }

  private async storeInHistoricalBucket(event: ProductEvent, s3Key: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: HISTORICAL_BUCKET,
      Key: s3Key,
      Body: JSON.stringify(event, null, 2),
      ContentType: 'application/json',
      Metadata: {
        eventId: event.eventId,
        eventType: event.eventType,
        timestamp: event.timestamp,
        sellerId: event.data.sellerId,
        productId: event.data.productId,
      },
      StorageClass: 'STANDARD',
    });

    await this.s3.send(command);
  }

  private async storeInArchiveBucket(event: ProductEvent, s3Key: string): Promise<void> {
    const compressedData = JSON.stringify(event);
    
    const command = new PutObjectCommand({
      Bucket: ARCHIVE_BUCKET,
      Key: s3Key,
      Body: compressedData,
      ContentType: 'application/json',
      ContentEncoding: 'gzip',
      Metadata: {
        eventId: event.eventId,
        eventType: event.eventType,
        timestamp: event.timestamp,
        sellerId: event.data.sellerId,
        productId: event.data.productId,
        archivedAt: new Date().toISOString(),
      },
      StorageClass: 'GLACIER',
    });

    await this.s3.send(command);
  }

  async archiveBatchEvents(events: ProductEvent[]): Promise<void> {
    try {
      logger.info('Starting batch archival', { eventCount: events.length });

      const batchSize = 10;
      const batches = [];
      
      for (let i = 0; i < events.length; i += batchSize) {
        batches.push(events.slice(i, i + batchSize));
      }

      await Promise.all(
        batches.map(batch => 
          Promise.all(batch.map(event => this.archiveEvent(event)))
        )
      );

      logger.info('Batch archival completed', { 
        eventCount: events.length,
        batchesProcessed: batches.length,
      });
    } catch (error) {
      logger.error('Batch archival failed', {
        eventCount: events.length,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  // Health check method
  async isHealthy(): Promise<boolean> {
    try {
      // Test S3 connectivity by attempting to list buckets
      await this.s3.send({ Bucket: HISTORICAL_BUCKET } as any);
      return true;
    } catch (error) {
      logger.error('S3 health check failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }
}
