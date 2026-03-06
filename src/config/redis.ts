import { env } from '@/config/env';

export const cacheConfig = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
  retryStrategy(times: number) {
    const delay = Math.min(times * 200, 2000);
    return delay;
  },
};
