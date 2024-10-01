import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import User from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { isUUID } from 'class-validator';
import {
  SERVICE_ERROR_DESCRIPTION,
  SERVICE_ERROR_MESSAGE,
} from '../../utils/constants/messageConstants';

@Injectable()
export class UsersService {
  private saltRounds: number;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    this.saltRounds = this.configService.get('SALT_ROUNDS', 10);
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

        return { userId: newUser.id };
      }
    } catch (error) {
      throw new ServiceUnavailableException(
        SERVICE_ERROR_MESSAGE,
        `${SERVICE_ERROR_DESCRIPTION} - create user`,
      );
    }

    return null;
  }

  async getAllUsers(
    current: number = 1,
    total: number = 10,
  ): Promise<{ users: User[]; totalPages: number }> {
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
        SERVICE_ERROR_MESSAGE,
        `${SERVICE_ERROR_DESCRIPTION} - find all user`,
      );
    }
  }

  async getUserById(userId: string): Promise<User> {
    try {
      if (!isUUID(userId)) {
        return null;
      }

      const existedUser = await this.usersRepository.findOne({
        where: {
          id: userId,
        },
      });

      if (!existedUser) {
        return null;
      }

      return existedUser;
    } catch (error) {
      throw new ServiceUnavailableException(
        SERVICE_ERROR_MESSAGE,
        `${SERVICE_ERROR_DESCRIPTION} - get user by id`,
      );
    }
  }

  async getUserbyEmail(email: string): Promise<User> {
    try {
      const existedUser = await this.usersRepository.findOne({
        where: {
          email: email,
        },
        // relations {
        //   role: true,
        // }
      });

      return existedUser;
    } catch (error) {
      throw new ServiceUnavailableException(
        SERVICE_ERROR_MESSAGE,
        `${SERVICE_ERROR_DESCRIPTION} - get user by email`,
      );
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      if (!isUUID(id)) {
        return null;
      }

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

        return updatedUser;
      }
    } catch (error) {
      throw new ServiceUnavailableException(
        SERVICE_ERROR_MESSAGE,
        `${SERVICE_ERROR_DESCRIPTION} - update user`,
      );
    }

    return null;
  }

  async deleteUserPermanently(id: string) {
    try {
      if (!isUUID(id)) {
        return null;
      }

      const existedUser = await this.usersRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!existedUser) {
        return null;
      }

      await this.usersRepository.remove(existedUser);

      return existedUser;
    } catch (error) {
      throw new ServiceUnavailableException(
        SERVICE_ERROR_MESSAGE,
        `${SERVICE_ERROR_DESCRIPTION} - delete user permanently`,
      );
    }
  }
}
