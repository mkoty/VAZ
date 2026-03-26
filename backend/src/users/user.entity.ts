import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Appeal } from '../appeals/appeal.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  patronymic: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  city: string;

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @OneToMany(() => Appeal, (appeal) => appeal.user)
  appeals: Appeal[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
