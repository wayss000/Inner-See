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
  createdAt: number;
}

export interface UserAnswer {
  id: string;
  recordId: string;
  questionId: string;
  userChoice: string;
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
  questionResults: Array<{
    question: QuestionDetail;
    userAnswer: UserAnswer;
    userChoiceText: string;
  }>;
}