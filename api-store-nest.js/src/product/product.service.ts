import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { title, price, description, stock, categoryIds } = createProductDto;
    const createProduct = this.productRepository.create({
      title,
      price,
      description,
      stock,
    });

    if (categoryIds) {
      const categoryes = await this.categoryRepository.findBy({
        id: In(categoryIds),
      });
      createProduct.categories = categoryes;
    }

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

  async remove(id: number) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found !!`);
    }

    const removeProduct = await this.productRepository.delete(id);

    return removeProduct;
  }
}
