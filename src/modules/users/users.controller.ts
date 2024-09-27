import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ConflictException,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomResponseType } from 'src/utils/types/definitions';
import { PaginationDto } from '../pagination/pagination.dto';
import { USER_NOT_FOUND } from '../../utils/constants/messageConstants';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CustomResponseType> {
    const result = await this.usersService.createUser(createUserDto);

    if (!result) {
      throw new ConflictException('Email này đã tồn tại', {
        cause: new Error('Create user service return null'),
        description: 'Conflict',
      });
    }

    const res: CustomResponseType = {
      message: 'Đã tạo người dùng mới',
      result,
    };

    return res;
  }

  @Get()
  async getAllUsers(
    @Query() paginationDto: PaginationDto,
  ): Promise<CustomResponseType> {
    const { current, total } = paginationDto;
    const result = await this.usersService.getAllUsers(current, total);

    const res: CustomResponseType = {
      message: 'Tìm tất cả người dùng',
      result,
    };

    return res;
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const result = await this.usersService.updateUser(id, updateUserDto);

    if (!result) {
      throw new NotFoundException(USER_NOT_FOUND, {
        cause: new Error('Update user service return null'),
        description: 'Not found',
      });
    }

    const res: CustomResponseType = {
      message: 'Đã cập nhật thông tin người dùng',
      result,
    };

    return res;
  }

  @Delete(':id')
  async deleteUserPermanently(@Param('id') id: string) {
    const result = await this.usersService.deleteUserPermanently(id);

    if (!result) {
      throw new NotFoundException(USER_NOT_FOUND, {
        cause: new Error('Delete user permanently service return null'),
        description: 'Not found',
      });
    }

    const res: CustomResponseType = {
      message: 'Đã xóa người dùng',
      result,
    };

    return res;
  }
}
