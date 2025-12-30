import { Category } from 'src/category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

//   @ManyToMany(() => Category, (category) => category.product)
}
