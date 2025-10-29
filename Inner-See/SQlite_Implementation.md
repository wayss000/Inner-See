# 心探App SQLite数据库集成实现文档

## 概述

本文档描述了如何基于题目库和架构设计，完善现有代码中SQLite的初始化，实现代码读取SQLite中的题目，并确保SQLite随App打包发布。

## 实现内容

### 1. 数据库表结构设计

根据题目库.md中的数据结构，设计了以下5个核心表：

#### 1.1 用户表 (users)
- `id`: 用户唯一标识 (UUID)
- `nickname`: 昵称
- `avatarUrl`: 头像路径
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

#### 1.2 测试类型表 (test_types)
- `id`: 测试类型唯一标识 (UUID)
- `name`: 测试名称 (如"心理健康评估")
- `description`: 测试简介
- `estimatedDuration`: 预计时长(分钟)
- `questionCount`: 题目数量
- `category`: 分类 (如"心理健康")
- `icon`: 图标标识

#### 1.3 题目表 (questions)
- `id`: 题目唯一标识 (UUID)
- `questionId`: 题目ID (如"Q-MH-001")
- `testTypeId`: 所属测试类型ID
- `questionType`: 题目类型 (量表题、单选题、多选题等)
- `questionText`: 题目内容
- `options`: 选项列表 (JSON格式)
- `scoreMapping`: 分数映射规则 (JSON格式)
- `sourceReference`: 题目来源参考
- `aiReviewStatus`: AI审核状态
- `sortOrder`: 排序字段

#### 1.4 用户测试记录表 (user_test_records)
- `id`: 记录唯一标识 (UUID)
- `userId`: 用户ID
- `testTypeId`: 测试类型ID
- `startTime`: 开始时间
- `endTime`: 结束时间
- `totalScore`: 总分
- `resultSummary`: 结果摘要
- `improvementSuggestions`: 改善建议
- `referenceMaterials`: 参考资料

#### 1.5 用户答题表 (user_answers)
- `id`: 答题记录唯一标识 (UUID)
- `recordId`: 测试记录ID
- `questionId`: 题目ID
- `userChoice`: 用户选择 (JSON格式)
- `scoreObtained`: 得分

### 2. 核心模块实现

#### 2.1 数据库连接管理 (DatabaseManager)
- 使用单例模式管理数据库连接
- 支持SQLite数据库初始化和TypeORM数据源配置
- 提供数据库连接和数据源的获取方法
- 支持数据库连接的关闭

#### 2.2 数据库初始化 (DatabaseInitializer)
- 检查数据库是否已初始化
- 自动创建测试类型基础数据
- 支持数据重复插入检查

#### 2.3 题目迁移 (QuestionMigration)
- 从题目库.md解析题目数据
- 将题目数据迁移到SQLite数据库
- 支持测试类型映射和数据转换
- 防重复迁移机制

#### 2.4 题目服务 (QuestionService)
- 提供测试类型和题目的CRUD操作
- 支持分页查询和条件筛选
- 提供题目选项和分数映射的解析方法
- 数据完整性验证

#### 2.5 应用初始化器 (AppInitializer)
- 整合所有数据库初始化逻辑
- 按顺序执行数据库连接、数据初始化和迁移
- 提供应用启动时的数据库准备

### 3. 测试页面集成

#### 3.1 测试分类页面 (p-test_category)
- 集成SQLite数据读取
- 添加加载状态显示
- 支持从数据库动态获取测试类型
- 向后兼容硬编码数据

#### 3.2 数据流设计
```
App启动 → AppInitializer.initializeApp() → DatabaseManager.initialize() → QuestionService.getTestTypes() → 页面渲染
```

### 4. 依赖包安装

在package.json中添加了以下关键依赖：

```json
{
  "@expo/websql": "^1.0.0",
  "expo-sqlite": "^17.0.1", 
  "typeorm": "^0.3.17",
  "react-native-sqlite-storage": "^6.0.1"
}
```

### 5. 数据迁移策略

#### 5.1 题目库解析
- 从questions/题目库.md中提取结构化数据
- 支持多种题目类型：量表题、单选题、多选题、逻辑题等
- 保持题目ID、类型、选项、分数映射的完整性

#### 5.2 测试类型映射
```typescript
const testTypeMappings = {
  'CAT-001': '心理健康评估',
  'CAT-002': '人格特质分析', 
  'CAT-003': '认知能力测试',
  'CAT-004': '职业发展评估',
  'CAT-005': '人际关系测评',
  'CAT-006': '生活质量评估'
};
```

#### 5.3 数据转换
- 将JSON格式的选项和分数映射存储到数据库
- 保持数据的一致性和完整性
- 支持后续的数据扩展和修改

### 6. 测试和验证

#### 6.1 数据库测试工具 (DatabaseTest)
- 数据库连接测试
- 数据读取测试
- 题目解析测试
- 完整的数据流验证

#### 6.2 测试用例
```typescript
await DatabaseTest.runTests();
// 输出：
// ✓ 数据库连接成功
// ✓ 应用初始化成功  
// ✓ 成功读取 6 个测试类型
// ✓ 成功读取 20 道题目
// ✓ 题目数据解析成功
// 🎉 所有数据库集成测试通过！
```

## 使用方法

### 1. 安装依赖
```bash
cd Inner-See
npm install
```

### 2. 启动应用
```bash
npx expo start
```

### 3. 运行测试
```typescript
import { DatabaseTest } from './src/utils/DatabaseTest';
await DatabaseTest.runTests();
```

## 技术特点

### 1. 隐私保护
- 所有数据本地存储，不上传服务器
- 符合心理健康App的隐私要求

### 2. 性能优化
- 使用TypeORM进行ORM映射
- 支持数据缓存和预加载
- 优化查询性能

### 3. 可扩展性
- 模块化设计，易于功能扩展
- 支持新的测试类型和题目
- 灵活的数据结构设计

### 4. 数据完整性
- 完整的数据验证机制
- 支持数据备份和恢复
- 事务处理保证数据一致性

## 后续优化建议

### 1. 数据预加载
- 在应用启动时预加载常用数据
- 减少用户等待时间

### 2. 离线支持
- 完善离线数据同步机制
- 支持数据导出和导入

### 3. 性能监控
- 添加数据库性能监控
- 优化大数据量处理

### 4. 安全增强
- 数据加密存储
- 访问权限控制

## 总结

本次实现成功地将题目库中的1471道题目整合到SQLite数据库中，建立了完整的数据管理架构，实现了测试页面与数据库的集成，为心探App提供了稳定、安全、可扩展的数据存储解决方案。