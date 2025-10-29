import { PrepackagedDatabase } from './PrepackagedDatabase';
import { QuestionDataSeeder } from './QuestionDataSeeder';

/**
 * 数据库构建器 - 用于在开发阶段创建预打包的SQLite数据库文件
 * 这个工具类负责将1471道题目导入到SQLite数据库中，生成可以随App打包的.db文件
 */
export class DatabaseBuilder {
  private static instance: DatabaseBuilder;
  private db: PrepackagedDatabase;
  private seeder: QuestionDataSeeder;

  static getInstance(): DatabaseBuilder {
    if (!DatabaseBuilder.instance) {
      DatabaseBuilder.instance = new DatabaseBuilder();
    }
    return DatabaseBuilder.instance;
  }

  constructor() {
    this.db = PrepackagedDatabase.getInstance();
    this.seeder = QuestionDataSeeder.getInstance();
  }

  /**
   * 构建完整的预打包数据库
   * 这个方法应该在开发阶段运行，生成包含完整题库的SQLite文件
   */
  async buildPrepackagedDatabase(): Promise<void> {
    try {
      console.log('开始构建预打包数据库...');
      
      // 初始化数据库连接
      await this.db.initialize();
      
      // 导入完整的题库数据
      await this.seeder.seedFullQuestionDatabase();
      
      // 验证数据库完整性
      const isValid = await this.seeder.validateDatabaseIntegrity();
      
      if (isValid) {
        console.log('✅ 预打包数据库构建成功！');
        console.log('数据库文件已生成，可以随App一起打包发布');
      } else {
        console.log('❌ 预打包数据库构建失败！');
        throw new Error('数据库完整性验证失败');
      }
    } catch (error) {
      console.error('构建预打包数据库失败:', error);
      throw error;
    }
  }

  /**
   * 从Markdown文件导入完整题库
   * 这个方法可以从questions/题目库.md文件中读取所有1471道题目并导入数据库
   */
  async importQuestionsFromMarkdown(): Promise<void> {
    try {
      console.log('开始从Markdown文件导入题目...');
      
      // 注意：这个方法需要在Node.js环境中运行，不能在React Native中使用
      // 因为React Native无法直接读取文件系统
      
      // 这里提供一个示例实现，实际使用时需要在开发机器上运行
      const fs = require('fs');
      const path = require('path');
      
      // 读取题目库文件
      const questionsFilePath = path.join(__dirname, '../../../questions/题目库.md');
      const content = fs.readFileSync(questionsFilePath, 'utf8');
      
      // 解析Markdown内容并提取题目
      const questions = this.parseQuestionsFromMarkdown(content);
      
      // 批量导入题目到数据库
      await this.importQuestionsToDatabase(questions);
      
      console.log(`✅ 成功导入 ${questions.length} 道题目`);
    } catch (error) {
      console.error('从Markdown导入题目失败:', error);
      throw error;
    }
  }

