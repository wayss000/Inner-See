import { apiClient, ApiResponse } from './ApiClient';

// 兜底数据 - 硬编码的5道核心题目
const FALLBACK_DATA = {
  testTypes: [
    {
      id: 'mental-health',
      name: '心理健康评估',
      description: '评估您的情绪状态、压力水平、焦虑程度和抑郁倾向',
      estimatedDuration: 5,
      questionCount: 2,
      category: '心理健康',
      icon: 'heart'
    },
    {
      id: 'personality',
      name: '人格特质分析',
      description: '分析您的性格类型、行为倾向和价值观',
      estimatedDuration: 3,
      questionCount: 1,
      category: '人格',
      icon: 'person'
    },
    {
      id: 'cognitive',
      name: '认知能力测试',
      description: '测试您的逻辑思维、空间想象和语言理解能力',
      estimatedDuration: 15,
      questionCount: 5,
      category: '认知',
      icon: 'brain'
    },
    {
      id: 'career',
      name: '职业发展评估',
      description: '评估您的职业兴趣、工作满意度和职业规划',
      estimatedDuration: 12,
      questionCount: 5,
      category: '职业',
      icon: 'briefcase'
    },
    {
      id: 'relationship',
      name: '人际关系测评',
      description: '评估您的亲密关系、社交能力和沟通风格',
      estimatedDuration: 10,
      questionCount: 5,
      category: '人际',
      icon: 'users'
    },
    {
      id: 'quality-of-life',
      name: '生活质量评估',
      description: '评估您的睡眠质量、生活习惯和情绪管理能力',
      estimatedDuration: 10,
      questionCount: 5,
      category: '生活',
      icon: 'leaf'
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
  ],
  // 按分类组织的完整兜底题目数据
  mentalHealthQuestions: [
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
    }
  ],
  personalityQuestions: [
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
    }
  ],
  cognitiveQuestions: [
    {
      id: 'Q-C-001',
      questionId: 'Q-C-001',
      testTypeId: 'cognitive',
      questionType: 'multiple-choice',
      questionText: '如果所有的A都是B，且所有的B都是C，那么以下哪项必然正确？',
      options: JSON.stringify([
        { value: 'A', label: '所有的C都是A' },
        { value: 'B', label: '所有的A都是C' },
        { value: 'C', label: '只有部分A是C' },
        { value: 'D', label: 'A和C没有关系' }
      ]),
      scoreMapping: JSON.stringify({
        'A': 0,
        'B': 10,
        'C': 0,
        'D': 0
      }),
      sourceReference: '瑞文推理测验',
      aiReviewStatus: 'approved',
      sortOrder: 1
    },
    {
      id: 'Q-C-002',
      questionId: 'Q-C-002',
      testTypeId: 'cognitive',
      questionType: 'multiple-choice',
      questionText: '想象一个正方体，如果将它的每个面都涂成不同的颜色，那么需要几种不同的颜色？',
      options: JSON.stringify([
        { value: 'A', label: '4种' },
        { value: 'B', label: '5种' },
        { value: 'C', label: '6种' },
        { value: 'D', label: '7种' }
      ]),
      scoreMapping: JSON.stringify({
        'A': 0,
        'B': 0,
        'C': 10,
        'D': 0
      }),
      sourceReference: '空间想象测试',
      aiReviewStatus: 'approved',
      sortOrder: 2
    },
    {
      id: 'Q-C-003',
      questionId: 'Q-C-003',
      testTypeId: 'cognitive',
      questionType: 'multiple-choice',
      questionText: '以下哪个词语与"慷慨"意思最接近？',
      options: JSON.stringify([
        { value: 'A', label: '吝啬' },
        { value: 'B', label: '大方' },
        { value: 'C', label: '节俭' },
        { value: 'D', label: '自私' }
      ]),
      scoreMapping: JSON.stringify({
        'A': 0,
        'B': 10,
        'C': 0,
        'D': 0
      }),
      sourceReference: '词汇理解测试',
      aiReviewStatus: 'approved',
      sortOrder: 3
    },
    {
      id: 'Q-C-004',
      questionId: 'Q-C-004',
      testTypeId: 'cognitive',
      questionType: 'scale',
      questionText: '请记住以下数字序列：3, 7, 1, 9, 5。然后回答：第二个数字是什么？',
      options: JSON.stringify([
        { value: '3', label: '3' },
        { value: '7', label: '7' },
        { value: '1', label: '1' },
        { value: '9', label: '9' },
        { value: '5', label: '5' }
      ]),
      scoreMapping: JSON.stringify({
        '3': 0,
        '7': 10,
        '1': 0,
        '9': 0,
        '5': 0
      }),
      sourceReference: '短期记忆测试',
      aiReviewStatus: 'approved',
      sortOrder: 4
    },
    {
      id: 'Q-C-005',
      questionId: 'Q-C-005',
      testTypeId: 'cognitive',
      questionType: 'open-ended',
      questionText: '砖头可以用来做什么？（请列举至少3个用途）',
      options: JSON.stringify([]),
      scoreMapping: JSON.stringify({}),
      sourceReference: '创造力测试',
      aiReviewStatus: 'approved',
      sortOrder: 5
    }
  ],
  careerQuestions: [
    {
      id: 'Q-CV-001',
      questionId: 'Q-CV-001',
      testTypeId: 'career',
      questionType: 'multiple-choice',
      questionText: '您在选择工作时，最看重以下哪些因素？（可多选）',
      options: JSON.stringify([
        { value: 'A', label: '薪资待遇和发展空间' },
        { value: 'B', label: '工作内容和兴趣匹配度' },
        { value: 'C', label: '工作环境和团队氛围' },
        { value: 'D', label: '工作稳定性和福利保障' },
        { value: 'E', label: '社会价值和意义感' }
      ]),
      scoreMapping: JSON.stringify({
        'A': 1,
        'B': 1,
        'C': 1,
        'D': 1,
        'E': 1
      }),
      sourceReference: '霍兰德职业兴趣理论',
      aiReviewStatus: 'approved',
      sortOrder: 1
    },
    {
      id: 'Q-CV-002',
      questionId: 'Q-CV-002',
      testTypeId: 'career',
      questionType: 'scale',
      questionText: '您对目前工作的整体满意度如何？',
      options: JSON.stringify([
        { value: '1', label: '非常不满意' },
        { value: '2', label: '不太满意' },
        { value: '3', label: '一般' },
        { value: '4', label: '比较满意' },
        { value: '5', label: '非常满意' }
      ]),
      scoreMapping: JSON.stringify({
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5
      }),
      sourceReference: '工作满意度量表',
      aiReviewStatus: 'approved',
      sortOrder: 2
    },
    {
      id: 'Q-CV-003',
      questionId: 'Q-CV-003',
      testTypeId: 'career',
      questionType: 'scale',
      questionText: '您在工作中感受到的压力程度如何？',
      options: JSON.stringify([
        { value: '1', label: '几乎没有压力' },
        { value: '2', label: '压力很小' },
        { value: '3', label: '中等程度' },
        { value: '4', label: '压力较大' },
        { value: '5', label: '压力非常大' }
      ]),
      scoreMapping: JSON.stringify({
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5
      }),
      sourceReference: '职业压力量表',
      aiReviewStatus: 'approved',
      sortOrder: 3
    },
    {
      id: 'Q-CV-004',
      questionId: 'Q-CV-004',
      testTypeId: 'career',
      questionType: 'scale',
      questionText: '您对自己的职业发展有清晰的规划吗？',
      options: JSON.stringify([
        { value: '1', label: '完全没有规划' },
        { value: '2', label: '规划很模糊' },
        { value: '3', label: '有一些规划' },
        { value: '4', label: '规划比较清晰' },
        { value: '5', label: '规划非常清晰' }
      ]),
      scoreMapping: JSON.stringify({
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5
      }),
      sourceReference: '职业规划清晰度',
      aiReviewStatus: 'approved',
      sortOrder: 4
    },
    {
      id: 'Q-CV-005',
      questionId: 'Q-CV-005',
      testTypeId: 'career',
      questionType: 'multiple-choice',
      questionText: '您认为自己在以下哪些方面有优势？（可多选）',
      options: JSON.stringify([
        { value: 'A', label: '沟通表达能力' },
        { value: 'B', label: '数据分析能力' },
        { value: 'C', label: '团队协作能力' },
        { value: 'D', label: '创新思维能力' },
        { value: 'E', label: '项目管理能力' }
      ]),
      scoreMapping: JSON.stringify({
        'A': 1,
        'B': 1,
        'C': 1,
        'D': 1,
        'E': 1
      }),
      sourceReference: '职业技能评估',
      aiReviewStatus: 'approved',
      sortOrder: 5
    }
  ],
  relationshipQuestions: [
    {
      id: 'Q-RL-001',
      questionId: 'Q-RL-001',
      testTypeId: 'relationship',
      questionType: 'scale',
      questionText: '在与他人发生分歧时，您通常能够理解对方的立场吗？',
      options: JSON.stringify([
        { value: '1', label: '完全不能理解' },
        { value: '2', label: '很难理解' },
        { value: '3', label: '有时能理解' },
        { value: '4', label: '通常能理解' },
        { value: '5', label: '总是能理解' }
      ]),
      scoreMapping: JSON.stringify({
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5
      }),
      sourceReference: '人际关系质量量表',
      aiReviewStatus: 'approved',
      sortOrder: 1
    },
    {
      id: 'Q-RL-002',
      questionId: 'Q-RL-002',
      testTypeId: 'relationship',
      questionType: 'scale',
      questionText: '您在社交场合中感到自在吗？',
      options: JSON.stringify([
        { value: '1', label: '非常不自在' },
        { value: '2', label: '不太自在' },
        { value: '3', label: '一般' },
        { value: '4', label: '比较自在' },
        { value: '5', label: '非常自在' }
      ]),
      scoreMapping: JSON.stringify({
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5
      }),
      sourceReference: '社交舒适度量表',
      aiReviewStatus: 'approved',
      sortOrder: 2
    },
    {
      id: 'Q-RL-003',
      questionId: 'Q-RL-003',
      testTypeId: 'relationship',
      questionType: 'scale',
      questionText: '您是否善于倾听他人的想法和感受？',
      options: JSON.stringify([
        { value: '1', label: '完全不善于' },
        { value: '2', label: '不太善于' },
        { value: '3', label: '一般' },
        { value: '4', label: '比较善于' },
        { value: '5', label: '非常善于' }
      ]),
      scoreMapping: JSON.stringify({
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5
      }),
      sourceReference: '倾听能力评估',
      aiReviewStatus: 'approved',
      sortOrder: 3
    },
    {
      id: 'Q-RL-004',
      questionId: 'Q-RL-004',
      testTypeId: 'relationship',
      questionType: 'scale',
      questionText: '您在沟通中是否能够清晰地表达自己的想法？',
      options: JSON.stringify([
        { value: '1', label: '完全不能' },
        { value: '2', label: '很难' },
        { value: '3', label: '一般' },
        { value: '4', label: '比较容易' },
        { value: '5', label: '非常容易' }
      ]),
      scoreMapping: JSON.stringify({
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5
      }),
      sourceReference: '表达清晰度',
      aiReviewStatus: 'approved',
      sortOrder: 4
    },
    {
      id: 'Q-RL-005',
      questionId: 'Q-RL-005',
      testTypeId: 'relationship',
      questionType: 'scale',
      questionText: '当与他人发生冲突时，您的第一反应是：',
      options: JSON.stringify([
        { value: '1', label: '逃避，避免面对' },
        { value: '2', label: '防御，保护自己' },
        { value: '3', label: '冷静，寻求理解' },
        { value: '4', label: '攻击，反击对方' },
        { value: '5', label: '合作，寻求解决' }
      ]),
      scoreMapping: JSON.stringify({
        '1': 1,
        '2': 2,
        '3': 5,
        '4': 1,
        '5': 5
      }),
      sourceReference: '冲突反应模式',
      aiReviewStatus: 'approved',
      sortOrder: 5
    }
  ],
  qualityOfLifeQuestions: [
    {
      id: 'Q-LQ-001',
      questionId: 'Q-LQ-001',
      testTypeId: 'quality-of-life',
      questionType: 'scale',
      questionText: '您对自己的睡眠质量满意吗？',
      options: JSON.stringify([
        { value: '1', label: '非常不满意' },
        { value: '2', label: '不太满意' },
        { value: '3', label: '一般' },
        { value: '4', label: '比较满意' },
        { value: '5', label: '非常满意' }
      ]),
      scoreMapping: JSON.stringify({
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5
      }),
      sourceReference: '匹兹堡睡眠质量指数',
      aiReviewStatus: 'approved',
      sortOrder: 1
    },
    {
      id: 'Q-LQ-002',
      questionId: 'Q-LQ-002',
      testTypeId: 'quality-of-life',
      questionType: 'scale',
      questionText: '您的饮食习惯健康吗？',
      options: JSON.stringify([
        { value: '1', label: '非常不健康' },
        { value: '2', label: '比较不健康' },
        { value: '3', label: '一般' },
        { value: '4', label: '比较健康' },
        { value: '5', label: '非常健康' }
      ]),
      scoreMapping: JSON.stringify({
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5
      }),
      sourceReference: '饮食习惯评估',
      aiReviewStatus: 'approved',
      sortOrder: 2
    },
    {
      id: 'Q-LQ-003',
      questionId: 'Q-LQ-003',
      testTypeId: 'quality-of-life',
      questionType: 'scale',
      questionText: '您是否有规律的运动习惯？',
      options: JSON.stringify([
        { value: '1', label: '完全没有' },
        { value: '2', label: '很少运动' },
        { value: '3', label: '偶尔运动' },
        { value: '4', label: '经常运动' },
        { value: '5', label: '每天运动' }
      ]),
      scoreMapping: JSON.stringify({
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5
      }),
      sourceReference: '运动习惯评估',
      aiReviewStatus: 'approved',
      sortOrder: 3
    },
    {
      id: 'Q-LQ-004',
      questionId: 'Q-LQ-004',
      testTypeId: 'quality-of-life',
      questionType: 'scale',
      questionText: '您是否能够有效管理自己的情绪？',
      options: JSON.stringify([
        { value: '1', label: '完全不能' },
        { value: '2', label: '很难' },
        { value: '3', label: '一般' },
        { value: '4', label: '比较容易' },
        { value: '5', label: '非常容易' }
      ]),
      scoreMapping: JSON.stringify({
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5
      }),
      sourceReference: '情绪调节能力',
      aiReviewStatus: 'approved',
      sortOrder: 4
    },
    {
      id: 'Q-LQ-005',
      questionId: 'Q-LQ-005',
      testTypeId: 'quality-of-life',
      questionType: 'scale',
      questionText: '您的工作与生活平衡吗？',
      options: JSON.stringify([
        { value: '1', label: '完全不平衡（工作占主导）' },
        { value: '2', label: '比较不平衡' },
        { value: '3', label: '一般' },
        { value: '4', label: '比较平衡' },
        { value: '5', label: '非常平衡' }
      ]),
      scoreMapping: JSON.stringify({
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5
      }),
      sourceReference: '工作生活平衡评估',
      aiReviewStatus: 'approved',
      sortOrder: 5
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
    // 特殊处理自定义测试
    if (id === 'custom') {
      return {
        id: 'custom',
        name: '自定义测试',
        description: '根据您的需求定制专属心理健康测试',
        estimatedDuration: 10, // 默认时长
        questionCount: 5, // 默认题数
        category: '自定义',
        icon: 'puzzle-piece'
      };
    }
    
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
        // 根据testTypeId返回对应的兜底题目
        let questions: Question[] = [];
        
        switch (testTypeId) {
          case 'mental-health':
            questions = FALLBACK_DATA.mentalHealthQuestions;
            break;
          case 'personality':
            questions = FALLBACK_DATA.personalityQuestions;
            break;
          case 'cognitive':
            questions = FALLBACK_DATA.cognitiveQuestions;
            break;
          case 'career':
            questions = FALLBACK_DATA.careerQuestions;
            break;
          case 'relationship':
            questions = FALLBACK_DATA.relationshipQuestions;
            break;
          case 'quality-of-life':
            questions = FALLBACK_DATA.qualityOfLifeQuestions;
            break;
          default:
            // 默认返回心理健康题目
            questions = FALLBACK_DATA.mentalHealthQuestions;
            break;
        }
        
        return questions.slice(0, count);
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