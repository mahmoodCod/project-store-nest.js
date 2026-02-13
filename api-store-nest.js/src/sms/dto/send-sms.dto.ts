import {
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendSmsDto {
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

  @ApiProperty({ example: 'hello message test', description: 'message' })
  @IsString({ message: 'message must be a string' })
  @IsNotEmpty({ message: 'message is required' })
  @MinLength(3, { message: 'At least 8-digit body character' })
  @MaxLength(50)
  message: string;
}
