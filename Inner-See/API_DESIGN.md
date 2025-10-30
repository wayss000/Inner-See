# 心探App HTTP接口设计方案

## 1. 现有技术架构分析

### 1.1 当前架构特点
- **数据层**: 使用SQLite数据库，包含1471道题目，6个测试类型
- **服务层**: LazyLoadingQuestionService提供懒加载功能
- **实体层**: TypeORM实体定义（Question、TestType等）
- **UI层**: React Native组件，支持分类展示和分页加载

### 1.2 需要修改的核心模块

#### 数据访问层
- **PrepackagedDatabase.ts**: 需要替换为HTTP客户端
- **LazyLoadingQuestionService.ts**: 需要重构为API服务
- **实体定义**: 需要适配HTTP响应格式

#### 业务逻辑层
- **App初始化**: 需要支持网络状态检测和兜底方案
- **错误处理**: 需要增加网络异常处理
- **缓存机制**: 需要实现本地缓存

#### UI层
- **加载状态**: 需要区分网络加载和本地加载
- **错误提示**: 需要网络异常提示
- **兜底数据**: 需要硬编码的备用题目

## 2. HTTP接口规范设计

### 2.1 基础配置

```typescript
// API基础配置
const API_CONFIG = {
  baseURL: 'https://api.xin-tan.com/v1',
  timeout: 10000, // 10秒超时
  retryCount: 3, // 失败重试次数
};

// 兜底数据（硬编码）
const FALLBACK_DATA = {
  testTypes: [
    {
      id: 'mental-health',
      name: '心理健康评估',
      description: '评估您的情绪状态、压力水平、焦虑程度和抑郁倾向',
      estimatedDuration: 10,
      questionCount: 20,
      category: '心理健康',
      icon: 'heart'
    }
  ],
  questions: [
    {
      id: 'Q-MH-001',
      testTypeId: 'mental-health',
      questionType: 'scale',
      questionText: '最近一周，您感到情绪低落的频率如何？',
      options: [
        { value: '1', label: '从不' },
        { value: '2', label: '很少' },
        { value: '3', label: '有时' },
        { value: '4', label: '经常' },
        { value: '5', label: '总是' }
      ],
      scoreMapping: {
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5
      }
    }
  ]
};
```

### 2.2 接口定义

#### 2.2.1 测试类型相关接口

**获取测试类型列表**
```
GET /test-types
Response:
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "estimatedDuration": number,
      "questionCount": number,
      "category": "string",
      "icon": "string"
    }
  ]
}
```

**获取单个测试类型详情**
```
GET /test-types/{id}
Response:
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "estimatedDuration": number,
    "questionCount": number,
    "category": "string",
    "icon": "string"
  }
}
```

#### 2.2.2 题目相关接口

**分页获取题目列表**
```
GET /questions
Query Parameters:
- test_type_id: string (必填)
- page: number (可选，默认1)
- page_size: number (可选，默认20)
- sort_order: string (可选，asc/desc)

Response:
{
  "code": 200,
  "message": "success",
  "data": {
    "questions": [
      {
        "id": "string",
        "questionId": "string",
        "testTypeId": "string",
        "questionType": "string",
        "questionText": "string",
        "options": "string", // JSON格式
        "scoreMapping": "string", // JSON格式
        "sourceReference": "string",
        "aiReviewStatus": "string",
        "sortOrder": number
      }
    ],
    "pagination": {
      "currentPage": number,
      "pageSize": number,
      "total": number,
      "hasMore": boolean
    }
  }
}
```

**获取单个题目详情**
```
GET /questions/{id}
Response:
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "string",
    "questionId": "string",
    "testTypeId": "string",
    "questionType": "string",
    "questionText": "string",
    "options": "string", // JSON格式
    "scoreMapping": "string", // JSON格式
    "sourceReference": "string",
    "aiReviewStatus": "string",
    "sortOrder": number
  }
}
```

**搜索题目**
```
GET /questions/search
Query Parameters:
- keyword: string (必填)
- test_type_id: string (可选)

Response:
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "string",
      "questionId": "string",
      "testTypeId": "string",
      "questionType": "string",
      "questionText": "string",
      "options": "string", // JSON格式
      "scoreMapping": "string", // JSON格式
      "sourceReference": "string",
      "aiReviewStatus": "string",
      "sortOrder": number
    }
  ]
}
```

#### 2.2.3 用户相关接口

