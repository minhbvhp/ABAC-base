import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Permission from './entities/permission.entity';
import { Repository } from 'typeorm';
import { SUBJECT_NOT_FOUND } from '../../utils/constants/messageConstants';
import { SubjectsService } from '../subjects/subjects.service';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,

    private subjectsService: SubjectsService,
  ) {}

  async createPermission(createPermissionDto: CreatePermissionDto) {
    try {
      const existedSubject = await this.subjectsService.getSubjectById(
        createPermissionDto.subjectId,
      );

      if (!existedSubject) {
        throw new NotFoundException(SUBJECT_NOT_FOUND, {
          cause: new Error('Create permission service not found subject'),
          description: 'Not found',
        });
      }

      const existedPermission = await this.permissionsRepository.findOne({
        where: {
          action: createPermissionDto.action,
          subject: existedSubject,
        },
      });

      if (!existedPermission) {
        const newPermission = await this.permissionsRepository.create({
          ...createPermissionDto,
          subject: existedSubject,
        });

        await this.permissionsRepository.insert(newPermission);

        return newPermission;
      }
    } catch (error) {
      throw error;
    }

    return null;
  }

  async getAllPermissions(): Promise<Permission[]> {
    try {
      const permissions = await this.permissionsRepository.find({
        relations: { subject: true },
      });

      return permissions;
    } catch (error) {
      throw error;
    }
  }

  async getPermissionById(id: number): Promise<Permission> {
    const existedPermission = await this.permissionsRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!existedPermission) {
      return null;
    }

    return existedPermission;
  }

  async updatePermission(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    try {
      const existedSubject = await this.subjectsService.getSubjectById(
        updatePermissionDto.subjectId,
      );

      if (!existedSubject) {
        throw new NotFoundException(SUBJECT_NOT_FOUND, {
          cause: new Error('Update permission service not found subject'),
          description: 'Not found',
        });
      }

      const existedPermission = await this.permissionsRepository.findOne({
        where: {
          id: id,
        },
      });

      if (existedPermission) {
        const updatedPermission = await this.permissionsRepository.create({
          ...updatePermissionDto,
          subject: existedSubject,
        });

        await this.permissionsRepository.update(
          existedPermission.id,
          updatedPermission,
        );

        return updatedPermission;
      }
    } catch (error) {
      throw error;
    }

    return null;
  }

  async deletePermissionPermanently(id: number) {
    try {
      const existedPermission = await this.permissionsRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!existedPermission) {
        return null;
      }

      await this.permissionsRepository.remove(existedPermission);

      return existedPermission;
    } catch (error) {
      throw error;
    }
  }
}
