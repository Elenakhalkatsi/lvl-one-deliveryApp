import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AddressesRepositoryModule } from 'src/repositories/addresses/addresses.module';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';

@Module({
  imports: [AuthModule, AddressesRepositoryModule],
  controllers: [AddressesController],
  providers: [AddressesService],
  exports: [AddressesService],
})
export class AddressesModule {}
