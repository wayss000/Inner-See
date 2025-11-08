/**
 * 心理测试App配色方案
 * 温暖、人文风格的配色，适合全年龄段用户
 */

// 背景渐变
export const BackgroundGradient = {
  primary: ['#fef3e2', '#f5e6d3'] as [string, string], // 温暖米色渐变
  // 备选方案
  alternative1: ['#e8f4f8', '#d4e9f2'] as [string, string], // 浅蓝到浅青
  alternative2: ['#fce4ec', '#f8bbd0'] as [string, string], // 浅粉到粉
};

// 主色调
export const PrimaryColors = {
  main: '#d97757',      // 温暖珊瑚色（替代 #6366f1）
  secondary: '#c0847c', // 柔和玫瑰色（替代 #8b5cf6）
  accent: '#8b7fa8',    // 柔和紫灰（替代青色）
};

// 卡片样式
export const CardColors = {
  background: 'rgba(255, 255, 255, 0.25)', // 卡片背景（从0.15提高到0.25）
  border: 'rgba(255, 255, 255, 0.3)',      // 卡片边框
  shadow: 'rgba(0, 0, 0, 0.1)',            // 柔和阴影
};

// 文字颜色（在浅色背景上）
export const TextColors = {
  primary: '#4a4a4a',   // 主文字（深灰）
  secondary: '#7a7a7a', // 次要文字（中灰）
  tertiary: '#9a9a9a',  // 辅助文字（浅灰）
  // 保留白色文字用于特殊场景（如深色卡片上的文字）
  white: '#ffffff',
  white80: 'rgba(255, 255, 255, 0.8)',
  white60: 'rgba(255, 255, 255, 0.6)',
};

// 按钮颜色
export const ButtonColors = {
  primary: ['#d97757', '#c0847c'] as [string, string], // 主按钮渐变
  secondary: ['#c0847c', '#8b7fa8'] as [string, string], // 次要按钮渐变
  success: ['#10b981', '#059669'] as [string, string], // 成功状态
  error: ['#ef4444', '#dc2626'] as [string, string],   // 错误状态
  disabled: ['#9ca3af', '#6b7280'] as [string, string], // 禁用状态
};

// 测试类型渐变色（保持原有，但可以微调）
export const TestTypeGradients = {
  'mental-health': ['#f472b6', '#a855f7'] as [string, string], // 心理健康
  'personality': ['#60a5fa', '#06b6d4'] as [string, string],   // 人格
  'cognitive': ['#fb923c', '#ef4444'] as [string, string],     // 认知
  'career': ['#2dd4bf', '#06b6d4'] as [string, string],        // 职业
  'relationship': ['#818cf8', '#a855f7'] as [string, string], // 人际
  'life': ['#4ade80', '#3b82f6'] as [string, string],          // 生活
  'custom': ['#f59e0b', '#d97706'] as [string, string],        // 自定义
};

// 导航栏颜色
export const NavigationColors = {
  tabBarActive: '#d97757',      // 底部导航激活色
  tabBarInactive: '#9a9a9a',   // 底部导航未激活色
  tabBarBackground: '#ffffffcc', // 底部导航背景
};

// 旧配色（用于对比和迁移参考）
export const LegacyColors = {
  backgroundGradient: ['#667eea', '#764ba2'] as [string, string],
  primary: '#6366f1',
  secondary: '#8b5cf6',
  cardBackground: 'rgba(255, 255, 255, 0.15)',
};

