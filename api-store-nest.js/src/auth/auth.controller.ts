import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.register(
      registerDto.mobile,
      registerDto.password,
      registerDto.display_name,
    );
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto)
}
