import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { allUserStub, createUserStub } from '../users/test/stubs/user.stub';
import { ConfigModule } from '@nestjs/config';

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  insert: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
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
    jest.spyOn(mockUserRepository, 'create').mockReturnValue(createUserStub());
    const { password, session, ...newUser } = createUserStub();

    // act
    const result = await service.create(createUserDto);

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

  it('findAll => Should return all paginated users', async () => {
    //arrange
    jest
      .spyOn(mockUserRepository, 'find')
      .mockResolvedValueOnce(allUserStub().slice(20, 30));

    //act
    const result = await service.findAll(3, 10);

    //assert
    expect(mockUserRepository.find).toHaveBeenCalled();
    expect(mockUserRepository.find).toHaveBeenCalledWith({
      take: 10,
      skip: 20,
    });

    expect(result).toEqual(allUserStub().slice(20, 30));
  });

  // it('findOne', () => {});
  // it('update', () => {});
  // it('remove', () => {});
});
