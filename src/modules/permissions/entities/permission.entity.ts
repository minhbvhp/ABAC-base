import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Role from '../../roles/entities/role.entity';
import Subject from '../../subjects/entities/subject.entity';
import { PermissionAction } from '../../auth/casl-ability.factory/casl-ability.factory';
import { PermissionCondition } from '../interfaces/permissionCondition.interface';

@Entity()
class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: PermissionAction;

  @ManyToOne(() => Subject, (subject) => subject.permissions)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @Column({ type: 'json' })
  condition: PermissionCondition;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  /**
   * @param condition: {"userId": "${id}"}
   * @param variables: {"id: 1"}
   * @return condition after parse: {"userId": 1}
   */
  public static parseCondition(
    condition: PermissionCondition,
    variables: Record<string, any>,
  ): PermissionCondition {
    if (!condition) return null;
    const parsedCondition = {};
    for (const [key, rawValue] of Object.entries(condition)) {
      if (rawValue !== null && typeof rawValue === 'object') {
        const value = this.parseCondition(rawValue, variables);
        parsedCondition[key] = value;
        continue;
      }
      if (typeof rawValue !== 'string') {
        parsedCondition[key] = rawValue;
        continue;
      }
      // find placeholder "${}""
      const matches = /^\\${([a-zA-Z0-9]+)}$/.exec(rawValue);
      if (!matches) {
        parsedCondition[key] = rawValue;
        continue;
      }
      const value = variables[matches[1]];
      if (typeof value === 'undefined') {
        throw new ReferenceError(`Variable ${name} is not defined`);
      }
      parsedCondition[key] = value;
    }
    return parsedCondition;
  }
}

export default Permission;
