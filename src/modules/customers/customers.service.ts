import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Customer from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  create(createCustomerDto: CreateCustomerDto) {
    return 'This action adds a new customer';
  }

  async getAllCustomers(
    current: number = 1,
    total: number = 10,
    condition: any,
  ): Promise<{ customers: Customer[]; totalPages: number }> {
    try {
      const skip = (current - 1) * total;

      const [customers, totalItems] =
        await this.customersRepository.findAndCount({
          take: total,
          skip,
          where: condition,
        });

      const totalPages = Math.ceil(totalItems / total);

      return { customers, totalPages };
    } catch (error) {
      throw error;
    }
  }

  async getCustomerById(customerId: number) {
    try {
      const customers = await this.customersRepository.findOne({
        where: {
          id: customerId,
        },
      });

      return customers;
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
