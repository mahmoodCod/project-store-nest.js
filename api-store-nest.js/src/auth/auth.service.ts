import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import UserRoleEnum from 'src/user/enum/userRoleEnum';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
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
}
