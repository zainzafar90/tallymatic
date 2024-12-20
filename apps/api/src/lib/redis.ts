import Redis from 'ioredis';

import { logger } from '@/common/logger';

const redis = new Redis(
  'rediss://default:AWikAAIjcDFjNzlmNTM0OGFkZjQ0ZGJhYjg4M2M3YWZmMTk3NWVlNXAxMA@touching-lioness-26788.upstash.io:6379'
);

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
