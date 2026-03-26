import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

export enum AppealCategory {
  QUALITY = 'quality',
  SERVICE = 'service',
  GUARANTEE = 'guarantee',
  PURCHASE = 'purchase',
  PARTS = 'parts',
  OTHER = 'other',
}

export enum AppealStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  ANSWERED = 'answered',
  CLOSED = 'closed',
}

@Entity('appeals')
export class Appeal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  category: AppealCategory;

  @Column()
  subject: string;

  @Column('text')
  message: string;

  @Column({ default: AppealStatus.NEW })
  status: AppealStatus;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column('simple-array', { nullable: true })
  attachments: string[];

  @ManyToOne(() => User, (user) => user.appeals)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
