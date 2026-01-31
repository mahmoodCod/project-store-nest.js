import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { orderItem } from './entities/order-item.entity';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { AddressModule } from 'src/address/address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, orderItem]),
    ProductModule,
    UserModule,
    AddressModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
