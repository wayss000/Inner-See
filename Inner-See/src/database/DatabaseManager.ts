import * as SQLite from 'expo-sqlite';
import { TestRecord, UserAnswer, TestResultWithDetails, User } from '../entities/TestEntities';

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
      if (!this.db) {
        this.db = await SQLite.openDatabaseAsync('mental_health.db');
        await this.createTables();
        await this.updateTableSchema(); // 确保表结构更新
        await this.ensureDefaultUser(); // 确保有默认用户
        console.log('数据库初始化成功');
      } else {
        console.log('数据库已初始化，跳过重复初始化');
      }
    } catch (error) {
      console.error('数据库初始化失败:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('数据库未初始化');

    // 创建用户表
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        nickname TEXT NOT NULL,
        avatar_emoji TEXT NOT NULL,
        join_date INTEGER NOT NULL,
        test_count INTEGER DEFAULT 0,
        test_days INTEGER DEFAULT 0,
        gender TEXT,
        age INTEGER,
        occupation TEXT,
        selected_model TEXT DEFAULT 'KwaiKAT',
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `);

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
        ai_analysis_result TEXT, -- AI分析结果JSON字符串
        created_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // 创建用户答题记录表（增强版，包含冗余数据）
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_answers (
        id TEXT PRIMARY KEY,
        record_id TEXT NOT NULL,
        question_id TEXT NOT NULL,
        -- 冗余数据：完整的题目信息
        question_text TEXT NOT NULL,
        question_type TEXT NOT NULL,
        options_json TEXT NOT NULL,
        -- 冗余数据：用户选择的可读信息
        user_choice TEXT NOT NULL,
        user_choice_text TEXT NOT NULL,
        score_obtained INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (record_id) REFERENCES test_records (id)
      )
    `);

    console.log('数据表创建成功');
  }

  /**
   * 更新表结构以添加新字段
   */
  private async updateTableSchema(): Promise<void> {
    if (!this.db) throw new Error('数据库未初始化');

    try {
      // 检查并添加users表的selected_model字段
      const userColumns = await this.db.getAllAsync<{ name: string }>(
        "PRAGMA table_info(users)"
      );
      const userColumnNames = userColumns.map(col => col.name);

      if (!userColumnNames.includes('selected_model')) {
        await this.db.execAsync('ALTER TABLE users ADD COLUMN selected_model TEXT DEFAULT "KwaiKAT"');
      }

      // 检查并添加user_answers表的新字段
      const columns = await this.db.getAllAsync<{ name: string }>(
        "PRAGMA table_info(user_answers)"
      );
      const columnNames = columns.map(col => col.name);

      // 添加question_text字段（如果不存在）
      if (!columnNames.includes('question_text')) {
        await this.db.execAsync('ALTER TABLE user_answers ADD COLUMN question_text TEXT NOT NULL DEFAULT ""');
      }

      // 添加question_type字段（如果不存在）
      if (!columnNames.includes('question_type')) {
        await this.db.execAsync('ALTER TABLE user_answers ADD COLUMN question_type TEXT NOT NULL DEFAULT ""');
      }

      // 添加options_json字段（如果不存在）
      if (!columnNames.includes('options_json')) {
        await this.db.execAsync('ALTER TABLE user_answers ADD COLUMN options_json TEXT NOT NULL DEFAULT ""');
      }

      // 添加user_choice_text字段（如果不存在）
      if (!columnNames.includes('user_choice_text')) {
        await this.db.execAsync('ALTER TABLE user_answers ADD COLUMN user_choice_text TEXT NOT NULL DEFAULT ""');
      }

      // 检查并添加test_records表的ai_analysis_result字段
      const testRecordColumns = await this.db.getAllAsync<{ name: string }>(
        "PRAGMA table_info(test_records)"
      );
      const testRecordColumnNames = testRecordColumns.map(col => col.name);

      if (!testRecordColumnNames.includes('ai_analysis_result')) {
        await this.db.execAsync('ALTER TABLE test_records ADD COLUMN ai_analysis_result TEXT');
        console.log('已添加test_records表的ai_analysis_result字段');
      }

      console.log('表结构更新完成');
    } catch (error) {
      console.error('更新表结构失败:', error);
      throw error;
    }
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
        result_summary, improvement_suggestions, reference_materials, ai_analysis_result, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        record.id,
        record.userId,
        record.testTypeId,
        record.startTime,
        record.endTime || null,
        record.totalScore || null,
        record.resultSummary || null,
        record.improvementSuggestions || null,
        record.referenceMaterials || null,
        record.aiAnalysisResult || null, // 添加AI分析结果字段
        record.createdAt
      ]
    );

    console.log('测试记录保存成功，ID:', record.id);
  }

  /**
   * 批量保存测试记录和用户答案
   */
  async saveTestRecordWithAnswers(record: TestRecord, answers: UserAnswer[]): Promise<void> {
    if (!this.db) throw new Error('数据库未初始化');

    await this.db.withTransactionAsync(async () => {
      // 保存测试记录
      await this.saveTestRecord(record);

      // 批量保存用户答案
      for (const answer of answers) {
        await this.saveUserAnswer(answer);
      }

      console.log(`测试记录保存成功，ID: ${record.id}`);
    });
  }

  async saveUserAnswer(answer: UserAnswer): Promise<void> {
    if (!this.db) throw new Error('数据库未初始化');

    await this.db.runAsync(
      `INSERT INTO user_answers
       (id, record_id, question_id, question_text, question_type, options_json, user_choice, user_choice_text, score_obtained, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        answer.id || '',
        answer.recordId || '',
        answer.questionId || '',
        answer.questionText || '',           // 冗余字段：题目文本
        answer.questionType || '',           // 冗余字段：题型
        answer.optionsJson || '',            // 冗余字段：选项JSON
        String(answer.userChoice || ''),     // 确保是字符串
        answer.userChoiceText || '',        // 冗余字段：用户选择的可读文本
        Number(answer.scoreObtained || 0),   // 确保是数字
        Number(answer.createdAt || Date.now()) // 确保是数字
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
        aiAnalysisResult: result.ai_analysis_result,
        createdAt: result.created_at
      };
      
      console.log('转换后的测试记录:', convertedResult);
      return convertedResult;
    }
    
    return null;
  }

  async getUserAnswersByRecordId(recordId: string): Promise<UserAnswer[]> {
    if (!this.db) throw new Error('数据库未初始化');

    const results = await this.db.getAllAsync<any>(
      'SELECT * FROM user_answers WHERE record_id = ? ORDER BY created_at',
      [recordId]
    );
    
    // 将数据库字段名（下划线命名）转换为 TypeScript 接口字段名（驼峰命名）
    return results.map(result => ({
      id: result.id,
      recordId: result.record_id,
      questionId: result.question_id,
      questionText: result.question_text,
      questionType: result.question_type,
      optionsJson: result.options_json,
      userChoice: result.user_choice,
      userChoiceText: result.user_choice_text,
      scoreObtained: result.score_obtained,
      createdAt: result.created_at
    }));
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
      aiAnalysisResult: testRecord.aiAnalysisResult ? JSON.parse(testRecord.aiAnalysisResult) : null,
      questionResults: questionResults.map(result => ({
        question: {
          id: result.question.id,
          text: result.question.text,
          type: result.question.type,
          options: result.question.options
        },
        userAnswer: result.userAnswer,
        userChoiceText: result.userChoiceText
      }))
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
      aiAnalysisResult: result.ai_analysis_result,
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

  /**
   * 确保有默认用户
   */
  public async ensureDefaultUser(): Promise<void> {
    if (!this.db) throw new Error('数据库未初始化');

    try {
      const user = await this.getCurrentUser();
      if (!user) {
        // 创建默认用户
        const defaultUser: User = {
          id: `user-${Date.now()}`,
          nickname: '小雨',
          avatarEmoji: this.getRandomDefaultAvatar(),
          joinDate: Date.now(),
          testCount: 0,
          testDays: 0,
          gender: undefined,
          age: undefined,
          occupation: undefined,
          selectedModel: 'KwaiKAT'
        };
        await this.createUser(defaultUser);
        console.log('默认用户创建成功');
      }
    } catch (error) {
      console.error('确保默认用户失败:', error);
    }
  }

  /**
   * 获取随机默认头像
   */
  private getRandomDefaultAvatar(): string {
    const avatars = ['smiley', 'heart', 'star', 'sun', 'moon', 'cat', 'dog', 'flower', 'tree', 'coffee', 'book', 'music', 'gamepad', 'rocket', 'gem', 'crown', 'gift', 'balloon', 'cookie', 'smile-beam'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }

  async createUser(user: User): Promise<void> {
    if (!this.db) throw new Error('数据库未初始化');

    await this.db.runAsync(
      `INSERT OR REPLACE INTO users
       (id, nickname, avatar_emoji, join_date, test_count, test_days, gender, age, occupation, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        user.nickname,
        user.avatarEmoji,
        user.joinDate,
        user.testCount || 0,
        user.testDays || 0,
        user.gender || null,
        user.age || null,
        user.occupation || null,
        Date.now(),
        Date.now()
      ]
    );

    console.log('用户创建成功，ID:', user.id);
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.db) throw new Error('数据库未初始化');

    const result = await this.db.getFirstAsync<any>(
      'SELECT * FROM users ORDER BY join_date DESC LIMIT 1'
    );

    if (result) {
      return {
        id: result.id,
        nickname: result.nickname,
        avatarEmoji: result.avatar_emoji,
        joinDate: result.join_date,
        testCount: result.test_count,
        testDays: result.test_days,
        gender: result.gender,
        age: result.age,
        occupation: result.occupation,
        selectedModel: result.selected_model || 'KwaiKAT'
      };
    }

    return null;
  }

  async updateUser(user: User): Promise<void> {
    if (!this.db) throw new Error('数据库未初始化');

    await this.db.runAsync(
      `UPDATE users
       SET nickname = ?, avatar_emoji = ?, gender = ?, age = ?, occupation = ?, selected_model = ?, updated_at = ?
       WHERE id = ?`,
      [
        user.nickname,
        user.avatarEmoji,
        user.gender || null,
        user.age || null,
        user.occupation || null,
        user.selectedModel || 'KwaiKAT',
        Date.now(),
        user.id
      ]
    );

    console.log('用户信息更新成功，ID:', user.id);
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}