/**
 * Event Contracts - TypeScript Interfaces
 * 
 * These interfaces define the structure of events in the Product Management System.
 * They ensure type safety across all services and provide clear documentation.
 */

export interface BaseEvent {
  eventId: string;
  eventType: string;
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
  eventType: 'ProductCreated';
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
  eventType: 'ProductUpdated';
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
  eventType: 'ProductDeleted';
  data: {
    productId: string;
    sellerId: string;
    name: string;
    deletedAt: string;
    reason?: string;
  };
}

export interface LowStockWarningEvent extends BaseEvent {
  eventType: 'LowStockWarning';
  data: {
    productId: string;
    sellerId: string;
    name: string;
    currentQuantity: number;
    threshold: number;
    category: string;
    triggeredAt: string;
  };
}

export type ProductEvent = 
  | ProductCreatedEvent 
  | ProductUpdatedEvent 
  | ProductDeletedEvent 
  | LowStockWarningEvent;

// Event type enum for type safety
export enum EventType {
  PRODUCT_CREATED = 'ProductCreated',
  PRODUCT_UPDATED = 'ProductUpdated',
  PRODUCT_DELETED = 'ProductDeleted',
  LOW_STOCK_WARNING = 'LowStockWarning'
}

// Constants
export const LOW_STOCK_THRESHOLD = 10;
export const EVENT_VERSION = '1.0.0';
export const EVENT_SOURCE = 'product-management-system';
