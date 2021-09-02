import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { GetAllDataDto } from 'src/dtos/get-all-data.dto';
import { MakeOrderDto } from 'src/dtos/make-order.dto';
import { UpdateOrderAddressDto } from 'src/dtos/update-order-address.dto';
import { UpdateOrderStatusDto } from 'src/dtos/update-order-status.dto';
import { Role } from 'src/enum/roles.enum';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { ProductsService } from '../products/products.service';
import { OrdersService } from './orders.service';

@Controller('api/v1/orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);
  constructor(
    private readonly orderService: OrdersService,
    private readonly dishService: ProductsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async makeOrder(@Body() data: MakeOrderDto, @Req() req) {
    const { user } = req;
    const result = await this.orderService.makeOrder(data, user.userId);

    if (result) {
      return getSuccessMessage(result);
    }

    return getErrorMessage('Unable to make order with given params');
  }

  //for the admins
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @UsePipes(ValidationPipe)
  async getAllOrders(@Query() data: GetAllDataDto) {
    const result = await this.orderService.getAllOrders(data);
    this.logger.log(`get all orders result: ${JSON.stringify(result)}`);
    if (result) {
      return getSuccessMessage(result);
    }
    return getErrorMessage('Could not get orders with given params');
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async getOrderAndDishes(
    @Param('id') orderId: string,
    @Query() data: GetAllDataDto,
    @Req() req,
  ) {
    const { user } = req;
    const order = await this.orderService.getOrderAndDishes(
      Number(orderId),
      data,
      user.userId,
    );
    if (order) {
      return getSuccessMessage(order);
    }

    return getErrorMessage('Could not get order with dishes');
  }

  @Get('/users/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async getUserOrders(
    @Param('id') userId: string,
    @Query() data: GetAllDataDto,
    @Req() req,
  ) {
    const { user } = req;
    const result = await this.orderService.getAllUserOrders(
      Number(userId),
      data,
      user.userId,
    );
    if (result) {
      return getSuccessMessage(result);
    }
    return getErrorMessage(`Could not get user's orders with given params`);
  }

  @Get('/restaurants/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @Roles(Role.manager)
  async getRestaurantOrders(
    @Param('id') restaurantId: string,
    @Query() data: GetAllDataDto,
    @Req() req,
  ) {
    const { user } = req;
    const result = await this.orderService.getAllRestaurantOrders(
      Number(restaurantId),
      data,
      user.userId,
    );
    if (result) {
      return getSuccessMessage(result);
    }
    return getErrorMessage(`Could not get restaurant's orders`);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @Roles(Role.user)
  async updateOrderAddress(
    @Body() data: UpdateOrderAddressDto,
    @Req() req,
    @Param('id') orderId: string,
  ) {
    const { user } = req;
    const result = await this.orderService.updateOrderAddress(
      Number(orderId),
      data,
      user.userId,
    );

    if (result) {
      return getSuccessMessage(result);
    }

    return getErrorMessage(
      `Unable to update order's address with given params`,
    );
  }

  @Patch('/status/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @Roles(Role.manager)
  async updateOrderStatus(
    @Body() data: UpdateOrderStatusDto,
    @Req() req,
    @Param('id') orderId: string,
  ) {
    const { user } = req;
    const result = await this.orderService.updateOrderStatus(
      Number(orderId),
      data,
      user.userId,
    );

    if (result) {
      return getSuccessMessage(result);
    }

    return getErrorMessage(`Unable to update order's status with given params`);
  }
}
