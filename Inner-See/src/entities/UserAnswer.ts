import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserTestRecord } from './UserTestRecord';
import { Question } from './Question';

@Entity('user_answers')
export class UserAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  recordId: string; // 外键关联UserTestRecord

  @ManyToOne(() => UserTestRecord)
  @JoinColumn({ name: 'recordId' })
  record: UserTestRecord;

  @Column({ length: 50 })
  questionId: string; // 外键关联Question

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @Column({ type: 'text' })
  userChoice: string; // JSON格式存储用户选择的答案

  @Column({ default: 0 })
  scoreObtained: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}