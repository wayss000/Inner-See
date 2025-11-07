/**
 * AI相关类型定义
 */

// 万青API 请求接口
export interface WanQingRequest {
  model: string;
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  temperature: number;
}

// 万青API 响应接口
export interface WanQingResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: "assistant";
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// AI分析请求数据
export interface AIRequestData {
  testInfo: {
    testType: string;
    testQuestions: Array<{
      id: string;
      content: string;
      options: string[];
      userAnswer: string;
      correctAnswer: string;
    }>;
    userScore: number;
    testResult: string;
  };
  userSupplement: string;
}

// AI分析结果
export interface AIAnalysisResult {
  currentSituation: string;
  adjustmentSuggestions: string;
 注意事项: string;
  disclaimer: string;
  fullResponse: string;
}

// 问AI按钮状态
export type AIButtonState = 'idle' | 'loading' | 'completed' | 'error' | 'viewable' | 'regenerating';

// 自定义测试配置
export interface CustomTestConfig {
  mode: 'interactive' | 'direct';
  selectedCategories?: string[];
  userDescription?: string;
}

// AI生成的测试题目
export interface GeneratedTestQuestion {
  id: string;
  content: string;
  options: string[];
  correctAnswer: string;
  category: string;
  difficulty: string;
}

// AI生成的测试
export interface GeneratedTest {
  id: string;
  title: string;
  description: string;
  questions: GeneratedTestQuestion[];
  estimatedDuration: number;
  category: string;
  difficulty: string;
}

// AI分析状态
export interface AIAnalysisState {
  status: 'idle' | 'analyzing' | 'completed' | 'error' | 'viewing' | 'regenerating';
  result: AIAnalysisResult | null;
  error: string | null;
  hasSavedResult: boolean;
}