import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { allUserStub, createUserStub } from '../users/test/stubs/user.stub';
import { ConfigModule } from '@nestjs/config';
import { formatUserResponse } from '../utils/helpers/formatUserResponseHelpers';

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  insert: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findAndCount: jest.fn(),
};

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

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create => should return null if user with email already exists', async () => {
    //arrange
    jest
      .spyOn(mockUserRepository, 'findOne')
      .mockResolvedValueOnce(createUserStub());

    //act
    const result = await service.createUser(createUserDto);

    //assert
    expect(mockUserRepository.findOne).toHaveBeenCalled();
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: {
        email: createUserDto.email,
      },
    });

    expect(result).toBeNull;
  });

  it('create => Should create a new user and return its data', async () => {
    // arrange
    jest.spyOn(mockUserRepository, 'create').mockReturnValue(createUserStub());

    const newUser = formatUserResponse(createUserStub());

    // act
    const result = await service.createUser(createUserDto);

    // assert
    expect(mockUserRepository.create).toHaveBeenCalled();
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      ...createUserDto,
      password: expect.anything(),
    });

    expect(mockUserRepository.insert).toHaveBeenCalled();
    expect(mockUserRepository.insert).toHaveBeenCalledWith({
      ...createUserStub(),
      createdAt: expect.anything(),
    });

    expect(result).toEqual(newUser);
  });

  it('getAllUsers => Should return all paginated users', async () => {
    //arrange
    const current = 3;
    const total = 10;

    jest
      .spyOn(mockUserRepository, 'findAndCount')
      .mockResolvedValueOnce([
        allUserStub().slice((current - 1) * total, current * total),
        allUserStub().length,
      ]);

    const skip = (current - 1) * total;
    const totalPages = Math.ceil(allUserStub().length / total);

    //act
    const result = await service.getAllUsers(current, total);

    //assert
    expect(mockUserRepository.findAndCount).toHaveBeenCalled();
    expect(mockUserRepository.findAndCount).toHaveBeenCalledWith({
      take: total,
      skip,
    });

    expect(result).toEqual({
      users: allUserStub().slice((current - 1) * total, current * total),
      totalPages,
    });
  });

  // it('findOne', () => {});
  // it('update', () => {});
  // it('remove', () => {});
});
