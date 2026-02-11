import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { PERMISSION_KEY } from '../decorators/permissions.decorator';
import { request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/address/entities/address.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
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
    const userId = user.userId;

    // ['read.user','create.user','create.product','makedata']
    const userPermission = await this.authService.getUserPermissions(userId);

    const hasPermission = requiredPermission.every((permission) =>
      userPermission.includes(this.cleanOwn(permission)),
    );

    if (!hasPermission)
      throw new ForbiddenException(
        'You have the required permission for this operation',
      );

    // check resurce own
    // requiredPermission.forEach((permission) => {
    for (const permission of requiredPermission) {
      if (permission.endsWith(':own')) {
        const [resurce, action] = permission.split(':');
        const paramId = +request.params['id'];

        const isOwner = await this.checkOwnerShip(resurce, userId, paramId);
        if (isOwner) return true;
        else
          throw new ForbiddenException(
            'You do not have access to this operation on this resource',
          );
      }
    }
    return true;
  }

  private cleanOwn(str: string): string {
    if (str.endsWith(':own')) {
      return str.slice(0, -4);
    }

    return str;
  }

  private async checkOwnerShip(
    resurce: string,
    userId: number,
    resourceId: number,
  ) {
    if (resurce === 'address') {
      const address = await this.addressRepository.findOne({
        where: { id: resourceId },
        relations: ['user'],
      });

      if (!address) {
        throw new BadRequestException('Address not found !!');
      }

      return address.user.id === userId;
    }
    return false;
  }
}
