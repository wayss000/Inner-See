import * as SQLite from 'expo-sqlite';
import { TestRecord, UserAnswer } from '../entities/TestEntities';

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

    const result = await this.db.getFirstAsync<TestRecord>(
      'SELECT * FROM test_records WHERE id = ?',
      [recordId]
    );
    return result;
  }

  async getUserAnswersByRecordId(recordId: string): Promise<UserAnswer[]> {
    if (!this.db) throw new Error('数据库未初始化');

    const results = await this.db.getAllAsync<UserAnswer>(
      'SELECT * FROM user_answers WHERE record_id = ? ORDER BY created_at',
      [recordId]
    );
    return results;
  }

  async getAllTestRecords(): Promise<TestRecord[]> {
    if (!this.db) throw new Error('数据库未初始化');

    const results = await this.db.getAllAsync<TestRecord>(
      'SELECT * FROM test_records ORDER BY created_at DESC'
    );
    return results;
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