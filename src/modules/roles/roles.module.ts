import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Role from '../roles/entities/role.entity';
import { ROLES } from '../../utils/types/definitions';
import Permission from '../permissions/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {
  constructor(private readonly rolesService: RolesService) {}

  async onModuleInit() {
    Object.values(ROLES).forEach((role) => {
      this.rolesService.createRole({ name: role, description: role });
    });
  }
}
