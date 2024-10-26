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

@Entity()
class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinTable()
  permissions: Permission[];
}

export default Role;
