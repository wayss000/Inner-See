import { AppState } from 'react-native';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ErrorResponse {
  code: number;
  message: string;
  error?: string;
  timestamp: string;
  path: string;
}

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>();

  set<T>(key: string, data: T, ttl: number = 60 * 60 * 1000): void { // 默认1小时缓存
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  remove(key: string): void {
    this.cache.delete(key);
  }
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private retryCount: number;
  private cache: CacheManager;
  private isOnline: boolean = true;

  constructor(config: { baseURL: string; timeout: number; retryCount: number }) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
    this.retryCount = config.retryCount;
    this.cache = new CacheManager();
    
    // 监听应用状态变化
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  private handleAppStateChange = (nextAppState: string) => {
    if (nextAppState === 'active') {
      // 应用回到前台时，清除过期缓存
      this.clearExpiredCache();
    }
  };

  private clearExpiredCache(): void {
    const now = Date.now();
    const cacheMap = this.cache['cache'] as Map<string, CacheItem<any>>;
    const entries = Array.from(cacheMap.entries());
    for (const [key, item] of entries) {
      if (now - item.timestamp > item.ttl) {
        this.cache.remove(key);
      }
    }
  }

  private async request<T>(options: {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
    headers?: Record<string, string>;
    useCache?: boolean;
    cacheKey?: string;
  }): Promise<T> {
    const { url, method = 'GET', data, headers = {}, useCache = false, cacheKey } = options;
    
    // 检查缓存
    if (useCache && cacheKey) {
      const cachedData = this.cache.get<T>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal: AbortSignal.timeout(this.timeout),
    };

    if (method !== 'GET' && data) {
      requestOptions.body = JSON.stringify(data);
    }

    // 添加查询参数（GET请求）
    let requestUrl = url;
    if (method === 'GET' && data) {
      const params = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      requestUrl = `${url}?${params.toString()}`;
    }

    let lastError: Error = new Error('Unknown error');
    
    // 重试机制
    for (let attempt = 0; attempt <= this.retryCount; attempt++) {
      try {
        const response = await fetch(`${this.baseURL}${requestUrl}`, requestOptions);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result: ApiResponse<T> = await response.json();
        
        if (result.code !== 200) {
          throw new Error(result.message || 'API request failed');
        }

        // 缓存结果
        if (useCache && cacheKey) {
          this.cache.set(cacheKey, result.data);
        }

        return result.data;
        
      } catch (error) {
        lastError = error as Error;
        
        // 如果是网络错误且不是最后一次尝试，等待后重试
        if (attempt < this.retryCount && (error as Error).message.includes('fetch')) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
        
        break;
      }
    }

    throw lastError;
  }

  async get<T>(url: string, params?: any, options?: { useCache?: boolean; cacheKey?: string }): Promise<T> {
    return this.request<T>({ 
      url, 
      method: 'GET', 
      data: params,
      useCache: options?.useCache,
      cacheKey: options?.cacheKey
    });
  }

  async post<T>(url: string, data?: any, options?: { useCache?: boolean; cacheKey?: string }): Promise<T> {
    return this.request<T>({ 
      url, 
      method: 'POST', 
      data,
      useCache: options?.useCache,
      cacheKey: options?.cacheKey
    });
  }

  async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ url, method: 'PUT', data });
  }

  async delete<T>(url: string): Promise<T> {
    return this.request<T>({ url, method: 'DELETE' });
  }

  // 检查网络状态
  async checkNetworkStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      this.isOnline = response.ok;
      return response.ok;
    } catch {
      this.isOnline = false;
      return false;
    }
  }

  // 清除缓存
  clearCache(): void {
    this.cache.clear();
  }

  // 获取缓存统计
  getCacheStats(): { size: number } {
    return { size: this.cache['cache'].size };
  }
}

// 创建全局API客户端实例
export const apiClient = new ApiClient({
  baseURL: 'https://api.xin-tan.com/v1',
  timeout: 10000,
  retryCount: 3,
});

export default ApiClient;