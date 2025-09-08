import { Producer } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';
import { kafkaConfigService } from './kafka.config';
import { 
  ProductEvent, 
  ProductCreatedEvent, 
  ProductUpdatedEvent, 
  ProductDeletedEvent, 
  LowStockWarningEvent,
  LOW_STOCK_THRESHOLD 
} from '../events/product.events';
import { Product } from '../../modules/products/product.enitity';

export class EventEmitterService {
  private producer: Producer | null = null;
  private readonly TOPIC_PRODUCT_EVENTS = 'product-events';
  private readonly TOPIC_NOTIFICATIONS = 'notifications';

  async initialize(): Promise<void> {
    this.producer = await kafkaConfigService.getProducer();
  }

  private async emitEvent(topic: string, event: ProductEvent): Promise<void> {
    if (!this.producer) {
      await this.initialize();
    }

    try {
      await this.producer!.send({
        topic,
        messages: [{
          key: event.data.productId,
          value: JSON.stringify(event),
          headers: {
            eventType: event.eventType,
            version: event.version,
            timestamp: event.timestamp,
          },
        }],
      });
      
      console.log(`Event emitted: ${event.eventType} for product ${event.data.productId}`);
    } catch (error) {
      console.error(`Failed to emit event ${event.eventType}:`, error);
      throw error;
    }
  }

  async emitProductCreated(product: Product): Promise<void> {
    const event: ProductCreatedEvent = {
      eventId: uuidv4(),
      eventType: 'ProductCreated',
      timestamp: new Date().toISOString(),
      version: '1.0',
      source: 'products-service',
      data: {
        productId: product.id,
        sellerId: product.sellerId,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        category: product.category,
        createdAt: product.createdAt.toISOString(),
      },
    };

    await this.emitEvent(this.TOPIC_PRODUCT_EVENTS, event);
  }

  async emitProductUpdated(product: Product, previousQuantity?: number): Promise<void> {
    const event: ProductUpdatedEvent = {
      eventId: uuidv4(),
      eventType: 'ProductUpdated',
      timestamp: new Date().toISOString(),
      version: '1.0',
      source: 'products-service',
      data: {
        productId: product.id,
        sellerId: product.sellerId,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        category: product.category,
        updatedAt: product.updatedAt.toISOString(),
        previousQuantity,
      },
    };

    await this.emitEvent(this.TOPIC_PRODUCT_EVENTS, event);

    // Check for low stock warning
    if (product.quantity <= LOW_STOCK_THRESHOLD) {
      await this.emitLowStockWarning(product);
    }
  }

  async emitProductDeleted(product: Product): Promise<void> {
    const event: ProductDeletedEvent = {
      eventId: uuidv4(),
      eventType: 'ProductDeleted',
      timestamp: new Date().toISOString(),
      version: '1.0',
      source: 'products-service',
      data: {
        productId: product.id,
        sellerId: product.sellerId,
        name: product.name,
        deletedAt: new Date().toISOString(),
      },
    };

    await this.emitEvent(this.TOPIC_PRODUCT_EVENTS, event);
  }

  async emitLowStockWarning(product: Product): Promise<void> {
    const event: LowStockWarningEvent = {
      eventId: uuidv4(),
      eventType: 'LowStockWarning',
      timestamp: new Date().toISOString(),
      version: '1.0',
      source: 'products-service',
      data: {
        productId: product.id,
        sellerId: product.sellerId,
        name: product.name,
        currentQuantity: product.quantity,
        threshold: LOW_STOCK_THRESHOLD,
        category: product.category,
        triggeredAt: new Date().toISOString(),
      },
    };

    await this.emitEvent(this.TOPIC_NOTIFICATIONS, event);
  }

  async disconnect(): Promise<void> {
    await kafkaConfigService.disconnect();
  }
}

export const eventEmitterService = new EventEmitterService();
