import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

const mockUserRepository = {
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  insert: jest.fn(),
  create: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create => Should create a new user and return its data', async () => {
    // arrange
    const createUserDto = {
      email: 'Test1@gmail.com',
      password: 'Test1@gmail.com',
      name: 'Test1@gmail.com',
      genderId: 1,
      phoneNumber: '0123456789',
      address: '24 Điện Biên Phủ',
      roleId: 1,
      companyId: 2,
    } as CreateUserDto;

    const user = {
      id: 'ada1231923j0ad9j092',
      email: 'Test1@gmail.com',
      password: '$2a$10$RwBjTGu9rwebdhZI519Tcu3pEI/rPduIgvhEckL1Tf3ZqcDosboh6',
      name: 'Test1@gmail.com',
      genderId: 1,
      phoneNumber: '0123456789',
      address: '24 Điện Biên Phủ',
      roleId: 1,
      companyId: 2,
    } as User;

    jest.spyOn(mockUserRepository, 'create').mockReturnValue(user);

    // act
    const result = await service.create(createUserDto);

    // assert
    expect(mockUserRepository.create).toHaveBeenCalled();
    // expect(mockUserRepository.insert).toHaveBeenCalledWith(createUserDto);

    // expect(result).toEqual(user);
  });

  // it('findAll', () => {});
  // it('findOne', () => {});
  // it('update', () => {});
  // it('remove', () => {});
});
