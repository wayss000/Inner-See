

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ApiService } from '../../src/services/ApiService';
import styles from './styles';

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
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, paddingHorizontal: 24 }}>
            <Text style={{ color: '#ffffff', marginTop: 16, fontSize: 16 }}>加载测试题目中...</Text>
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
  const handleSubmitTest = () => {
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    const recordId = 'record_' + Date.now();
    
    // 模拟保存测试记录
    const testRecord = {
      recordId,
      testTypeId,
      startTime,
      endTime,
      duration,
      answers: userAnswers,
      timestamp: new Date().toISOString()
    };
    
    console.log('测试记录:', testRecord);
    setIsSubmitModalVisible(false);
    router.push(`/p-result_display?record_id=${recordId}`);
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
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* 顶部导航栏 */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}
                activeOpacity={0.8}
              >
                <FontAwesome6 name="arrow-left" size={18} color="#ffffff" />
              </TouchableOpacity>
              <View style={styles.testTitleSection}>
                <Text style={styles.testTitle}>{currentTest.title}</Text>
                <Text style={styles.questionProgress}>
                  {currentQuestionIndex + 1}/{currentTest.questions.length}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.timerButton} activeOpacity={0.8}>
              <FontAwesome6 name="clock" size={18} color="#ffffff" />
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
            <FontAwesome6 name="arrow-left" size={16} color="#ffffff" />
            <Text style={styles.actionButtonText}>上一题</Text>
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
              color="#ffffff" 
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
                  <FontAwesome6 name="triangle-exclamation" size={24} color="#ffffff" />
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
                  <FontAwesome6 name="check" size={24} color="#ffffff" />
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

