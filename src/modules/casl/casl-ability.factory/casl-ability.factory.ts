import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  MongoAbility,
  MongoQuery,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import User from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import Permission from '../../permissions/entities/permission.entity';
import { ACTIONS, SUBJECTS } from '../../../utils/types/definitions';

type PossibleAbilities = [ACTIONS, SUBJECTS | any];
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
      const { action, subject, condition, inverted } = permission;

      if (subject) {
        if (condition) {
          const dynamicCondition = Permission.parseCondition(condition, user);

          inverted === true
            ? cannot(action as ACTIONS, subject.name, dynamicCondition)
            : can(action as ACTIONS, subject.name, dynamicCondition);
        } else {
          inverted === true
            ? cannot(action as ACTIONS, subject.name)
            : can(action as ACTIONS, subject.name);
        }
      }
    });

    return build({
      detectSubjectType: (item) =>
        item.constructor.name as ExtractSubjectType<SUBJECTS>,
    });
  }
}
