import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishEntity } from './entities/dish.entity';
import { DishesModule } from './modules/dishes/dishes.module';
import { RestaurantEntity } from './entities/restaurant.entity';
import { UsersModule } from './modules/users/users.module';
import { UsersEntity } from './entities/users.entity';
import { AuthModule } from './auth/auth.module';
import { AddressEntity } from './entities/address.entity';
import { AddressesModule } from './modules/addresses/addresses.module';
import { RatingEntity } from './entities/rating.entity';
import { OrderEntity } from './entities/order.entity';
import { DishesToOrdersEntity } from './entities/dishes-to-orders.entity';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { OrdersModule } from './modules/orders/orders.module';
import { MessageModule } from './modules/message/message.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Message } from './entities/message.entity';
import { ChatGateway } from './modules/message/chat.gateway';
import { RatingsModule } from './modules/ratings/ratings.module';
import { Managers2RestaurantsEntity } from './entities/managers-to-restaurants.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'delivery-app',
      password: '123456',
      database: 'deliveryapp',
      entities: [
        RestaurantEntity,
        DishEntity,
        UsersEntity,
        AddressEntity,
        RatingEntity,
        OrderEntity,
        DishesToOrdersEntity,
        Message,
        Managers2RestaurantsEntity,
      ],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({ rootPath: `${process.cwd()}/public` }),
    DishesModule,
    UsersModule,
    AuthModule,
    AddressesModule,
    RestaurantsModule,
    OrdersModule,
    MessageModule,
    RatingsModule,
  ],

  controllers: [],
  providers: [ChatGateway],
})
export class AppModule {}
