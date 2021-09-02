import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { OrdersRepositoryModule } from 'src/repositories/orders/orders.module';
import { AddressesModule } from '../addresses/addresses.module';
import { DishesModule } from '../dishes/dishes.module';
import { UsersModule } from '../users/users.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    AuthModule,
    OrdersRepositoryModule,
    DishesModule,
    AddressesModule,
    UsersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
