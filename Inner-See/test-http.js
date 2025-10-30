// HTTP接口集成测试脚本
import { ApiService } from './src/services/ApiService';

async function testHttpIntegration() {
  console.log('开始测试HTTP接口集成...');
  
  try {
    const apiService = ApiService.getInstance();
    
    // 测试1: 获取测试类型
    console.log('\n--- 测试1: 获取测试类型 ---');
    const testTypes = await apiService.getTestTypes();
    console.log('测试类型数量:', testTypes.length);
    console.log('测试类型列表:', testTypes.map(t => ({ id: t.id, name: t.name })));
    
    // 测试2: 获取题目
    console.log('\n--- 测试2: 获取题目 ---');
    if (testTypes.length > 0) {
      const firstTestType = testTypes[0];
      const questions = await apiService.getQuestionsByTestType(firstTestType.id, 1, 5);
      console.log('题目数量:', questions.questions.length);
      console.log('题目列表:', questions.questions.map(q => ({ 
        id: q.id, 
        questionText: q.questionText.substring(0, 50) + '...' 
      })));
    }
    
    // 测试3: 搜索题目
    console.log('\n--- 测试3: 搜索题目 ---');
    const searchResults = await apiService.searchQuestions('情绪');
    console.log('搜索结果数量:', searchResults.length);
    console.log('搜索结果:', searchResults.map(q => ({ 
      id: q.id, 
      questionText: q.questionText.substring(0, 50) + '...' 
    })));
    
    // 测试4: 获取缓存统计
    console.log('\n--- 测试4: 缓存统计 ---');
    const cacheStats = apiService.getCacheStats();
    console.log('缓存项目数量:', cacheStats.size);
    
    console.log('\n✅ HTTP接口集成测试完成！');
    
  } catch (error) {
    console.error('❌ HTTP接口集成测试失败:', error);
  }
}

// 如果直接运行此文件，执行测试
if (require.main === module) {
  testHttpIntegration();
}

export { testHttpIntegration };