import z from 'zod';

export class TaskValidation {
  static readonly GET = z.object({
    user_id: z.number().min(1).positive(),
  });

  static readonly CREATE = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1),
    priority: z.string().min(1),
    due_date: z.date(),
    user_id: z.number().min(1).positive(),
  });

  static readonly UPPDATE = z.object({
    id: z.number().min(1).positive(),
    title: z.string().min(1).max(100).optional(),
    description: z.string().min(1).optional(),
    priority: z.string().min(1).optional(),
    due_date: z.date().optional(),
  });

  static readonly DELETE = z.object({
    id: z.number().min(1).positive(),
    user_id: z.number().min(1).positive(),
  });
}
