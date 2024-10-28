import { ConflictException, Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Subject from './entities/subject.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { SUBJECTS, UNIQUE_VIOLATION_CODE } from '../../utils/types/definitions';
import { SUBJECT_ALREADY_EXISTED } from '../../utils/constants/messageConstants';

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

  async updateSubject(
    id: number,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    try {
      const existedSubject = await this.subjectsRepository.findOne({
        where: {
          id: id,
        },
      });

      if (existedSubject) {
        const updatedSubject = await this.subjectsRepository.create({
          ...updateSubjectDto,
        });

        await this.subjectsRepository.update(existedSubject.id, updatedSubject);

        return updatedSubject;
      }
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError?.code === UNIQUE_VIOLATION_CODE) {
          throw new ConflictException(SUBJECT_ALREADY_EXISTED);
        }
      }

      throw error;
    }

    return null;
  }

  async deleteSubjectPermanently(id: number) {
    try {
      const existedSubject = await this.subjectsRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!existedSubject) {
        return null;
      }

      await this.subjectsRepository.remove(existedSubject);

      return existedSubject;
    } catch (error) {
      throw error;
    }
  }
}
