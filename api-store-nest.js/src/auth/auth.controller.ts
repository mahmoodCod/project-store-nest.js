import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorators';

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

  @Post('role')
  async createRole(@Body() createRole, @Res() res: Response) {
    const role = await this.authService.createRole(createRole?.name);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: role,
      message: 'Create role successfully :))',
    });
  }

  // @Get('getUserPermission/:user_id')
  // async getUserPermission(@Param('user_id') user_id: number) {
  //   const login = await this.authService.getUserPermissions(user_id);

  //   return login;
  // }
}
