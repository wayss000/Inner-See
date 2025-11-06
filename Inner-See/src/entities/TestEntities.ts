export interface TestRecord {
  id: string;
  userId: string;
  testTypeId: string;
  startTime: number;
  endTime?: number;
  totalScore?: number;
  resultSummary?: string;
  improvementSuggestions?: string;
  referenceMaterials?: string;
  aiAnalysisResult?: string; // AI分析结果JSON字符串
  createdAt: number;
}

export interface UserAnswer {
  id: string;
  recordId: string;
  questionId: string;
  // 冗余数据：完整的题目信息
  questionText: string;        // 题目文本
  questionType: string;        // 题型
  optionsJson: string;         // 选项JSON
  // 冗余数据：用户选择的可读信息
  userChoice: string;
  userChoiceText: string;      // 用户选择的可读文本
  scoreObtained: number;
  createdAt: number;
}

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

export interface QuestionDetail {
  id: string;
  text: string;
  type: 'single_choice' | 'scale';
  options: Array<{
    value: number | string;
    text: string;
  }>;
}

export interface AIAnalysisResult {
  currentSituation: string;
  adjustmentSuggestions: string;
  注意事项: string;
  disclaimer: string;
  fullResponse: string;
}

export interface TestResultWithDetails {
  testName: string;
  score: number;
  level: string;
  levelPercentage: number;
  interpretation: string[];
  suggestions: Array<{
    title: string;
    text: string;
    icon: string;
  }>;
  aiAnalysisResult?: AIAnalysisResult | null;
  questionResults: Array<{
    question: QuestionDetail;
    userAnswer: UserAnswer;
    userChoiceText: string;
  }>;
}

export interface User {
  id: string;
  nickname: string;
  avatarEmoji: string;
  joinDate: number;
  testCount?: number;
  testDays?: number;
  gender?: '男' | '女' | '其他';
  age?: number;
  occupation?: string;
  selectedModel: string;
  created_at?: number;
  updated_at?: number;
}