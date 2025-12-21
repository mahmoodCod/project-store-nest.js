import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createAddressDto: CreateAddressDto, userId: number) {
    const user = await this.userRepository.findOneByOrFail({ id: userId });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const address = this.addressRepository.create({
      ...createAddressDto,
      user,
    });

    return await this.addressRepository.save(address);
  }

  async findAll(): Promise<Address[]> {
    return await this.addressRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!address) {
      throw new NotFoundException(`Address ${id} not found !!`);
    }

    return address;
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    const address = await this.addressRepository.findOneBy({ id });

    if (!address) {
      throw new NotFoundException(`Address ${id} not found !!`);
    }

    await this.addressRepository.update(id, updateAddressDto);

    return this.addressRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const address = await this.addressRepository.findOneBy({ id });

    if (!address) {
      throw new NotFoundException(`Address ${id} not found !!`);
    }

    const removeAddress = await this.addressRepository.delete(id);

    return removeAddress;
  }
}
