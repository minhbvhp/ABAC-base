import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { allUserStub, createUserStub } from '../users/test/stubs/user.stub';
import { CreateUserDto } from './dto/create-user.dto';

jest.mock('./users.service');
describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create => Should create a new user and return response', async () => {
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

    //act
    const response = await controller.createUser(createUserDto);

    //expect
    expect(response).toEqual({
      message: 'Đã tạo người dùng mới',
      result: { userId: createUserStub().id },
    });
  });

  it('findAll => Should return response include paginated users', async () => {
    //arrange

    //act
    const response = await controller.getAllUsers({ current: 3, total: 10 });

    //expect
    expect(response).toEqual({
      message: 'Tìm tất cả người dùng',
      result: allUserStub().slice(20, 30),
    });
  });
});
