import { Body, Controller, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorators';
import { RoleDto } from './dto/role.dto';
import { RoleToUserDto } from './dto/role-to-user.dto';

@ApiTags('Management auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const register = await this.authService.register(
      registerDto.mobile,
      registerDto.password,
      registerDto.display_name,
    );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: register,
      message: 'Create register successfully :))',
    });
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const login = await this.authService.login(
      loginDto.mobile,
      loginDto.password,
    );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: login,
      message: 'Login successfully :))',
    });
  }

  @ApiBearerAuth()
  @Post('role')
  async createRole(@Body() createRole: RoleDto, @Res() res: Response) {
    const role = await this.authService.createRole(createRole?.name);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: role,
      message: 'Create role successfully :))',
    });
  }

  @ApiBearerAuth()
  @Post('role/append-to-user')
  async addRoleToUser(@Body() roleToUser: RoleToUserDto) {
    const role = await this.authService.addRoleToUser(
      roleToUser.userId,
      roleToUser.roleId,
    );

    return role;
  }

  @ApiBearerAuth()
  @Post('role/remove-to-user')
  async removeRoleToUser(@Body() roleToUser: RoleToUserDto) {
    const role = await this.authService.removeRoleToUser(
      roleToUser.userId,
      roleToUser.roleId,
    );

    return role;
  }

  @ApiBearerAuth()
  @Post('role/get-user-roles/:userId')
  async getUserRoles(@Param('userId') userId: number) {
    const role = await this.authService.getUserRole(userId);

    return role;
  }

  @ApiBearerAuth()
  @Post('permission')
  async createPermission(@Body() createRole: RoleDto) {
    const permission = await this.authService.createPermission(
      createRole?.name,
    );

    return permission;
  }

  // @Get('getUserPermission/:user_id')
  // async getUserPermission(@Param('user_id') user_id: number) {
  //   const login = await this.authService.getUserPermissions(user_id);

  //   return login;
  // }
}
