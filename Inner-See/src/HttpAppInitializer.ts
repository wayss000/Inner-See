import { ApiService } from './services/ApiService';

export class HttpAppInitializer {
  private static instance: HttpAppInitializer;

  static getInstance(): HttpAppInitializer {
    if (!HttpAppInitializer.instance) {
      HttpAppInitializer.instance = new HttpAppInitializer();
    }
    return HttpAppInitializer.instance;
  }

  async initialize(): Promise<void> {
    try {
      console.log('正在初始化HTTP应用...');
      
      // 初始化API服务
      const apiService = ApiService.getInstance();
      
      // 检查网络状态
      const isOnline = await apiService.getCacheStats();
      console.log('应用初始化完成，网络状态检查完成');
      
    } catch (error) {
      console.error('HTTP应用初始化失败:', error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    try {
      // 清理缓存
      const apiService = ApiService.getInstance();
      apiService.clearCache();
      console.log('应用清理完成');
    } catch (error) {
      console.error('应用清理失败:', error);
    }
  }
}

export default HttpAppInitializer;