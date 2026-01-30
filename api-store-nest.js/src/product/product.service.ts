import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { BookmarkProduct } from './entities/product-bookmark.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(BookmarkProduct)
    private readonly bookmarkProductRepository: Repository<BookmarkProduct>,
    private readonly userService: UserService,
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

  async toggleBookmark(
    userId: number,
    productId: number,
  ): Promise<BookmarkProduct | void> {
    const user = await this.userService.findOne(userId);
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!user || !product) {
      throw new NotFoundException('user || product not found');
    }

    const exsistingBookmark = await this.bookmarkProductRepository.findOne({
      where: {
        user: { id: user.id },
        product: { id: product.id },
      },
    });

    if (exsistingBookmark) {
      await this.bookmarkProductRepository.remove(exsistingBookmark);
    } else {
      const newBookmark = this.bookmarkProductRepository.create({
        user: user,
        product: product,
      });
      await this.bookmarkProductRepository.save(newBookmark);
    }
  }

  async addItemToBasket(userId: number, productId: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    return await this.userService.addProductToBasket(userId, product);
  }

  async removeItemFromBasket(userId: number, productId: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    return await this.userService.removeProductFromBasket(userId, product);
  }
}
