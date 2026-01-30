import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Title must be a string' })
  title: string;
}
