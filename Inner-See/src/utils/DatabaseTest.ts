import { DatabaseManager } from '../database/DatabaseManager';
import { QuestionService } from '../services/QuestionService';
import { AppInitializer } from '../AppInitializer';

export class DatabaseTest {
  static async runTests(): Promise<void> {
    console.log('开始数据库集成测试...');
    
    try {
      // 1. 测试数据库连接
      console.log('测试1: 数据库连接...');
      await DatabaseManager.getInstance().initialize();
      console.log('✓ 数据库连接成功');
      
      // 2. 测试应用初始化
      console.log('测试2: 应用初始化...');
      await AppInitializer.getInstance().initializeApp();
      console.log('✓ 应用初始化成功');
      
      // 3. 测试测试类型读取
      console.log('测试3: 读取测试类型...');
      const questionService = QuestionService.getInstance();
      const testTypes = await questionService.getTestTypes();
      console.log(`✓ 成功读取 ${testTypes.length} 个测试类型`);
      
      // 4. 测试题目读取
      if (testTypes.length > 0) {
        console.log('测试4: 读取题目...');
        const questions = await questionService.getQuestionsByTestType(testTypes[0].id);
        console.log(`✓ 成功读取 ${questions.length} 道题目`);
        
        // 5. 测试题目解析
        console.log('测试5: 题目数据解析...');
        const firstQuestion = questions[0];
        if (firstQuestion) {
          const options = questionService.parseOptions(firstQuestion);
          const scoreMapping = questionService.parseScoreMapping(firstQuestion);
          console.log('✓ 题目数据解析成功');
          console.log('示例题目:', {
            id: firstQuestion.questionId,
            text: firstQuestion.questionText,
            optionsCount: options.length,
            scoreMapping
          });
        }
      }
      
      console.log('🎉 所有数据库集成测试通过！');
      
    } catch (error) {
      console.error('❌ 数据库集成测试失败:', error);
      throw error;
    } finally {
      // 关闭数据库连接
      await DatabaseManager.getInstance().close();
      console.log('数据库连接已关闭');
    }
  }
}