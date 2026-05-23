import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { config } from '@videochat/config';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  constructor() {
    const redisUrl = config.redis.url || undefined;
    super(redisUrl, {
      password: config.redis.password,
      retryStrategy: (times) => Math.min(times * 50, 2000),
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    if (!config.redis.url) {
      this.logger.warn('Redis URL not configured - running without Redis');
      return;
    }

    this.on('connect', () => this.logger.log('Redis connected'));
    this.on('error', (err) => this.logger.error('Redis error', err));

    this.connect().catch((err) => this.logger.error('Redis connection failed', err));
  }

  async onModuleDestroy() {
    if (config.redis.url) {
      await this.quit();
    }
  }
}
