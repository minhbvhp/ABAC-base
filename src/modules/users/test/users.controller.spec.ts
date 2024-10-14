import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { allUserStub, createUserStub } from './stubs/user.stub';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConflictException } from '@nestjs/common';

jest.mock('../users.service');

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

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('create user => Should throw ConflictException if user service return null', async () => {
    //arrange
    jest.spyOn(usersService, 'createUser').mockResolvedValueOnce(null);

    //act && assert
    await expect(usersController.createUser(createUserDto)).rejects.toThrow(
      ConflictException,
    );
  });

  it('create user => Should create a new user and return response', async () => {
    //arrange

    //act
    const response = await usersController.createUser(createUserDto);

    //expect
    expect(response).toEqual({
      message: 'Đã tạo người dùng mới',
      result: { userId: createUserStub().id },
    });
  });

  it('findAll => Should return response include paginated users', async () => {
    //arrange

    //act
    const response = await usersController.getAllUsers({
      current: 3,
      total: 10,
    });

    //expect
    expect(response).toEqual({
      message: 'Tìm tất cả người dùng',
      result: allUserStub().slice(20, 30),
    });
  });
});
