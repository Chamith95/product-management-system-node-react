import { Product, ProductCategory } from '../../modules/products/product.enitity';

export interface BaseEvent {
  eventId: string;
  eventType: string;
  timestamp: string;
  version: string;
  source: string;
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
    category: ProductCategory;
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
    category: ProductCategory;
    updatedAt: string;
    previousQuantity?: number;
  };
}

export interface ProductDeletedEvent extends BaseEvent {
  eventType: 'ProductDeleted';
  data: {
    productId: string;
    sellerId: string;
    name: string;
    deletedAt: string;
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
    category: ProductCategory;
    triggeredAt: string;
  };
}

export type ProductEvent = 
  | ProductCreatedEvent 
  | ProductUpdatedEvent 
  | ProductDeletedEvent 
  | LowStockWarningEvent;

export const LOW_STOCK_THRESHOLD = 10;
