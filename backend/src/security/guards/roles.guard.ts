import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'generated/prisma/enums';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RequestWithUser } from '../interfaces/request-with-user.interface';

// Checks whether the authenticated user has the required role(s)
// defined via the @Roles() decorator.
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // checks if the user's role matches any of the required roles.
  // Throws ForbiddenException if the user does not have the required role.
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();

    // Checks if the user's assigned role is included in the required roles list.
    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) throw new ForbiddenException('Dont have access');

    return true;
  }
}
