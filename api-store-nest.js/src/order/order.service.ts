import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { orderItem } from './entities/order-item.entity';
import { User } from 'src/user/entities/user.entity';
import { Address } from 'src/address/entities/address.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(orderItem)
    private readonly orderItemRepository: Repository<orderItem>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    const {
      userId,
      addressId,
      items,
      status,
      payed_time,
      total_price,
      discount_code,
    } = createOrderDto;

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const address = await this.addressRepository.findOne({
      where: { id: addressId },
    });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
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
