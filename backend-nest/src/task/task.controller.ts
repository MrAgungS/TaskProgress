import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from 'src/model/task.model';
import { Roles } from 'src/security/decorators/roles.decorator';
import { Role } from 'generated/prisma/enums';

@Controller('/api/tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('/')
  getTasks(@Request() req: { user_id: number }) {
    return this.taskService.getTasks(req.user_id);
  }

  @Get('/:id')
  getTasksById(@Param('id') id: number, @Request() req: { user_id: number }) {
    return this.taskService.getTaskById(id, req.user_id);
  }

  @Post('/')
  createTask(@Body() dto: CreateTaskDto, @Request() req: { user_id: number }) {
    return this.taskService.createTask(dto, req.user_id);
  }

  @Patch('/:id')
  @Roles(Role.user)
  updateTask(
    @Param('id') id: number,
    @Body() dto: UpdateTaskDto,
    @Request() req: { user_id: number },
  ) {
    return this.taskService.updateTask(id, dto, req.user_id);
  }

  @Delete('/:id')
  @Roles(Role.user)
  deleteTask(@Param('id') id: number, @Request() req: { user_id: number }) {
    return this.taskService.deleteTask(id, req.user_id);
  }
}
