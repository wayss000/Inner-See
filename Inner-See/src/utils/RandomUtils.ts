/**
 * 随机选择工具函数
 */

/**
 * 从数组中随机选择指定数量的元素
 * @param array 源数组
 * @param count 要选择的数量
 * @returns 随机选择的元素数组
 */
export function getRandomItems<T>(array: T[], count: number): T[] {
  if (array.length <= count) {
    return [...array];
  }
  
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * 从API获取的测试类型数据转换为UI格式并随机选择
 * @param apiTestTypes 从API获取的测试类型数组
 * @param count 要选择的数量
 * @returns 随机选择的UI格式测试类型数组
 */
export function getRandomTestTypes(apiTestTypes: any[], count: number): any[] {
  // 先转换为UI格式
  const uiTestTypes = apiTestTypes.map(testType => ({
    id: testType.id,
    title: testType.name,
    description: testType.description,
    duration: `${testType.estimatedDuration}分钟`,
    questions: `${testType.questionCount}题`,
    icon: testType.icon,
    gradientColors: getTestTypeGradient(testType.category)
  }));
  
  // 然后随机选择
  return getRandomItems(uiTestTypes, count);
}

/**
 * 根据测试类型分类获取对应的渐变色
 * @param category 测试类型分类
 * @returns 渐变色数组
 */
function getTestTypeGradient(category: string): [string, string, ...string[]] {
  const gradients: Record<string, [string, string, ...string[]]> = {
    '心理健康': ['#f472b6', '#a855f7'],
    '人格': ['#60a5fa', '#06b6d4'],
    '认知': ['#fb923c', '#ef4444'],
    '职业': ['#2dd4bf', '#06b6d4'],
    '人际': ['#818cf8', '#a855f7'],
    '生活': ['#4ade80', '#3b82f6'],
  };
  
  return gradients[category] || ['#f59e0b', '#ea580c'];
}

/**
 * 生成随机的热门测试数据（当API数据不可用时的备用方案）
 * @param count 数量
 * @returns 热门测试数组
 */
export function generateRandomHotTests(count: number): any[] {
  const allHotTests = [
    {
      id: 'depression',
      title: '抑郁症评估',
      description: '专业的抑郁症状筛查，帮助您了解心理状态',
      duration: '5-8分钟',
      difficulty: '简单',
      icon: 'heart',
      gradientColors: ['#f472b6', '#a855f7'],
    },
    {
      id: 'personality',
      title: 'MBTI性格测试',
      description: '经典的16型人格测试，深入了解性格特质',
      duration: '10-15分钟',
      difficulty: '中等',
      icon: 'user',
      gradientColors: ['#60a5fa', '#06b6d4'],
    },
    {
      id: 'stress',
      title: '压力水平评估',
      description: '科学评估当前压力状态，提供缓解建议',
      duration: '3-5分钟',
      difficulty: '简单',
      icon: 'brain',
      gradientColors: ['#fb923c', '#ef4444'],
    },
    {
      id: 'anxiety',
      title: '焦虑症筛查',
      description: '快速评估焦虑症状，提供专业建议',
      duration: '4-6分钟',
      difficulty: '简单',
      icon: 'exclamation-triangle',
      gradientColors: ['#ef4444', '#f97316'],
    },
    {
      id: 'sleep',
      title: '睡眠质量评估',
      description: '分析您的睡眠模式和质量',
      duration: '3-4分钟',
      difficulty: '简单',
      icon: 'moon',
      gradientColors: ['#6b7280', '#374151'],
    },
    {
      id: 'self-esteem',
      title: '自尊心测试',
      description: '评估您的自我价值感和自信心',
      duration: '5-7分钟',
      difficulty: '中等',
      icon: 'star',
      gradientColors: ['#fbbf24', '#f59e0b'],
    }
  ];
  
  return getRandomItems(allHotTests, count);
}

/**
 * 生成随机的测试分类数据（当API数据不可用时的备用方案）
 * @param count 数量
 * @returns 测试分类数组
 */
export function generateRandomCategories(count: number): any[] {
  const allCategories = [
    {
      id: 'mental-health',
      title: '心理健康评估',
      count: '20题',
      icon: 'heart',
      gradientColors: ['#f472b6', '#a855f7'],
    },
    {
      id: 'personality',
      title: '人格特质分析',
      count: '25题',
      icon: 'user',
      gradientColors: ['#60a5fa', '#06b6d4'],
    },
    {
      id: 'cognitive',
      title: '认知能力测试',
      count: '15题',
      icon: 'brain',
      gradientColors: ['#fb923c', '#ef4444'],
    },
    {
      id: 'career',
      title: '职业发展评估',
      count: '18题',
      icon: 'briefcase',
      gradientColors: ['#2dd4bf', '#06b6d4'],
    },
    {
      id: 'relationship',
      title: '人际关系测评',
      count: '16题',
      icon: 'users',
      gradientColors: ['#818cf8', '#a855f7'],
    },
    {
      id: 'quality-of-life',
      title: '生活质量评估',
      count: '14题',
      icon: 'leaf',
      gradientColors: ['#4ade80', '#3b82f6'],
    }
  ];
  
  return getRandomItems(allCategories, count);
}