import { Injectable, Logger } from '@nestjs/common';
import { MakeOrderDto } from 'src/dtos/make-order.dto';
import { UpdateOrderAddressDto } from 'src/dtos/update-order-address.dto';
import { OrderStatus } from 'src/enum/order-status.enum';
import { OrdersRepository } from 'src/repositories/orders/orders.repository';
import { AddressesService } from 'src/modules/addresses/addresses.service';
import { DishesService } from '../dishes/dishes.service';
import { GetAllDataDto } from 'src/dtos/get-all-data.dto';
import { UpdateOrderStatusDto } from 'src/dtos/update-order-status.dto';
import { UsersService } from '../users/users.service';
import { Role } from 'src/enum/roles.enum';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  constructor(
    private readonly orderRepo: OrdersRepository,
    private readonly dishesService: DishesService,
    private readonly addressesService: AddressesService,
    private readonly usersService: UsersService,
  ) {}

  async makeOrder(data: MakeOrderDto, user: number) {
    try {
      const checkIfDishesMatch =
        await this.dishesService.dishesBelongToRestaurant(data);

      // const checkIfDishIsNotUpdated =
      //   await this.dishesService.dishesHaveBeenUpdated(data);

      // if (checkIfDishIsNotUpdated) {
      const totalPrice = await this.dishesService.calculateTotalPrice(
        data.dishes,
      );

      if (checkIfDishesMatch) {
        await this.addressesService.createAddress(data.address, user);

        return await this.orderRepo.makeAnOrder(data, totalPrice);
      }
      // } else {
      //   return 'Some propperties of the dish have been changed, please check and reorder';
      // }
      return `Dish does not belong to this restaurant, please try to re order`;
    } catch (err) {
      this.logger.error(`Could not make an order, ${err}`);
      return null;
    }
  }

  async getOrderAndDishes(id: number, data: GetAllDataDto, userId: number) {
    try {
      const orderToCheck = await this.orderRepo.findOrderbyId(id);
      const managerToCheck = await this.usersService.findUserById(userId);
      console.log(orderToCheck);
      console.log(managerToCheck);
      if (orderToCheck.length > 0 && managerToCheck.length > 0) {
        if (
          orderToCheck[0].customerId === userId ||
          managerToCheck[0].restaurant === orderToCheck[0].restaurant ||
          managerToCheck[0].userRole === Role.admin
        ) {
          return await this.orderRepo.getOneOrderDishes(id, data);
        }
        return `Wrong order id`;
      }
      return `Could not check the corresponding order`;
    } catch (err) {
      return null;
    }
  }

  async getAllOrders(data: GetAllDataDto) {
    return await this.orderRepo.getAllOrders(data);
  }
  async getAllUserOrders(
    customerId: number,
    data: GetAllDataDto,
    userId: number,
  ) {
    try {
      if (customerId === userId) {
        return await this.orderRepo.getAllUserOrders(customerId, data);
      }
      return `This order does not belong to current account`;
    } catch (err) {
      return null;
    }
  }
  async getAllRestaurantOrders(
    restaurantId: number,
    data: GetAllDataDto,
    userId,
  ) {
    try {
      const userToCheck = await this.usersService.findUserById(userId);
      if (userToCheck.length > 0) {
        if (userToCheck[0].restaurant === restaurantId) {
          return await this.orderRepo.getAllRestaurantOrders(
            restaurantId,
            data,
          );
        }
        return `Restaurant manager does not match`;
      }
      return `User not found`;
    } catch (err) {
      return null;
    }
  }

  async updateOrderAddress(
    orderId: number,
    data: UpdateOrderAddressDto,
    userId: number,
  ) {
    try {
      const orderCustomer = await this.orderRepo.findOrderbyId(orderId);
      this.logger.log(`order found ${orderCustomer}`);
      if (orderCustomer.length > 0) {
        if (
          orderCustomer[0].customerId === userId &&
          orderCustomer[0].orderStatus === OrderStatus.pending
        ) {
          const result = await this.orderRepo.updateOrderAddress(orderId, data);
          if (result) {
            await this.addressesService.createAddress(data.address, userId);
            return result;
          }
        } else {
          return 'order was not found or update was not permitted';
        }
      }
      return `Order and user not found`;
    } catch (err) {
      this.logger.error(`could not update order's address: ${err}`);
      return null;
    }
  }

  async updateOrderStatus(
    orderId: number,
    data: UpdateOrderStatusDto,
    userId: number,
  ) {
    try {
      const orderToCheck = await this.orderRepo.findOrderbyId(orderId);
      const managerToCheck = await this.usersService.findUserById(userId);
      if (orderToCheck.length > 0 && managerToCheck.length > 0) {
        if (orderToCheck[0].restaurant === managerToCheck[0].restaurant) {
          return await this.orderRepo.updateOrderStatus(orderId, data);
        }
        return `Manager and the restaurant does not match`;
      }
      return `Could not find order or the manager`;
    } catch (err) {
      return null;
    }
  }

  async findOrderbyId(id: number) {
    return await this.orderRepo.findOrderbyId(id);
  }
}
