import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createUserStub } from '../users/test/stubs/user.stub';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('../users/users.service');

const loginDto = {
  email: 'NotAvailable@email.com',
  password: '123456',
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  // let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService, ConfigService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    // jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('get authenticated user => throw a BadRequestException if email not existed', async () => {
    //arrange
    jest.spyOn(usersService, 'getUserbyEmail').mockResolvedValueOnce(null);
    const { email, password } = loginDto;

    //act && assert
    await expect(
      authService.getAuthenticatedUser(email, password),
    ).rejects.toThrow(BadRequestException);
  });

  it('get authenticated user => throw a BadRequestException if email or password wrong', async () => {
    //arrange
    jest
      .spyOn(usersService, 'getUserbyEmail')
      .mockResolvedValueOnce(createUserStub());

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false);

    const { email, password } = loginDto;

    //act && assert
    await expect(
      authService.getAuthenticatedUser(email, password),
    ).rejects.toThrow(BadRequestException);
  });

  it('get authenticated user => should return user if email and password matched', async () => {
    //arrange
    jest
      .spyOn(usersService, 'getUserbyEmail')
      .mockResolvedValueOnce(createUserStub());

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => true);

    const { email, password } = createUserStub();

    //act
    const result = await authService.getAuthenticatedUser(email, password);

    //act && assert
    expect(result).toEqual(createUserStub());
  });
});
