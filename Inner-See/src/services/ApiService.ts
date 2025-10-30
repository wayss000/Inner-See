import { apiClient, ApiResponse } from './ApiClient';

// 兜底数据 - 硬编码的5道核心题目
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
    },
    {
      id: 'personality',
      name: '人格特质分析',
      description: '分析您的性格类型、行为倾向和价值观',
      estimatedDuration: 15,
      questionCount: 25,
      category: '人格',
      icon: 'person'
    },
    {
      id: 'stress',
      name: '压力水平评估',
      description: '科学评估当前压力状态，提供缓解建议',
      estimatedDuration: 5,
      questionCount: 15,
      category: '压力管理',
      icon: 'bolt'
    },
    {
      id: 'anxiety',
      name: '焦虑症筛查',
      description: '评估焦虑症状的严重程度，提供专业建议',
      estimatedDuration: 8,
      questionCount: 18,
      category: '焦虑',
      icon: 'triangle-exclamation'
    },
    {
      id: 'depression',
      name: '抑郁症评估',
      description: '专业的抑郁症状筛查，帮助您了解心理状态',
      estimatedDuration: 12,
      questionCount: 22,
      category: '抑郁',
      icon: 'cloud'
    }
  ],
  questions: [
    {
      id: 'Q-MH-001',
      questionId: 'Q-MH-001',
      testTypeId: 'mental-health',
      questionType: 'scale',
      questionText: '最近一周，您感到情绪低落的频率如何？',
      options: JSON.stringify([
        { value: '1', label: '从不' },
        { value: '2', label: '很少' },
        { value: '3', label: '有时' },
        { value: '4', label: '经常' },
        { value: '5', label: '总是' }
      ]),
      scoreMapping: JSON.stringify({
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5
      }),
      sourceReference: 'PHQ-9',
      aiReviewStatus: 'approved',
      sortOrder: 1
    },
    {
      id: 'Q-MH-002',
      questionId: 'Q-MH-002',
      testTypeId: 'mental-health',
      questionType: 'scale',
      questionText: '最近一周，您对事物失去兴趣或乐趣的频率如何？',
      options: JSON.stringify([
        { value: '1', label: '从不' },
        { value: '2', label: '很少' },
        { value: '3', label: '有时' },
        { value: '4', label: '经常' },
        { value: '5', label: '总是' }
      ]),
      scoreMapping: JSON.stringify({
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5
      }),
      sourceReference: 'PHQ-9',
      aiReviewStatus: 'approved',
      sortOrder: 2
    },
    {
      id: 'Q-P-001',
      questionId: 'Q-P-001',
      testTypeId: 'personality',
      questionType: 'multiple-choice',
      questionText: '在社交场合中，您通常感觉如何？',
      options: JSON.stringify([
        { value: 'A', label: '非常自在，喜欢与人交流' },
        { value: 'B', label: '比较自在，但需要时间适应' },
        { value: 'C', label: '有些紧张，更喜欢小团体' },
        { value: 'D', label: '非常紧张，更喜欢独处' }
      ]),
      scoreMapping: JSON.stringify({
        'A': 4,
        'B': 3,
        'C': 2,
        'D': 1
      }),
      sourceReference: 'MBTI',
      aiReviewStatus: 'approved',
      sortOrder: 1
    },
    {
      id: 'Q-S-001',
      questionId: 'Q-S-001',
      testTypeId: 'stress',
      questionType: 'scale',
      questionText: '最近一个月，您感到压力大的频率如何？',
      options: JSON.stringify([
        { value: '1', label: '从不' },
        { value: '2', label: '很少' },
        { value: '3', label: '有时' },
        { value: '4', label: '经常' },
        { value: '5', label: '总是' }
      ]),
      scoreMapping: JSON.stringify({
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5
      }),
      sourceReference: 'PSS',
      aiReviewStatus: 'approved',
      sortOrder: 1
    },
    {
      id: 'Q-A-001',
      questionId: 'Q-A-001',
      testTypeId: 'anxiety',
      questionType: 'scale',
      questionText: '最近一周，您感到紧张或焦虑的频率如何？',
      options: JSON.stringify([
        { value: '1', label: '从不' },
        { value: '2', label: '很少' },
        { value: '3', label: '有时' },
        { value: '4', label: '经常' },
        { value: '5', label: '总是' }
      ]),
      scoreMapping: JSON.stringify({
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5
      }),
      sourceReference: 'GAD-7',
      aiReviewStatus: 'approved',
      sortOrder: 1
    }
  ]
};

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

