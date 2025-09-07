import { Request, Response, NextFunction } from 'express';

export class RequestLogger {
  static log = (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const logMessage = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
      
      if (res.statusCode >= 400) {
        console.error(logMessage);
      } else {
        console.log(logMessage);
      }
    });
    
    next();
  };
}
