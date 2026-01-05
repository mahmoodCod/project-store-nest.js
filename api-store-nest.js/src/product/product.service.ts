import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createProduct = this.productRepository.create(createProductDto);
    return await this.productRepository.save(createProduct);
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productRepository.find({
      relations: ['category'],
    });

    return products;
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found !!`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found !!`);
    }

    await this.productRepository.update(id, updateProductDto);

    return this.productRepository.findOneBy({ id });
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
