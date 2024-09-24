import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {
  afterUpdateUserStub,
  allUserStub,
  createUserStub,
} from '../users/test/stubs/user.stub';
import { ConfigModule } from '@nestjs/config';
import { formatUserResponse } from '../utils/helpers/formatUserResponseHelpers';
import { UpdateUserDto } from '../users/dto/update-user.dto';

const mockUserRepository = {
  findOne: jest.fn().mockResolvedValue(createUserStub()),
  create: jest.fn(),
  insert: jest.fn(),
  find: jest.fn(),
  update: jest.fn().mockResolvedValue(afterUpdateUserStub()),
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

const notAvailableId = '123abc';

const notExistId = '76131254-32ff-413b-9f94-59e6e590961f';

const updateUserDto = {
  name: 'TestUpdate',
  genderId: 2,
  phoneNumber: '55555',
  address: 'Update address',
  roleId: 2,
  companyId: 1,
} as UpdateUserDto;

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

    //act
    const result = await service.createUser(createUserDto);

    //assert
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: {
        email: createUserDto.email,
      },
    });

    expect(result).toBeNull;
  });

  it('create => Should create a new user and return its data', async () => {
    // arrange
    jest
      .spyOn(mockUserRepository, 'create')
      .mockReturnValueOnce(createUserStub());
    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(null);

    const newUser = formatUserResponse(createUserStub());

    // act
    const result = await service.createUser(createUserDto);

    // assert
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      ...createUserDto,
      password: expect.anything(),
    });

    expect(mockUserRepository.insert).toHaveBeenCalledWith({
      ...createUserStub(),
      createdAt: expect.anything(),
    });

    expect(result).toEqual({ ...newUser, createdAt: expect.anything() });
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
    expect(mockUserRepository.findAndCount).toHaveBeenCalledWith({
      take: total,
      skip,
    });

    expect(result).toEqual({
      users: allUserStub().slice((current - 1) * total, current * total),
      totalPages,
    });
  });

  it('updateUser => Should return null if id is not UUID', async () => {
    //arrange

    //act
    const result = await service.updateUser(notAvailableId, updateUserDto);

    //assert
    expect(result).toBeNull;
  });

  it('updateUser => Should return null if user does not exist', async () => {
    //arrange
    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(null);

    //act
    const result = await service.updateUser(notExistId, updateUserDto);

    //assert
    expect(result).toBeNull;
  });

  it('updateUser => Should update user and return formatted user response', async () => {
    //arrange
    jest
      .spyOn(mockUserRepository, 'create')
      .mockResolvedValue(afterUpdateUserStub());

    const existId = createUserStub().id;
    const updatedUser = formatUserResponse(afterUpdateUserStub());

    //act
    const result = await service.updateUser(existId, updateUserDto);

    //assert

    expect(mockUserRepository.update).toHaveBeenCalledWith(existId, {
      ...afterUpdateUserStub(),
      createdAt: expect.anything(),
    });
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      ...updateUserDto,
    });

    expect(result).toEqual(updatedUser);
  });

  it('deleteUserPermanently => Should return null if id is not UUID', async () => {
    //arrange

    //act
    const result = await service.deleteUserPermanently(notAvailableId);

    //assert
    expect(result).toBeNull;
  });

  it('deleteUserPermanently => Should return null if user does not exist', async () => {
    //arrange
    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(null);

    //act
    const result = await service.deleteUserPermanently(notExistId);

    //assert
    expect(result).toBeNull;
  });

  it('deleteUserPermanently => Shoud delete user and return formatted user response', async () => {
    //arrange
    const existId = createUserStub().id;
    const deletedUser = formatUserResponse(createUserStub());

    //act
    const result = await service.deleteUserPermanently(existId);

    //assert

    expect(mockUserRepository.remove).toHaveBeenCalledWith({
      ...createUserStub(),
      createdAt: expect.anything(),
    });

    expect(result).toEqual({ ...deletedUser, createdAt: expect.anything() });
  });
});
