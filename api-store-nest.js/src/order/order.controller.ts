/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Response } from 'express';
import { PaymentOrderDto } from './dto/payment-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Res() res: Response) {
    const order = await this.orderService.create(createOrderDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: order,
      message: 'Order created successfully :))',
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const allOrders = await this.orderService.findAll();

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: allOrders,
      message: 'Order all successfully :))',
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const getOrder = await this.orderService.findOne(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: getOrder,
      message: 'Get Orders successfully :))',
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Res() res: Response,
  ) {
    const updateOrder = await this.orderService.update(+id, updateOrderDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: updateOrder,
      message: 'Order updated successfully :))',
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const removeOrder = await this.orderService.remove(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: removeOrder,
      message: 'Order remove successfully :))',
    });
  }

  @Post('start-payment')
  async startPayment(
    @Body() paymentOrderDto: PaymentOrderDto,
    @Res() res: Response,
  ) {
    const responsePay = await this.orderService.startPayment(
      paymentOrderDto.amount,
    );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        ...responsePay,
        payment_url: `https://gateway.zibal.ir/start/${responsePay.trackId}`,
      },
      message: 'Order remove successfully :))',
    });
  }
}
