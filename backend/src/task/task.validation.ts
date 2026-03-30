import { Priority } from 'generated/prisma/enums';
import z from 'zod';

export class TaskValidation {
  static readonly CREATE = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).optional(),
    priority: z.nativeEnum(Priority),
    due_date: z.coerce.date().optional(),
  });

  static readonly UPDATE = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).optional(),
    priority: z.nativeEnum(Priority),
    due_date: z.coerce.date().optional(),
  });
}
