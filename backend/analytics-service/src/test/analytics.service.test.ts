import { AnalyticsService } from '../services/analytics.service';
import { ProductCreatedEvent } from '../models/events.model';
import '@types/jest';
import { EventType } from '../models/event-type.model';

jest.mock('@aws-sdk/lib-dynamodb', () => ({
  DynamoDBDocumentClient: {
    from: jest.fn(() => ({
      send: jest.fn().mockResolvedValue({}),
    })),
  },
}));

describe('AnalyticsService', () => {
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    analyticsService = new AnalyticsService();
  });

  describe('processEvent', () => {
    it('should process ProductCreated event successfully', async () => {
      const event: ProductCreatedEvent = {
        eventId: 'test-event-id',
        eventType: EventType.PRODUCT_CREATED,
        timestamp: '2024-01-01T00:00:00.000Z',
        version: '1.0.0',
        source: 'test-service',
        correlationId: 'test-correlation-id',
        userId: 'test-user-id',
        sessionId: 'test-session-id',
        data: {
          productId: 'test-product-id',
          sellerId: 'test-seller-id',
          name: 'Test Product',
          description: 'Test Description',
          price: 1000,
          quantity: 10,
          category: 'electronics',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        metadata: {
          userAgent: 'test-agent',
          ipAddress: '127.0.0.1',
          requestId: 'test-request-id',
        },
      };

      await expect(analyticsService.processEvent(event)).resolves.not.toThrow();
    });

    it('should handle invalid event gracefully', async () => {
      const invalidEvent = {
        eventId: 'test-event-id',
        // Missing required fields
      } as any;

      await expect(analyticsService.processEvent(invalidEvent)).rejects.toThrow();
    });
  });

});

