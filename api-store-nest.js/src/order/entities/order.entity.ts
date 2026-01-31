import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { orderStatus } from '../enum/order-status.enum';
import { Address } from 'src/address/entities/address.entity';
import { orderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: orderStatus,
    default: orderStatus.PENDING,
  })
  status: orderStatus;

  @Column({ type: 'timestamp', nullable: true })
  payed_time: Date;

  @ManyToOne(() => Address, (address) => address.orders)
  @JoinColumn({ name: 'addressId' })
  address: Address;

  @OneToMany(() => orderItem, (item) => item.order)
  items: orderItem[];

  @Column({ type: 'bigint' })
  total_price: number;

  @Column({ type: 'varchar', nullable: true })
  discount_code: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
