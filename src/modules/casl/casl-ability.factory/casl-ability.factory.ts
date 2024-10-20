import {
  Ability,
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  MongoQuery,
} from '@casl/ability';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import User from '../../users/entities/user.entity';
import Permission from '../../permissions/entities/permission.entity';
import { PermissionCondition } from '../../permissions/interfaces/permissionCondition.interface';
import { UsersService } from '../../users/users.service';
import Customer from '../../customers/entities/customer.entity';
import { permission } from 'node:process';

export enum PermissionAction {
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export type SubjectsType =
  | InferSubjects<typeof Customer | typeof User>
  | 'all'
  | 'Customer'
  | any;
export type PossibleAbilities = [PermissionAction, SubjectsType];
export type Conditions = MongoQuery;

interface CaslPermission {
  action: PermissionAction;
  subject: SubjectsType;
  conditions: Conditions;
}

export type AppAbility = MongoAbility<PossibleAbilities, Conditions>;

@Injectable()
export class CaslAbilityFactory {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder(
      createMongoAbility<PossibleAbilities, Conditions>,
    );

    const dbPermissions = await this.usersService.getPermissionsById(user.id);

    // const caslPermissions = dbPermissions.map((permission) => ({
    //   action: permission.action,
    //   subject: permission.subject.name,
    //   conditions: Permission.parseCondition(permission.condition, user),
    // }));

    // const ability = createMongoAbility(caslPermissions);

    dbPermissions.forEach((permission) => {
      can(
        permission.action,
        permission.subject.name,
        Permission.parseCondition(permission.condition, User),
      );
    });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<SubjectsType>,
    });
  }
}
