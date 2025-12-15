import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Mobile must be a string' })
  @IsNotEmpty({ message: 'Mobile is required' })
  mobile: string;
}
