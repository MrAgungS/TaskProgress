import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redis: Redis;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  onModuleInit() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });
    this.redis.on('connect', () => {
      this.logger.info('Redis connected');
    });

    this.redis.on('error', (err) => {
      this.logger.error('Redis error', { error: err.message });
    });
  }

  async onModuleDestroy() {
    await this.redis.quit();
    this.logger.info('Redis connection closed');
  }
}
