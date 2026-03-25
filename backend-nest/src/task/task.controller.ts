import { Controller } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('/api/tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}
}
