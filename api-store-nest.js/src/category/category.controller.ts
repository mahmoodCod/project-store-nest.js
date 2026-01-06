import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpStatus,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Response } from 'express';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res: Response,
  ) {
    const createCategory = await this.categoryService.create(createCategoryDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: createCategory,
      message: 'Category created successfully :))',
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const category = await this.categoryService.findAll();

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: category,
      message: 'Category all successfully :))',
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const category = await this.categoryService.findOne(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: category,
      message: 'Category get successfully :))',
    });
  }

  @Delete('remove-only-category/:id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.categoryService.removeOnlyCategory(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Category removed successfully :))',
    });
  }
}
