import { TestRecord as DbTestRecord } from '../entities/TestEntities';

/**
 * 测试类型配置映射
 * 基于 ApiService.ts 中的6种测试类型
 */
export interface TestTypeConfig {
  id: string;
  name: string;
  icon: string;
  gradientColors: [string, string, ...string[]];
  levelColor?: string;
}

export const TEST_TYPE_CONFIGS: Record<string, TestTypeConfig> = {
  'mental-health': {
    id: 'mental-health',
    name: '心理健康评估',
    icon: 'heart',
    gradientColors: ['#f472b6', '#a855f7'],
    levelColor: '#fb923c'
  },
  'personality': {
    id: 'personality',
    name: '人格特质分析',
    icon: 'user',
    gradientColors: ['#60a5fa', '#06b6d4']
  },
  'cognitive': {
    id: 'cognitive',
    name: '认知能力测试',
    icon: 'brain',
    gradientColors: ['#fb923c', '#ef4444'],
    levelColor: '#4ade80'
  },
  'career': {
    id: 'career',
    name: '职业发展评估',
    icon: 'briefcase',
    gradientColors: ['#2dd4bf', '#06b6d4']
  },
  'relationship': {
    id: 'relationship',
    name: '人际关系测评',
    icon: 'users',
    gradientColors: ['#818cf8', '#a855f7']
  },
  'quality-of-life': {
    id: 'quality-of-life',
    name: '生活质量评估',
    icon: 'leaf',
    gradientColors: ['#4ade80', '#3b82f6'],
    levelColor: '#4ade80'
  },
  'custom': {
    id: 'custom',
    name: '自定义测试',
    icon: 'puzzle-piece',
    gradientColors: ['#f59e0b', '#d97706'],
    levelColor: '#f59e0b'
  },
  'stress': {
    id: 'stress',
    name: '压力水平评估',
    icon: 'wave-pulse',
    gradientColors: ['#f97316', '#ef4444'],
    levelColor: '#fbbf24'
  },
  'anxiety': {
    id: 'anxiety',
    name: '焦虑症筛查',
    icon: 'wind',
    gradientColors: ['#8b5cf6', '#ec4899'],
    levelColor: '#f472b6'
  },
  'mbti': {
    id: 'mbti',
    name: 'MBTI性格测试',
    icon: 'users-gear',
    gradientColors: ['#06b6d4', '#60a5fa'],
    levelColor: '#3b82f6'
  }
};

/**
 * 时间格式化工具函数
 * 3天内使用相对时间，超过3天使用具体日期
 */
export function formatTestTime(timestamp: number): string {
  const now = Date.now();
  const testTime = new Date(timestamp);
  const diffMs = now - timestamp;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  // 格式化时间为 HH:mm 格式
  const timeString = testTime.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // 3天内使用相对时间
  if (diffDays === 0) {
    return `今天 ${timeString}`;
  } else if (diffDays === 1) {
    return `昨天 ${timeString}`;
  } else if (diffDays === 2) {
    return `2天前 ${timeString}`;
  } else if (diffDays === 3) {
    return `3天前 ${timeString}`;
  } else {
    // 超过3天使用具体日期格式
    const dateString = testTime.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return `${dateString} ${timeString}`;
  }
}

/**
 * 将数据库测试记录转换为UI组件所需格式
 */
export interface UITestRecord {
  id: string;
  title: string;
  time: string;
  score?: number;
  level?: string;
  type?: string;
  description?: string;
  icon: string;
  gradientColors: [string, string, ...string[]];
  levelColor?: string;
  testTypeId?: string; // 添加测试类型ID字段用于前端区分
  isCustomTest?: boolean; // 添加自定义测试标识字段
}

export function convertDbRecordToUI(dbRecord: DbTestRecord): UITestRecord {
  const config = TEST_TYPE_CONFIGS[dbRecord.testTypeId] || TEST_TYPE_CONFIGS['mental-health'];
  
  console.log('convertDbRecordToUI 转换数据:', {
    originalTestTypeId: dbRecord.testTypeId,
    configName: config.name,
    configIcon: config.icon,
    isCustomTest: dbRecord.testTypeId === 'custom'
  });
  
  return {
    id: dbRecord.id,
    title: config.name,
    time: formatTestTime(dbRecord.createdAt),
    score: dbRecord.totalScore,
    level: dbRecord.resultSummary,
    type: dbRecord.testTypeId === 'personality' && dbRecord.resultSummary ? dbRecord.resultSummary : undefined,
    description: dbRecord.testTypeId === 'personality' && dbRecord.resultSummary ? `${dbRecord.resultSummary}类型` : undefined,
    icon: config.icon,
    gradientColors: config.gradientColors,
    levelColor: config.levelColor,
    testTypeId: dbRecord.testTypeId,
    isCustomTest: dbRecord.testTypeId === 'custom'
  };
}

/**
 * 分页配置
 */
export const PAGINATION_CONFIG = {
  pageSize: 10,
  loadMoreThreshold: 0.8 // 滚动到80%时加载更多
};