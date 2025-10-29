import { DatabaseManager } from './database/DatabaseManager';
import { DatabaseInitializer } from './database/DatabaseInitializer';
import { QuestionMigration } from './database/QuestionMigration';

export class AppInitializer {
  private static instance: AppInitializer;

  static getInstance(): AppInitializer {
    if (!AppInitializer.instance) {
      AppInitializer.instance = new AppInitializer();
    }
    return AppInitializer.instance;
  }

  async initializeApp(): Promise<void> {
    try {
      console.log('开始应用初始化...');
      
      // 初始化数据库连接
      await DatabaseManager.getInstance().initialize();
      console.log('数据库连接初始化完成');
      
      // 初始化测试数据
      await DatabaseInitializer.getInstance().initializeDatabase();
      console.log('测试数据初始化完成');
      
      // 迁移题目库数据
      await QuestionMigration.getInstance().migrateQuestionsFromLibrary();
      console.log('题目数据迁移完成');
      
      console.log('应用初始化完成');
    } catch (error) {
      console.error('应用初始化失败:', error);
      throw error;
    }
  }

  async closeApp(): Promise<void> {
    try {
      await DatabaseManager.getInstance().close();
      console.log('数据库连接已关闭');
    } catch (error) {
      console.error('关闭数据库连接失败:', error);
    }
  }
}