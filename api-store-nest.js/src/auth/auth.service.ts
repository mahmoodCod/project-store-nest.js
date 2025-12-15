import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import UserRoleEnum from 'src/user/enum/userRoleEnum';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(mobile: string, password: string, display_name: string) {
    return this.userService.create({
      mobile,
      password,
      display_name,
      role: UserRoleEnum.NormalUser,
    });
  }
}
