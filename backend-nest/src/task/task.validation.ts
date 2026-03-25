import { Priority } from 'generated/prisma/enums';
import z from 'zod';

export class TaskValidation {
  static readonly CREATE = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1),
    priority: z.nativeEnum(Priority),
    due_date: z.date(),
  });

  static readonly UPDATE = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1),
    priority: z.nativeEnum(Priority),
    due_date: z.date(),
  });
}
