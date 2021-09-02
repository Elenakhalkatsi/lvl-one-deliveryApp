import { Injectable, Logger } from '@nestjs/common';
import { GetAllDataDto } from 'src/dtos/get-all-data.dto';
import { RegisterUserDto } from 'src/dtos/register-user.dto';
import { UpdateUserDto } from 'src/dtos/update-users.dto';
import { UsersRepository } from 'src/repositories/users/users.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly usersRepository: UsersRepository) {}

  async registerUser(data: RegisterUserDto) {
    const result = await this.usersRepository.registerUser(data);
    if (data.restaurant) {
      await this.usersRepository.createManagerToRestaurant(
        result.id,
        data.restaurant,
      );
    }
    return result;
  }

  async getAllUsers(data: GetAllDataDto) {
    const result = await this.usersRepository.getAllUsers(data);
    return result;
  }

  async deleteUser(userId: number) {
    const result = await this.usersRepository.deleteUser(Number(userId));

    return result;
  }

  async updateUser(userId: number, data: UpdateUserDto) {
    const result = await this.usersRepository.updateUser(Number(userId), data);

    return result;
  }

  async findUserByEmailAndPassword(email: string, password: string) {
    const result = this.usersRepository.findUserByEmailAndPassword(
      email,
      password,
    );
    return result;
  }

  async findManagerToRestaurantById(managerId: number) {
    return await this.usersRepository.findRestMang(managerId);
  }

  async findUserById(userId: number) {
    return await this.usersRepository.findUserById(userId);
  }
}
