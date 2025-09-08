import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { ErrorHandler } from './common/middleware/error-handler.middleware';
import { RequestLogger } from './common/middleware/request-logger.middleware';
import { WebSocketService } from './services/websocket.service';
import { NotificationConsumerService } from './services/notification-consumer.service';

// Load environment variables
dotenv.config();

class App {
  public app: express.Application;
  public server: any;
  private readonly port: number;
  private webSocketService: WebSocketService;
  public notificationConsumerService: NotificationConsumerService;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.port = parseInt(process.env.PORT || '3002');
    
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeWebSocket();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors());
    
    
    // Request logging
    this.app.use(RequestLogger.log);
    
    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 1000 requests per windowMs
      message: {
        success: false,
        error: {
          message: 'Too many requests from this IP, please try again later.',
          code: 'RATE_LIMIT_EXCEEDED'
        }
      }
    });
    this.app.use(limiter);
    
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  }

  private initializeRoutes(): void {
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Notification Service - WebSocket API',
        version: '1.0.0',
        endpoints: {
          health: '/health',
          websocket: `ws://localhost:${this.port}`
        },
        connectedSellers: this.webSocketService.getConnectedSellers(),
        totalClients: this.webSocketService.getTotalConnectedClients()
      });
    });
    
    this.app.get('/health', (req, res) => {
      res.json({
        success: true,
        message: 'Notification service is healthy',
        timestamp: new Date().toISOString(),
        websocket: {
          connectedSellers: this.webSocketService.getConnectedSellers(),
          totalClients: this.webSocketService.getTotalConnectedClients()
        }
      });
    });
    
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: {
          message: 'Route not found',
          code: 'ROUTE_NOT_FOUND'
        }
      });
    });
  }

  private initializeWebSocket(): void {
    this.webSocketService = new WebSocketService(this.server);
    this.notificationConsumerService = new NotificationConsumerService(this.webSocketService);
  }

  private initializeErrorHandling(): void {
    this.app.use(ErrorHandler.handle);
  }

  public async start(): Promise<void> {
    try {
      await this.notificationConsumerService.initialize();
      
      this.server.listen(this.port, () => {
        console.log(`Notification service running on port ${this.port}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log('WebSocket server initialized');
        console.log('Kafka consumer initialized');
      });
    } catch (error) {
      console.error('Failed to start notification service:', error);
      process.exit(1);
    }
  }
}


const app = new App();
app.start().catch((error) => {
  console.error('Notification service startup failed:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down gracefully...');
  await app.notificationConsumerService.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  await app.notificationConsumerService.disconnect();
  process.exit(0);
});

export default app;
