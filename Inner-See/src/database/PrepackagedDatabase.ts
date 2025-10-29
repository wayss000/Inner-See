import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export class PrepackagedDatabase {
  private static instance: PrepackagedDatabase;
  private db: SQLiteDatabase | null = null;

  static getInstance(): PrepackagedDatabase {
    if (!PrepackagedDatabase.instance) {
      PrepackagedDatabase.instance = new PrepackagedDatabase();
    }
    return PrepackagedDatabase.instance;
  }

  async initialize(): Promise<void> {
    try {
      // 检查是否已经有预打包的数据库文件
      const dbExists = await this.checkDatabaseExists();
      
      if (dbExists) {
        // 使用预打包的数据库文件
        this.db = await openDatabaseAsync('xin-tan.db');
        console.log('使用预打包的数据库文件');
      } else {
        // 回退到动态创建数据库
        console.log('预打包数据库文件不存在，回退到动态创建');
        await this.createDatabase();
      }

      // 确保数据表结构完整
      await this.ensureTablesExist();
      console.log('数据库初始化成功');
    } catch (error) {
      console.error('数据库初始化失败:', error);
      throw error;
    }
  }

  private async checkDatabaseExists(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        // Web平台总是返回false，使用动态创建
        return false;
      }

      const dbUri = `${FileSystem.documentDirectory}SQLite/xin-tan.db`;
      const fileInfo = await FileSystem.getInfoAsync(dbUri);
      return fileInfo.exists;
    } catch (error) {
      console.log('检查数据库文件是否存在时出错:', error);
      return false;
    }
  }

  private async createDatabase(): Promise<void> {
    this.db = await openDatabaseAsync('xin-tan.db');
    await this.ensureTablesExist();
  }

  private async ensureTablesExist(): Promise<void> {
    if (!this.db) {
      throw new Error('数据库未连接');
    }

    // 检查并创建测试类型表
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS test_types (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        estimated_duration INTEGER DEFAULT 0,
        question_count INTEGER DEFAULT 0,
        category TEXT,
        icon TEXT
      )
    `);

    // 检查并创建题目表
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        question_id TEXT NOT NULL,
        test_type_id TEXT NOT NULL,
        question_type TEXT NOT NULL,
        question_text TEXT NOT NULL,
        options TEXT NOT NULL,
        score_mapping TEXT NOT NULL,
        source_reference TEXT,
        ai_review_status TEXT DEFAULT 'pending',
        sort_order INTEGER DEFAULT 0,
        FOREIGN KEY (test_type_id) REFERENCES test_types (id)
      )
    `);

    // 检查并创建用户表
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        nickname TEXT,
        avatar_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 检查并创建用户测试记录表
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_test_records (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        test_type_id TEXT NOT NULL,
        start_time DATETIME NOT NULL,
        end_time DATETIME,
        total_score REAL DEFAULT 0,
        result_summary TEXT,
        improvement_suggestions TEXT,
        reference_materials TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (test_type_id) REFERENCES test_types (id)
      )
    `);

    // 检查并创建用户答题表
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_answers (
        id TEXT PRIMARY KEY,
        record_id TEXT NOT NULL,
        question_id TEXT NOT NULL,
        user_choice TEXT NOT NULL,
        score_obtained REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (record_id) REFERENCES user_test_records (id),
        FOREIGN KEY (question_id) REFERENCES questions (id)
      )
    `);

    console.log('数据表结构检查完成');
  }

  getDatabase(): SQLiteDatabase {
    if (!this.db) {
      throw new Error('数据库未初始化');
    }
    return this.db;
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}