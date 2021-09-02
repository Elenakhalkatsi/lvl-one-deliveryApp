import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/interface/address.interface';
import { GetAllDataDto } from 'src/dtos/get-all-data.dto';
import { AddressEntity } from 'src/entities/address.entity';
import { getAllQuery } from 'src/utils/get-all.query';
import { Repository } from 'typeorm';
import { UpdateAddressDto } from 'src/dtos/update-address.dto';

@Injectable()
export class AddressesRepository {
  private readonly logger = new Logger(AddressesRepository.name);
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
  ) {}

  async createAddress(address: string, user: number): Promise<Address> {
    try {
      this.logger.log(
        `creating new address,  address: ${address}, user: ${user}`,
      );
      const newAddress = new AddressEntity();
      newAddress.address = address;
      newAddress.user = user;
      newAddress.deleted = false;
      const result = await this.addressRepository.save(newAddress);
      this.logger.log(`address created and saved: ${result}`);
      return {
        id: result.id,
        address: result.address,
        user: result.id,
      };
    } catch (err) {
      this.logger.error(`Could not create address: ${err}`);
      return null;
    }
  }

  async deleteAddress(id: number): Promise<Address> {
    try {
      this.logger.log(`deleting address by id ${id}`);
      return await this.addressRepository.save({
        id,
        deleted: true,
      });
    } catch (err) {
      this.logger.error(`Could not delete the address: ${err}`);
      return null;
    }
  }
}
