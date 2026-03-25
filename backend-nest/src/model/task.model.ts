export enum TaskPriority {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export class CreateTaskDto {
  title: string;
  description: string;
  priority: TaskPriority;
  due_date: Date;
}

export class UpdateTaskDto {
  title: string;
  description: string;
  priority: TaskPriority;
  due_date: Date;
}
