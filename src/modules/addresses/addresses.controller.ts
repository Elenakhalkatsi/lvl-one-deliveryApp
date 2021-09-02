import { Controller, Delete, Logger, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/enum/roles.enum';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { AddressesService } from './addresses.service';

@Controller('api/v1/addresses')
export class AddressesController {
  private readonly logger = new Logger(AddressesController.name);
  constructor(private readonly addressesService: AddressesService) {}

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  async deleteAddress(@Param('id') id: string) {
    try {
      this.logger.log(`deleting address with id ${id}`);
      const result = await this.addressesService.deleteAddress(Number(id));
      this.logger.log(`result of delete: ${result}`);
      if (result) {
        return getSuccessMessage(`Address deleted successfully`);
      }
    } catch (err) {
      return getErrorMessage('Something went wrong');
    }
  }
}
