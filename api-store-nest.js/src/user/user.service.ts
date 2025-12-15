import {
  BadRequestException,
  Injectable,
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
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createUser = this.userRepository.create(createUserDto);

      return await this.userRepository.save(createUser);
    } catch (error) {
      throw new BadRequestException('Error created user!!');
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

  async findOne(id: number) {
    const users = await this.userRepository.findOneBy({ id });

    if (!users) {
      throw new NotFoundException(`Users ${id} not found !!`);
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

  async remove(id: number) {
    const users = await this.userRepository.findOneBy({ id });

    if (!users) {
      throw new NotFoundException(`Users ${id} not found !!`);
    }

    const removeUser = await this.userRepository.delete(id);

    return removeUser;
  }
}
