/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { orderItem } from './entities/order-item.entity';
import { UserService } from 'src/user/user.service';
import { AddressService } from 'src/address/address.service';
import { ProductService } from 'src/product/product.service';
import { orderStatus } from './enum/order-status.enum';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(orderItem)
    private readonly orderItemRepository: Repository<orderItem>,

    private readonly userService: UserService,

    private readonly addressService: AddressService,

    private readonly productService: ProductService,

    private readonly httpService: HttpService,
  ) {}
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const user = await this.userService.findOne(createOrderDto.userId);

    const address = await this.addressService.findOne(createOrderDto.addressId);

    const order = this.orderRepository.create({
      user,
      address,
      status: createOrderDto.status || orderStatus.PENDING,
      discount_code: createOrderDto.discount_code,
    });

    const savedOrder = await this.orderRepository.save(order);

    let totalPrice = 0;
    if (createOrderDto.items && createOrderDto.items.length > 0) {
      const orderItems = createOrderDto.items.map(async (item) => {
        const product = await this.productService.findOne(item.productId);
        totalPrice += product.price;

        const orderItem = this.orderItemRepository.create({
          order: savedOrder,
          product,
        });

        return this.orderItemRepository.save(orderItem);
      });

      await Promise.all(orderItems);
    }

    // update totalPrice in order

    await this.orderRepository.update(
      { id: savedOrder.id },
      { total_price: totalPrice },
    );

    const returned_order = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['user', 'address', 'items', 'items.product'],
    });

    if (!returned_order) {
      throw new NotFoundException('Order not found');
    }

    return returned_order;
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['user', 'address', 'items', 'items.product'],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'address', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found !!');
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found !!');
    }

    if (updateOrderDto.status) {
      order.status = updateOrderDto.status;
    }

    if (updateOrderDto.discount_code) {
      order.discount_code = updateOrderDto.discount_code;
    }

    if (updateOrderDto.addressId) {
      const address = await this.addressService.findOne(
        updateOrderDto.addressId,
      );
      order.address = address;
    }

    return this.orderRepository.save(order);
  }

  async remove(id: number): Promise<{ message: string }> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException('Order not found !!');
    }

    if (order.items && order.items.length > 0) {
      await this.orderItemRepository.remove(order.items);
    }

    await this.orderRepository.remove(order);

    return {
      message: 'Order deleted successfully',
    };
  }

  async startPayment(orderId: number) {
    const order = await this.findOne(orderId);
    const request = this.httpService.post(
      'https://gateway.zibal.ir/v1/request',
      {
        merchant: 'zibal',
        amount: order.total_price * 10,
        callbackUrl: 'http://localhost',
        orderId: 2,
      },
    );
    const responseBody = await lastValueFrom(request);
    return responseBody.data;
  }

  async verifyPayment(trackId: number, orderId: number) {
    const request = this.httpService.post(
      'https://gateway.zibal.ir/v1/verify',
      {
        merchant: 'zibal',
        trackId: trackId,
      },
    );
    const responseBody = await lastValueFrom(request);

    if (responseBody.data.result === 100) {
      const order = await this.findOne(orderId);
      order.status = orderStatus.COMPELETED;
      await this.orderRepository.save(order);
    }
    return responseBody.data;
  }
}
