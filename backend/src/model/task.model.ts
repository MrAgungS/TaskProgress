export enum TaskPriority {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export class CreateTaskDto {
  title: string;
  description: string | null;
  priority: TaskPriority;
  due_date: Date | null;
}

export class UpdateTaskDto {
  title: string;
  description: string | null;
  priority: TaskPriority;
  due_date: Date | null;
}
