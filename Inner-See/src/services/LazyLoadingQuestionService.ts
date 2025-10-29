import { WebSafePrepackagedDatabase } from '../database/WebSafePrepackagedDatabase';

export interface Question {
  id: string;
  questionId: string;
  testTypeId: string;
  questionType: string;
  questionText: string;
  options: string;
  scoreMapping: string;
  sourceReference: string;
  aiReviewStatus: string;
  sortOrder: number;
}

export interface TestType {
  id: string;
  name: string;
  description: string;
  estimatedDuration: number;
  questionCount: number;
  category: string;
  icon: string;
}

class LazyLoadingQuestionService {
  private static instance: LazyLoadingQuestionService;
  private db: WebSafePrepackagedDatabase;
  private readonly BATCH_SIZE = 20; // 每批加载的题目数量

  static getInstance(): LazyLoadingQuestionService {
    if (!LazyLoadingQuestionService.instance) {
      LazyLoadingQuestionService.instance = new LazyLoadingQuestionService();
    }
    return LazyLoadingQuestionService.instance;
  }

  constructor() {
    this.db = WebSafePrepackagedDatabase.getInstance();
  }

  async initialize(): Promise<void> {
    await this.db.initialize();
  }

  // 获取测试类型列表（懒加载的基础数据）
  async getTestTypes(): Promise<TestType[]> {
    try {
      const db = this.db.getDatabase();
      const result = await db.getAllAsync<TestType>(
        `SELECT id, name, description, estimated_duration as estimatedDuration, 
                question_count as questionCount, category, icon 
         FROM test_types 
         ORDER BY sort_order, name`
      );
      return result;
    } catch (error) {
      console.error('获取测试类型失败:', error);
      throw error;
    }
  }

  // 分批获取题目（支持懒加载）
  async getQuestionsByTestType(testTypeId: string, offset: number = 0): Promise<Question[]> {
    try {
      const db = this.db.getDatabase();
      const result = await db.getAllAsync<Question>(
        `SELECT id, question_id as questionId, test_type_id as testTypeId,
                question_type as questionType, question_text as questionText,
                options, score_mapping as scoreMapping, source_reference as sourceReference,
                ai_review_status as aiReviewStatus, sort_order as sortOrder
         FROM questions 
         WHERE test_type_id = ? 
         ORDER BY sort_order 
         LIMIT ? OFFSET ?`,
        [testTypeId, this.BATCH_SIZE, offset]
      );
      return result;
    } catch (error) {
      console.error('获取题目失败:', error);
      throw error;
    }
  }

  // 获取指定数量的题目（用于预加载）
  async getQuestionsBatch(testTypeId: string, count: number, offset: number = 0): Promise<Question[]> {
    try {
      const db = this.db.getDatabase();
      const result = await db.getAllAsync<Question>(
        `SELECT id, question_id as questionId, test_type_id as testTypeId,
                question_type as questionType, question_text as questionText,
                options, score_mapping as scoreMapping, source_reference as sourceReference,
                ai_review_status as aiReviewStatus, sort_order as sortOrder
         FROM questions 
         WHERE test_type_id = ? 
         ORDER BY sort_order 
         LIMIT ? OFFSET ?`,
        [testTypeId, count, offset]
      );
      return result;
    } catch (error) {
      console.error('获取题目批次失败:', error);
      throw error;
    }
  }

  // 获取单个题目的详细信息
  async getQuestionById(questionId: string): Promise<Question | null> {
    try {
      const db = this.db.getDatabase();
      const result = await db.getFirstAsync<Question>(
        `SELECT id, question_id as questionId, test_type_id as testTypeId,
                question_type as questionType, question_text as questionText,
                options, score_mapping as scoreMapping, source_reference as sourceReference,
                ai_review_status as aiReviewStatus, sort_order as sortOrder
         FROM questions 
         WHERE id = ? OR question_id = ?`,
        [questionId, questionId]
      );
      return result;
    } catch (error) {
      console.error('获取单个题目失败:', error);
      throw error;
    }
  }

  // 检查是否还有更多题目可以加载
  async hasMoreQuestions(testTypeId: string, offset: number): Promise<boolean> {
    try {
      const db = this.db.getDatabase();
      const result = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count 
         FROM questions 
         WHERE test_type_id = ? 
         LIMIT 1 OFFSET ?`,
        [testTypeId, offset]
      );
      return result?.count > 0;
    } catch (error) {
      console.error('检查是否有更多题目失败:', error);
      return false;
    }
  }

  // 获取测试类型的题目总数
  async getQuestionCountByTestType(testTypeId: string): Promise<number> {
    try {
      const db = this.db.getDatabase();
      const result = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count 
         FROM questions 
         WHERE test_type_id = ?`,
        [testTypeId]
      );
      return result?.count || 0;
    } catch (error) {
      console.error('获取题目数量失败:', error);
      return 0;
    }
  }

  // 搜索题目（支持关键词搜索）
  async searchQuestions(keyword: string, testTypeId?: string): Promise<Question[]> {
    try {
      const db = this.db.getDatabase();
      let query = `
        SELECT id, question_id as questionId, test_type_id as testTypeId,
               question_type as questionType, question_text as questionText,
               options, score_mapping as scoreMapping, source_reference as sourceReference,
               ai_review_status as aiReviewStatus, sort_order as sortOrder
        FROM questions 
        WHERE (question_text LIKE ? OR question_id LIKE ?)
      `;
      let params: any[] = [`%${keyword}%`, `%${keyword}%`];

      if (testTypeId) {
        query += ' AND test_type_id = ?';
        params.push(testTypeId);
      }

      query += ' ORDER BY sort_order LIMIT 50';

      const result = await db.getAllAsync<Question>(query, params);
      return result;
    } catch (error) {
      console.error('搜索题目失败:', error);
      throw error;
    }
  }

  // 获取推荐的前N道题目（用于快速预览）
  async getRecommendedQuestions(testTypeId: string, count: number = 5): Promise<Question[]> {
    try {
      const db = this.db.getDatabase();
      const result = await db.getAllAsync<Question>(
        `SELECT id, question_id as questionId, test_type_id as testTypeId,
                question_type as questionType, question_text as questionText,
                options, score_mapping as scoreMapping, source_reference as sourceReference,
                ai_review_status as aiReviewStatus, sort_order as sortOrder
         FROM questions 
         WHERE test_type_id = ? 
         ORDER BY sort_order 
         LIMIT ?`,
        [testTypeId, count]
      );
      return result;
    } catch (error) {
      console.error('获取推荐题目失败:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.db.close();
  }
}

export { LazyLoadingQuestionService };