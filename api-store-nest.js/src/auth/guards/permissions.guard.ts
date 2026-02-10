import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { PERMISSION_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    // get permissions in metadata

    // ['create.user', 'makedata']
    const requiredPermission = this.reflector.getAllAndOverride<string[]>(
      PERMISSION_KEY,
      [context.getClass(), context.getHandler()],
    );

    if (!requiredPermission) return true;

    // get user data
    const { user } = context.switchToHttp().getRequest();
    const userId = user.id;

    // ['read.user','create.user','create.product','makedata']
    const userPermission = await this.authService.getUserPermissions(userId);

    const hasPermission = requiredPermission.every((permission) =>
      userPermission.includes(this.cleanOwn(permission)),
    );

    if (!hasPermission)
      throw new ForbiddenException(
        'You have the required permission for this operation',
      );

    return true;
  }

  private cleanOwn(str: string): string {
    if (str.endsWith(':own')) {
      return str.slice(0, -4);
    }

    return str;
  }
}
