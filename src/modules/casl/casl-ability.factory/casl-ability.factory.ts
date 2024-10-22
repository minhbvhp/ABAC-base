import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  MongoAbility,
  MongoQuery,
} from '@casl/ability';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import User from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import Permission from '../../permissions/entities/permission.entity';

export enum Actions {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects = 'Customer' | 'User' | any;

type PossibleAbilities = [Actions, Subjects];
type Conditions = MongoQuery;

export type AppAbility = MongoAbility<PossibleAbilities, Conditions>;

@Injectable()
export class CaslAbilityFactory {
  constructor(private readonly usersService: UsersService) {}

  async createForUser(user: User): Promise<AppAbility> {
    const { can, cannot, build } = new AbilityBuilder(
      createMongoAbility<PossibleAbilities, Conditions>,
    );

    const permissions = await this.usersService.getPermissionsById(user.id);

    permissions.forEach((permission) => {
      const { action, subject, condition } = permission;

      if (condition) {
        const dynamicCondition = Permission.parseCondition(condition, user);
        can(action as Actions, subject.name, dynamicCondition);
      } else {
        can(action as Actions, subject.name);
      }
    });

    return build({
      detectSubjectType: (item) =>
        item.constructor.name as ExtractSubjectType<Subjects>,
    });
  }
}
