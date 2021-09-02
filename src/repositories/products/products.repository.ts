import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddProductDto } from 'src/dtos/add-product.dto';
import { GetAllDataDto } from 'src/dtos/get-all-data.dto';
import { MakeOrderDto } from 'src/dtos/make-order.dto';
import { UpdateProductDto } from 'src/dtos/update-product.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { Product } from 'src/interface/product.interface';
import { getAllQuery } from 'src/utils/get-all.query';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsRepository {
  private readonly logger = new Logger(ProductsRepository.name);
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepo: Repository<ProductEntity>,
  ) {}

  async addProduct(data: AddProductDto): Promise<Product> {
    try {
      this.logger.log(`Creating new Product with data: ${data}`);
      const newProduct = new ProductEntity();
      newProduct.productName = data.productName;
      newProduct.price = data.price;
      newProduct.restaurant = data.restaurant;

      const result = await this.productsRepo.save(newProduct);
      this.logger.log(`Product added ${result}`);
      return {
        id: result.id,
        name: result.productName,
        price: result.price,
        restaurant: result.restaurant,
      };
    } catch (err) {
      this.logger.error(`Could not add a new Product ${err}`);
      return null;
    }
  }

  async getOneProduct(id: number): Promise<Product> {
    try {
      const foundProduct = await this.productsRepo.findOne(id);
      this.logger.log(`Company found ${foundProduct}`);
      if (!foundProduct.deleted) {
        this.logger.log(`Found Product is not deleted`);
        return {
          id: foundProduct.id,
          name: foundProduct.productName,
          price: foundProduct.price,
          restaurant: foundProduct.restaurant,
        };
      }
    } catch (err) {
      this.logger.error(`Could not get Product ${err}`);
      return null;
    }
  }

  async getRestaurantMenu(id: number, data: GetAllDataDto) {
    try {
      const queryBuilder = this.productsRepo.createQueryBuilder('products');
      queryBuilder.leftJoinAndSelect('products.restaurant', 'restaurants');
      queryBuilder.where('restaurants.id = :id', { id: id });
      queryBuilder.andWhere('restaurants.deleted = false');
      queryBuilder.andWhere('products.deleted = false');

      getAllQuery(queryBuilder, data);
      const result = await queryBuilder.getRawMany();
      this.logger.log(
        `get all products from one restaurant with join ${result}`,
      );
      return result.map((res) => ({
        restaurant: res.restaurants_restaurantName,
        address: res.restaurants_address,
        menuItem: {
          productId: res.products_id,
          name: res.products_productName,
          price: res.products_price,
        },
      }));
    } catch (err) {
      this.logger.error(`Could not get products ${err}`);
      return null;
    }
  }

  async updateProduct(id: number, data: UpdateProductDto): Promise<Product> {
    try {
      await this.productsRepo.save({
        id,
        ...data,
      });
      this.logger.log(`product updated`);
      const updatedProduct = await this.productsRepo.findOne(id);

      return {
        id: updatedProduct.id,
        name: updatedProduct.productName,
        price: updatedProduct.price,
        restaurant: updatedProduct.restaurant,
      };
    } catch (err) {
      this.logger.error(`Could not update Product ${err}`);
      return null;
    }
  }

  //error needs to be fixed
  async deleteProduct(id: number) {
    return await this.productsRepo.save({
      id: Number(id),
      deleted: true,
    });
  }

  async globalSearch(data: GetAllDataDto) {
    try {
      this.logger.log(`Starting global search`);
      const queryBuilder = this.productsRepo.createQueryBuilder('products');
      queryBuilder.leftJoinAndSelect('products.restaurant', 'restaurants');
      queryBuilder.where('restaurants.deleted = false');
      queryBuilder.andWhere('products.deleted = false');
      if (data.searchBy) {
        const column = Object.keys(data.searchBy)[0];
        queryBuilder.andWhere(`${column} like :productName`, {
          productName: `%${this.escapeLikeString(data.searchBy[column])}%`,
        });
        queryBuilder.andWhere(`${column} like :restaurantName`, {
          restaurantName: `%${this.escapeLikeString(data.searchBy[column])}%`,
        });
      }
      getAllQuery(queryBuilder, data);
      const result = await queryBuilder.getRawMany();
      this.logger.log(`global Search Result: ${result}`);
      return result.map((res) => ({
        restaurantName: res.restaurants_restaurantName,
        phoneNumber: res.restaurants_phoneNumber,
        email: res.restaurants_email,
        address: res.restaurants_address,

        products: {
          productName: res.products_productName,
          price: res.products_price,
        },
      }));
    } catch (err) {
      this.logger.error(`Could not get item: ${err}`);
      return null;
    }
  }

  escapeLikeString(raw: string): any {
    return raw.replace(/[\\%_]/g, '\\$&');
  }

  async findProductById(id: number) {
    try {
      const result = await this.productsRepo.findOne(id);
      return {
        id: result.id,
        productName: result.productName,
        price: result.price,
        restaurant: result.restaurant,
      };
    } catch (err) {
      this.logger.error(`Could not find product by id ${err}`);
      return null;
    }
  }

  async productsBelongToRestaurant(data: MakeOrderDto) {
    try {
      const productsCount = await this.productsRepo
        .createQueryBuilder('products')
        .where('products.deleted = false')
        .andWhere('products.id IN (:...products)', { products: data.products })
        .andWhere('products.restaurant != :restaurant', {
          restaurant: data.restaurant,
        })
        .getCount();
      if (productsCount > 0) {
        return false;
      }

      return true;
    } catch (err) {
      this.logger.error(
        `Could not check if the products were from the same restaurant, ${err}`,
      );
      return null;
    }
  }

  //check if the products have been updated while the customer was making an order
  async productsHaveBeenUpdated(data: MakeOrderDto) {
    try {
      const productsCount = await this.productsRepo
        .createQueryBuilder('products')
        .where('products.deleted = false')
        .andWhere('products.id IN (:...products)', { products: data.products })
        .andWhere('products.restaurant != :restaurant', {
          restaurant: data.restaurant,
        })
        .andWhere('products.lastTimeUpdated >= : orderTime', {
          orderTime: data.orderTime,
        })
        .getCount();

      if (productsCount > 0) {
        return false;
      }

      return true;
    } catch (err) {
      this.logger.error(
        `Could not check if the products were updated or not, ${err}`,
      );
      return null;
    }
  }

  async calculateTotalPrice(products: number[]) {
    try {
      let totalPrice = 0;
      for (const product of products) {
        const foundProduct = await this.findProductById(product);
        totalPrice += Number(foundProduct.price);
      }

      return totalPrice;
    } catch (err) {
      this.logger.error(
        `Could not calculate the total price of the order, ${err}`,
      );
      return null;
    }
  }
  async findProduct(id: number) {
    try {
      const queryBuilder = await this.productsRepo
        .createQueryBuilder('products')
        .where('products.deleted = false')
        .innerJoinAndSelect('products.restaurant', 'restaurants')
        .andWhere('products.id = :id', { id });
      const result = await queryBuilder.getRawMany();
      return result.map((res) => ({
        productId: res.products_id,
        restaurant: res.restaurants_id,
      }));
    } catch (err) {
      this.logger.error(`Could not find product by id ${err}`);
      return null;
    }
  }
}
