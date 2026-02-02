import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import UserRoleEnum from '../enum/userRoleEnum';
import { Address } from 'src/address/entities/address.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { BookmarkProduct } from 'src/product/entities/product-bookmark.entity';
import { Product } from 'src/product/entities/product.entity';
import { Order } from 'src/order/entities/order.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  mobile: string;

  @Column({ nullable: false })
  display_name: string;

  @Column({ nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.NormalUser,
  })
  role: UserRoleEnum;

  @OneToMany(() => Address, (address) => address.user)
  address: Address[];

  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[];

  @OneToMany(() => BookmarkProduct, (bookmark) => bookmark.user)
  bookmarks: BookmarkProduct[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @ManyToMany(() => Product, (product) => product.baskets)
  @JoinTable({
    name: 'basket_items',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  basket_items: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
