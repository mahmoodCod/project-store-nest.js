import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { Permission } from '../entities/permission.entity';
import { PERMISSION_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // get permissions in metadata

    // ['create.user', 'makedata']
    const requiredPermission = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSION_KEY,
      [context.getClass(), context.getHandler()],
    );

    if (!requiredPermission) return true;

    // get user data
    const { user } = context.switchToHttp().getRequest();
    const userId = user.id;

    // ['read.user','create.user','create.product','makedata']
    const userPermission = this.authService.getUserPermissions(userId);

    return true;
  }
}