**创建用户**
```
POST /users
Request:
{
  "nickname": "string",
  "avatarUrl": "string"
}

Response:
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "string",
    "nickname": "string",
    "avatarUrl": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

**获取用户信息**
```
GET /users/{id}
Response:
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "string",
    "nickname": "string",
    "avatarUrl": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

#### 2.2.4 测试记录相关接口

**创建测试记录**
```
POST /test-records
Request:
{
  "userId": "string",
  "testTypeId": "string",
  "startTime": "string",
  "endTime": "string",
  "totalScore": number,
  "resultSummary": "string",
  "improvementSuggestions": "string",
  "referenceMaterials": "string"
}

Response:
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "string",
    "userId": "string",
    "testTypeId": "string",
    "startTime": "string",
    "endTime": "string",
    "totalScore": number,
    "resultSummary": "string",
    "improvementSuggestions": "string",
    "referenceMaterials": "string",
    "createdAt": "string"
  }
}
```

**获取用户测试记录列表**
```
GET /users/{userId}/test-records
Query Parameters:
- page: number (可选，默认1)
- page_size: number (可选，默认10)

Response:
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [
      {
        "id": "string",
        "userId": "string",
        "testTypeId": "string",
        "startTime": "string",
        "endTime": "string",
        "totalScore": number,
        "resultSummary": "string",
        "improvementSuggestions": "string",
        "referenceMaterials": "string",
        "createdAt": "string"
      }
    ],
    "pagination": {
      "currentPage": number,
      "pageSize": number,
      "total": number,
      "hasMore": boolean
    }
  }
}
```

**创建用户答题记录**
```
POST /user-answers
Request:
{
  "recordId": "string",
  "questionId": "string",
  "userChoice": "string",
  "scoreObtained": number
}

Response:
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "string",
    "recordId": "string",
    "questionId": "string",
    "userChoice": "string",
    "scoreObtained": number,
    "createdAt": "string"
  }
}
```

### 2.3 错误响应格式

```typescript
interface ErrorResponse {
  code: number; // HTTP状态码
  message: string; // 错误信息
  error?: string; // 具体错误描述
  timestamp: string; // 错误时间
  path: string; // 请求路径
}
```

### 2.4 状态码定义

- **200**: 成功
- **400**: 请求参数错误
- **401**: 未授权
- **404**: 资源不存在
- **500**: 服务器内部错误
- **502**: 网关错误
- **503**: 服务不可用

## 3. 客户端实现方案

### 3.1 网络状态检测

```typescript
interface NetworkStatus {
  isOnline: boolean;
  isReachable: boolean;
  connectionType: 'wifi' | 'cellular' | 'unknown';
}

// 网络状态监听
const useNetworkStatus = (): NetworkStatus => {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isReachable: true,
    connectionType: 'unknown'
  });

  useEffect(() => {
    const handleOnline = () => setStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setStatus(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return status;
};
```

### 3.2 HTTP客户端封装

```typescript
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private retryCount: number;

  constructor(config: { baseURL: string; timeout: number; retryCount: number }) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
    this.retryCount = config.retryCount;
  }

  async request<T>(options: {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
    headers?: Record<string, string>;
  }): Promise<T> {
    // 实现HTTP请求逻辑，包含重试机制
  }

  async get<T>(url: string, params?: any): Promise<T> {
    return this.request<T>({ url, method: 'GET', data: params });
  }

  async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ url, method: 'POST', data });
  }
}
```

### 3.3 数据缓存策略

```typescript
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>();

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
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
}
```

## 4. 迁移策略

### 4.1 渐进式迁移

1. **第一阶段**: 保持SQLite作为主要数据源，HTTP接口作为备用
2. **第二阶段**: HTTP接口作为主要数据源，SQLite作为缓存
3. **第三阶段**: 完全切换到HTTP接口，SQLite仅用于离线缓存

### 4.2 兼容性处理

- 保持现有接口不变，内部实现切换
- 添加网络状态检测和自动回退
- 保留SQLite相关代码作为备用方案

## 5. 安全考虑

### 5.1 数据传输安全
- 使用HTTPS加密传输
- 敏感数据加密存储
- API接口权限控制

### 5.2 用户隐私保护
- 匿名化处理用户数据
- 最小化数据收集
- 明确的隐私政策

## 6. 性能优化

### 6.1 请求优化
- 合理的分页策略
- 数据压缩传输
- 请求去重

### 6.2 缓存策略
- 本地缓存常用数据
- 智能缓存更新
- 离线数据同步

这个设计方案既满足了您对HTTP接口的需求，又保留了兜底方案，确保在网络异常时仍能正常使用。建议先按照这个方案进行开发，然后逐步迁移。