import { Redis } from 'ioredis';

import { config } from '@/config/config';
import { logger } from '@/common/logger';

const redisUrl = config.redis.host;

export const redis = new Redis(redisUrl);

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
