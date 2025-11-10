

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ApiService } from '../../src/services/ApiService';
import { DatabaseManager } from '../../src/database/DatabaseManager';
import styles from './styles';
import { BackgroundGradient, PrimaryColors, TextColors } from '../../src/constants/Colors';

interface QuestionOption {
  value: number | string;
  text: string;
}

interface Question {
  id: number;
  text: string;
  type: 'single_choice' | 'scale';
  options: QuestionOption[];
}

interface TestData {
  title: string;
  questions: Question[];
}

interface ApiQuestion {
  id: string;
  questionText: string;
  questionType: string;
  options: string;
}

const TestQuestionScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const testTypeId = (params.test_type_id as string) || 'depression';
  const testDataFromParams = params.testData ? JSON.parse(params.testData as string) : null;
  const customConfig = params.config ? JSON.parse(params.config as string) : null;

  // 状态管理
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | string)[]>([]);
  const [isAbandonModalVisible, setIsAbandonModalVisible] = useState(false);
  const [isSubmitModalVisible, setIsSubmitModalVisible] = useState(false);
  const [startTime] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [testData, setTestData] = useState<TestData | null>(null);

  // 从ApiService获取兜底数据
  useEffect(() => {
    loadTestData();
  }, [testTypeId]);

  const loadTestData = async () => {
    try {
      setIsLoading(true);
      
      // 如果是自定义测试，直接使用传入的数据
      if (testDataFromParams) {
        const convertedQuestions = testDataFromParams.questions.map((question: any, index: number) => ({
          id: index + 1,
          text: question.content,
          type: 'single_choice' as const,
          options: question.options.map((opt: string, optIndex: number) => ({
            value: optIndex,
            text: opt
          }))
        }));

        setTestData({
          title: testDataFromParams.title || '自定义测试',
          questions: convertedQuestions
        });
        return;
      }
      
      // 使用ApiService获取测试题目
      const apiService = ApiService.getInstance();
      const questionsData = await apiService.getRecommendedQuestions(testTypeId, 5);
      
      if (questionsData && questionsData.length > 0) {
        // 转换API数据为组件需要的格式
        const convertedQuestions = questionsData.map((question: ApiQuestion, index: number) => {
          let options: QuestionOption[] = [];
          
          try {
            // 解析options字符串为数组
            const parsedOptions = JSON.parse(question.options);
            if (Array.isArray(parsedOptions)) {
              options = parsedOptions.map((opt: any) => ({
                value: opt.value,
                text: opt.label
              }));
            }
          } catch (error) {
            console.error('解析题目选项失败:', error);
            // 如果解析失败，使用默认选项
            options = [
              { value: 0, text: '选项1' },
              { value: 1, text: '选项2' }
            ];
          }

          return {
            id: index + 1,
            text: question.questionText,
            type: question.questionType === 'multiple-choice' ? 'single_choice' as const : 'scale' as const,
            options
          };
        });

        // 获取测试类型名称
        const testType = await apiService.getTestTypeById(testTypeId);
        const title = testType?.name || testTypeId;

        setTestData({
          title,
          questions: convertedQuestions
        });
      } else {
        // 如果API没有数据，使用本地兜底数据
        setTestData(getFallbackTestData(testTypeId));
      }
    } catch (error) {
      console.error('加载测试数据失败:', error);
      // 出错时使用本地兜底数据
      setTestData(getFallbackTestData(testTypeId));
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackTestData = (typeId: string): TestData => {
    // 本地兜底数据
    const fallbackData: Record<string, TestData> = {
      depression: {
        title: '抑郁症评估',
        questions: [
          {
            id: 1,
            text: '最近两周内，您是否经常感到情绪低落、沮丧或绝望？',
            type: 'single_choice',
            options: [
              { value: 0, text: '完全没有' },
              { value: 1, text: '有几天' },
              { value: 2, text: '一半以上的天数' },
              { value: 3, text: '几乎每天' }
            ]
          },
          {
            id: 2,
            text: '最近两周内，您是否对做事情几乎没有兴趣或乐趣？',
            type: 'single_choice',
            options: [
              { value: 0, text: '完全没有' },
              { value: 1, text: '有几天' },
              { value: 2, text: '一半以上的天数' },
              { value: 3, text: '几乎每天' }
            ]
          },
          {
            id: 3,
            text: '最近两周内，您是否难以入睡或保持睡眠，或睡得太多？',
            type: 'single_choice',
            options: [
              { value: 0, text: '完全没有' },
              { value: 1, text: '有几天' },
              { value: 2, text: '一半以上的天数' },
              { value: 3, text: '几乎每天' }
            ]
          }
        ]
      },
      personality: {
        title: 'MBTI性格测试',
        questions: [
          {
            id: 1,
            text: '您更倾向于：',
            type: 'single_choice',
            options: [
              { value: 'E', text: '与他人相处时获得能量' },
              { value: 'I', text: '独处时获得能量' }
            ]
          },
          {
            id: 2,
            text: '您更关注：',
            type: 'single_choice',
            options: [
              { value: 'S', text: '具体的事实和细节' },
              { value: 'N', text: '抽象的概念和可能性' }
            ]
          }
        ]
      },
      'mental-health': {
        title: '心理健康评估',
        questions: [
          {
            id: 1,
            text: '最近一周，您感到情绪低落的频率如何？',
            type: 'scale',
            options: [
              { value: 1, text: '从不' },
              { value: 2, text: '很少' },
              { value: 3, text: '有时' },
              { value: 4, text: '经常' },
              { value: 5, text: '总是' }
            ]
          },
          {
            id: 2,
            text: '最近一周，您对事物失去兴趣或乐趣的频率如何？',
            type: 'scale',
            options: [
              { value: 1, text: '从不' },
              { value: 2, text: '很少' },
              { value: 3, text: '有时' },
              { value: 4, text: '经常' },
              { value: 5, text: '总是' }
            ]
          }
        ]
      },
      stress: {
        title: '压力水平评估',
        questions: [
          {
            id: 1,
            text: '最近一个月，您感到压力大的频率如何？',
            type: 'scale',
            options: [
              { value: 1, text: '从不' },
              { value: 2, text: '很少' },
              { value: 3, text: '有时' },
              { value: 4, text: '经常' },
              { value: 5, text: '总是' }
            ]
          }
        ]
      },
      anxiety: {
        title: '焦虑症筛查',
        questions: [
          {
            id: 1,
            text: '最近一周，您感到紧张或焦虑的频率如何？',
            type: 'scale',
            options: [
              { value: 1, text: '从不' },
              { value: 2, text: '很少' },
              { value: 3, text: '有时' },
              { value: 4, text: '经常' },
              { value: 5, text: '总是' }
            ]
          }
        ]
      }
    };

    return fallbackData[typeId] || fallbackData.depression;
  };

  // 等待数据加载完成
  if (isLoading || !testData) {
    return (
      <LinearGradient colors={BackgroundGradient.primary} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, paddingHorizontal: 24 }}>
            <Text style={{ color: TextColors.primary, marginTop: 16, fontSize: 16 }}>加载测试题目中...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const currentTest = testData;
  const currentQuestion = currentTest.questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / currentTest.questions.length) * 100;
  const hasAnswered = userAnswers[currentQuestionIndex] !== undefined;
  const isLastQuestion = currentQuestionIndex === currentTest.questions.length - 1;

  // 处理返回按钮
  const handleBackPress = () => {
    setIsAbandonModalVisible(true);
  };

  // 处理放弃测试
  const handleAbandonTest = () => {
    setIsAbandonModalVisible(false);
    router.back();
  };

  // 处理继续测试
  const handleContinueTest = () => {
    setIsAbandonModalVisible(false);
  };

  // 处理选项选择
  const handleOptionSelect = (value: number | string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = value;
    setUserAnswers(newAnswers);
  };

  // 处理上一题
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // 处理下一题
  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsSubmitModalVisible(true);
    }
  };

  // 处理提交测试
  const handleSubmitTest = async () => {
    try {
      const endTime = Date.now();
      const duration = Math.round((endTime - startTime) / 1000);
      const recordId = 'record_' + Date.now();
      
      // 计算测试结果
      const totalScore = calculateScore();
      const resultSummary = generateResultSummary();
      const improvementSuggestions = generateSuggestions();
      
      console.log('准备保存测试记录:', {
        id: recordId,
        userId: 'user_1',
        testTypeId,
        testTypeIdFinal: testTypeId === 'custom' ? 'custom' : testTypeId,
        totalScore,
        resultSummary,
        improvementSuggestions
      });
      
      // 保存测试记录到数据库
      const testRecord = {
        id: recordId,
        userId: 'user_1', // 默认用户ID
        testTypeId: testTypeId === 'custom' ? 'custom' : testTypeId,
        startTime,
        endTime,
        totalScore,
        resultSummary,
        improvementSuggestions,
        referenceMaterials: testTypeId === 'custom' ? 'AI生成的自定义测试' : 'PHQ-9, MBTI等专业量表',
        createdAt: Date.now()
      };
      
      // 保存测试记录和用户答题记录（包含冗余数据）
      const databaseManager = await getDatabaseManager();
      
      // 准备用户答题记录（包含冗余数据）
      const userAnswersData = userAnswers.map((answer, index) => {
        const question = currentTest.questions[index];
        const selectedOption = question.options?.find(opt => opt.value === answer);
        
        console.log(`准备保存第${index}题数据:`, {
          questionId: question.id,
          questionText: question.text,
          questionType: question.type,
          optionsCount: question.options?.length,
          userAnswer: answer,
          selectedOptionText: selectedOption?.text
        });
        
        return {
          id: `answer_${recordId}_${index}`,
          recordId,
          questionId: question.id.toString(),
          // 冗余数据：完整的题目信息
          questionText: question.text || '',
          questionType: question.type || 'single_choice',
          optionsJson: JSON.stringify((question.options || []).map(opt => ({
            value: opt.value,
            text: opt.text
          }))),
          // 冗余数据：用户选择的可读信息
          userChoice: answer?.toString() || '',
          userChoiceText: selectedOption?.text || answer?.toString() || '未选择',
          scoreObtained: getScoreForAnswer(index, answer),
          createdAt: Date.now()
        };
      });
      
      console.log('准备保存的用户答案数据:', userAnswersData);
      
      // 使用批量保存方法
      await databaseManager.saveTestRecordWithAnswers(testRecord, userAnswersData);
      
      console.log('测试记录保存完成，跳转到结果页面，recordId:', recordId);
      setIsSubmitModalVisible(false);
      router.push(`/p-result_display?record_id=${recordId}`);
    } catch (error) {
      console.error('保存测试记录失败:', error);
      Alert.alert('错误', '保存测试记录失败，请重试');
    }
  };

  // 计算测试得分
  const calculateScore = (): number => {
    let totalScore = 0;
    userAnswers.forEach((answer, index) => {
      const question = currentTest.questions[index];
      if (question && question.type === 'scale') {
        totalScore += Number(answer) || 0;
      } else if (question && question.type === 'single_choice') {
        // 单选题根据选项值计算分数
        const selectedOption = question.options.find(opt => opt.value === answer);
        if (selectedOption) {
          totalScore += Number(selectedOption.value) || 0;
        }
      }
    });
    return totalScore;
  };

  // 生成结果摘要
  const generateResultSummary = (): string => {
    const score = calculateScore();
    const maxPossibleScore = currentTest.questions.length * 5; // 假设每题最高5分
    const percentage = (score / maxPossibleScore) * 100;
    
    // 根据测试类型生成不同的结果摘要
    if (testTypeId === 'mental-health' || testTypeId === 'stress' || testTypeId === 'anxiety') {
      // 心理健康相关测试
      if (percentage < 20) {
        return '正常';
      } else if (percentage < 40) {
        return '轻度异常';
      } else if (percentage < 60) {
        return '中度异常';
      } else {
        return '重度异常';
      }
    } else if (testTypeId === 'personality') {
      // 人格测试
      return '已完成人格评估';
    } else if (testTypeId === 'cognitive') {
      // 认知能力测试
      if (percentage < 30) {
        return '认知能力偏低';
      } else if (percentage < 60) {
        return '认知能力中等';
      } else {
        return '认知能力优秀';
      }
    } else if (testTypeId === 'career') {
      // 职业发展测试
      if (percentage < 30) {
        return '职业发展意识不足';
      } else if (percentage < 60) {
        return '职业发展意识良好';
      } else {
        return '职业发展意识优秀';
      }
    } else if (testTypeId === 'relationship') {
      // 人际关系测试
      if (percentage < 30) {
        return '人际关系能力较弱';
      } else if (percentage < 60) {
        return '人际关系能力良好';
      } else {
        return '人际关系能力优秀';
      }
    } else if (testTypeId === 'quality-of-life') {
      // 生活质量测试
      if (percentage < 30) {
        return '生活质量较低';
      } else if (percentage < 60) {
        return '生活质量中等';
      } else {
        return '生活质量较高';
      }
    } else if (testTypeId === 'custom') {
      // 自定义测试
      return '自定义测试完成';
    } else {
      // 默认情况
      return '测试完成';
    }
  };

  // 生成改善建议
  const generateSuggestions = (): string => {
    const score = calculateScore();
    const maxPossibleScore = currentTest.questions.length * 5;
    const percentage = (score / maxPossibleScore) * 100;
    
    // 根据测试类型生成不同的改善建议
    if (testTypeId === 'mental-health' || testTypeId === 'stress' || testTypeId === 'anxiety') {
      // 心理健康相关测试
      if (percentage < 20) {
        return '您的测试结果正常，继续保持良好的生活习惯。';
      } else if (percentage < 40) {
        return '您有轻度异常，建议适当调整生活方式，增加运动和社交活动。';
      } else if (percentage < 60) {
        return '您有中度异常，建议寻求专业心理咨询师的帮助。';
      } else {
        return '您有重度异常，强烈建议尽快联系专业心理医生进行评估。';
      }
    } else if (testTypeId === 'personality') {
      // 人格测试
      return '您已完成人格特质分析，建议结合测试结果深入了解自己的性格特点，发挥优势，改善不足。';
    } else if (testTypeId === 'cognitive') {
      // 认知能力测试
      if (percentage < 30) {
        return '建议进行认知训练，如阅读、 puzzles、学习新技能等，以提升认知能力。';
      } else if (percentage < 60) {
        return '您的认知能力良好，继续保持学习和思考的习惯。';
      } else {
        return '您的认知能力优秀，可以尝试更具挑战性的认知活动。';
      }
    } else if (testTypeId === 'career') {
      // 职业发展测试
      if (percentage < 30) {
        return '建议进行职业规划咨询，明确职业目标和发展方向。';
      } else if (percentage < 60) {
        return '您的职业发展意识良好，建议制定具体的职业发展计划。';
      } else {
        return '您的职业发展意识优秀，可以考虑职业晋升或转型的机会。';
      }
    } else if (testTypeId === 'relationship') {
      // 人际关系测试
      if (percentage < 30) {
        return '建议学习沟通技巧，提升人际交往能力。';
      } else if (percentage < 60) {
        return '您的人际关系能力良好，继续保持良好的沟通习惯。';
      } else {
        return '您的人际关系能力优秀，可以成为他人的人际关系指导者。';
      }
    } else if (testTypeId === 'quality-of-life') {
      // 生活质量测试
      if (percentage < 30) {
        return '建议改善生活习惯，包括规律作息、健康饮食和适量运动。';
      } else if (percentage < 60) {
        return '您的生活质量中等，可以进一步优化生活习惯。';
      } else {
        return '您的生活质量较高，继续保持健康的生活方式。';
      }
    } else if (testTypeId === 'custom') {
      // 自定义测试
      return '这是您自定义的心理测试结果，建议根据具体测试内容进行相应调整。';
    } else {
      // 默认情况
      return '测试完成，建议根据测试结果进行相应的调整和改善。';
    }
  };

  // 获取单个答案的得分
  const getScoreForAnswer = (questionIndex: number, answer: number | string): number => {
    const question = currentTest.questions[questionIndex];
    if (!question) return 0;
    
    if (question.type === 'scale') {
      return Number(answer) || 0;
    } else {
      const selectedOption = question.options.find(opt => opt.value === answer);
      return Number(selectedOption?.value) || 0;
    }
  };

  // 获取数据库管理器实例
  const getDatabaseManager = async () => {
    const dbManager = DatabaseManager.getInstance();
    try {
      await dbManager.initialize();
      return dbManager;
    } catch (error) {
      console.error('数据库初始化失败，尝试重连:', error);
      // 如果初始化失败，尝试关闭后重新初始化
      try {
        await dbManager.close();
        await dbManager.initialize();
        return dbManager;
      } catch (retryError) {
        console.error('数据库重连失败:', retryError);
        throw retryError;
      }
    }
  };

  // 处理检查答案
  const handleCheckAnswers = () => {
    setIsSubmitModalVisible(false);
  };

  // 渲染单选题选项
  const renderSingleChoiceOptions = () => {
    return currentQuestion.options.map((option, index) => {
      const isSelected = userAnswers[currentQuestionIndex] === option.value;
      
      return (
        <TouchableOpacity
          key={index}
          style={[styles.optionCard, isSelected && styles.optionCardSelected]}
          onPress={() => handleOptionSelect(option.value)}
          activeOpacity={0.8}
        >
          <View style={styles.optionContent}>
            <View style={styles.optionRadio}>
              {isSelected && <View style={styles.optionRadioDot} />}
            </View>
            <Text style={styles.optionText}>{option.text}</Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <LinearGradient colors={BackgroundGradient.primary} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* 顶部导航栏 */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}
                activeOpacity={0.7}
              >
                <FontAwesome6 name="arrow-left" size={18} color={PrimaryColors.main} />
              </TouchableOpacity>
              <View style={styles.testTitleSection}>
                <Text style={styles.testTitle}>{currentTest.title}</Text>
                <Text style={styles.questionProgress}>
                  {currentQuestionIndex + 1}/{currentTest.questions.length}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.timerButton} activeOpacity={0.8}>
              <FontAwesome6 name="clock" size={18} color={PrimaryColors.main} />
            </TouchableOpacity>
          </View>

          {/* 进度条 */}
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
            </View>
            <View style={styles.progressText}>
              <Text style={styles.progressTextItem}>第{currentQuestionIndex + 1}题</Text>
              <Text style={styles.progressTextItem}>共{currentTest.questions.length}题</Text>
            </View>
          </View>

          {/* 题目内容区 */}
          <View style={styles.questionSection}>
            <View style={styles.questionCard}>
              <Text style={styles.questionText}>{currentQuestion.text}</Text>
              <View style={styles.optionsContainer}>
                {renderSingleChoiceOptions()}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* 底部操作区 */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.prevButton, currentQuestionIndex === 0 && styles.disabledButton]}
            onPress={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            activeOpacity={0.8}
          >
            <FontAwesome6 name="arrow-left" size={16} color={PrimaryColors.main} />
            <Text style={styles.prevButtonText}>上一题</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.nextButton, !hasAnswered && styles.disabledButton]}
            onPress={handleNextQuestion}
            disabled={!hasAnswered}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>
              {isLastQuestion ? '完成测试' : '下一题'}
            </Text>
            <FontAwesome6 
              name={isLastQuestion ? "check" : "arrow-right"} 
              size={16} 
              color={PrimaryColors.main} 
            />
          </TouchableOpacity>
        </View>

        {/* 放弃测试确认对话框 */}
        <Modal
          visible={isAbandonModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={handleContinueTest}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.abandonModalIcon}>
                  <FontAwesome6 name="triangle-exclamation" size={24} color={TextColors.white} />
                </View>
                <Text style={styles.modalTitle}>确认放弃测试？</Text>
                <Text style={styles.modalDescription}>
                  您的答题进度将会丢失，确定要放弃当前测试吗？
                </Text>
              </View>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={handleContinueTest}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalButtonText}>继续测试</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalConfirmButton]}
                  onPress={handleAbandonTest}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalButtonText}>放弃测试</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* 提交确认对话框 */}
        <Modal
          visible={isSubmitModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCheckAnswers}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.submitModalIcon}>
                  <FontAwesome6 name="check" size={24} color={TextColors.white} />
                </View>
                <Text style={styles.modalTitle}>完成测试</Text>
                <Text style={styles.modalDescription}>
                  您已完成所有题目，现在提交测试获取结果
                </Text>
              </View>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={handleCheckAnswers}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalButtonText}>检查答案</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalSubmitButton]}
                  onPress={handleSubmitTest}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalButtonText}>提交测试</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default TestQuestionScreen;

