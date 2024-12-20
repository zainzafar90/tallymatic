import { Redis } from 'ioredis';

import { logger } from '@/common/logger';

export const redis = new Redis({
  host: '23.88.39.74',
  port: 6379,
  username: 'default',
  password: 'dokploy&11ZZ',
  enableReadyCheck: true,
});

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
