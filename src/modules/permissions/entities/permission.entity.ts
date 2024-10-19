import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import Role from '../../roles/entities/role.entity';

@Entity()
class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'subject_id' })
  subjectId: number;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}

export default Permission;
