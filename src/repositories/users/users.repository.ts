import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from 'src/dtos/register-user.dto';
import { UsersEntity } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from 'src/dtos/update-users.dto';
import { GetAllDataDto } from 'src/dtos/get-all-data.dto';
import { getAllQuery } from 'src/utils/get-all.query';
import { Role } from 'src/enum/roles.enum';
import { ManagersToRestaurantsEntity } from 'src/entities/managers-to-restaurants.entity';

@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name);
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    @InjectRepository(ManagersToRestaurantsEntity)
    private readonly managersToRestaurantsRepo: Repository<ManagersToRestaurantsEntity>,
  ) {}
  async registerUser(data: RegisterUserDto) {
    try {
      this.logger.log(`Register an user: ${RegisterUserDto}`);
      const salt = await bcrypt.genSalt();
      const newUser = new UsersEntity();
      (newUser.fullName = data.fullName),
        (newUser.email = data.email),
        (newUser.phoneNumber = data.phoneNumber),
        (newUser.userRole = data.userRole),
        (newUser.hash = await bcrypt.hash(data.password, salt)),
        (newUser.deleted = false);
      newUser.restaurant =
        data.userRole === Role.manager ? data.restaurant : null;

      const result = await this.usersRepository.save(newUser);
      this.logger.log(`User registered : ${result}`);

      return {
        id: result.id,
        fullName: result.fullName,
        email: result.email,
        phoneNumber: result.phoneNumber,
        userRole: result.userRole,
        restaurant: result.restaurant,
      };
    } catch (err) {
      this.logger.error(`Could not register user: ${err}`);
      return null;
    }
  }

  async getAllUsers(data: GetAllDataDto) {
    try {
      this.logger.log(`data recieved from front : ${JSON.stringify(data)}`);
      const queryBuilder = this.usersRepository.createQueryBuilder();
      queryBuilder.where('deleted = false');
      getAllQuery(queryBuilder, data);
      const result = await queryBuilder.getMany();
      const users = result.map((users) => ({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        userRole: users.userRole,
        phoneNumber: users.phoneNumber,
      }));
      return users;
    } catch (err) {
      this.logger.error(`Could not get users, ${err}`);
      return null;
    }
  }

  async deleteUser(id: number) {
    try {
      this.logger.error(`User with id: ${id} - was deleted! `);
      const result = await this.usersRepository.save({
        id,
        deleted: true,
      });
      return result;
    } catch (err) {
      this.logger.error(`Could not delete user ${err}`);
      return null;
    }
  }

  async updateUser(userId: number, data: UpdateUserDto) {
    this.logger.error(`User information with id: ${userId} - was updated! `);
    try {
      await this.usersRepository.update({ id: userId }, data);
      const result = await this.usersRepository.findOne(userId);
      return {
        id: result.id,
        fullName: result.fullName,
        email: result.email,
        phoneNumber: result.phoneNumber,
        userRole: result.userRole,
      };
    } catch (err) {
      this.logger.error(`Could not update order ${err}`);
      return null;
    }
  }

  async findUserByEmailAndPassword(email: string, password: string) {
    try {
      this.logger.log(`find user by email and password for correct login`);
      const user = await this.usersRepository.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        return null;
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.hash);
      this.logger.log(`Recieved from user and database password is matched`);
      if (isPasswordCorrect) {
        return user;
      } else {
        this.logger.log(
          `Recieved from user and database password is not matched`,
        );
        return null;
      }
    } catch (err) {
      return null;
    }
  }

  async createManagerToRestaurant(userId: number, restaurant: number) {
    try {
      const result = new ManagersToRestaurantsEntity();
      result.restaurant = restaurant;
      result.manager = userId;
      await this.managersToRestaurantsRepo.save(result);
      this.logger.log(`Creating managers for restaurants : ${result}`);
    } catch (err) {
      return null;
    }
  }

  async findRestMang(managerId: number) {
    try {
      const queryBuilder =
        await this.managersToRestaurantsRepo.createQueryBuilder(
          'managerToRest',
        );
      queryBuilder.where('managerToRest.manager = :managerId', { managerId });
      const result = await queryBuilder.getRawMany();
      this.logger.log(
        `Result from getRawMany, managersToRestaurant: ${result}`,
      );
      return result.map((res) => ({
        id: res.managerToRest_id,
        manager: res.managerToRest_manager,
        restaurant: res.managerToRest_restaurant,
      }));
    } catch (err) {
      this.logger.error(`Could not find managerToRestaurant by id ${err}`);
      return null;
    }
  }

  async findUserById(userId: number) {
    try {
      const queryBuilder = await this.usersRepository.createQueryBuilder(
        'users',
      );
      queryBuilder.where('users.id = :userId', { userId });
      queryBuilder.leftJoinAndSelect('users.restaurant', 'restaurants');
      queryBuilder.andWhere('users.deleted = false');
      const result = await queryBuilder.getRawMany();
      return result.map((res) => ({
        id: res.users_id,
        fullName: res.users_fullName,
        userRole: res.users_userRole,
        restaurant: res.restaurants_id,
      }));
    } catch (err) {
      this.logger.error(`could not get user, ${err}`);
      return null;
    }
  }
}
