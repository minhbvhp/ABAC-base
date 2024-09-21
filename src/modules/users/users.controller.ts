import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomResponseType } from 'src/modules/utils/types/definitions';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.create(createUserDto);

    if (!result) {
      throw new NotFoundException('Người dùng này đã tồn tại', {
        cause: new Error('Create user service return null'),
        description: 'Create user failed',
      });
    }

    const res: CustomResponseType = {
      message: 'Đã tạo người dùng mới',
      result,
    };

    return res;
  }

  @Get()
  async findAll() {
    const result = this.usersService.findAll();

    if (!result) {
      throw new NotFoundException('Không tìm được người dùng', {
        cause: new Error('Find all user service return null'),
        description: 'Find all users failed',
      });
    }

    return {
      message: 'Tìm người dùng',
      result,
    };
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
