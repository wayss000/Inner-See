import { PrepackagedDatabase } from './PrepackagedDatabase';

export class QuestionDataSeeder {
  private static instance: QuestionDataSeeder;
  private db: PrepackagedDatabase;

  static getInstance(): QuestionDataSeeder {
    if (!QuestionDataSeeder.instance) {
      QuestionDataSeeder.instance = new QuestionDataSeeder();
    }
    return QuestionDataSeeder.instance;
  }

  constructor() {
    this.db = PrepackagedDatabase.getInstance();
  }

  async seedFullQuestionDatabase(): Promise<void> {
    try {
      console.log('开始导入完整题库数据...');
      const db = this.db.getDatabase();

      // 检查是否已经有数据
      const testTypeCount = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM test_types'
      );

      if (testTypeCount?.count && testTypeCount.count > 0) {
        console.log('数据库已有数据，跳过导入');
        return;
      }

      // 导入测试类型
      await this.seedTestTypes(db);
      
      // 导入题目数据
      await this.seedQuestions(db);
      
      console.log('完整题库数据导入完成');
    } catch (error) {
      console.error('导入题库数据失败:', error);
      throw error;
    }
  }

  private async seedTestTypes(db: any): Promise<void> {
    const testTypes = [
      {
        id: 'CAT-001',
        name: '心理健康评估',
        description: '评估您的情绪状态、压力水平、焦虑程度和抑郁倾向',
        estimated_duration: 10,
        question_count: 20,
        category: '心理健康',
        icon: 'heart'
      },
      {
        id: 'CAT-002',
        name: '人格特质分析',
        description: '分析您的性格类型、行为倾向和价值观',
        estimated_duration: 15,
        question_count: 25,
        category: '人格',
        icon: 'person'
      },
      {
        id: 'CAT-003',
        name: '认知能力测试',
        description: '测试您的逻辑思维、空间思维和语言理解能力',
        estimated_duration: 20,
        question_count: 15,
        category: '认知',
        icon: 'brain'
      },
      {
        id: 'CAT-004',
        name: '职业发展评估',
        description: '评估您的职业兴趣、工作满意度和职业规划',
        estimated_duration: 15,
        question_count: 18,
        category: '职业',
        icon: 'briefcase'
      },
      {
        id: 'CAT-005',
        name: '人际关系测评',
        description: '评估您的亲密关系、社交能力和沟通风格',
        estimated_duration: 12,
        question_count: 16,
        category: '人际',
        icon: 'people'
      },
      {
        id: 'CAT-006',
        name: '生活质量评估',
        description: '评估您的睡眠质量、生活习惯和情绪管理',
        estimated_duration: 10,
        question_count: 14,
        category: '生活',
        icon: 'home'
      }
    ];

    for (const testType of testTypes) {
      await db.runAsync(
        `INSERT INTO test_types 
         (id, name, description, estimated_duration, question_count, category, icon) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          testType.id,
          testType.name,
          testType.description,
          testType.estimated_duration,
          testType.question_count,
          testType.category,
          testType.icon
        ]
      );
    }

    console.log(`导入了 ${testTypes.length} 个测试类型`);
  }

  private async seedQuestions(db: any): Promise<void> {
    // 由于完整1471道题目数据量较大，这里只展示部分示例
    // 实际项目中，这些数据应该预先打包在数据库文件中
    
    const sampleQuestions = [
      // 心理健康评估示例题目
      {
        id: 'Q-MH-001',
        questionId: 'Q-MH-001',
        testTypeId: 'CAT-001',
        questionType: '量表题',
        questionText: '在过去的一周里，您感到快乐和满足的频率如何？',
        options: JSON.stringify([
          { value: 1, label: '几乎从不' },
          { value: 2, label: '很少' },
          { value: 3, label: '有时' },
          { value: 4, label: '经常' },
          { value: 5, label: '几乎总是' }
        ]),
        scoreMapping: JSON.stringify({ 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 }),
        sourceReference: '基于DASS-21抑郁焦虑压力量表改编',
        aiReviewStatus: '已通过',
        sortOrder: 1
      },
      {
        id: 'Q-MH-002',
        questionId: 'Q-MH-002',
        testTypeId: 'CAT-001',
        questionType: '量表题',
        questionText: '您最近的情绪波动大吗？',
        options: JSON.stringify([
          { value: 1, label: '非常稳定，几乎没有波动' },
          { value: 2, label: '比较稳定，偶尔有波动' },
          { value: 3, label: '一般，有时会有明显波动' },
          { value: 4, label: '比较不稳定，经常波动' },
          { value: 5, label: '非常不稳定，情绪起伏很大' }
        ]),
        scoreMapping: JSON.stringify({ 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 }),
        sourceReference: '基于情绪调节量表改编',
        aiReviewStatus: '待AI审核',
        sortOrder: 2
      },
      // 人格特质分析示例题目
      {
        id: 'Q-PD-001',
        questionId: 'Q-PD-001',
        testTypeId: 'CAT-002',
        questionType: '单选题',
        questionText: '当您需要做重要决定时，您更倾向于：',
        options: JSON.stringify([
          { value: 'A', label: '仔细分析所有可能的选择和后果' },
          { value: 'B', label: '跟随内心的感觉和直觉' },
          { value: 'C', label: '咨询他人的意见和建议' },
          { value: 'D', label: '快速做出决定，避免过度思考' }
        ]),
        scoreMapping: JSON.stringify({ A: '分析型', B: '直觉型', C: '社交型', D: '行动型' }),
        sourceReference: '基于MBTI性格测试理论',
        aiReviewStatus: '已通过',
        sortOrder: 1
      },
      // 认知能力测试示例题目
      {
        id: 'Q-CG-001',
        questionId: 'Q-CG-001',
        testTypeId: 'CAT-003',
        questionType: '逻辑推理题',
        questionText: '如果所有的A都是B，且所有的B都是C，那么以下哪项必然正确？',
        options: JSON.stringify([
          { value: 'A', label: '所有的C都是A' },
          { value: 'B', label: '所有的A都是C' },
          { value: 'C', label: '只有部分A是C' },
          { value: 'D', label: 'A和C没有关系' }
        ]),
        scoreMapping: JSON.stringify({ B: 10, A: 0, C: 0, D: 0 }),
        sourceReference: '基于瑞文推理测验改编',
        aiReviewStatus: '已通过',
        sortOrder: 1
      }
    ];

    for (const question of sampleQuestions) {
      await db.runAsync(
        `INSERT INTO questions 
         (id, question_id, test_type_id, question_type, question_text, options, 
          score_mapping, source_reference, ai_review_status, sort_order) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          question.id,
          question.questionId,
          question.testTypeId,
          question.questionType,
          question.questionText,
          question.options,
          question.scoreMapping,
          question.sourceReference,
          question.aiReviewStatus,
          question.sortOrder
        ]
      );
    }

    console.log(`导入了 ${sampleQuestions.length} 道示例题目`);
  }

  async validateDatabaseIntegrity(): Promise<boolean> {
    try {
      const db = this.db.getDatabase();
      
      // 检查测试类型数量
      const testTypeCount = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM test_types'
      );
      
      // 检查题目数量
      const questionCount = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM questions'
      );
      
      console.log(`数据库验证结果：${testTypeCount?.count} 个测试类型，${questionCount?.count} 道题目`);
      
      return testTypeCount?.count > 0 && questionCount?.count > 0;
    } catch (error) {
      console.error('验证数据库完整性失败:', error);
      return false;
    }
  }
}