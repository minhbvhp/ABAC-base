import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Customer from './entities/customer.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async createCustomer(createCustomerDto: CreateCustomerDto, userId: string) {
    try {
      if (!isUUID(userId)) {
        return null;
      }

      const existedCustomer = await this.customersRepository.findOne({
        where: {
          taxCode: createCustomerDto.taxCode,
        },
      });

      if (!existedCustomer) {
        const newCustomer = await this.customersRepository.create({
          ...createCustomerDto,
          userId: userId,
        });

        await this.customersRepository.insert(newCustomer);

        return newCustomer;
      }
    } catch (error) {
      throw error;
    }

    return null;
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
}
