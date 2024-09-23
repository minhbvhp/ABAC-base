import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import User from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { formatUserResponse } from '../utils/helpers/formatUserResponseHelpers';

@Injectable()
export class UsersService {
  private saltRounds: number;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private readonly config: ConfigService,
  ) {
    this.saltRounds = config.get('SALT_ROUNDS', 10);
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const existedUser = await this.usersRepository.findOne({
        where: {
          email: createUserDto.email,
        },
      });

      if (!existedUser) {
        const hashedPassword = await bcrypt.hash(
          createUserDto.password,
          +this.saltRounds,
        );

        const newUser = await this.usersRepository.create({
          ...createUserDto,
          password: hashedPassword,
        });

        await this.usersRepository.insert(newUser);

        const result = formatUserResponse(newUser);

        return result;
      }
    } catch (error) {
      throw new ServiceUnavailableException(
        'Lỗi dịch vụ',
        'User service error - create',
      );
    }

    return null;
  }

  async getAllUsers(current: number = 1, total: number = 10) {
    try {
      const skip = (current - 1) * total;

      const [users, totalItems] = await this.usersRepository.findAndCount({
        take: total,
        skip,
      });

      const totalPages = Math.ceil(totalItems / total);

      return { users, totalPages };
    } catch (error) {
      throw new ServiceUnavailableException(
        'Lỗi dịch vụ',
        'User service error - find all',
      );
    }
  }

  async getUserbyEmail(email: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          email: email,
        },
        // relations {
        //   role: true,
        // }
      });

      return user;
    } catch (error) {
      throw new ServiceUnavailableException(
        'Lỗi dịch vụ',
        'User service error - get user by email',
      );
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const existedUser = await this.usersRepository.findOne({
        where: {
          id: id,
        },
      });

      if (existedUser) {
        const updatedUser = await this.usersRepository.create({
          ...updateUserDto,
        });

        await this.usersRepository.update(existedUser.id, updatedUser);

        const result = formatUserResponse(updatedUser);

        return result;
      }
    } catch (error) {
      throw new ServiceUnavailableException(
        'Lỗi dịch vụ',
        'User service error - update user',
      );
    }

    return null;
  }

  async deleteUserPermanently(id: string) {
    try {
      const existedUser = await this.usersRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!existedUser) {
        return null;
      }

      const result = formatUserResponse(existedUser);

      await this.usersRepository.remove(existedUser);

      return result;
    } catch (error) {
      throw new ServiceUnavailableException(
        'Lỗi dịch vụ',
        'User service error - delete user permanently',
      );
    }
  }
}
