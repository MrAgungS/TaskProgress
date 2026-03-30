import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from 'generated/prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    super({
      adapter,
      log: [
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'query' },
      ],
    } satisfies Prisma.PrismaClientOptions);
  }

  async onModuleInit() {
    this.$on('error' as never, (e: Prisma.LogEvent) => {
      this.logger.error('Prisma error', {
        message: e.message,
        target: e.target,
      });
    });
    this.$on('warn' as never, (e: Prisma.LogEvent) => {
      this.logger.warn('Prisma warn', { message: e.message, target: e.target });
    });
    this.$on('info' as never, (e: Prisma.LogEvent) => {
      this.logger.info('Prisma info', { message: e.message, target: e.target });
    });
    this.$on('query' as never, (e: Prisma.QueryEvent) => {
      this.logger.info('Prisma query', {
        query: e.query,
        duration: e.duration,
      });
    });

    await this.$connect();
  }
}
