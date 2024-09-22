import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import User from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { PaginationDto } from 'src/modules/pagination/pagination.dto';

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

  async create(createUserDto: CreateUserDto) {
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

        const { password, session, ...result } = newUser;

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

  // async getUserbyEmail(id: number) {
  //   try {
  //     const skip = (+page - 1) * +pageSize;

  //     const users = await this.usersRepository.find({
  //       take: +pageSize,
  //       skip,
  //     });

  //     return users;
  //   } catch (error) {
  //     throw new ServiceUnavailableException(
  //       'Lỗi dịch vụ',
  //       'User service error - find all',
  //     );
  //   }
  // }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
