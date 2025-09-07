import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { ErrorHandler, initializeDatabase, RequestLogger } from './common';
import { HealthRoutes } from './modules/health';
import { ProductRoutes } from './modules/products';
import { setupSwagger } from './swagger';

// Load environment variables
dotenv.config();

class App {
  public app: express.Application;
  private readonly port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3000');
    
    this.initializeMiddlewares();
    this.setupSwagger();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors());
    
    // Compression middleware
    this.app.use(compression());
    
    // Request logging
    this.app.use(RequestLogger.log);
    
    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
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
    // Health check route
    this.app.use('/health', HealthRoutes);
    
    // API routes
    this.app.use('/products', ProductRoutes);
    

    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Product Management API',
        version: '1.0.0',
        endpoints: {
          health: '/health',
          products: '/products'
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

  private initializeErrorHandling(): void {
    this.app.use(ErrorHandler.handle);
  }

  public async start(): Promise<void> {
    try {
      await initializeDatabase();
      
      this.app.listen(this.port, () => {
        console.log(`Server running on port ${this.port}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`Health check: http://localhost:${this.port}/health`);
        console.log(`Products API: http://localhost:${this.port}/products`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private setupSwagger(): void {
    //@ts-ignore
    setupSwagger(this.app);
  }
}



// Start the application
const app = new App();
app.start().catch((error) => {
  console.error('Application startup failed:', error);
  process.exit(1);
});

export default app;
