import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BookmarkProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  productId: number;

  @Column({ type: 'bigint' })
  userId: number;
}
