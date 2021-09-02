import { Injectable, Logger } from '@nestjs/common';
import { GetAllDataDto } from 'src/dtos/get-all-data.dto';
import { UpdateAddressDto } from 'src/dtos/update-address.dto';
import { AddressesRepository } from 'src/repositories/addresses/addresses.repository';

@Injectable()
export class AddressesService {
  private readonly logger = new Logger(AddressesService.name);
  constructor(private readonly addressesRepository: AddressesRepository) {}

  async createAddress(address: string, user: number) {
    try {
      return await this.addressesRepository.createAddress(address, user);
    } catch (err) {
      this.logger.error(`Could not create new address, ${err}`);
      return null;
    }
  }

  async deleteAddress(id: number) {
    return await this.addressesRepository.deleteAddress(id);
  }
}
