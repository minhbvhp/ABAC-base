import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Permission from '../../permissions/entities/permission.entity';

@Entity()
class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Permission, (permission) => permission.subject)
  permissions: Permission[];
}

export default Subject;
