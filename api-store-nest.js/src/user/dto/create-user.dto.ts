import {
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  Matches,
  Validate,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Mobile must be a string' })
  @IsNotEmpty({ message: 'Mobile is required' })
  @Matches(/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/, {
    message: 'Mobile number must be 11 digits',
  })
  @Validate(IsMobilePhone, ['fa-IR'], {
    message: 'Mobile number must be a valid Iranian mobile number',
  })
  mobile: string;
}
