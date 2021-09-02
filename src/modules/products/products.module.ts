import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ProductsRepositoryModule } from 'src/repositories/products/products.module';
import { UsersModule } from '../users/users.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [AuthModule, ProductsRepositoryModule, UsersModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
