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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomResponseType } from 'src/modules/utils/types/definitions';
import { PaginationDto } from '../pagination/pagination.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CustomResponseType> {
    const result = await this.usersService.create(createUserDto);

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
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<CustomResponseType> {
    const { page, pageSize } = paginationDto;
    const result = await this.usersService.findAll(page, pageSize);

    const res: CustomResponseType = {
      message: 'Tìm tất cả người dùng',
      result,
    };

    return res;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
