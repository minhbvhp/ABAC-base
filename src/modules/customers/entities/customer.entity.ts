import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tax_code', nullable: true })
  taxCode: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column()
  address: string;

  @Column()
  userId: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}

export default Customer;
