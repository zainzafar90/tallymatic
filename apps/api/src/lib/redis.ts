import Redis from 'ioredis';

import { config } from '@/config/config';
import { logger } from '@/common/logger';

export const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
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
