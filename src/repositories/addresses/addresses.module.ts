import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from 'src/entities/address.entity';
import { AddressesRepository } from './addresses.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity])],
  providers: [AddressesRepository],
  exports: [AddressesRepository],
})
export class AddressesRepositoryModule {}
