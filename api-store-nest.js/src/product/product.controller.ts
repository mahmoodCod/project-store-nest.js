import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';
import { BookmarkProductDto } from './dto/bookmark-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @Res() res: Response,
  ) {
    const createProduct = await this.productService.create(createProductDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: createProduct,
      message: 'Product created successfully :))',
    });
  }

  @Post('bookMark-product')
  async bookMarkProduct(
    @Body() bookMarkProduct: BookmarkProductDto,
    @Res() res: Response,
  ) {
    const bookMarkData = await this.productService.toggleBookmark(
      bookMarkProduct.userId,
      bookMarkProduct.productId,
    );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: bookMarkData,
      message: 'Product bookMark successfully :))',
    });
  }

  @Post('add-basket')
  async addProductToBasket(
    @Body() bookMarkProduct: BookmarkProductDto,
    @Res() res: Response,
  ) {
    const bookMarkData = await this.productService.addItemToBasket(
      bookMarkProduct.userId,
      bookMarkProduct.productId,
    );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: bookMarkData,
      message: 'Product add to basket successfully :))',
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const products = await this.productService.findAll();

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: products,
      message: 'Product all successfully :))',
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const product = await this.productService.findOne(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: product,
      message: 'Product get successfully :))',
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Res() res: Response,
  ) {
    const updateProduct = await this.productService.update(
      +id,
      updateProductDto,
    );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: updateProduct,
      message: 'Product updated successfully :))',
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const removeProduct = await this.productService.remove(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: removeProduct,
      message: 'Product removed successfully :))',
    });
  }
}
