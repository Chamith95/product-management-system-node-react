import { Request, Response, NextFunction } from 'express';
import { DomainException } from '../exceptions/domain.exception';
import { NotFoundException } from '../exceptions/not-found,exception';
import { ValidationException } from '../exceptions/validation.exception';
import { ParamRequiredException } from '../exceptions/param-required.exception';

export class ErrorHandler {
  static handle = (error: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error('Error occurred:', error);

    if (error instanceof NotFoundException) {
      res.status(404).json({
        success: false,
        error: {
          message: error.message,
          code: error.code
        }
      });
      return;
    }

    if (error instanceof ValidationException) {
      res.status(400).json({
        success: false,
        error: {
          message: error.message,
          code: error.code,
          details: error.errors
        }
      });
      return;
    }
    if (error instanceof ParamRequiredException) {
      res.status(400).json({
        success: false,
        error: {
          message: error.message,
          code: error.code
        }
      });
      return;
    }

    if (error instanceof DomainException) {
      res.status(400).json({
        success: false,
        error: {
          message: error.message,
          code: error.code
        }
      });
      return;
    }

    // Handle TypeORM errors
    if (error.name === 'QueryFailedError') {
      res.status(400).json({
        success: false,
        error: {
          message: 'Database operation failed',
          code: 'DATABASE_ERROR'
        }
      });
      return;
    }

    // Handle validation errors from class-validator
    if (error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR'
        }
      });
      return;
    }

    // Default error handler
    res.status(500).json({
      success: false,
      error: {
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR'
      }
    });
  };
}
