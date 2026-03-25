import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ValidationService } from 'src/common/validation/validation.service';
import { CreateTaskDto, UpdateTaskDto } from 'src/model/task.model';
import { Logger } from 'winston';
import { TaskValidation } from './task.validation';

@Injectable()
export class TaskService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async getTasks(user_id: number) {
    return this.prismaService.task.findMany({
      where: { user_id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTaskById(id: number, user_id: number) {
    const task = await this.prismaService.task.findUnique({
      where: { id },
    });
    if (!task) throw new NotFoundException('Task Not Found');
    if (task.user_id !== user_id) throw new ForbiddenException('Not Allowed');
    return task;
  }

  async createTask(dto: CreateTaskDto, user_id: number) {
    const createDTO = this.validationService.validate(
      TaskValidation.CREATE,
      dto,
    );
    return this.prismaService.task.create({
      data: {
        ...createDTO,
        user_id,
      },
    });
  }

  async updateTask(id: number, dto: UpdateTaskDto, user_id: number) {
    const updateDTO = this.validationService.validate(
      TaskValidation.UPDATE,
      dto,
    );
    await this.getTaskById(id, user_id);
    return this.prismaService.task.update({
      where: { id },
      data: updateDTO,
    });
  }

  async deleteTask(id: number, user_id: number) {
    await this.getTaskById(id, user_id);
    return this.prismaService.task.delete({
      where: { id },
    });
    return { massage: 'Task deleted successfully' };
  }
}
