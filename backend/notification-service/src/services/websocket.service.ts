import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { LowStockWarningEvent } from '../common/events/product.events';

export interface NotificationData {
  id: string;
  type: 'low_stock_warning';
  title: string;
  message: string;
  productId: string;
  productName: string;
  sellerId: string;
  currentQuantity: number;
  threshold: number;
  category: string;
  timestamp: string;
}

export class WebSocketService {
  private io: SocketIOServer;
  private connectedClients: Map<string, Set<string>> = new Map(); 

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Handle seller subscription
      socket.on('subscribe', (sellerId: string) => {
        if (!this.connectedClients.has(sellerId)) {
          this.connectedClients.set(sellerId, new Set());
        }
        this.connectedClients.get(sellerId)!.add(socket.id);
        
        socket.join(`seller:${sellerId}`);
        
        console.log(`Client ${socket.id} subscribed to seller ${sellerId}`);
        
        socket.emit('subscribed', { sellerId, message: 'Successfully subscribed to notifications' });
      });


      socket.on('unsubscribe', (sellerId: string) => {
        const sellerClients = this.connectedClients.get(sellerId);
        if (sellerClients) {
          sellerClients.delete(socket.id);
          if (sellerClients.size === 0) {
            this.connectedClients.delete(sellerId);
          }
        }
        
        socket.leave(`seller:${sellerId}`);
        console.log(`Client ${socket.id} unsubscribed from seller ${sellerId}`);
      });


      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        
        for (const [sellerId, clients] of this.connectedClients.entries()) {
          if (clients.has(socket.id)) {
            clients.delete(socket.id);
            if (clients.size === 0) {
              this.connectedClients.delete(sellerId);
            }
          }
        }
      });
    });
  }

  public emitLowStockWarning(event: LowStockWarningEvent): void {
    const notification: NotificationData = {
      id: event.eventId,
      type: 'low_stock_warning',
      title: 'Low Stock Warning',
      message: `${event.data.name} has only ${event.data.currentQuantity} items left (threshold: ${event.data.threshold})`,
      productId: event.data.productId,
      productName: event.data.name,
      sellerId: event.data.sellerId,
      currentQuantity: event.data.currentQuantity,
      threshold: event.data.threshold,
      category: event.data.category,
      timestamp: event.data.triggeredAt,
    };

    this.io.to(`seller:${event.data.sellerId}`).emit('notification', notification);
    
    console.log(`Low stock warning sent to seller ${event.data.sellerId}: ${notification.message}`);
  }

  public getConnectedSellers(): string[] {
    return Array.from(this.connectedClients.keys());
  }

  public getConnectedClientsCount(sellerId: string): number {
    return this.connectedClients.get(sellerId)?.size || 0;
  }

  public getTotalConnectedClients(): number {
    let total = 0;
    for (const clients of this.connectedClients.values()) {
      total += clients.size;
    }
    return total;
  }
}
