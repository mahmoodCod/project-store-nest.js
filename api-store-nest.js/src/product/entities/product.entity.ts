import { Category } from 'src/category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookmarkProduct } from './product-bookmark.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  price: number;

  @Column()
  description: string;

  @Column({ nullable: false })
  stock: number;

  @CreateDateColumn()
  cretedAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Category, (category) => category.product)
  @JoinTable({
    name: 'product_category',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @OneToMany(() => BookmarkProduct, (bookmark) => bookmark.product)
  bookmarks: BookmarkProduct[];
}
