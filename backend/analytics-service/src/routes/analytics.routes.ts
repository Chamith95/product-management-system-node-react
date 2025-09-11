import { Router, Request, Response } from 'express';
import { logger } from '../common/utils/logger';

const router = Router();

router.get('/health', async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      message: 'Analytics service is healthy',
      timestamp: new Date().toISOString(),
      service: 'analytics-service',
    });
  } catch (error) {
    logger.error('Health check failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;

