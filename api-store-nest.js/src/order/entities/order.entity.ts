import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { orderStatus } from '../enum/order-status.enum';
import { Address } from 'src/address/entities/address.entity';

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

  @Column({ type: 'bigint' })
  total_price: number;

  @Column({ type: 'bigint', nullable: true })
  discount_code: number;
}
