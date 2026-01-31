import { Injectable } from '@nestjs/common';
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

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
