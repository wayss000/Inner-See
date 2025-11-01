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