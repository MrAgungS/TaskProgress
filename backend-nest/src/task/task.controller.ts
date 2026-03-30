import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
  getTasks(@Request() req: { user: { id: number } }) {
    return this.taskService.getTasks(req.user.id);
  }

  @Get('/:id')
  getTasksById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { id: number } },
  ) {
    return this.taskService.getTaskById(id, req.user.id);
  }

  @Post('/')
  createTask(
    @Body() dto: CreateTaskDto,
    @Request() req: { user: { id: number } },
  ) {
    return this.taskService.createTask(dto, req.user.id);
  }

  @Patch('/:id')
  @Roles(Role.user)
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
    @Request() req: { user: { id: number } },
  ) {
    return this.taskService.updateTask(id, dto, req.user.id);
  }

  @Delete('/:id')
  @Roles(Role.user)
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { id: number } },
  ) {
    return this.taskService.deleteTask(id, req.user.id);
  }
}
