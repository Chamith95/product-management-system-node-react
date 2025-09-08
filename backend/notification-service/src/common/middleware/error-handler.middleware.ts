import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class ErrorHandler {
  static handle(error: AppError, req: Request, res: Response, next: NextFunction): void {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';

    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation Error';
    } else if (error.name === 'CastError') {
      statusCode = 400;
      message = 'Invalid ID format';
    } else if (error.name === 'MongoError' && (error as any).code === 11000) {
      statusCode = 400;
      message = 'Duplicate field value';
    }


    console.error('Error:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.status(statusCode).json({
      success: false,
      error: {
        message,
        code: error.name || 'INTERNAL_ERROR',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      }
    });
  }
}
