import { Consumer, EachMessagePayload } from 'kafkajs';
import { kafkaConfigService } from '../common/kafka/kafka.config';
import { LowStockWarningEvent } from '../common/events/product.events';
import { WebSocketService } from './websocket.service';

export class NotificationConsumerService {
  private consumer: Consumer | null = null;
  private readonly TOPIC_NOTIFICATIONS = 'notifications';
  private readonly GROUP_ID = 'notification-service-consumer';
  private webSocketService: WebSocketService;

  constructor(webSocketService: WebSocketService) {
    this.webSocketService = webSocketService;
  }

  async initialize(): Promise<void> {
    this.consumer = await kafkaConfigService.getConsumer(this.GROUP_ID);
    
    await this.consumer.subscribe({
      topic: this.TOPIC_NOTIFICATIONS,
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        await this.handleMessage(payload);
      },
    });

    console.log('Notification consumer initialized and listening for events');
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    try {
      const message = JSON.parse(payload.message.value?.toString() || '{}');
      
      if (message.eventType === 'LowStockWarning') {
        const event = message as LowStockWarningEvent;
        await this.handleLowStockWarning(event);
      }
    } catch (error) {
      console.error('Error processing notification message:', error);
    }
  }

  private async handleLowStockWarning(event: LowStockWarningEvent): Promise<void> {
    try {
      this.webSocketService.emitLowStockWarning(event);
      
      console.log(`Low stock warning notification sent via WebSocket: ${event.data.name} has only ${event.data.currentQuantity} items left`);
    } catch (error) {
      console.error('Error sending low stock warning notification:', error);
    }
  }

  async disconnect(): Promise<void> {
    if (this.consumer) {
      await this.consumer.disconnect();
      this.consumer = null;
    }
  }
}


