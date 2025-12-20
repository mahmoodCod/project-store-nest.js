import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import UserRoleEnum from '../enum/userRoleEnum';
import { Address } from 'src/address/entities/address.entity';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
