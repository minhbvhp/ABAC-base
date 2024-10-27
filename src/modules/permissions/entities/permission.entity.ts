import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import Role from '../../roles/entities/role.entity';
import Subject from '../../subjects/entities/subject.entity';
import { ACTIONS } from '../../../utils/types/definitions';

@Unique('action_subject_UNIQUE', ['action', 'subject.id'])
@Entity()
class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Column({ enum: ACTIONS, type: 'enum' })
  action: ACTIONS;

  @ManyToOne(() => Subject, (subject) => subject.permissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @Column({ type: 'json', nullable: true })
  condition?: Record<string, any>;

  @Column({ type: 'boolean', default: false })
  inverted: boolean;

  @ManyToMany(() => Role, (role) => role.permissions, {
    onDelete: 'CASCADE',
  })
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
