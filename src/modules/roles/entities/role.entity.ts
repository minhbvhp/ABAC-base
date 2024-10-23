import { Expose } from 'class-transformer';
import User from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Permission from '../../permissions/entities/permission.entity';
import { ROLES } from '../../../utils/types/definitions';

@Entity()
class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ unique: true, enum: ROLES, default: ROLES.SALES })
  name: ROLES;

  @Column()
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable()
  permissions: Permission[];
}

export default Role;
