import { PrepackagedDatabase } from './database/PrepackagedDatabase';
import { LazyLoadingQuestionService } from './services/LazyLoadingQuestionService';

class LazyLoadingAppInitializer {
  private static instance: LazyLoadingAppInitializer;
  private questionService: LazyLoadingQuestionService;

  static getInstance(): LazyLoadingAppInitializer {
    if (!LazyLoadingAppInitializer.instance) {
      LazyLoadingAppInitializer.instance = new LazyLoadingAppInitializer();
    }
    return LazyLoadingAppInitializer.instance;
  }

  constructor() {
    this.questionService = LazyLoadingQuestionService.getInstance();
  }

  async initializeApp(): Promise<void> {
    try {
      console.log('开始应用初始化...');
      
      // 初始化预打包数据库连接
      await this.questionService.initialize();
      console.log('预打包数据库连接初始化完成');
      
      // 检查数据库是否包含完整数据
      await this.validateDatabaseContent();
      console.log('数据库内容验证完成');
      
      console.log('应用初始化完成');
    } catch (error) {
      console.error('应用初始化失败:', error);
      throw error;
    }
  }

  private async validateDatabaseContent(): Promise<void> {
    try {
      // 检查测试类型数量
      const testTypes = await this.questionService.getTestTypes();
      console.log(`数据库中包含 ${testTypes.length} 个测试类型`);
      
      if (testTypes.length === 0) {
        console.log('警告：数据库中没有测试类型数据');
        // 可以选择插入示例数据作为回退
        await this.insertFallbackData();
      } else {
        // 检查每个测试类型的题目数量
        for (const testType of testTypes) {
          const questionCount = await this.questionService.getQuestionCountByTestType(testType.id);
          console.log(`测试类型 "${testType.name}" 包含 ${questionCount} 道题目`);
        }
      }
    } catch (error) {
      console.error('验证数据库内容时出错:', error);
      throw error;
    }
  }

  private async insertFallbackData(): Promise<void> {
    console.log('插入回退数据...');
    
    // 这里可以插入最少的示例数据，确保应用基本功能可用
    // 实际项目中，这些数据应该已经包含在预打包的数据库中
    const db = PrepackagedDatabase.getInstance().getDatabase();
    
    // 插入示例测试类型
    await db.runAsync(
      `INSERT OR REPLACE INTO test_types 
       (id, name, description, estimated_duration, question_count, category, icon) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['1', '心理健康评估', '评估您的情绪状态和心理健康', 10, 20, '心理健康', 'heart']
    );
    
    // 插入示例题目
    await db.runAsync(
      `INSERT OR REPLACE INTO questions 
       (id, question_id, test_type_id, question_type, question_text, options, 
        score_mapping, source_reference, ai_review_status, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        '1',
        'Q-MH-001',
        '1',
        '量表题',
        '在过去的一周里，您感到快乐和满足的频率如何？',
        JSON.stringify([
          { value: 1, label: '几乎从不' },
          { value: 2, label: '很少' },
          { value: 3, label: '有时' },
          { value: 4, label: '经常' },
          { value: 5, label: '几乎总是' }
        ]),
        JSON.stringify({ 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 }),
        '基于DASS-21抑郁焦虑压力量表改编',
        '已通过',
        1
      ]
    );
    
    console.log('回退数据插入完成');
  }

  async closeApp(): Promise<void> {
    try {
      await this.questionService.close();
      console.log('数据库连接已关闭');
    } catch (error) {
      console.error('关闭数据库连接失败:', error);
    }
  }
}

export { LazyLoadingAppInitializer };