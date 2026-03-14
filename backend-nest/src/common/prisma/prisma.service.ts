import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from 'generated/prisma/client';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions>
  implements OnModuleInit
{
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
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
    } as any);
  }
  async onModuleInit() {
    this.$on('error' as never, (e) => {
      this.logger.error(e);
    });
    this.$on('warn' as never, (e) => {
      this.logger.warn(e);
    });
    this.$on('info' as never, (e) => {
      this.logger.log(e);
    });
    this.$on('query' as never, (e) => {
      this.logger.log(e);
    });

    await this.$connect();
  }
}
