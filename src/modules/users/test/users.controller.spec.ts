import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import {
  afterUpdateUserStub,
  allUserStub,
  createUserStub,
} from './stubs/user.stub';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { mockRequestWithUser } from './mocks/requests.mock';

jest.mock('../users.service');

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

  describe('createUser', () => {});

  describe('getAllUsers', () => {});

  describe('getUserById', () => {});

  describe('updateUser', () => {});

  describe('deleteUserPermanently', () => {});
});
