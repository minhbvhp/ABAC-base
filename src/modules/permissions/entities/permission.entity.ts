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
import { Actions } from '../../casl/casl-ability.factory/casl-ability.factory';

@Entity()
class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: Actions;

  @ManyToOne(() => Subject, (subject) => subject.permissions)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @Column({ type: 'json', nullable: true })
  condition?: Record<string, any>;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  public static parseCondition(
    conditions: Record<string, any>,
    user: any,
  ): Record<string, any> {
    const conditionStr = JSON.stringify(conditions);
    // Replace placeholders with actual values from the user object
    const replaced = conditionStr.replace(/\$\{(\w+)\}/g, (_, key) => {
      return user[key];
    });
    return JSON.parse(replaced);
  }
}

export default Permission;
