import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import UserRoleEnum from 'src/user/enum/userRoleEnum';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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
    const user = await this.userService
  }
}
