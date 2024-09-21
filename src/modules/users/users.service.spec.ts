import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { createUserStub } from '../users/test/stubs/user.stub';

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  insert: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
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

  it('findOne => should return null if user with email already exists', async () => {
    //arrange
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

    jest
      .spyOn(mockUserRepository, 'findOne')
      .mockResolvedValueOnce(createUserStub());

    //act
    const result = await service.create(createUserDto);

    //assert
    expect(mockUserRepository.findOne).toHaveBeenCalled();
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: {
        email: createUserDto.email,
      },
    });

    expect(result).toEqual(null);
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
      // session: 'Minh',
    } as CreateUserDto;

    jest.spyOn(mockUserRepository, 'create').mockReturnValue(createUserStub());
    const { password, ...newUser } = createUserStub();

    // act
    const result = await service.create(createUserDto);

    // assert
    expect(mockUserRepository.create).toHaveBeenCalled();
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      ...createUserDto,
      password: expect.anything(),
    });

    expect(result).toEqual(newUser);
  });

  // it('findAll', () => {});
  // it('findOne', () => {});
  // it('update', () => {});
  // it('remove', () => {});
});
