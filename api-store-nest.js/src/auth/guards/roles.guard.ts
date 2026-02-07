import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorators';
import UserRoleEnum from 'src/user/enum/userRoleEnum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // get roles in metadata
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(
      ROLES_KEY,
      [context.getClass(), context.getHandler()],
    );

    if (!requiredRoles) return true;

    // get user data from jwt token
    const { user } = context.switchToHttp().getRequest();

    // check access role
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole)
      throw new ForbiddenException('You have permission to access this path');

    return true;
  }
}
