import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { TestType } from './TestType';

@Entity('user_test_records')
export class UserTestRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  userId: string; // 外键关联User

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ length: 50 })
  testTypeId: string; // 外键关联TestType

  @ManyToOne(() => TestType)
  @JoinColumn({ name: 'testTypeId' })
  testType: TestType;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({ default: 0 })
  totalScore: number;

  @Column({ type: 'text', nullable: true })
  resultSummary: string;

  @Column({ type: 'text', nullable: true })
  improvementSuggestions: string;

  @Column({ type: 'text', nullable: true })
  referenceMaterials: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}