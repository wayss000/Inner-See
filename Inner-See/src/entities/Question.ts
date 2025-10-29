import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TestType } from './TestType';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  questionId: string; // 如 Q-MH-001

  @Column({ length: 50 })
  testTypeId: string; // 外键关联TestType

  @ManyToOne(() => TestType)
  @JoinColumn({ name: 'testTypeId' })
  testType: TestType;

  @Column({ length: 20 })
  questionType: string; // 量表题、单选题、多选题等

  @Column({ type: 'text' })
  questionText: string;

  @Column({ type: 'text' })
  options: string; // JSON格式存储选项

  @Column({ type: 'text' })
  scoreMapping: string; // JSON格式存储分数映射规则

  @Column({ type: 'text', nullable: true })
  sourceReference: string; // 题目来源参考

  @Column({ length: 20, default: 'pending' })
  aiReviewStatus: string; // AI审核状态

  @Column({ default: 0 })
  sortOrder: number; // 排序字段

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}