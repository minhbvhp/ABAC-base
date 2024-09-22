import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { allUserStub, createUserStub } from '../users/test/stubs/user.stub';

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

  it('create => Should create a new user and return custom response', async () => {
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
    const response = await controller.create(createUserDto);

    //expect
    expect(response).toEqual({
      message: 'Đã tạo người dùng mới',
      result: { ...createUserStub(), createdAt: expect.anything() },
    });
  });

  it('findAll => Should return custom response include paginated users', async () => {
    //arrange

    //act
    const response = await controller.findAll({ page: 3, pageSize: 10 });

    //expect
    expect(response).toEqual({
      message: 'Tìm tất cả người dùng',
      result: allUserStub().slice(20, 30),
    });
  });
});
