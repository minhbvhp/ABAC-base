import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from '../customers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import Customer from '../entities/customer.entity';

const mockCustomerRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  insert: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findAndCount: jest.fn(),
};

describe('CustomersService', () => {
  let customersService: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository,
        },
      ],
    }).compile();

    customersService = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(customersService).toBeDefined();
  });
});