export interface Pagination {
  currentPage: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  questions: T[];
  pagination: Pagination;
}

export class ApiService {
  private static instance: ApiService;

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // 获取测试类型列表
  async getTestTypes(): Promise<TestType[]> {
    try {
      // 检查网络状态
      const isOnline = await apiClient.checkNetworkStatus();
      
      if (!isOnline) {
        console.log('网络不可用，使用兜底数据');
        return FALLBACK_DATA.testTypes;
      }

      return await apiClient.get<TestType[]>('/test-types', undefined, {
        useCache: true,
        cacheKey: 'test-types'
      });
    } catch (error) {
      console.log('API请求失败，使用兜底数据:', error);
      return FALLBACK_DATA.testTypes;
    }
  }

  // 获取单个测试类型
  async getTestTypeById(id: string): Promise<TestType | null> {
    try {
      const isOnline = await apiClient.checkNetworkStatus();
      
      if (!isOnline) {
        return FALLBACK_DATA.testTypes.find(type => type.id === id) || null;
      }

      return await apiClient.get<TestType>(`/test-types/${id}`);
    } catch (error) {
      return FALLBACK_DATA.testTypes.find(type => type.id === id) || null;
    }
  }

  // 分页获取题目列表
  async getQuestionsByTestType(
    testTypeId: string, 
    page: number = 1, 
    pageSize: number = 20
  ): Promise<PaginatedResponse<Question>> {
    try {
      const isOnline = await apiClient.checkNetworkStatus();
      
      if (!isOnline) {
        console.log('网络不可用，使用兜底数据');
        const questions = FALLBACK_DATA.questions.filter(q => q.testTypeId === testTypeId);
        return {
          questions: questions.slice(0, pageSize),
          pagination: {
            currentPage: page,
            pageSize,
            total: questions.length,
            hasMore: questions.length > pageSize
          }
        };
      }

      return await apiClient.get<PaginatedResponse<Question>>('/questions', {
        test_type_id: testTypeId,
        page,
        page_size: pageSize
      });
    } catch (error) {
      console.log('API请求失败，使用兜底数据:', error);
      const questions = FALLBACK_DATA.questions.filter(q => q.testTypeId === testTypeId);
      return {
        questions: questions.slice(0, pageSize),
        pagination: {
          currentPage: page,
          pageSize,
          total: questions.length,
          hasMore: questions.length > pageSize
        }
      };
    }
  }

  // 获取单个题目
  async getQuestionById(questionId: string): Promise<Question | null> {
    try {
      const isOnline = await apiClient.checkNetworkStatus();
      
      if (!isOnline) {
        return FALLBACK_DATA.questions.find(q => q.id === questionId) || null;
      }

      return await apiClient.get<Question>(`/questions/${questionId}`);
    } catch (error) {
      return FALLBACK_DATA.questions.find(q => q.id === questionId) || null;
    }
  }

  // 搜索题目
  async searchQuestions(keyword: string, testTypeId?: string): Promise<Question[]> {
    try {
      const isOnline = await apiClient.checkNetworkStatus();
      
      if (!isOnline) {
        return FALLBACK_DATA.questions.filter(q => 
          q.questionText.includes(keyword) && 
          (testTypeId ? q.testTypeId === testTypeId : true)
        );
      }

      return await apiClient.get<Question[]>('/questions/search', {
        keyword,
        test_type_id: testTypeId
      });
    } catch (error) {
      return FALLBACK_DATA.questions.filter(q => 
        q.questionText.includes(keyword) && 
        (testTypeId ? q.testTypeId === testTypeId : true)
      );
    }
  }

