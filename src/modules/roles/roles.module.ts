import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import Role, { ROLE } from 'src/modules/roles/entities/role.entity';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    const adminRole = {
      name: ROLE.ADMIN,
      description: ROLE.ADMIN,
    };

    const salesRole = {
      name: ROLE.SALES,
      description: ROLE.SALES,
    };

    const existedAdminRole = await this.roleRepository.findOneBy({
      name: adminRole.name,
    });
    if (!existedAdminRole) {
      await this.roleRepository.insert(adminRole);
    }

    const existedSalesRole = await this.roleRepository.findOneBy({
      name: salesRole.name,
    });
    if (!existedSalesRole) {
      await this.roleRepository.insert(salesRole);
    }
  }
}
