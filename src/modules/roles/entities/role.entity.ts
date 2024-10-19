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

export enum ROLE {
  ADMIN = 'Admin',
  SALES = 'Sales',
  ACCOUNTANT = 'Accountant',
}

@Entity()
class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ unique: true, enum: ROLE, default: ROLE.SALES })
  name: string;

  @Column()
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable()
  permissions: Permission[];
}

export default Role;
