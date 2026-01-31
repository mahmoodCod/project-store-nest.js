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
  ) {}
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const user = await this.userService.findOne(createOrderDto.userId);

    const address = await this.addressService.findOne(createOrderDto.addressId);

    const order = this.orderRepository.create({
      user,
      address,
      status: createOrderDto.status || orderStatus.PENDING,
      total_price: createOrderDto.total_price,
      discount_code: createOrderDto.discount_code,
    });

    const savedOrder = await this.orderRepository.save(order);

    if (createOrderDto.items && createOrderDto.items.length > 0) {
      const orderItems = createOrderDto.items.map(async (item) => {
        const product = await this.productService.findOne(item.productId);

        const orderItem = this.orderItemRepository.create({
          order: savedOrder,
          product,
        });

        return this.orderItemRepository.save(orderItem);
      });

      await Promise.all(orderItems);
    }

    return savedOrder;
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

    if (updateOrderDto.total_price) {
      order.total_price = updateOrderDto.total_price;
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
}
