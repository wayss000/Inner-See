import { DatabaseManager } from './database/DatabaseManager';

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
      
      // 确保有默认用户
      await DatabaseManager.getInstance().ensureDefaultUser();
      console.log('默认用户初始化完成');
      
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