import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/auth/entities/permission.entity';
import { Role } from 'src/auth/entities/role.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedPermissionAndRole();
  }

  async seedPermissionAndRole() {
    // step 1: create permissions
    const permissionsData = [
      // user permissions
      'user:create',
      'user:read',
      'user:edit',
      'user:delete',

      // address permissions
      'address:create',
      'address:read',
      'address:edit',
      'address:delete',
    ];

    for (const permName of permissionsData) {
      const permission = await this.permissionRepository.findOne({
        where: { name: permName },
      });

      if (!permission) {
        const perm = this.permissionRepository.create({ name: permName });

        await this.permissionRepository.save(perm);
      }
    }

    // step 2: create roles
    const rolesData = [
      { name: 'admin', permissions: permissionsData },
      { name: 'manager', permissions: [] },
      { name: 'user', permissions: [] },
    ];

    for (const roleObj of rolesData) {
      const role = await this.roleRepository.findOne({
        where: { name: roleObj.name },
      });

      const permissionsData = await this.permissionRepository.findBy({
        name: In(roleObj.permissions),
      });
      if (!role) {
        const role = this.roleRepository.create({
          name: roleObj.name,
          permissions: permissionsData,
        });

        await this.roleRepository.save(role);
      } else {
        role.permissions = permissionsData;

        await this.roleRepository.save(role);
      }
    }
  }
}
