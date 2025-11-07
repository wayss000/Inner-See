import Constants from 'expo-constants';
import { WanQingRequest, WanQingResponse, AIRequestData, CustomTestConfig, GeneratedTest } from '../types/AITypes';

/**
 * 获取环境变量配置（兼容 web 和原生平台）
 */
function getEnvConfig(key: string): string {
  // 优先从 expo-constants 获取（适用于原生平台）
  const extra = Constants.expoConfig?.extra;
  if (extra && extra[key]) {
    return extra[key];
  }
  
  // 回退到 process.env（适用于 web 平台）
  const envValue = process.env[key];
  if (envValue) {
    return envValue;
  }
  
  return '';
}

/**
 * AI服务类，负责与KAT-Coder-Pro模型的交互
 */
export class AIService {
  private static instance: AIService;
  private apiKey: string;
  private apiUrl: string;
  private modelId: string;

  private constructor() {
    // 使用万擎API配置（兼容 web 和原生平台）
    this.apiKey = getEnvConfig('EXPO_PUBLIC_WANQING_API_KEY');
    this.apiUrl = getEnvConfig('EXPO_PUBLIC_WANQING_API_URL');
    this.modelId = getEnvConfig('EXPO_PUBLIC_WANQING_MODEL_ID');
    
    // 调试日志
    console.log('AIService 初始化配置:', {
      hasApiKey: !!this.apiKey,
      hasApiUrl: !!this.apiUrl,
      hasModelId: !!this.modelId,
      apiUrl: this.apiUrl,
      modelId: this.modelId
    });
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * 调用万青API模型进行心理分析
   * @param requestData 测试数据和用户补充信息
   * @returns AI分析结果
   */
  async analyzeTestResult(requestData: AIRequestData): Promise<string> {
    console.log('开始AI分析:', {
      testType: requestData.testInfo.testType,
      userScore: requestData.testInfo.userScore,
      hasSupplement: !!requestData.userSupplement
    });

    // 检查API配置是否完整
    if (!this.apiKey || !this.apiUrl || !this.modelId) {
      console.error('AI配置检查失败:', {
        apiKey: this.apiKey ? '已设置' : '未设置',
        apiUrl: this.apiUrl || '未设置',
        modelId: this.modelId || '未设置'
      });
      throw new Error('AI分析服务未配置，请联系管理员');
    }

    try {
      const prompt = this.buildPrompt(requestData);
      const request: any = {
        model: this.modelId, // 使用配置的模型ID
        messages: [
          {
            role: "system",
            content: "你是一位专业的心理健康分析师，请根据用户提供的测试数据和补充信息，生成详细的分析报告。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      };

      console.log('AI分析请求已构建，准备调用API');

      const response = await this.callWanQingAPI(request);
      const result = this.parseResponse(response);
      
      console.log('AI分析完成，结果已解析');
      return result;
    } catch (error) {
      console.error('AI分析失败:', error);
      console.error('API配置:', {
        apiUrl: this.apiUrl,
        apiKeySet: !!this.apiKey,
        hasApiKey: !!this.apiKey
      });
      throw new Error('AI分析服务暂时不可用，请稍后重试');
    }
  }

  /**
   * 生成自定义测试
   * @param config 自定义测试配置
   * @returns 生成的测试
   */
  async generateCustomTest(config: CustomTestConfig): Promise<GeneratedTest> {
    console.log('开始生成自定义测试:', {
      mode: config.mode,
      hasCategories: !!config.selectedCategories,
      hasDescription: !!config.userDescription
    });

    if (!this.apiKey || !this.apiUrl || !this.modelId) {
      throw new Error('AI分析服务未配置，请联系管理员');
    }

    try {
      const prompt = this.buildCustomTestPrompt(config);
      const request: any = {
        model: this.modelId,
        messages: [
          {
            role: "system",
            content: "你是一位专业的心理健康测试生成专家，请根据用户的需求生成个性化的心理测试题目。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8
      };

      const response = await this.callWanQingAPI(request);
      const result = this.parseCustomTestResponse(response);
      
      console.log('自定义测试生成完成');
      return result;
    } catch (error) {
      console.error('自定义测试生成失败:', error);
      throw new Error('自定义测试生成服务暂时不可用，请稍后重试');
    }
  }

  /**
   * 构建自定义测试生成的提示词
   */
  private buildCustomTestPrompt(config: CustomTestConfig): string {
    const { mode, selectedCategories, userDescription } = config;
    
    let prompt = '请根据以下需求生成一个个性化的心理健康测试：\n\n';
    
    if (mode === 'interactive' && selectedCategories) {
      prompt += `用户选择了以下测试分类：${selectedCategories.join('、')}\n`;
      prompt += '请结合这些分类的特点，生成一个综合性的测试。\n';
    }
    
    if (mode === 'direct' && userDescription) {
      prompt += `用户描述的问题：${userDescription}\n`;
      prompt += '请根据这个描述，生成针对性的测试题目。\n';
    }
    
    prompt += `
请按以下JSON格式生成测试：

{
  "id": "custom_test_{timestamp}",
  "title": "根据用户需求生成的个性化测试标题",
  "description": "测试的简要说明",
  "category": "测试的主要分类",
  "difficulty": "简单/中等/困难",
  "estimatedDuration": 测试预计时长（分钟）,
  "questions": [
    {
      "id": "q1",
      "content": "问题内容",
      "options": ["选项A", "选项B", "选项C", "选项D"],
      "correctAnswer": "正确答案",
      "category": "问题所属分类",
      "difficulty": "简单/中等/困难"
    }
  ]
}

要求：
1. 生成8-12个问题，覆盖不同的心理健康维度
2. 问题要贴近用户的需求或描述
3. 选项要合理，避免明显的错误选项
4. 确保JSON格式正确，可以直接解析
    `.trim();

    return prompt;
  }

  /**
   * 解析自定义测试生成的响应
   */
  private parseCustomTestResponse(response: WanQingResponse): GeneratedTest {
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('AI响应内容为空');
    }

    try {
      // 提取JSON部分
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('响应中未找到有效的JSON格式');
      }

      const testData = JSON.parse(jsonMatch[0]);
      
      // 验证必要字段
      if (!testData.id || !testData.title || !testData.questions) {
        throw new Error('生成的测试数据不完整');
      }

      return testData;
    } catch (error) {
      console.error('解析自定义测试响应失败:', error);
      throw new Error('无法解析生成的测试数据，请重试');
    }
  }

  /**
   * 构建AI请求的提示词
   */
  private buildPrompt(requestData: AIRequestData): string {
    const { testInfo, userSupplement } = requestData;
    
    const questionsDetail = testInfo.testQuestions.map((question, index) =>
      `${index + 1}. ${question.content}\n   您的选择: ${question.userAnswer}\n   正确答案: ${question.correctAnswer}`
    ).join('\n\n');

    return `
请根据以下信息生成心理健康分析报告：

测试信息：
- 测试类型：${testInfo.testType}
- 用户得分：${testInfo.userScore}
- 测试结果：${testInfo.testResult}

答题详情：
${questionsDetail}

用户补充信息：
"${userSupplement || '无'}"

请按以下格式生成报告：
1. 当前情况分析（基于答题结果的专业解读）
2. 具体调整建议（可操作的心理调适方法）
3. 注意事项和预警（需要关注的问题）

最后添加免责声明：
本回答由 AI 生成，内容仅供参考，请仔细甄别。
    `.trim();
  }

  /**
   * 调用万青API
   */
  private async callWanQingAPI(request: WanQingRequest): Promise<WanQingResponse> {
    console.log('AI分析请求开始:', {
      apiUrl: this.apiUrl,
      model: request.model,
      messageCount: request.messages.length,
      hasSupplement: !!request.messages[1]?.content && request.messages[1].content !== '无'
    });

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(request)
      });

      console.log('AI分析HTTP响应状态:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI分析HTTP错误响应:', {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText
        });
        throw new Error(`API请求失败: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      console.log('AI分析成功响应:', {
        id: result.id,
        model: result.model,
        object: result.object,
        created: result.created,
        usage: result.usage,
        finish_reason: result.choices[0]?.finish_reason,
        responseTime: new Date().toISOString()
      });

      return result;
    } catch (error) {
      console.error('AI分析服务暂时不可用:', error);
      throw new Error('AI分析服务暂时不可用，请稍后重试');
    }
  }


  /**
   * 解析AI响应
   */
  private parseResponse(response: WanQingResponse): string {
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('AI响应内容为空');
    }

    // 验证是否包含免责声明
    if (!content.includes('本回答由 AI 生成')) {
      return content + '\n\n本回答由 AI 生成，内容仅供参考，请仔细甄别。';
    }

    return content;
  }
}