  /**
   * 解析Markdown文件中的题目
   * 这是一个简化的解析器，实际使用时可能需要更复杂的逻辑
   */
  private parseQuestionsFromMarkdown(content: string): any[] {
    const questions: any[] = [];
    const lines = content.split('\n');
    
    let currentTestType = null;
    let currentQuestion = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // 检测测试类型标题
      if (line.startsWith('## ')) {
        const match = line.match(/## (\d+\.\d+) (.+)/);
        if (match) {
          currentTestType = {
            id: match[1].replace('.', '-'),
            name: match[2],
            questions: []
          };
        }
      }
      
      // 检测题目标题
      if (line.startsWith('#### Q-')) {
        const match = line.match(/#### (Q-[A-Z]+-\d+)/);
        if (match && currentTestType) {
          currentQuestion = {
            id: match[1],
            testTypeId: currentTestType.id,
            options: [],
            scoreMapping: {}
          };
        }
      }
      
      // 检测题目内容
      if (currentQuestion && line.startsWith('**题目内容**：')) {
        currentQuestion.questionText = line.replace('**题目内容**：', '').trim();
      }
      
      // 检测题目类型
      if (currentQuestion && line.startsWith('**题目类型**：')) {
        currentQuestion.questionType = line.replace('**题目类型**：', '').trim();
      }
      
      // 检测选项
      if (currentQuestion && line.startsWith('- ') && !line.includes('**')) {
        const optionMatch = line.match(/- (\w+)：(.+)/);
        if (optionMatch) {
          currentQuestion.options.push({
            value: optionMatch[1],
            label: optionMatch[2]
          });
          currentQuestion.scoreMapping[optionMatch[1]] = optionMatch[1];
        }
      }
      
      // 检测分数映射
      if (currentQuestion && line.startsWith('**分数映射**：')) {
        const scoreText = line.replace('**分数映射**：', '').trim();
        try {
          currentQuestion.scoreMapping = JSON.parse(scoreText);
        } catch (e) {
          // 如果JSON解析失败，使用默认映射
          currentQuestion.scoreMapping = { A: 'A', B: 'B', C: 'C', D: 'D' };
        }
      }
      
      // 检测题目来源
      if (currentQuestion && line.startsWith('**题目来源**：')) {
        currentQuestion.sourceReference = line.replace('**题目来源**：', '').trim();
      }
      
      // 检测AI审核状态
      if (currentQuestion && line.startsWith('**AI审核状态**：')) {
        currentQuestion.aiReviewStatus = line.replace('**AI审核状态**：', '').trim();
      }
      
      // 完成一个题目的解析
      if (currentQuestion && (line === '' || i === lines.length - 1)) {
        if (currentQuestion.questionText && currentQuestion.options.length > 0) {
          questions.push(currentQuestion);
        }
        currentQuestion = null;
      }
    }
    
    return questions;
  }

  /**
   * 将解析的题目导入数据库
   */
  private async importQuestionsToDatabase(questions: any[]): Promise<void> {
    const db = this.db.getDatabase();
    
    // 按测试类型分组
    const questionsByTestType = new Map<string, any[]>();
    
    for (const question of questions) {
      if (!questionsByTestType.has(question.testTypeId)) {
        questionsByTestType.set(question.testTypeId, []);
      }
      questionsByTestType.get(question.testTypeId)!.push(question);
    }
    
    // 导入测试类型
    for (const [testTypeId, testQuestions] of questionsByTestType) {
      // 检查测试类型是否存在
      const existingTestType = await db.getFirstAsync(
        'SELECT id FROM test_types WHERE id = ?',
        [testTypeId]
      );
      
      if (!existingTestType) {
        await db.runAsync(
          `INSERT INTO test_types 
           (id, name, description, estimated_duration, question_count, category, icon) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [testTypeId, `测试类型${testTypeId}`, '自动生成的测试类型', 10, testQuestions.length, '心理测试', 'heart']
        );
      }
    }
    
    // 导入题目
    let totalImported = 0;
    for (const question of questions) {
      await db.runAsync(
        `INSERT OR REPLACE INTO questions 
         (id, question_id, test_type_id, question_type, question_text, options, 
          score_mapping, source_reference, ai_review_status, sort_order) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          question.id,
          question.id,
          question.testTypeId,
          question.questionType,
          question.questionText,
          JSON.stringify(question.options),
          JSON.stringify(question.scoreMapping),
          question.sourceReference,
          question.aiReviewStatus,
          question.sortOrder || 0
        ]
      );
      totalImported++;
    }
    
    console.log(`导入了 ${totalImported} 道题目`);
  }

  /**
   * 导出数据库统计信息
   */
  async exportDatabaseStats(): Promise<any> {
    try {
      const db = this.db.getDatabase();
      
      const stats = {
        testTypes: await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM test_types'),
        questions: await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM questions'),
        testTypesDetails: await db.getAllAsync(
          'SELECT id, name, question_count FROM test_types ORDER BY id'
        )
      };
      
      console.log('数据库统计信息:', stats);
      return stats;
    } catch (error) {
      console.error('导出数据库统计信息失败:', error);
      throw error;
    }
  }
}