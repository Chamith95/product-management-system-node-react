export interface ProductAnalytics {
  pk: string; 
  sk: string; 
  eventId: string;
  eventType: string;
  timestamp: string;
  version: string;
  source: string;
  correlationId: string;
  userId: string;
  sessionId?: string;
  productId: string;
  sellerId: string;
  productName: string;
  category: string;
  price?: number;
  quantity?: number;
  previousQuantity?: number;
  priceChange?: number;
  quantityChange?: number;
  eventData: Record<string, any>;
  
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    requestId?: string;
  };
  ttl: number;
}

export interface EventLog {
  pk: string;
  sk: string;  
  eventId: string;
  eventType: string;
  timestamp: string;
  source: string;
  correlationId: string;
  eventData: Record<string, any>;
  processed: boolean;
  processedAt?: string;
  errorMessage?: string;
  ttl: number;
}
