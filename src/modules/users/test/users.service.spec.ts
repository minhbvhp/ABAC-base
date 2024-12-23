import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  afterUpdateUserStub,
  allUserStub,
  createUserStub,
} from './stubs/user.stub';
import { UsersService } from '../users.service';
import { ConfigService } from '@nestjs/config';
import User from '../entities/user.entity';
import {
  accountantRoleStub,
  salesRoleStub,
} from '../../roles/test/stubs/role.stub';
import { RolesService } from '../../roles/roles.service';
import { createUserDto, updateUserDto } from './dto/mock-user.dto';

jest.mock('../../roles/roles.service');

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  insert: jest.fn(),
  find: jest.fn(),
  update: jest.fn().mockResolvedValue(afterUpdateUserStub()),
  remove: jest.fn(),
  findAndCount: jest.fn(),
};

const notAvailableId = '123abc';

const notExistId = '76131254-32ff-413b-9f94-59e6e590961f';

describe('UsersService', () => {
  let usersService: UsersService;
  let rolesService: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [ConfigModule],
      providers: [
        UsersService,
        ConfigService,
        RolesService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    rolesService = module.get<RolesService>(RolesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('createUser', () => {
    it('should return null if user with email already exists', async () => {
      //arrange
      jest
        .spyOn(mockUserRepository, 'findOne')
        .mockResolvedValueOnce(createUserStub());

      //act
      const result = await usersService.createUser(createUserDto);

      //assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: {
          email: createUserDto.email,
        },
      });

      expect(result).toEqual(null);
    });

    it('should create a new user and return its data', async () => {
      // arrange
      jest
        .spyOn(mockUserRepository, 'create')
        .mockReturnValueOnce(createUserStub());

      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(null);

      jest
        .spyOn(rolesService, 'getRoleById')
        .mockResolvedValueOnce(salesRoleStub());

      const newUser = createUserStub();

      // act
      const result = await usersService.createUser(createUserDto);

      // assert
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: expect.anything(),
        role: salesRoleStub(),
      });

      expect(mockUserRepository.insert).toHaveBeenCalledWith(createUserStub());

      expect(result).toEqual({ userId: newUser.id });
    });
  });

  describe('getAllUsers', () => {
    it('hould return all paginated users', async () => {
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
      const result = await usersService.getAllUsers(current, total);

      //assert
      expect(mockUserRepository.findAndCount).toHaveBeenCalledWith({
        take: total,
        skip,
        relations: expect.anything(),
      });

      expect(result).toEqual({
        users: allUserStub().slice((current - 1) * total, current * total),
        totalPages,
      });
    });
  });

  describe('getUserByEmail', () => {
    it('should return null if user not existed', async () => {
      //arrange
      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(null);
      const mockEmail = 'Test@gmail.com';

      //act
      const result = await usersService.getUserByEmail(mockEmail);

      //assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockEmail },
        select: { id: true, email: true, name: true, password: true },
        relations: expect.anything(),
      });

      expect(result).toEqual(null);
    });

    it('should return existed email', async () => {
      //arrange
      const mockEmail = createUserStub().email;
      jest
        .spyOn(mockUserRepository, 'findOne')
        .mockResolvedValueOnce(createUserStub());

      //act
      const result = await usersService.getUserByEmail(mockEmail);

      //assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockEmail },
        select: { id: true, email: true, name: true, password: true },
        relations: expect.anything(),
      });

      expect(result).toEqual(createUserStub());
    });
  });

  describe('updateUser', () => {
    it('should return null if id is not UUID', async () => {
      //arrange

      //act
      const result = await usersService.updateUser(
        notAvailableId,
        updateUserDto,
      );

      //assert
      expect(result).toEqual(null);
    });

    it('should return null if user does not exist', async () => {
      //arrange
      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(null);

      //act
      const result = await usersService.updateUser(notExistId, updateUserDto);

      //assert
      expect(result).toEqual(null);
    });

    it('should update user and return formatted user response', async () => {
      //arrange
      jest
        .spyOn(mockUserRepository, 'findOne')
        .mockResolvedValueOnce(createUserStub());

      jest
        .spyOn(rolesService, 'getRoleById')
        .mockResolvedValueOnce(accountantRoleStub());

      jest
        .spyOn(mockUserRepository, 'create')
        .mockReturnValueOnce(afterUpdateUserStub());

      const existId = createUserStub().id;
      const updatedUser = afterUpdateUserStub();

      //act
      const result = await usersService.updateUser(existId, updateUserDto);

      //assert

      expect(mockUserRepository.update).toHaveBeenCalledWith(
        existId,
        updatedUser,
      );

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...updateUserDto,
        role: updatedUser.role,
      });

      expect(result).toEqual(updatedUser);
    });
  });

  describe('deleteUserPermanently', () => {
    it('should return null if id is not UUID', async () => {
      //arrange

      //act
      const result = await usersService.deleteUserPermanently(notAvailableId);

      //assert
      expect(result).toEqual(null);
    });

    it('should return null if user does not exist', async () => {
      //arrange
      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(null);

      //act
      const result = await usersService.deleteUserPermanently(notExistId);

      //assert
      expect(result).toEqual(null);
    });

    it('Shoud delete user and return formatted user response', async () => {
      //arrange
      jest
        .spyOn(mockUserRepository, 'findOne')
        .mockResolvedValueOnce(createUserStub());

      const existId = createUserStub().id;

      const deletedUser = createUserStub();

      //act
      const result = await usersService.deleteUserPermanently(existId);

      //assert

      expect(mockUserRepository.remove).toHaveBeenCalledWith(createUserStub());

      expect(result).toEqual(deletedUser);
    });
  });
});
