import { EventType } from './event-type.model';

export interface BaseEvent {
  eventId: string;
  eventType: EventType;
  timestamp: string;
  version: string;
  source: string;
  correlationId: string;
  userId: string;
  sessionId?: string;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    requestId?: string;
  };
}

export interface ProductCreatedEvent extends BaseEvent {
  eventType: EventType.PRODUCT_CREATED;
  data: {
    productId: string;
    sellerId: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
    createdAt: string;
  };
}

export interface ProductUpdatedEvent extends BaseEvent {
  eventType: EventType.PRODUCT_UPDATED;
  data: {
    productId: string;
    sellerId: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
    updatedAt: string;
    previousQuantity?: number;
    changes: Record<string, any>;
    previousState: Record<string, any>;
  };
}

export interface ProductDeletedEvent extends BaseEvent {
  eventType: EventType.PRODUCT_DELETED;
  data: {
    productId: string;
    sellerId: string;
    name: string;
    deletedAt: string;
    reason?: string;
  };
}


export type ProductEvent = 
  | ProductCreatedEvent 
  | ProductUpdatedEvent 
  | ProductDeletedEvent