  // 获取推荐题目（前N道）
  async getRecommendedQuestions(testTypeId: string, count: number = 5): Promise<Question[]> {
    try {
      const isOnline = await apiClient.checkNetworkStatus();
      
      if (!isOnline) {
        return FALLBACK_DATA.questions
          .filter(q => q.testTypeId === testTypeId)
          .slice(0, count);
      }

      return await apiClient.get<Question[]>('/questions/recommended', {
        test_type_id: testTypeId,
        count
      });
    } catch (error) {
      return FALLBACK_DATA.questions
        .filter(q => q.testTypeId === testTypeId)
        .slice(0, count);
    }
  }

  // 获取题目总数
  async getQuestionCountByTestType(testTypeId: string): Promise<number> {
    try {
      const isOnline = await apiClient.checkNetworkStatus();
      
      if (!isOnline) {
        return FALLBACK_DATA.questions.filter(q => q.testTypeId === testTypeId).length;
      }

      const response = await apiClient.get<{ count: number }>(
        `/test-types/${testTypeId}/question-count`
      );
      return response.count;
    } catch (error) {
      return FALLBACK_DATA.questions.filter(q => q.testTypeId === testTypeId).length;
    }
  }

  // 检查是否还有更多题目
  async hasMoreQuestions(testTypeId: string, offset: number): Promise<boolean> {
    try {
      const isOnline = await apiClient.checkNetworkStatus();
      
      if (!isOnline) {
        const total = FALLBACK_DATA.questions.filter(q => q.testTypeId === testTypeId).length;
        return total > offset;
      }

      const response = await apiClient.get<{ hasMore: boolean }>(
        `/questions/has-more`,
        { test_type_id: testTypeId, offset }
      );
      return response.hasMore;
    } catch (error) {
      const total = FALLBACK_DATA.questions.filter(q => q.testTypeId === testTypeId).length;
      return total > offset;
    }
  }

  // 创建用户
  async createUser(nickname: string, avatarUrl?: string): Promise<{ id: string; nickname: string; avatarUrl?: string }> {
    try {
      const isOnline = await apiClient.checkNetworkStatus();
      
      if (!isOnline) {
        // 离线模式下生成临时ID
        return {
          id: `offline-${Date.now()}`,
          nickname,
          avatarUrl
        };
      }

      return await apiClient.post('/users', {
        nickname,
        avatarUrl
      });
    } catch (error) {
      return {
        id: `offline-${Date.now()}`,
        nickname,
        avatarUrl
      };
    }
  }

  // 创建测试记录
  async createTestRecord(data: {
    userId: string;
    testTypeId: string;
    startTime: string;
    endTime?: string;
    totalScore?: number;
    resultSummary?: string;
    improvementSuggestions?: string;
    referenceMaterials?: string;
  }): Promise<{ id: string }> {
    try {
      const isOnline = await apiClient.checkNetworkStatus();
      
      if (!isOnline) {
        return { id: `offline-record-${Date.now()}` };
      }

      return await apiClient.post('/test-records', data);
    } catch (error) {
      return { id: `offline-record-${Date.now()}` };
    }
  }

  // 创建用户答题记录
  async createUserAnswer(data: {
    recordId: string;
    questionId: string;
    userChoice: string;
    scoreObtained: number;
  }): Promise<{ id: string }> {
    try {
      const isOnline = await apiClient.checkNetworkStatus();
      
      if (!isOnline) {
        return { id: `offline-answer-${Date.now()}` };
      }

      return await apiClient.post('/user-answers', data);
    } catch (error) {
      return { id: `offline-answer-${Date.now()}` };
    }
  }

  // 清除缓存
  clearCache(): void {
    apiClient.clearCache();
  }

  // 获取缓存统计
  getCacheStats() {
    return apiClient.getCacheStats();
  }
}

export default ApiService;