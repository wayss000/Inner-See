import * as SQLite from 'expo-sqlite';
import { TestRecord, UserAnswer, TestResultWithDetails } from '../entities/TestEntities';

export class DatabaseManager {
  private static instance: DatabaseManager;
  private db: SQLite.SQLiteDatabase | null = null;

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  async initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync('mental_health.db');
      await this.createTables();
      console.log('数据库初始化成功');
    } catch (error) {
      console.error('数据库初始化失败:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('数据库未初始化');

    // 创建测试记录表
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS test_records (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        test_type_id TEXT NOT NULL,
        start_time INTEGER NOT NULL,
        end_time INTEGER,
        total_score INTEGER,
        result_summary TEXT,
        improvement_suggestions TEXT,
        reference_materials TEXT,
        created_at INTEGER NOT NULL
      )
    `);

    // 创建用户答题记录表
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_answers (
        id TEXT PRIMARY KEY,
        record_id TEXT NOT NULL,
        question_id TEXT NOT NULL,
        user_choice TEXT NOT NULL,
        score_obtained INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (record_id) REFERENCES test_records (id)
      )
    `);

    console.log('数据表创建成功');
  }

  async saveTestRecord(record: TestRecord): Promise<void> {
    if (!this.db) throw new Error('数据库未初始化');

    console.log('保存测试记录:', {
      id: record.id,
      userId: record.userId,
      testTypeId: record.testTypeId,
      totalScore: record.totalScore,
      resultSummary: record.resultSummary,
      improvementSuggestions: record.improvementSuggestions
    });

    await this.db.runAsync(
      `INSERT OR REPLACE INTO test_records
       (id, user_id, test_type_id, start_time, end_time, total_score,
        result_summary, improvement_suggestions, reference_materials, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        record.id,
        record.userId,
        record.testTypeId,
        record.startTime,
        record.endTime,
        record.totalScore,
        record.resultSummary,
        record.improvementSuggestions,
        record.referenceMaterials,
        record.createdAt
      ]
    );

    console.log('测试记录保存成功，ID:', record.id);
  }

  async saveUserAnswer(answer: UserAnswer): Promise<void> {
    if (!this.db) throw new Error('数据库未初始化');

    await this.db.runAsync(
      `INSERT INTO user_answers 
       (id, record_id, question_id, user_choice, score_obtained, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        answer.id,
        answer.recordId,
        answer.questionId,
        answer.userChoice,
        answer.scoreObtained,
        answer.createdAt
      ]
    );
  }

  async getTestRecordById(recordId: string): Promise<TestRecord | null> {
    if (!this.db) throw new Error('数据库未初始化');

    console.log('开始查询测试记录，ID:', recordId);
    
    const result = await this.db.getFirstAsync<any>(
      'SELECT * FROM test_records WHERE id = ?',
      [recordId]
    );
    
    console.log('查询到的原始记录:', result);
    
    // 将数据库字段名（下划线命名）转换为 TypeScript 接口字段名（驼峰命名）
    if (result) {
      const convertedResult: TestRecord = {
        id: result.id,
        userId: result.user_id,
        testTypeId: result.test_type_id,
        startTime: result.start_time,
        endTime: result.end_time,
        totalScore: result.total_score,
        resultSummary: result.result_summary,
        improvementSuggestions: result.improvement_suggestions,
        referenceMaterials: result.reference_materials,
        createdAt: result.created_at
      };
      
      console.log('转换后的测试记录:', convertedResult);
      return convertedResult;
    }
    
    return null;
  }

  async getUserAnswersByRecordId(recordId: string): Promise<UserAnswer[]> {
    if (!this.db) throw new Error('数据库未初始化');

    const results = await this.db.getAllAsync<UserAnswer>(
      'SELECT * FROM user_answers WHERE record_id = ? ORDER BY created_at',
      [recordId]
    );
    return results;
  }

  async getTestResultWithDetails(recordId: string): Promise<TestResultWithDetails | null> {
    if (!this.db) throw new Error('数据库未初始化');

    // 获取测试记录
    const testRecord = await this.getTestRecordById(recordId);
    if (!testRecord) return null;

    // 获取用户答题记录
    const userAnswers = await this.getUserAnswersByRecordId(recordId);

    // 这里需要获取题目详情，由于题目数据在本地，我们需要从测试时保存的数据中获取
    // 由于当前实现中没有保存题目详情，我们需要从本地数据源获取
    // 这里先返回一个基础结构，具体的题目详情需要在结果页面从本地数据源获取
    const questionResults = userAnswers.map(answer => ({
      question: {
        id: answer.questionId,
        text: `题目 ${answer.questionId}`, // 临时占位符
        type: 'scale' as const,
        options: [
          { value: 1, text: '选项1' },
          { value: 2, text: '选项2' },
          { value: 3, text: '选项3' },
          { value: 4, text: '选项4' },
          { value: 5, text: '选项5' }
        ]
      },
      userAnswer: answer,
      userChoiceText: answer.userChoice
    }));

    return {
      testName: testRecord.testTypeId === 'mental-health' ? '抑郁症评估' : 'MBTI性格测试',
      score: testRecord.totalScore || 0,
      level: testRecord.resultSummary || '未知',
      levelPercentage: Math.min((testRecord.totalScore || 0) * 10, 100),
      interpretation: [
        `根据您的测试结果，${testRecord.resultSummary || '测试完成'}。`,
        '这是基于您答题情况生成的个性化结果。',
        '建议定期进行心理状态评估，保持良好的生活习惯。'
      ],
      suggestions: testRecord.improvementSuggestions ? [
        {
          title: '改善建议',
          text: testRecord.improvementSuggestions,
          icon: 'lightbulb'
        }
      ] : [
        {
          title: '增加体育锻炼',
          text: '每天进行30分钟的有氧运动，有助于改善情绪状态。',
          icon: 'person-walking'
        },
        {
          title: '改善睡眠质量',
          text: '保持规律的作息时间，创造舒适的睡眠环境。',
          icon: 'moon'
        }
      ],
      questionResults
    };
  }

  async getAllTestRecords(): Promise<TestRecord[]> {
    if (!this.db) throw new Error('数据库未初始化');

    const results = await this.db.getAllAsync<any>(
      'SELECT * FROM test_records ORDER BY created_at DESC'
    );
    
    // 将数据库字段名（下划线命名）转换为 TypeScript 接口字段名（驼峰命名）
    return results.map(result => ({
      id: result.id,
      userId: result.user_id,
      testTypeId: result.test_type_id,
      startTime: result.start_time,
      endTime: result.end_time,
      totalScore: result.total_score,
      resultSummary: result.result_summary,
      improvementSuggestions: result.improvement_suggestions,
      referenceMaterials: result.reference_materials,
      createdAt: result.created_at
    }));
  }

  async deleteTestRecord(recordId: string): Promise<void> {
    if (!this.db) throw new Error('数据库未初始化');

    await this.db.runAsync(
      'DELETE FROM user_answers WHERE record_id = ?',
      [recordId]
    );
    await this.db.runAsync(
      'DELETE FROM test_records WHERE id = ?',
      [recordId]
    );
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}