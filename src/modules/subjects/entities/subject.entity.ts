import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Permission from '../../permissions/entities/permission.entity';
import { SUBJECTS } from '../../../utils/types/definitions';

@Entity()
class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, enum: SUBJECTS, type: 'enum' })
  name: SUBJECTS;

  @OneToMany(() => Permission, (permission) => permission.subject)
  permissions: Permission[];
}

export default Subject;
