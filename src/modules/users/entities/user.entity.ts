import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  name: string;

  @Column({ name: 'gender_id' })
  genderId: number;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column()
  address: string;

  @Column({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'company_id' })
  companyId: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Exclude()
  @Column({
    unique: true,
    nullable: true,
    select: false,
    name: 'current_refresh_token',
  })
  currentRefreshToken: string;
}

export default User;
