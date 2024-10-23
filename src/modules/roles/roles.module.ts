import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Role from '../roles/entities/role.entity';
import { ROLES } from '../../utils/types/definitions';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {
  constructor(private readonly rolesService: RolesService) {}

  async onModuleInit() {
    const adminRole = {
      name: ROLES.ADMIN,
      description: ROLES.ADMIN,
    };

    const salesRole = {
      name: ROLES.SALES,
      description: ROLES.SALES,
    };

    const accountantRole = {
      name: ROLES.ACCOUNTANT,
      description: ROLES.ACCOUNTANT,
    };

    this.rolesService.createRole(adminRole);

    this.rolesService.createRole(salesRole);

    this.rolesService.createRole(accountantRole);
  }
}
