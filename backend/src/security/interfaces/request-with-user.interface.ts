import { Request } from 'express';
import { Role } from 'generated/prisma/enums';

export interface RequestUser {
  id: number;
  email: string;
  role: Role;
}

export interface RequestWithUser extends Request {
  user: RequestUser;
}
