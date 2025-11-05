/**
 * AI相关类型定义
 */

// KAT-Coder-Pro API 请求接口
export interface KATCoderProRequest {
  model: "KAT-Coder-Pro";
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  temperature: number;
}

// KAT-Coder-Pro API 响应接口
export interface KATCoderProResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
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
export type AIButtonState = 'idle' | 'loading' | 'completed' | 'error';

// AI分析状态
export interface AIAnalysisState {
  status: 'idle' | 'analyzing' | 'completed' | 'error';
  result: AIAnalysisResult | null;
  error: string | null;
}