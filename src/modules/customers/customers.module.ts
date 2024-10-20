import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Customer from './entities/customer.entity';
import { AuthModule } from '../auth/auth.module';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), CaslModule],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
