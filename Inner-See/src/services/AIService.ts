import { KATCoderProRequest, KATCoderProResponse, AIRequestData } from '../types/AITypes';

/**
 * AI服务类，负责与KAT-Coder-Pro模型的交互
 */
export class AIService {
  private static instance: AIService;
  private apiKey: string;
  private apiUrl: string;

  private constructor() {
    // 从环境变量或配置文件获取API配置
    this.apiKey = process.env.EXPO_PUBLIC_KAT_CODER_PRO_API_KEY || '';
    this.apiUrl = process.env.EXPO_PUBLIC_KAT_CODER_PRO_API_URL || 'https://api.katcoder.com/v1/chat/completions';
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * 调用KAT-Coder-Pro模型进行心理分析
   * @param requestData 测试数据和用户补充信息
   * @returns AI分析结果
   */
  async analyzeTestResult(requestData: AIRequestData): Promise<string> {
    try {
      const prompt = this.buildPrompt(requestData);
      const request: KATCoderProRequest = {
        model: "KAT-Coder-Pro",
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

      const response = await this.callKATCoderPro(request);
      return this.parseResponse(response);
    } catch (error) {
      console.error('AI分析失败:', error);
      throw new Error('AI分析服务暂时不可用，请稍后重试');
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
   * 调用KAT-Coder-Pro API
   */
  private async callKATCoderPro(request: KATCoderProRequest): Promise<KATCoderProResponse> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    return response.json();
  }

  /**
   * 解析AI响应
   */
  private parseResponse(response: KATCoderProResponse): string {
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