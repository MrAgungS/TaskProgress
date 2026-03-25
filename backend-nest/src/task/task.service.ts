import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RedisService } from 'src/common/redis/redis.service';
import { Logger } from 'winston';

@Injectable()
export class TaskService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private redisService: RedisService,
  ) {}

  async getTasks() {}
  async getTasksId() {}
  async createTask() {}
  async updateTask() {}
  async deleteTask() {}
}
