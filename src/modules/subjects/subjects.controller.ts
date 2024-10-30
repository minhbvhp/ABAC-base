import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ConflictException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { CustomResponseType, ROLES } from '../../utils/types/definitions';
import {
  SUBJECT_ALREADY_EXISTED,
  SUBJECT_NOT_FOUND,
} from '../../utils/constants/messageConstants';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { ApiTags } from '@nestjs/swagger';

@Roles(ROLES.ADMIN)
@UseGuards(RolesGuard)
@UseGuards(JwtAccessTokenGuard)
@ApiTags('subjects')
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  async createSubject(
    @Body() createSubjectDto: CreateSubjectDto,
  ): Promise<CustomResponseType> {
    const result = await this.subjectsService.createSubject(createSubjectDto);

    if (!result) {
      throw new ConflictException(SUBJECT_ALREADY_EXISTED, {
        cause: new Error('Create subject service return null'),
        description: 'Conflict',
      });
    }

    const res: CustomResponseType = {
      message: 'Đã tạo đối tượng mới',
      result,
    };

    return res;
  }

  @Get()
  async getAllSubjects(): Promise<CustomResponseType> {
    const result = await this.subjectsService.getAllSubjects();

    const res: CustomResponseType = {
      message: 'Tìm tất cả đối tượng',
      result,
    };

    return res;
  }

  @Patch(':id')
  async updateSubject(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ): Promise<CustomResponseType> {
    const result = await this.subjectsService.updateSubject(
      Number(id),
      updateSubjectDto,
    );

    if (!result) {
      throw new NotFoundException(SUBJECT_NOT_FOUND, {
        cause: new Error('Update subject service return null'),
        description: 'Not found',
      });
    }

    const res: CustomResponseType = {
      message: 'Đã cập nhật thông tin đối tượng',
      result,
    };

    return res;
  }

  @Delete(':id')
  async deleteSubjectPermanently(
    @Param('id') id: string,
  ): Promise<CustomResponseType> {
    const result = await this.subjectsService.deleteSubjectPermanently(
      Number(id),
    );

    if (!result) {
      throw new NotFoundException(SUBJECT_NOT_FOUND, {
        cause: new Error('Delete subject permanently service return null'),
        description: 'Not found',
      });
    }

    const res: CustomResponseType = {
      message: 'Đã xóa đối tượng',
      result,
    };

    return res;
  }
}
