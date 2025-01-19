import { redis } from '@/lib/redis';
import { logger } from '@/common/logger';

const CACHE_KEYS = {
  productCount: (organizationId: string) => `product:count:${organizationId}`,
} as const;

const CACHE_TTL = {
  productCount: 60 * 5, // 5 minutes
} as const;

export const cacheManager = {
  async getProductCount(storeId: string): Promise<number | null> {
    const key = CACHE_KEYS.productCount(storeId);
    const cached = await redis.get(key);

    if (cached) {
      logger.info(`Cache HIT: ${key}`);
      return parseInt(cached, 10);
    }

    logger.info(`Cache MISS: ${key}`);
    return null;
  },

  async setProductCount(storeId: string, count: number): Promise<void> {
    const key = CACHE_KEYS.productCount(storeId);
    await redis.setex(key, CACHE_TTL.productCount, count.toString());
    logger.info(`Cache SET: ${key}, value: ${count}, TTL: ${CACHE_TTL.productCount}s`);
  },

  async invalidateProductCount(storeId: string): Promise<void> {
    const key = CACHE_KEYS.productCount(storeId);
    await redis.del(key);
    logger.info(`Cache INVALIDATED: ${key}`);
  },
};
