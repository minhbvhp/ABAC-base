import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Role from '../roles/entities/role.entity';
import { Repository } from 'typeorm';
// import { CreateRoleDto } from './dto/create-role.dto';
// import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}
  // create(createRoleDto: CreateRoleDto) {
  //   return 'This action adds a new role';
  // }
  // findAll() {
  //   return `This action returns all roles`;
  // }
  // findOne(id: number) {
  //   return `This action returns a #${id} role`;
  // }
  // update(id: number, updateRoleDto: UpdateRoleDto) {
  //   return `This action updates a #${id} role`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} role`;
  // }
}
