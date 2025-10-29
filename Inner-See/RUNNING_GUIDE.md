# 心探App SQLite数据库集成运行指南

## 🎯 快速开始

### 1. 安装依赖
```bash
cd Inner-See
npm install
```

### 2. 启动应用
```bash
npx expo start
```

## 🔧 代码运行说明

### 应用初始化（自动执行）

在 `app/_layout.tsx` 文件中，我已经添加了自动初始化代码：

```typescript
// 应用初始化
useEffect(() => {
  if (!appInitialized) {
    initializeApp();
    appInitialized = true;
  }
}, []);

const initializeApp = async () => {
  try {
    console.log('开始应用初始化...');
    await LazyLoadingAppInitializer.getInstance().initializeApp();
    console.log('应用初始化完成');
  } catch (error) {
    console.error('应用初始化失败:', error);
  }
};
```

**这意味着：当你启动应用时，数据库会自动初始化，你不需要手动运行任何代码！**

### 页面数据读取（自动执行）

在 `screens/p-test_category/index.tsx` 文件中，我已经添加了自动数据读取代码：

```typescript
const loadTestTypes = async () => {
  try {
    setLoading(true);
    
    // 使用懒加载服务获取测试类型
    const questionService = LazyLoadingQuestionService.getInstance();
    await questionService.initialize();
    
    const testTypesFromDB = await questionService.getTestTypes();
    setTestTypesData(testTypesFromDB);
    
    // 转换为UI组件需要的格式
    const uiTestTypes: TestType[] = testTypesFromDB.map(testType => ({
      id: testType.id,
      title: testType.name,
      description: testType.description,
      duration: `${testType.estimatedDuration}分钟`,
      questions: `${testType.questionCount}题`,
      icon: testType.icon,
      gradientColors: ['#f59e0b', '#ea580c']
    }));
    
    setDisplayTestTypes(uiTestTypes);
    console.log(`成功加载 ${testTypesFromDB.length} 个测试类型`);
  } catch (error) {
    console.error('加载测试类型失败:', error);
    // 回退到模拟数据
    // ...
  } finally {
    setLoading(false);
  }
};
```

**这意味着：当你访问测试分类页面时，会自动从数据库读取测试类型数据，你不需要手动运行任何代码！**

## 📱 实际操作步骤

### 步骤1：启动应用
```bash
cd Inner-See
npm install  # 如果还没有安装依赖
npx expo start
```

### 步骤2：查看控制台输出
启动后，你会在终端中看到类似这样的日志：
```
开始应用初始化...
使用预打包的数据库文件
数据库初始化成功
预打包数据库连接初始化完成
数据库中包含 6 个测试类型
测试类型 "心理健康评估" 包含 20 道题目
测试类型 "人格特质分析" 包含 25 道题目
...
应用初始化完成
```

### 步骤3：访问测试分类页面
在Expo开发工具中，点击 `p-test_category` 页面，你会看到：
- 加载动画
- 成功加载6个测试类型
- 每个测试类型的名称、描述、时长和题目数量

### 步骤4：查看页面日志
在浏览器控制台或Expo控制台中，你会看到：
```
成功加载 6 个测试类型
```

## 🔍 如果遇到问题

### 问题1：依赖安装失败
**解决方法：**
```bash
cd Inner-See
rm -rf node_modules package-lock.json
npm install
```

### 问题2：数据库连接失败
**解决方法：**
检查是否正确安装了expo-sqlite：
```bash
npm install expo-sqlite
```

### 问题3：页面显示模拟数据而不是数据库数据
**解决方法：**
检查控制台错误信息，通常是因为数据库初始化失败，应用会自动回退到模拟数据。

## 📊 验证数据库是否正常工作

### 方法1：查看控制台日志
启动应用后，查看终端输出，应该看到：
- "数据库初始化成功"
- "成功加载 X 个测试类型"

### 方法2：在页面中添加调试代码
在 `screens/p-test_category/index.tsx` 的 `loadTestTypes` 函数中，我已经添加了调试日志：

```typescript
console.log(`成功加载 ${testTypesFromDB.length} 个测试类型`);
```

### 方法3：检查数据库文件
在开发环境中，数据库文件通常位于：
- iOS: `~/Library/Developer/CoreSimulator/Devices/[device-id]/data/Containers/Data/Application/[app-id]/Documents/SQLite/xin-tan.db`
- Android: 应用的私有存储目录
- Web: 浏览器的IndexedDB

## 🚀 开发阶段构建完整数据库

如果你需要从questions/题目库.md文件导入1471道题目，需要在开发机器上运行以下代码：

```typescript
import { DatabaseBuilder } from './src/database/DatabaseBuilder';

const builder = DatabaseBuilder.getInstance();

// 构建预打包数据库
await builder.buildPrepackagedDatabase();

// 从Markdown导入完整题库
await builder.importQuestionsFromMarkdown();

// 导出统计信息
const stats = await builder.exportDatabaseStats();
```

**注意：这个功能需要在Node.js环境中运行，不能在React Native应用中直接使用。**

## 📝 总结

### 你不需要手动运行的代码：
- ✅ 应用初始化代码已经自动添加到 `app/_layout.tsx`
- ✅ 页面数据读取代码已经自动添加到 `screens/p-test_category/index.tsx`

### 你只需要做的：
1. 安装依赖：`npm install`
2. 启动应用：`npx expo start`
3. 查看控制台和页面输出

### 预期结果：
- 应用启动时自动初始化数据库
- 测试分类页面自动从数据库读取6个测试类型
- 控制台显示成功日志
- 页面显示完整的测试类型列表

现在你可以直接运行 `npx expo start` 来测试完整的SQLite集成功能了！