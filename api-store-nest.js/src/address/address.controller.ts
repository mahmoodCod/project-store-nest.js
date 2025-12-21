import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Response } from 'express';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(
    @Body() createAddressDto: CreateAddressDto,
    @Res() res: Response,
  ) {
    const createAddress = await this.addressService.create(createAddressDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: createAddress,
      message: 'Address created successfully :))',
    });
  }

  @Get()
  async findAll(
    @Res() res: Response,
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
  ) {
    const address = await this.addressService.findAll(limit, page);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: address,
      message: 'Address all successfully :))',
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const getAddress = await this.addressService.findOne(+id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: getAddress,
      message: 'Address get successfully :))',
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @Res() res: Response,
  ) {
    const updateAddress = await this.addressService.update(
      +id,
      updateAddressDto,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: updateAddress,
      message: 'Address updated successfully :))',
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const removeAddress = await this.addressService.remove(+id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: removeAddress,
      message: 'Address removed successfully :))',
    });
  }
}
