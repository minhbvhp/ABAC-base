import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Role from '../roles/entities/role.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import {
  HAS_ONE_PERMISSION_NOT_FOUND,
  ROLE_ALREADY_EXISTED,
  ROLE_NOT_FOUND,
} from '../../utils/constants/messageConstants';
import Permission from '../permissions/entities/permission.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UNIQUE_VIOLATION_CODE } from '../../utils/types/definitions';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,

    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async createRole(createRoleDto: CreateRoleDto) {
    try {
      const existedRole = await this.rolesRepository.findOne({
        where: {
          name: createRoleDto.name,
        },
      });

      if (!existedRole) {
        const newRole = await this.rolesRepository.create(createRoleDto);

        await this.rolesRepository.insert(newRole);

        return newRole;
      }
    } catch (error) {
      throw error;
    }

    return null;
  }

  async getAllRoles(): Promise<Role[]> {
    try {
      const roles = await this.rolesRepository.find();

      return roles;
    } catch (error) {
      throw error;
    }
  }

  async getRoleById(id: number) {
    try {
      const existedRole = await this.rolesRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!existedRole) {
        return null;
      }

      return existedRole;
    } catch (error) {
      throw error;
    }
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    try {
      const existedRole = await this.rolesRepository.findOne({
        where: {
          id: id,
        },
      });

      if (existedRole) {
        const updatedRole = await this.rolesRepository.create({
          ...updateRoleDto,
        });

        await this.rolesRepository.update(existedRole.id, updatedRole);

        return updatedRole;
      }
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError?.code === UNIQUE_VIOLATION_CODE) {
          throw new ConflictException(ROLE_ALREADY_EXISTED);
        }
      }

      throw error;
    }

    return null;
  }

  async deleteRolePermanently(id: number) {
    try {
      const existedRole = await this.rolesRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!existedRole) {
        return null;
      }

      await this.rolesRepository.remove(existedRole);

      return existedRole;
    } catch (error) {
      throw error;
    }
  }

  async grantPermissions(roleId: number, permissionIds: number[]) {
    try {
      const existedRole = await this.rolesRepository.findOne({
        where: {
          id: roleId,
        },
      });

      if (!existedRole) {
        throw new NotFoundException(ROLE_NOT_FOUND);
      }

      const checkAllAsyncPermissions = await Promise.all(
        permissionIds.map(async (permissionId) => {
          return await this.isPermissionAvailable(permissionId);
        }),
      );

      const areAllPermissionAvailable = checkAllAsyncPermissions.every(Boolean);

      if (!areAllPermissionAvailable) {
        throw new NotFoundException(HAS_ONE_PERMISSION_NOT_FOUND);
      }

      const permissions: Permission[] = await Promise.all(
        permissionIds.map(async (permissionId) => {
          const permission = await this.permissionsRepository.findOne({
            where: {
              id: permissionId,
            },
            relations: { subject: true, roles: true },
          });

          return await this.permissionsRepository.create(permission);
        }),
      );

      existedRole.permissions = permissions;

      await this.rolesRepository.save(existedRole);

      return { role_id: roleId, permission_ids: permissionIds };
    } catch (error) {
      throw error;
    }
  }

  private async isPermissionAvailable(permissionId: number) {
    const permission = await this.permissionsRepository.findOne({
      where: {
        id: permissionId,
      },
    });

    if (permission) return true;

    return false;
  }
}
