import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: ['pending', 'compeleted', 'canselleded'],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  set_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  payed_time: Date;
}
