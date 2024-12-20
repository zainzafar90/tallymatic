import { Redis } from 'ioredis';

import { config } from '@/config/config';
import { logger } from '@/common/logger';

// Debug logging
logger.info('Environment Variables:');
logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
logger.info(`REDIS_HOST: ${process.env.REDIS_HOST}`);
logger.info(`REDIS_PORT: ${process.env.REDIS_PORT}`);
logger.info('Config Values:');
logger.info(`Redis Config: ${JSON.stringify(config.redis, null, 2)}`);

const redisOptions = {
  host: config.redis.host,
  port: config.redis.port,
  enableReadyCheck: true,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: null,
};

logger.info(`Redis Options: ${JSON.stringify(redisOptions, null, 2)}`);

export const redis = new Redis(redisOptions);

redis.on('error', (error) => {
  logger.error('Redis connection error:', error);
});

redis.on('connect', () => {
  logger.info('Connected to Redis');
});

redis.on('ready', () => {
  logger.info('Redis is ready');
});

redis.on('reconnecting', () => {
  logger.info('Redis reconnecting...');
});

process.on('SIGTERM', () => {
  redis.disconnect();
});
