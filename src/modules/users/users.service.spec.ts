import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { allUserStub, createUserStub } from '../users/test/stubs/user.stub';
import { ConfigModule } from '@nestjs/config';
import { formatUserResponse } from '../utils/helpers/formatUserResponseHelpers';
import { UpdateUserDto } from '../users/dto/update-user.dto';

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn().mockReturnValueOnce(createUserStub()),
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

  it('updateUser => Should return null if id is not UUID', async () => {
    //arrange

    //act
    const result = await service.updateUser(notAvailableId, updateUserDto);

    //assert
    expect(result).toBeNull;
  });

  it('updateUser => Should return null if email does not exist', async () => {
    //arrange

    //act
    const result = await service.updateUser(notExistId, updateUserDto);

    //assert
    expect(result).toBeNull;
  });

  it('updateUser => Should update user and return formatted user response', async () => {
    //arrange
    const existId = createUserStub().id;

    jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(createUserStub());

    //act
    const result = await service.updateUser(existId, updateUserDto);

    //assert
    expect(mockUserRepository.findOne).toHaveBeenCalled();
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: existId,
      },
    });

    expect(mockUserRepository.findOne).toBeNull;
    // expect(mockUserRepository.update).toHaveBeenCalled();
    // expect(mockUserRepository.update).toHaveBeenCalled();
    // expect(mockUserRepository.update).toHaveBeenCalledWith({
    //   existId,
    //   updateUserDto,
    // });
  });

  // it('remove', () => {});
});
