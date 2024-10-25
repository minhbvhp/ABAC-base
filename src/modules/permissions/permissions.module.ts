import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { SubjectsModule } from '../subjects/subjects.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import Permission from './entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), SubjectsModule],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
