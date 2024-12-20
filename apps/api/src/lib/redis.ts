import { Redis } from 'ioredis';

// import { config } from '@/config/config';
import { logger } from '@/common/logger';

export const redis = new Redis('redis://default:dokploy&11ZZ@23.88.39.74:6379');

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
