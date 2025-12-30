import {
  Column,
  CreateDateColumn,
  Entity,
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

  @Column({ default: 1 })
  stock: number;

  @CreateDateColumn()
  cretedAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
