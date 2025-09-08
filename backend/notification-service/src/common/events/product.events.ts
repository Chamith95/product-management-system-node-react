export interface BaseEvent {
  eventId: string;
  eventType: string;
  timestamp: string;
  version: string;
  source: string;
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

export type NotificationEvent = LowStockWarningEvent;
