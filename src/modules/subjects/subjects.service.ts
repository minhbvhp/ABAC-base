import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Subject from './entities/subject.entity';
import { Repository } from 'typeorm';
import { SUBJECTS } from '../../utils/types/definitions';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private subjectsRepository: Repository<Subject>,
  ) {}

  async createSubject(createSubjectDto: CreateSubjectDto) {
    try {
      const existedSubject = await this.subjectsRepository.findOne({
        where: {
          name: createSubjectDto.name,
        },
      });

      if (!existedSubject) {
        const newSubject = await this.subjectsRepository.create({
          ...createSubjectDto,
        });

        await this.subjectsRepository.insert(newSubject);

        return { subject_name: newSubject.name };
      }
    } catch (error) {
      throw error;
    }

    return null;
  }

  async getAllSubjects(): Promise<Subject[]> {
    try {
      const subjects = await this.subjectsRepository.find();

      return subjects;
    } catch (error) {
      throw error;
    }
  }

  async getSubjectById(id: number): Promise<Subject> {
    const existedSubject = await this.subjectsRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!existedSubject) {
      return null;
    }

    return existedSubject;
  }

  async getSubjectByName(subjectName: SUBJECTS): Promise<Subject> {
    const existedSubject = await this.subjectsRepository.findOne({
      where: {
        name: subjectName,
      },
    });

    if (!existedSubject) {
      return null;
    }

    return existedSubject;
  }
}
