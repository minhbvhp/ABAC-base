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

@Entity()
class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: PermissionAction;

  @ManyToOne(() => Subject, (subject) => subject.permissions)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}

export default Permission;
