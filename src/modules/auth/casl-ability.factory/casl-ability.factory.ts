import { Ability } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import User from '../../users/entities/user.entity';
import Permission from '../../permissions/entities/permission.entity';

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}
export type PermissionSubjectType = any;
export type AppAbility = Ability<[PermissionAction, PermissionSubjectType]>;

interface CaslPermission {
  action: PermissionAction;
  subject: string;
}

@Injectable()
export class CaslAbilityFactory {
  //   constructor(private authService: AuthService) {}
  async createForUser(user: User): Promise<AppAbility> {
    const dbPermissions: Permission[] = [];
    //   await this.authService.getAllPermissionsOfUser(user);
    const caslPermissions: CaslPermission[] = dbPermissions.map(
      (permission) => ({
        action: permission.action,
        subject: permission.subject.name,
      }),
    );
    return new Ability<[PermissionAction, PermissionSubjectType]>(
      caslPermissions,
    );
  }
}
