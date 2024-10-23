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
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { CustomResponseType } from '../../utils/types/definitions';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  async getAllSubjects(): Promise<CustomResponseType> {
    const result = await this.subjectsService.getAllSubjects();

    const res: CustomResponseType = {
      message: 'Tìm tất cả đối tượng',
      result,
    };

    return res;
  }
}
