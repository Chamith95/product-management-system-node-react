import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { KafkaConsumerService } from './services/kafka-consumer.service';
import analyticsRoutes from './routes/analytics.routes';
import { errorHandler, notFoundHandler } from './common/middleware/error-handler.middleware';
import { logger } from './common/utils/logger';

dotenv.config();

class AnalyticsApp {
  private app: express.Application;
  private kafkaConsumer: KafkaConsumerService;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.ANALYTICS_SERVICE_PORT || '3003', 10);
    this.kafkaConsumer = new KafkaConsumerService();
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    this.app.use(helmet());

    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-ID'],
    }));


    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  }

  private setupRoutes(): void {
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Analytics Service API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      });
    });

    this.app.use('/api', analyticsRoutes);
  }

  private setupErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {

      await this.kafkaConsumer.start();
      logger.info('Kafka consumer started successfully');

      this.app.listen(this.port, () => {
        logger.info(`Analytics service started on port ${this.port}`, {
          port: this.port,
          environment: process.env.NODE_ENV || 'development',
        });
      });


      this.setupGracefulShutdown();

    } catch (error) {
      logger.error('Failed to start analytics service', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      process.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}, starting graceful shutdown...`);
      
      try {
        await this.kafkaConsumer.stop();
        logger.info('Kafka consumer stopped');
        
        process.exit(0);
      } catch (error) {
        logger.error('Error during graceful shutdown', {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        process.exit(1);
      }
    };


    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception', {
        error: error.message,
        stack: error.stack,
      });
      shutdown('uncaughtException');
    });


    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled promise rejection', {
        reason: reason instanceof Error ? reason.message : reason,
        promise: promise.toString(),
      });
      shutdown('unhandledRejection');
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}

const analyticsApp = new AnalyticsApp();
analyticsApp.start().catch((error) => {
  logger.error('Failed to start application', {
    error: error instanceof Error ? error.message : 'Unknown error',
  });
  process.exit(1);
});

export default analyticsApp;

