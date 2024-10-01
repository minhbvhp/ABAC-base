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
import { UpdateUserDto } from '../users/dto/update-user.dto';

const mockUserRepository = {
  findOne: jest.fn(),
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
  let userService: UsersService;

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

    userService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('create => should return null if user with email already exists', async () => {
    //arrange
    jest
      .spyOn(mockUserRepository, 'findOne')
      .mockResolvedValueOnce(createUserStub());

    //act
    const result = await userService.createUser(createUserDto);

    //assert
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: {
        email: createUserDto.email,
      },
    });

    expect(result).toEqual(null);
  });

  it('create => Should create a new user and return its data', async () => {
    // arrange
    jest
      .spyOn(mockUserRepository, 'create')
      .mockReturnValueOnce(createUserStub());
    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(null);

    const newUser = createUserStub();

    // act
    const result = await userService.createUser(createUserDto);

    // assert
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      ...createUserDto,
      password: expect.anything(),
    });

    expect(mockUserRepository.insert).toHaveBeenCalledWith(createUserStub());

    expect(result).toEqual({ userId: newUser.id });
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
    const result = await userService.getAllUsers(current, total);

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

  it('getUserbyEmail => Should return null if user not existed', async () => {
    //arrange
    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(null);
    const mockEmail = 'Test@gmail.com';

    //act
    const result = await userService.getUserbyEmail(mockEmail);

    //assert
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { email: mockEmail },
    });

    expect(result).toEqual(null);
  });

  it('getUserbyEmail => Should return existed email', async () => {
    //arrange
    const mockEmail = createUserStub().email;
    jest
      .spyOn(mockUserRepository, 'findOne')
      .mockResolvedValueOnce(createUserStub());

    //act
    const result = await userService.getUserbyEmail(mockEmail);

    //assert
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { email: mockEmail },
    });

    expect(result).toEqual(createUserStub());
  });

  it('updateUser => Should return null if id is not UUID', async () => {
    //arrange

    //act
    const result = await userService.updateUser(notAvailableId, updateUserDto);

    //assert
    expect(result).toEqual(null);
  });

  it('updateUser => Should return null if user does not exist', async () => {
    //arrange
    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(null);

    //act
    const result = await userService.updateUser(notExistId, updateUserDto);

    //assert
    expect(result).toEqual(null);
  });

  it('updateUser => Should update user and return formatted user response', async () => {
    //arrange
    jest
      .spyOn(mockUserRepository, 'findOne')
      .mockResolvedValueOnce(createUserStub());

    jest
      .spyOn(mockUserRepository, 'create')
      .mockResolvedValue(afterUpdateUserStub());

    const existId = createUserStub().id;
    const updatedUser = afterUpdateUserStub();

    //act
    const result = await userService.updateUser(existId, updateUserDto);

    //assert

    expect(mockUserRepository.update).toHaveBeenCalledWith(
      existId,
      afterUpdateUserStub(),
    );
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      ...updateUserDto,
    });

    expect(result).toEqual(updatedUser);
  });

  it('deleteUserPermanently => Should return null if id is not UUID', async () => {
    //arrange

    //act
    const result = await userService.deleteUserPermanently(notAvailableId);

    //assert
    expect(result).toEqual(null);
  });

  it('deleteUserPermanently => Should return null if user does not exist', async () => {
    //arrange
    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(null);

    //act
    const result = await userService.deleteUserPermanently(notExistId);

    //assert
    expect(result).toEqual(null);
  });

  it('deleteUserPermanently => Shoud delete user and return formatted user response', async () => {
    //arrange
    jest
      .spyOn(mockUserRepository, 'findOne')
      .mockResolvedValueOnce(createUserStub());

    const existId = createUserStub().id;

    const deletedUser = createUserStub();

    //act
    const result = await userService.deleteUserPermanently(existId);

    //assert

    expect(mockUserRepository.remove).toHaveBeenCalledWith(createUserStub());

    expect(result).toEqual(deletedUser);
  });
});
