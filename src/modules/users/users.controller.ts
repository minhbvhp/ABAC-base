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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomResponseType } from 'src/utils/types/definitions';
import { PaginationDto } from '../pagination/pagination.dto';
import { USER_NOT_FOUND } from '../../utils/constants/messageConstants';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ROLE } from 'src/modules/roles/entities/role.entity';
import { Public } from 'src/decorators/auth.decorator';

@Roles(ROLE.ADMIN)
@UseGuards(RolesGuard)
@UseGuards(JwtAccessTokenGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
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

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<CustomResponseType> {
    const result = await this.usersService.getUserById(id, false);

    if (!result) {
      throw new NotFoundException(USER_NOT_FOUND, {
        cause: new Error('Get user service by id return null'),
        description: 'Not found',
      });
    }

    const res: CustomResponseType = {
      message: 'Đã tìm thấy người dùng',
      result,
    };

    return res;
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<CustomResponseType> {
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
  async deleteUserPermanently(
    @Param('id') id: string,
  ): Promise<CustomResponseType> {
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
