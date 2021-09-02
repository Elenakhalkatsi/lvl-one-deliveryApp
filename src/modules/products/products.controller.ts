import {
  Body,
  Controller,
  Delete,
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
import { AddProductDto } from 'src/dtos/add-product.dto';
import { GetAllDataDto } from 'src/dtos/get-all-data.dto';
import { UpdateProductDto } from 'src/dtos/update-product.dto';
import { Role } from 'src/enum/roles.enum';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { ProductsService } from './products.service';

@Controller('api/v1/products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);
  constructor(private readonly productService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @Roles(Role.manager)
  async addProduct(@Body() data: AddProductDto, @Req() req) {
    const { user } = req;
    this.logger.log(`Adding new product : ${data}`);
    const result = await this.productService.addProduct(user.userId, data);
    this.logger.log(`New product added: ${result}`);
    if (result) {
      return getSuccessMessage(result);
    }
    this.logger.error(`could not add the product, ${data}`);
    return getErrorMessage('Could not add product with given params');
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async getRestaurantMenu(
    @Param('id') id: string,
    @Query() data: GetAllDataDto,
  ) {
    this.logger.log(`getting restaurant's menu, ${data}`);
    const result = await this.productService.getRestaurantMenu(
      Number(id),
      data,
    );
    if (result) {
      return getSuccessMessage(result);
    }
    this.logger.error(`could not get the menu`);
    return getErrorMessage('Could not get restaurant menu');
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.manager)
  async deleteProduct(@Param('id') id: string, @Req() req) {
    const { user } = req;
    const result = await this.productService.deleteProduct(
      user.userId,
      Number(id),
    );
    if (result) {
      return `Product with id ${id} is deleted successfully`;
    }
    return getErrorMessage(`Could not delete the product`);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.manager)
  @UsePipes(ValidationPipe)
  async updateProduct(
    @Body() data: UpdateProductDto,
    @Param('id') id: string,
    @Req() req,
  ) {
    const { user } = req;
    this.logger.log(`Updating product with id ${id}`);
    const result = await this.productService.updateProduct(
      Number(id),
      data,
      user.userId,
    );
    if (result) {
      return getSuccessMessage(result);
    }
    this.logger.error(`could not update the product`);
    return getErrorMessage(`Could not update product with given params`);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async globalSearch(@Query() data: GetAllDataDto) {
    this.logger.log(`Performing global search`);
    const result = await this.productService.globalSearch(data);
    if (result) {
      return getSuccessMessage(result);
    }
    this.logger.error(`Could not perform global search`);
    return getErrorMessage(`Could not perform the global search`);
  }
}
