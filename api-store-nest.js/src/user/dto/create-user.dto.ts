import {
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import UserRoleEnum from '../enum/userRoleEnum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: '09932915475', description: 'phone number' })
  @IsString({ message: 'Mobile must be a string' })
  @IsNotEmpty({ message: 'Mobile is required' })
  @Matches(/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/, {
    message: 'Mobile number must be 11 digits',
  })
  @Validate(IsMobilePhone, ['fa-IR'], {
    message: 'Mobile number must be a valid Iranian mobile number',
  })
  mobile: string;

  @ApiProperty({ example: 'mahmood', description: 'display name' })
  @IsString({ message: 'Display_name must be a string' })
  @IsNotEmpty({ message: 'Display_name is required' })
  @MinLength(3, { message: 'At least 8-digit body character' })
  @MaxLength(50)
  display_name: string;

  @ApiProperty({ example: '12345678', description: 'password' })
  @IsString({ message: 'Password must be a string' })
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, {
    message: 'Password is required',
  })
  @MinLength(8, { message: 'At least 8-digit body character' })
  @MaxLength(16)
  password: string;

  @ApiPropertyOptional({
    enum: UserRoleEnum,
    example: UserRoleEnum.Admin,
    description: 'role user',
  })
  @IsEnum(UserRoleEnum, {
    message: 'User role must be one of the values ​​(user , admin).',
  })
  @IsOptional()
  role: UserRoleEnum;
}
