import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CustomResponseType } from '../../utils/types/definitions';
// import { CreateRoleDto } from './dto/create-role.dto';
// import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // @Post()
  // create(@Body() createRoleDto: CreateRoleDto) {
  //   return this.rolesService.create(createRoleDto);
  // }

  // @Get()
  // findAll() {
  //   return this.rolesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.rolesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
  //   return this.rolesService.update(+id, updateRoleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.rolesService.remove(+id);
  // }

  @Post('grant')
  async create(
    @Body() rolePermissions: { roleId: string; permissionIds: string[] },
  ): Promise<CustomResponseType> {
    const _roleId = Number(rolePermissions.roleId);
    const _permissionIds = rolePermissions.permissionIds.map((id) =>
      Number(id),
    );
    const result = await this.rolesService.grantPermission(
      _roleId,
      _permissionIds,
    );

    const res: CustomResponseType = {
      message: 'Đã thiết lập quyền hạn',
      result,
    };

    return res;
  }
}
