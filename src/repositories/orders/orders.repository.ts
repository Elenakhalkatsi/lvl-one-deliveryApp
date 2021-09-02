import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAllDataDto } from 'src/dtos/get-all-data.dto';
import { MakeOrderDto } from 'src/dtos/make-order.dto';
import { UpdateOrderAddressDto } from 'src/dtos/update-order-address.dto';
import { UpdateOrderStatusDto } from 'src/dtos/update-order-status.dto';
import { ProductsToOrdersEntity } from 'src/entities/products-to-orders.entity';
import { OrderEntity } from 'src/entities/order.entity';
import { OrderStatus } from 'src/enum/order-status.enum';
import { getAllQuery } from 'src/utils/get-all.query';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersRepository {
  private readonly logger = new Logger(OrdersRepository.name);
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(ProductsToOrdersEntity)
    private readonly productToOrderRepo: Repository<ProductsToOrdersEntity>,
  ) {}

  //Make and save the order, save products in prodtoorder table;
  async makeAnOrder(data: MakeOrderDto, totalPrice: number) {
    try {
      this.logger.log(`Making an order: ${MakeOrderDto}, ${totalPrice}`);
      const newOrder = new OrderEntity();
      newOrder.price = totalPrice;
      newOrder.address = data.address;
      newOrder.user = 1;
      newOrder.date = data.orderTime;
      newOrder.restaurant = data.restaurant;
      newOrder.status = OrderStatus.pending;

      const result = await this.orderRepo.save(newOrder);
      this.logger.log(`Order created and saved: ${result}`);

      if (result) {
        data.products.forEach(async (product) => {
          const productToOrder = new ProductsToOrdersEntity();
          productToOrder.restaurant = data.restaurant;
          productToOrder.order = newOrder.id;
          productToOrder.product = product;

          await this.productToOrderRepo.save(productToOrder);
        });
      }
      return {
        id: result.id,
        price: result.price,
        address: result.address,
        user: result.user,
        date: result.date,
        restaurant: result.restaurant,
        status: result.status,
      };
    } catch (err) {
      this.logger.error(`Could not make an order: ${err}`);
      return null;
    }
  }

  //Gets all the products and their prices for a single order
  //Only the admin is able to make this call
  async getOneOrderProducts(orderId: number, data: GetAllDataDto) {
    try {
      this.logger.log(`orderId is : ${JSON.stringify(orderId)}`);
      const queryBuilder =
        this.productToOrderRepo.createQueryBuilder('productToOrder');
      queryBuilder
        .innerJoinAndSelect('productToOrder.order', 'order')
        .innerJoinAndSelect('productToOrder.product', 'product')
        .where('order.id = :orderId', { orderId });

      getAllQuery(queryBuilder, data);

      const result = await queryBuilder.getRawMany();
      if (result.length === 0) {
        return `Order with given id does not exist`;
      }
      return result.map((res) => ({
        restaurant: res.productToOrder_restaurantId,
        date: res.order_date,
        status: res.order_status,
        price: res.order_price,
        productOrdered: {
          id: res.product_id,
          name: res.product_name,
          price: res.product_price,
        },
      }));
    } catch (err) {
      this.logger.error(`could not get products ordered: ${err}`);
      return null;
    }
  }

  //gets all of the orders
  async getAllOrders(data: GetAllDataDto) {
    try {
      this.logger.log(`data recieved from front : ${JSON.stringify(data)}`);
      const queryBuilder = this.orderRepo.createQueryBuilder('order');
      queryBuilder
        .innerJoinAndSelect('order.user', 'users')
        .innerJoinAndSelect('order.restaurant', 'restaurants');

      getAllQuery(queryBuilder, data);
      const result = await queryBuilder.getRawMany();
      return result.map((res) => ({
        orderId: res.order_id,
        date: res.order_date,
        status: res.order_status,
        price: res.order_price,
        orderedProducts: res.order_orderedProducts,
        user: {
          id: res.order_userId,
          name: res.users_fullName,
          email: res.users_email,
          phoneNumber: res.users_phoneNumber,
        },
        restaurant: {
          name: res.restaurants_name,
          email: res.restaurants_email,
          address: res.restaurants_address,
        },
      }));
    } catch (err) {
      this.logger.error(`Could not get orders, ${err}`);
      return null;
    }
  }

  //gets orders of an individual user
  async getAllUserOrders(userId: number, data: GetAllDataDto) {
    try {
      this.logger.log(`data recieved from front : ${JSON.stringify(data)}`);
      const queryBuilder = this.orderRepo.createQueryBuilder('order');
      queryBuilder
        .innerJoinAndSelect('order.user', 'users')
        .innerJoinAndSelect('order.restaurant', 'restaurants')
        .where('users.id = :userId', { userId: userId });

      getAllQuery(queryBuilder, data);

      const result = await queryBuilder.getRawMany();

      return result.map((res) => ({
        orderId: res.order_id,
        date: res.order_date,
        status: res.order_status,
        price: res.order_price,
        user: {
          id: res.order_userId,
          name: res.users_fullName,
          email: res.users_email,
          phoneNumber: res.users_phoneNumber,
        },
        restaurant: {
          name: res.restaurants_name,
          email: res.restaurants_email,
          address: res.restaurants_address,
        },
      }));
    } catch (err) {
      this.logger.error(`Could not get user's orders, ${err}`);
      return null;
    }
  }
  //gets orders for a specific restaurant
  //managers only
  async getAllRestaurantOrders(restaurantId: number, data: GetAllDataDto) {
    try {
      this.logger.log(`data recieved from front : ${JSON.stringify(data)}`);
      const queryBuilder = this.orderRepo.createQueryBuilder('order');
      queryBuilder
        .innerJoinAndSelect('order.user', 'users')
        .innerJoinAndSelect('order.restaurant', 'restaurants')
        .where('restaurants.id = :restaurantId', {
          restaurantId: restaurantId,
        });

      getAllQuery(queryBuilder, data);

      const result = await queryBuilder.getRawMany();

      return result.map((res) => ({
        orderId: res.order_id,
        date: res.order_date,
        status: res.order_status,
        price: res.order_price,
        user: {
          id: res.order_userId,
          name: res.users_fullName,
          email: res.users_email,
          phoneNumber: res.users_phoneNumber,
        },
        restaurant: {
          name: res.restaurants_name,
          email: res.restaurants_email,
          address: res.restaurants_address,
        },
      }));
    } catch (err) {
      this.logger.error(`Could not get restaurant's orders, ${err}`);
      return null;
    }
  }

  //allows the customer to update address while the order status is still pending
  async updateOrderAddress(orderId: number, data: UpdateOrderAddressDto) {
    try {
      await this.orderRepo.save({
        id: orderId,
        address: data.address,
      });
      this.logger.log(`order address updated`);
      const updatedOrder = await this.orderRepo.findOne(orderId);

      return {
        id: updatedOrder.id,
        address: updatedOrder.address,
      };
    } catch (err) {
      this.logger.error(`Could not update order ${err}`);
      return null;
    }
  }

  async findOrderbyId(orderId: number) {
    try {
      const queryBuilder = await this.orderRepo.createQueryBuilder('order');
      queryBuilder
        .innerJoinAndSelect('order.user', 'users')
        .innerJoinAndSelect('order.restaurant', 'restaurant')
        .where('order.id = :orderId', { orderId: orderId });
      const result = await queryBuilder.getRawMany();
      return result.map((res) => ({
        restaurant: res.restaurant_id,
        userId: res.users_id,
        orderStatus: res.order_status,
      }));
    } catch (err) {
      this.logger.error(`Could not find order by id: ${err}`);
      return null;
    }
  }

  async updateOrderStatus(orderId: number, data: UpdateOrderStatusDto) {
    try {
      await this.orderRepo.save({
        id: orderId,
        status: data.status,
      });
      this.logger.log(`order status updated`);
      const updatedOrder = await this.orderRepo.findOne(orderId);

      return {
        id: updatedOrder.id,
        date: updatedOrder.date,
        status: updatedOrder.status,
        address: updatedOrder.address,
      };
    } catch (err) {
      this.logger.error(`Could not update order ${err}`);
      return null;
    }
  }
}
