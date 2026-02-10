import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import UserRoleEnum from 'src/user/enum/userRoleEnum';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async register(mobile: string, password: string, display_name: string) {
    const hashPassword: string = await bcrypt.hash(password, 10);
    return this.userService.create({
      mobile,
      password: hashPassword,
      display_name,
      role: UserRoleEnum.NormalUser,
    });
  }

  async login(mobile: string, password: string) {
    const user = await this.userService.findOneByMobile(mobile);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Your password is incorrect!!');
    }

    const payload = {
      mobile: user.mobile,
      sub: user.id,
      display_name: user.display_name,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
    };
  }

  async getUserPermissions(userId: number): Promise<string[]> {
    const user = await this.userService.findUserByPermission(userId);

    const permissions = new Set<string>();
    user.roles?.forEach((role) =>
      role.permissions?.forEach((p) => permissions.add(p.name)),
    );

    user.permissions?.forEach((p) => permissions.add(p.name));

    return Array.from(permissions);
  }

  async createRole(name: string) {
    const role = this.roleRepository.create({ name });

    return this.roleRepository.save(role);
  }

  async addRoleToUser(userId: number, roleId: number) {
    const user = await this.userService.findUserByPermission(userId);

    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) throw new NotFoundException('User role not found');

    if (!user.roles.find((r) => r.id === role.id)) {
      return await this.userService.addRole(userId, role);
    }

    throw new BadRequestException(
      'This role has already been shown to the user',
    );
  }

  async removeRoleToUser(userId: number, roleId: number) {
    const user = await this.userService.findUserByPermission(userId);

    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) throw new NotFoundException('User role not found');

    if (user.roles.find((r) => r.id === role.id)) {
      return await this.userService.removeRole(userId, roleId);
    }

    throw new BadRequestException('Valid role entered');
  }

  async getUserRole(userId: number) {
    const user = await this.userService.findUserByPermission(userId);

    return user.roles;
  }

  async createPermission(name: string) {
    const permission = this.permissionRepository.create({ name });

    return this.permissionRepository.save(permission);
  }

  async addPermissionToRole(permissionId, roleId) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException(`Role ${roleId} not found`);
    }

    if (!role?.permissions.find((p) => p.id === permissionId)) {
      const permission = await this.permissionRepository.findOne({
        where: { id: permissionId },
      });

      if (!permission) {
        throw new NotFoundException(`Permission ${permissionId} not found`);
      }

      role.permissions.push(permission);
    } else throw new BadRequestException('This permission already exists');

    return this.roleRepository.save(role);
  }

  async addPermissionToUser(userId: number, permissionId: number) {
    const user = await this.userService.findUserByPermission(userId);

    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });
    if (!permission) throw new NotFoundException('License not found');

    if (!user.permissions.find((p) => p.id === permission.id)) {
      return await this.userService.addPermission(userId, permission);
    }

    throw new BadRequestException(
      'This permission has already been shown to the user',
    );
  }
}
