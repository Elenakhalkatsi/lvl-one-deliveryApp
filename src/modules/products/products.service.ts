import { Injectable, Logger } from '@nestjs/common';
import { AddProductDto } from 'src/dtos/add-product.dto';
import { GetAllDataDto } from 'src/dtos/get-all-data.dto';
import { MakeOrderDto } from 'src/dtos/make-order.dto';
import { UpdateProductDto } from 'src/dtos/update-product.dto';
import { ProductsRepository } from 'src/repositories/products/products.repository';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(
    private readonly productRepo: ProductsRepository,
    private readonly userService: UsersService,
  ) {}

  async addProduct(managerId: number, data: AddProductDto) {
    try {
      const managerToCheck = await this.userService.findManagerToRestaurantById(
        managerId,
      );
      if (managerToCheck.length > 0) {
        if (managerToCheck[0].restaurant === data.restaurant) {
          return await this.productRepo.addProduct(data);
        }
        return `Adding a Product to this restaurant is not allowed`;
      } else {
        return `Could not find corresponding restaurant for this manager`;
      }
    } catch (err) {
      this.logger.error(`Could not add new Product: ${err}`);
      return null;
    }
  }

  async getRestaurantMenu(id: number, data: GetAllDataDto) {
    return await this.productRepo.getRestaurantMenu(id, data);
  }

  async getProductById(id: number) {
    return await this.productRepo.getOneProduct(id);
  }

  async deleteProduct(managerId: number, id: number) {
    try {
      const managerToCheck = await this.userService.findManagerToRestaurantById(
        managerId,
      );

      const foundProduct = await this.findProductById(id);
      if (managerToCheck.length > 0 && foundProduct) {
        if (managerToCheck[0].restaurant === foundProduct.restaurant) {
          return await this.productRepo.deleteProduct(Number(id));
        }

        return `Deleting this Product is not permitted`;
      }
      this.logger.error(`Product and the restaurant to check not found`);
      return `Could not find the restaurant and the Product`;
    } catch (err) {
      this.logger.error(`Could not delete the Product: ${err}`);
      return null;
    }
  }

  async updateProduct(id: number, data: UpdateProductDto, managerId: number) {
    try {
      const managerToCheck = await this.userService.findManagerToRestaurantById(
        managerId,
      );
      console.log(managerToCheck);

      const foundProduct = await this.findProductById(id);
      console.log(foundProduct);
      if (managerToCheck.length > 0 && foundProduct.length > 0) {
        if (managerToCheck[0].restaurant === foundProduct[0].restaurant) {
          return await this.productRepo.updateProduct(id, data);
        }
        return `Product update not permitted for this manager`;
      }
      return `Restaurant and the Product to check not found`;
    } catch (err) {
      this.logger.error(`Could not update the Product: ${err}`);
      return null;
    }
  }

  async globalSearch(data: GetAllDataDto) {
    return await this.productRepo.globalSearch(data);
  }

  async findProductById(id: number) {
    return await this.productRepo.findProductById(id);
  }

  async productsBelongToRestaurant(data: MakeOrderDto) {
    try {
      return await this.productRepo.productsBelongToRestaurant(data);
    } catch (err) {
      this.logger.error(
        `Could not check if all the Products are from the same restaurant, ${err}`,
      );
      return null;
    }
  }

  async calculateTotalPrice(products: number[]) {
    try {
      return await this.productRepo.calculateTotalPrice(products);
    } catch (err) {
      this.logger.error(
        `Could not calculate the total price for an order, ${err}`,
      );
      return null;
    }
  }

  async productsHaveBeenUpdated(data: MakeOrderDto) {
    return await this.productRepo.productsHaveBeenUpdated(data);
  }

  async findProduct(id: number) {
    return await this.productRepo.findProductById(id);
  }
}
