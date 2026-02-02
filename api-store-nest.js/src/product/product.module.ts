import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { UserModule } from 'src/user/user.module';
import { BookmarkProduct } from './entities/product-bookmark.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, BookmarkProduct]),
    UserModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
