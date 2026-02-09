import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import UserRoleEnum from './enum/userRoleEnum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const alreadyUser = await this.findOneByMobile(
        createUserDto.mobile,
        true,
      );

      if (!alreadyUser) {
        const createUser = this.userRepository.create(createUserDto);
        return await this.userRepository.save(createUser);
      } else throw new BadRequestException('User already exists!!');
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(role?: UserRoleEnum, limit: number = 10, page: number = 1) {
    const query = this.userRepository.createQueryBuilder('users');

    if (role) {
      query.where('role = :role', { role });
    }

    query.skip((page - 1) * limit).take(limit);

    return await query.getMany();
  }

  async findOne(id: number): Promise<User> {
    const users = await this.userRepository.findOneBy({ id });

    if (!users) {
      throw new NotFoundException(`Users ${id} not found !!`);
    }

    return users;
  }

  // service permissions
  async findUserByPermission(userId: number): Promise<User> {
    const users = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions', 'permissions'],
    });

    if (!users) {
      throw new NotFoundException(`Users ${userId} not found !!`);
    }

    return users;
  }

  async addRole(userId, role) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.roles.push(role);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.save(user);
  }

  async removeRole(userId: number, roleId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.roles = user.roles.filter((r) => r.id !== roleId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.save(user);
  }

  async findOneByMobile(mobile: string, checkExist: boolean = false) {
    const users = await this.userRepository.findOneBy({ mobile });

    if (!checkExist)
      if (!users) {
        throw new NotFoundException(`Users ${mobile} not found !!`);
      }

    return users;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const users = await this.userRepository.findOneBy({ id });

    if (!users) {
      throw new NotFoundException(`Users ${id} not found !!`);
    }

    await this.userRepository.update(id, updateUserDto);

    return this.userRepository.findOneBy({ id });
  }

  async addProductToBasket(userId, product) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['basket_items'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.basket_items.push(product);

    return await this.userRepository.save(user);
  }

  async removeProductFromBasket(userId: number, productId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['basket_items'],
    });

    if (!user) {
      throw new NotFoundException('User not found !!');
    }

    const productIndex = user.basket_items.findIndex(
      (item) => item.id === productId,
    );

    if (productIndex === -1) {
      throw new NotFoundException('Product not found in the basket');
    }

    user.basket_items.splice(productIndex, 1);

    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    const users = await this.userRepository.findOneBy({ id });

    if (!users) {
      throw new NotFoundException(`Users ${id} not found !!`);
    }

    const removeUser = await this.userRepository.delete(id);

    return removeUser;
  }
}
