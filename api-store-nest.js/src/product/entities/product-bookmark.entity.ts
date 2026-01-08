import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bookmark_Product')
export class BookmarkProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  productId: number;

  @Column({ type: 'bigint' })
  userId: number;
}
