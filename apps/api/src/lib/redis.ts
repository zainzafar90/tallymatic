import { Redis } from 'ioredis';

import { config } from '@/config/config';

export const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  enableReadyCheck: true,
});

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});
