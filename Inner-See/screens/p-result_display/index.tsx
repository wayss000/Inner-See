

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Share, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DatabaseManager } from '../../src/database/DatabaseManager';
import { AIService } from '../../src/services/AIService';
import { AIAnalysisResult, AIButtonState, AIAnalysisState } from '../../src/types/AITypes';
import AIAskButton from './components/AIAskButton';
import AISupplementInput from './components/AISupplementInput';
import AIAnalysisResultComponent from './components/AIAnalysisResult';
import ErrorToast from '../../src/components/ErrorToast';
import styles from './styles';
import { BackgroundGradient, PrimaryColors, TextColors, BackButtonStyles, CloseButtonStyles } from '../../src/constants/Colors';

interface TestResult {
  id?: string;
  testName: string;
  score: number;
  level: string;
  levelPercentage: number;
  interpretation: string[];
  suggestions: Array<{
    title: string;
    text: string;
    icon: string;
  }>;
  aiAnalysisResult?: AIAnalysisResult | null;
  questionResults?: Array<{
    question: {
      id: string;
      text: string;
      type: 'single_choice' | 'scale';
      options: Array<{
        value: number | string;
        text: string;
      }>;
    };
    userAnswer: {
      id: string;
      recordId: string;
      questionId: string;
      userChoice: string;
      scoreObtained: number;
      createdAt: number;
    };
    userChoiceText: string;
  }>;
}

const ResultDisplayScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // AI分析相关状态
  const [aiButtonState, setAiButtonState] = useState<AIButtonState>('idle');
  const [aiAnalysisState, setAiAnalysisState] = useState<AIAnalysisState>({
    status: 'idle',
    result: null,
    error: null,
    hasSavedResult: false,
  });
  const [showSupplementInput, setShowSupplementInput] = useState(false);
  const [aiSupplement, setAiSupplement] = useState('');
  const [showAiResult, setShowAiResult] = useState(false);
  
  // 错误提示状态
  const [errorMessage, setErrorMessage] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);

  // 获取按钮图标名称
  const getButtonIconName = () => {
    switch (aiButtonState) {
      case 'idle':
        return 'brain';
      case 'loading':
      case 'regenerating':
        return 'spinner';
      case 'completed':
      case 'viewable':
        return 'eye';
      case 'error':
        return 'refresh';
      default:
        return 'brain';
    }
  };

  // 获取按钮颜色
  const getButtonColors = (): [string, string] => {
    switch (aiButtonState) {
      case 'error':
        return ['#ef4444', '#dc2626'];
      case 'completed':
      case 'viewable':
        return ['#10b981', '#059669'];
      case 'loading':
      case 'regenerating':
        return ['#f59e0b', '#d97706'];
      default:
        return [PrimaryColors.main, PrimaryColors.secondary];
    }
  };

  // 模拟测试结果数据
  const mockResults: Record<string, TestResult> = {
    record1: {
      testName: '抑郁症评估',
      score: 23,
      level: '轻度抑郁倾向',
      levelPercentage: 45,
      interpretation: [
        '根据您的测试结果，您目前表现出轻度抑郁倾向。这意味着您可能正在经历一些情绪上的困扰，但尚未达到临床抑郁症的诊断标准。',
        '您可能会感到偶尔的低落情绪、对日常活动的兴趣下降，或者出现睡眠和食欲的轻微变化。这些都是人体应对压力的正常反应。',
        '值得注意的是，轻度抑郁倾向是可以通过积极的生活方式调整和心理调适得到改善的。及时关注并采取行动是非常重要的。'
      ],
      suggestions: [
        {
          title: '增加体育锻炼',
          text: '每天进行30分钟的有氧运动，如快走、跑步或游泳，有助于释放内啡肽，改善情绪状态。',
          icon: 'person-walking'
        },
        {
          title: '改善睡眠质量',
          text: '保持规律的作息时间，创造舒适的睡眠环境，避免睡前使用电子设备。',
          icon: 'moon'
        },
        {
          title: '加强社交联系',
          text: '与亲友保持联系，参与社交活动，分享感受，避免过度独处。',
          icon: 'users'
        },
        {
          title: '练习放松技巧',
          text: '尝试冥想、深呼吸练习或瑜伽，每天10-15分钟，有助于缓解压力和焦虑。',
          icon: 'leaf'
        }
      ]
    },
    record2: {
      testName: 'MBTI性格测试',
      score: 85,
      level: 'INFP - 调停者',
      levelPercentage: 85,
      interpretation: [
        '您的MBTI类型为INFP（调停者），这是一种富有理想主义和同理心的性格类型。',
        '您重视内心的价值观，富有创造力，善于理解他人的情感需求。',
        'INFP类型的人通常具有强烈的道德感和对美好事物的追求。'
      ],
      suggestions: [
        {
          title: '发挥创造力',
          text: '寻找能够发挥您创造力的活动，如写作、艺术创作或音乐。',
          icon: 'palette'
        },
        {
          title: '建立深度关系',
          text: '与志同道合的人建立深厚的情感连接，分享您的理想和价值观。',
          icon: 'heart'
        },
        {
          title: '设定现实目标',
          text: '将您的理想主义与现实相结合，设定可实现的短期和长期目标。',
          icon: 'bullseye'
        }
      ]
    }
  };

  useEffect(() => {
    const loadTestResult = async () => {
      try {
        setIsLoading(true);
        const recordId = (params.record_id as string);
        
        console.log('开始加载测试结果，recordId:', recordId);
        
        if (!recordId) {
          Alert.alert('错误', '缺少测试记录ID');
          return;
        }
        
        // 首先尝试从数据库加载真实数据
        const dbManager = DatabaseManager.getInstance();
        await dbManager.initialize();
        
        console.log('数据库初始化完成，开始查询测试记录');
        
        const testRecord = await dbManager.getTestRecordById(recordId);
        
        console.log('从数据库获取到的testRecord:', testRecord);
        
        if (testRecord) {
          console.log('数据库中找到测试记录，开始生成测试结果');
          console.log('testRecord.resultSummary:', testRecord.resultSummary);
          console.log('testRecord.totalScore:', testRecord.totalScore);
          console.log('testRecord.aiAnalysisResult:', testRecord.aiAnalysisResult);
          console.log('testRecord.aiAnalysisResult是否为空:', !testRecord.aiAnalysisResult);
          
          // 从数据库记录生成测试结果
          const result: TestResult = {
                       id: testRecord.id,
                       testName: testRecord.testTypeId === 'mental-health' ? '抑郁症评估' : 'MBTI性格测试',
                       score: testRecord.totalScore || 0,
                       level: testRecord.resultSummary || '未知',
                       levelPercentage: Math.min((testRecord.totalScore || 0) * 10, 100), // 简单的百分比计算
                       interpretation: [
                         `根据您的测试结果，${testRecord.resultSummary || '测试完成'}。`,
                         '这是基于您答题情况生成的个性化结果。',
                         '建议定期进行心理状态评估，保持良好的生活习惯。'
                       ],
                       suggestions: testRecord.improvementSuggestions ? [
                         {
                           title: '改善建议',
                           text: testRecord.improvementSuggestions,
                           icon: 'lightbulb'
                         }
                       ] : [
                         {
                           title: '增加体育锻炼',
                           text: '每天进行30分钟的有氧运动，有助于改善情绪状态。',
                           icon: 'person-walking'
                         },
                         {
                           title: '改善睡眠质量',
                           text: '保持规律的作息时间，创造舒适的睡眠环境。',
                           icon: 'moon'
                         }
                       ],
                       aiAnalysisResult: testRecord.aiAnalysisResult ? JSON.parse(testRecord.aiAnalysisResult) : null,
                       questionResults: [] // 将通过updateQuestionResults函数从user_answers表获取
                     };
          
          // 检查是否有AI分析结果
          const hasAiResult = !!testRecord.aiAnalysisResult;
          
          console.log('hasAiResult:', hasAiResult);
          console.log('生成的测试结果:', result);
          setTestResult(result);
          
          // 如果已有AI分析结果，设置按钮状态和分析状态
          if (hasAiResult) {
            console.log('设置按钮状态为viewable，AI分析结果:', testRecord.aiAnalysisResult);
            setAiButtonState('viewable');
            try {
              const parsedResult = JSON.parse(testRecord.aiAnalysisResult!);
              setAiAnalysisState(prev => ({
                ...prev,
                hasSavedResult: true,
                status: 'completed',
                result: parsedResult,
              }));
            } catch (error) {
              console.error('解析AI分析结果失败:', error);
              setAiButtonState('idle');
            }
          } else {
            console.log('没有AI分析结果，设置按钮状态为idle');
            setAiButtonState('idle');
          }
        } else {
          console.log('数据库中未找到测试记录，使用mock数据');
          // 如果数据库中没有找到，使用mock数据作为fallback
          const mockResult = mockResults[recordId] || mockResults.record1;
          setTestResult(mockResult);
          // 对于mock数据，设置按钮为初始状态
          setAiButtonState('idle');
        }
      } catch (error) {
        console.error('加载测试结果失败:', error);
        Alert.alert('错误', '加载测试结果失败，请重试');
      } finally {
        setIsLoading(false);
      }
    };

    loadTestResult();
  }, [params.record_id]);

  // 从数据库获取题目详情并更新questionResults
  const updateQuestionResults = async () => {
    if (!testResult || (testResult.questionResults && testResult.questionResults.length > 0)) return;
    
    try {
      const dbManager = DatabaseManager.getInstance();
      await dbManager.initialize();
      
      const userAnswers = await dbManager.getUserAnswersByRecordId(params.record_id as string);
      
      // 由于user_answers表中已经包含完整的冗余数据，直接使用
      console.log('从数据库获取的用户答案数据:', userAnswers);
      
      const questionResults = userAnswers.map((answer, index) => {
        console.log(`处理第${index}题答案:`, {
          questionId: answer.questionId,
          questionText: answer.questionText,
          questionType: answer.questionType,
          optionsJson: answer.optionsJson,
          userChoice: answer.userChoice,
          userChoiceText: answer.userChoiceText
        });
        
        let parsedOptions = [];
        try {
          // 尝试解析optionsJson，如果失败则使用默认选项
          if (answer.optionsJson) {
            parsedOptions = JSON.parse(answer.optionsJson);
          } else {
            console.warn('optionsJson为空，使用默认选项');
          }
        } catch (error) {
          console.warn('解析选项JSON失败，使用默认选项:', error, {
            optionsJson: answer.optionsJson,
            questionId: answer.questionId
          });
          // 如果解析失败，使用默认选项格式
          parsedOptions = [
            { value: 1, text: '选项1' },
            { value: 2, text: '选项2' }
          ];
        }

        return {
          question: {
            id: answer.questionId,
            text: answer.questionText || '未知题目',        // 直接使用冗余数据：题目文本
            type: answer.questionType as 'single_choice' | 'scale', // 直接使用冗余数据：题型
            options: parsedOptions
          },
          userAnswer: {
            id: answer.id,
            recordId: answer.recordId,
            questionId: answer.questionId,
            userChoice: answer.userChoice || '',
            scoreObtained: answer.scoreObtained || 0,
            createdAt: answer.createdAt || Date.now()
          },
          userChoiceText: answer.userChoiceText || '未选择' // 直接使用冗余数据：用户选择的可读文本
        };
      });
      
      setTestResult(prev => prev ? {
        ...prev,
        questionResults
      } : null);
      
    } catch (error) {
      console.error('更新题目详情失败:', error);
    }
  };

  // 当测试结果加载完成后，更新题目详情
  useEffect(() => {
    if (testResult) {
      updateQuestionResults();
    }
  }, [testResult]);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/p-home');
    }
  };

  const handleSharePress = async () => {
    try {
      if (!testResult) return;

      const shareContent = `我的${testResult.testName}结果：${testResult.level}，得分${testResult.score}。快来心探APP体验专业心理测试吧！`;
      
      await Share.share({
        message: shareContent,
        title: '测试结果分享',
      });
    } catch (error) {
      Alert.alert('分享失败', '无法分享测试结果');
    }
  };

  const handleHomePress = () => {
    router.push('/p-home');
  };

  if (isLoading || !testResult) {
    return (
      <LinearGradient colors={BackgroundGradient.primary} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>加载中...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={BackgroundGradient.primary} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* 顶部导航栏 */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={BackButtonStyles.container} onPress={handleBackPress}>
                <FontAwesome6 name="arrow-left" size={18} style={BackButtonStyles.icon} />
              </TouchableOpacity>
              <View style={styles.headerTitleSection}>
                <Text style={styles.pageTitle}>测试结果</Text>
                <Text style={styles.testName}>{testResult.testName}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.shareButtonHeader} onPress={handleSharePress}>
              <FontAwesome6 name="share-nodes" size={18} color={PrimaryColors.main} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* 测试分数区 */}
          <View style={styles.scoreSection}>
            <View style={styles.scoreCard}>
              <View style={styles.scoreCircleContainer}>
                <View style={styles.scoreCircle}>
                  <View style={styles.scoreInner}>
                    <Text style={styles.scoreValue}>{testResult.score}</Text>
                    <Text style={styles.scoreLabel}>测试分数</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.scoreLevel}>
                <Text style={styles.levelTitle}>{testResult.level}</Text>
                <View style={styles.levelBarContainer}>
                  <View style={[styles.levelBar, { width: `${testResult.levelPercentage}%` }]} />
                </View>
                <View style={styles.levelRange}>
                  <Text style={styles.levelRangeText}>正常</Text>
                  <Text style={styles.levelRangeText}>轻度</Text>
                  <Text style={styles.levelRangeText}>中度</Text>
                  <Text style={styles.levelRangeText}>重度</Text>
                </View>
              </View>
              
              <View style={styles.testMeta}>
                <View style={styles.testMetaItem}>
                  <FontAwesome6 name="clock" size={14} color={TextColors.secondary} />
                  <Text style={styles.testMetaText}>用时 6分钟</Text>
                </View>
                <View style={styles.testMetaItem}>
                  <FontAwesome6 name="calendar" size={14} color={TextColors.secondary} />
                  <Text style={styles.testMetaText}>今天 14:30</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 结果解读区 */}
          <View style={styles.interpretationSection}>
            <View style={styles.interpretationCard}>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={['#60a5fa', '#06b6d4']}
                  style={styles.sectionIcon}
                >
                  <FontAwesome6 name="lightbulb" size={18} color={PrimaryColors.main} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>结果解读</Text>
              </View>
              
              <View style={styles.interpretationContent}>
                {testResult.interpretation.map((text, index) => (
                  <Text key={index} style={styles.interpretationText}>
                    {text}
                  </Text>
                ))}
              </View>
            </View>
          </View>

          {/* 改善建议区 */}
          <View style={styles.suggestionsSection}>
            <View style={styles.suggestionsCard}>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={['#4ade80', '#3b82f6']}
                  style={styles.sectionIcon}
                >
                  <FontAwesome6 name="heart" size={18} color={PrimaryColors.main} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>改善建议</Text>
              </View>
              
              <View style={styles.suggestionsList}>
                {testResult.suggestions.map((suggestion, index) => (
                  <View key={index} style={styles.suggestionItem}>
                    <View style={styles.suggestionIcon}>
                      <FontAwesome6 name={suggestion.icon as any} size={14} color={TextColors.white} />
                    </View>
                    <View style={styles.suggestionContent}>
                      <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                      <Text style={styles.suggestionText}>{suggestion.text}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* 专业参考资料区 */}
          <View style={styles.referencesSection}>
            <View style={styles.referencesCard}>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={['#a78bfa', '#ec4899']}
                  style={styles.sectionIcon}
                >
                  <FontAwesome6 name="book" size={18} color={PrimaryColors.main} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>专业参考</Text>
              </View>
              
              <View style={styles.referencesContent}>
                <View style={styles.referenceItem}>
                  <Text style={styles.referenceTitle}>PHQ-9 抑郁症筛查量表</Text>
                  <Text style={styles.referenceText}>
                    本测试基于PHQ-9量表，是国际通用的抑郁症筛查工具，具有良好的信度和效度。
                  </Text>
                  <View style={styles.referenceScoring}>
                    <Text style={styles.referenceScoringText}>• 0-4分：无抑郁症状</Text>
                    <Text style={styles.referenceScoringText}>• 5-9分：轻度抑郁倾向</Text>
                    <Text style={styles.referenceScoringText}>• 10-14分：中度抑郁</Text>
                    <Text style={styles.referenceScoringText}>• 15-27分：重度抑郁</Text>
                  </View>
                </View>
                
                <View style={styles.referenceItem}>
                  <Text style={styles.referenceTitle}>专业建议</Text>
                  <Text style={styles.referenceText}>
                    如果您的症状持续超过两周，或对日常生活造成明显影响，建议咨询专业心理医生或精神科医师进行进一步评估。
                  </Text>
                </View>
                
                <View style={styles.emergencyNotice}>
                  <View style={styles.emergencyHeader}>
                    <FontAwesome6 name="triangle-exclamation" size={14} color="#fb923c" />
                    <Text style={styles.emergencyTitle}>重要提醒</Text>
                  </View>
                  <Text style={styles.emergencyText}>
                    本测试仅供参考，不能替代专业医疗诊断。如有严重心理困扰，请及时寻求专业帮助。
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 答题详情区 */}
          {testResult.questionResults && testResult.questionResults.length > 0 && (
            <View style={styles.questionDetailsSection}>
              <View style={styles.questionDetailsCard}>
                <View style={styles.sectionHeader}>
                  <LinearGradient
                    colors={['#f59e0b', '#eab308']}
                    style={styles.sectionIcon}
                  >
                    <FontAwesome6 name="list-ol" size={18} color={PrimaryColors.main} />
                  </LinearGradient>
                  <Text style={styles.sectionTitle}>答题详情</Text>
                </View>
                
                <View style={styles.questionDetailsList}>
                  {testResult.questionResults.map((questionResult, index) => (
                    <View key={index} style={styles.questionDetailItem}>
                      <View style={styles.questionNumber}>
                        <Text style={styles.questionNumberText}>第{index + 1}题</Text>
                      </View>
                      <View style={styles.questionContent}>
                        <Text style={styles.questionText}>{questionResult.question.text}</Text>
                        <View style={styles.userAnswerSection}>
                          <Text style={styles.userAnswerLabel}>您的选择：</Text>
                          <Text style={styles.userAnswerText}>{questionResult.userChoiceText}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* 底部间距 */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* 底部操作区 */}
        <View style={styles.bottomActions}>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.shareButton} onPress={handleSharePress}>
              <LinearGradient
                colors={[PrimaryColors.main, PrimaryColors.secondary]}
                style={styles.shareButtonGradient}
              >
                <FontAwesome6 name="share-nodes" size={16} color={TextColors.white} />
                <Text style={styles.shareButtonText}>分享结果</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.homeButton} onPress={handleHomePress}>
              <FontAwesome6 name="house" size={16} color={PrimaryColors.main} />
              <Text style={styles.homeButtonText}>返回首页</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI悬浮按钮 */}
        <TouchableOpacity
          style={styles.aiFloatingButton}
          onPress={() => {
            console.log('悬浮按钮点击，当前状态:', {
              aiButtonState,
              hasSavedResult: aiAnalysisState.hasSavedResult,
              aiAnalysisResult: testResult?.aiAnalysisResult
            });
            
            if (aiButtonState === 'viewable' || aiButtonState === 'completed') {
              // 如果有保存的结果，直接显示结果
              console.log('显示保存的AI分析结果');
              setShowAiResult(true);
            } else {
              // 否则进入补充信息输入
              console.log('进入补充信息输入');
              setShowSupplementInput(true);
            }
          }}
          disabled={aiButtonState === 'loading' || aiButtonState === 'regenerating'}
        >
          <LinearGradient
            colors={getButtonColors()}
            style={styles.aiFloatingIcon}
          >
            <FontAwesome6
              name={getButtonIconName()}
              size={18}
              color={TextColors.white}
            />
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>

      {/* AI分析结果弹窗 - 移到SafeAreaView外部 */}
      {(() => {
        console.log('弹窗渲染检查:', {
          showAiResult,
          hasResult: !!aiAnalysisState.result,
          status: aiAnalysisState.status,
          shouldShow: showAiResult && (aiAnalysisState.result || aiAnalysisState.status === 'analyzing')
        });
        return showAiResult && (aiAnalysisState.result || aiAnalysisState.status === 'analyzing');
      })() && (
        <View style={styles.aiModalOverlay}>
          <View style={styles.aiModalContent}>
              <View style={styles.aiModalHeader}>
                <Text style={styles.aiModalTitle}>AI深度分析</Text>
                <TouchableOpacity
                  style={CloseButtonStyles.container}
                  onPress={() => {
                    setShowAiResult(false);
                  }}
                  activeOpacity={0.7}
                >
                  <FontAwesome6 name="xmark" size={16} color={CloseButtonStyles.icon.color} />
                </TouchableOpacity>
              </View>
              <ScrollView 
                style={styles.aiModalScrollView}
                contentContainerStyle={{ 
                  padding: 16, 
                  paddingBottom: 20, // 减少底部内边距，按钮区域已经有自己的间距
                }}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                <AIAnalysisResultComponent
                  result={aiAnalysisState.result || {
                    currentSituation: 'AI正在分析您的测试结果...',
                    adjustmentSuggestions: '请稍候，正在生成个性化建议...',
                    注意事项: '分析完成后将显示注意事项...',
                    disclaimer: '本回答由 AI 生成，内容仅供参考，请仔细甄别。',
                    fullResponse: 'AI正在分析中...'
                  }}
                  onClose={() => {
                    setShowAiResult(false);
                    // 确保关闭弹窗后，按钮状态保持为可查看状态
                    if (aiAnalysisState.hasSavedResult && aiAnalysisState.result) {
                      setAiButtonState('viewable');
                    }
                  }}
                  onRegenerate={async () => {
                    try {
                      // 设置为重新生成状态，这样AISupplementInput会正确显示loading
                      setAiButtonState('regenerating');
                      setAiAnalysisState({
                        status: 'regenerating',
                        result: aiAnalysisState.result, // 保持当前结果可见
                        error: null,
                        hasSavedResult: true,
                      });
                      setShowAiResult(false);
                      setShowSupplementInput(true);
                    } catch (error) {
                      console.error('重新生成AI分析失败:', error);
                      setAiAnalysisState({
                        status: 'error',
                        result: null,
                        error: error instanceof Error ? error.message : '重新生成失败',
                        hasSavedResult: false,
                      });
                      setAiButtonState('error');
                    }
                  }}
                />
              </ScrollView>
            </View>
          </View>
        )}

      {/* AI补充信息输入弹窗 */}
      <AISupplementInput
        visible={showSupplementInput}
        onClose={() => setShowSupplementInput(false)}
        onSubmit={async (supplement) => {
            console.log('=== AI分析开始，onSubmit被调用 ===');
            console.log('当前状态:', {
              aiButtonState,
              aiAnalysisStateStatus: aiAnalysisState.status,
              hasTestResult: !!testResult,
              supplement: supplement?.substring(0, 50),
            });
            
            setShowSupplementInput(false);
            setAiSupplement(supplement);
            
            try {
              // 判断是首次分析还是重新生成
              const isRegenerating = aiButtonState === 'viewable' || aiButtonState === 'completed';
              console.log('分析类型判断:', { isRegenerating, currentButtonState: aiButtonState });
              
              if (isRegenerating) {
                setAiButtonState('regenerating');
                setAiAnalysisState({
                  status: 'regenerating',
                  result: aiAnalysisState.result, // 保持当前结果可见
                  error: null,
                  hasSavedResult: true,
                });
              } else {
                setAiButtonState('loading');
                setAiAnalysisState({
                  status: 'analyzing',
                  result: null,
                  error: null,
                  hasSavedResult: false,
                });
              }

              // 构建AI请求数据
              const aiRequestData = {
                testInfo: {
                  testType: testResult.testName,
                  testQuestions: testResult.questionResults?.map(qr => ({
                    id: qr.question.id,
                    content: qr.question.text,
                    options: qr.question.options.map(opt => opt.text),
                    userAnswer: qr.userChoiceText,
                    correctAnswer: qr.userChoiceText, // 对于心理测试，用户答案就是"正确"答案
                  })) || [],
                  userScore: testResult.score,
                  testResult: testResult.level,
                },
                userSupplement: supplement,
              };

              // 调用AI服务
              const aiService = AIService.getInstance();
              console.log('准备调用AI服务，请求数据:', {
                testType: aiRequestData.testInfo.testType,
                questionCount: aiRequestData.testInfo.testQuestions.length,
                hasSupplement: !!aiRequestData.userSupplement,
              });
              
              const analysisResult = await aiService.analyzeTestResult(aiRequestData);
              
              console.log('AI服务调用完成，返回结果:', {
                hasResult: !!analysisResult,
                resultType: typeof analysisResult,
                resultLength: analysisResult?.length || 0,
                resultPreview: analysisResult ? analysisResult.substring(0, 100) : 'null',
              });

              // 解析AI响应并更新状态 - 使用滑动窗口方式
              const parseAIResponse = (response: string): AIAnalysisResult => {
                console.log('开始解析AI响应，响应长度:', response?.length || 0);
                const sections = {
                  currentSituation: '',
                  adjustmentSuggestions: '',
                  注意事项: '',
                  disclaimer: '本回答由 AI 生成，内容仅供参考，请仔细甄别。',
                  fullResponse: response,
                };

                // 定义章节标题模式 - 支持多种格式（包括 Markdown ### 格式）
                interface SectionPattern {
                  key: 'currentSituation' | 'adjustmentSuggestions' | '注意事项';
                  patterns: RegExp[];
                }

                const sectionPatterns: SectionPattern[] = [
                  {
                    key: 'currentSituation',
                    patterns: [
                      /###\s*1[\.、]\s*当前情况分析(?:\s*\([^)]*\))?/i,  // Markdown 格式：### 1. 当前情况分析（可能有括号内容）
                      /1[\.、]\s*当前情况分析(?:\s*\([^)]*\))?/i,        // 普通格式：1. 当前情况分析
                      /一[\.、]\s*当前情况分析/i,
                      /①\s*当前情况分析/i,
                    ],
                  },
                  {
                    key: 'adjustmentSuggestions',
                    patterns: [
                      /###\s*2[\.、]\s*具体调整建议(?:\s*\([^)]*\))?/i,  // Markdown 格式：### 2. 具体调整建议（可能有括号内容）
                      /2[\.、]\s*具体调整建议(?:\s*\([^)]*\))?/i,        // 普通格式：2. 具体调整建议
                      /二[\.、]\s*具体调整建议/i,
                      /②\s*具体调整建议/i,
                    ],
                  },
                  {
                    key: '注意事项',
                    patterns: [
                      /###\s*3[\.、]\s*注意事项(?:\s*\([^)]*\))?/i,      // Markdown 格式：### 3. 注意事项（可能包含"和预警"等）
                      /3[\.、]\s*注意事项(?:\s*\([^)]*\))?/i,            // 普通格式：3. 注意事项
                      /三[\.、]\s*注意事项/i,
                      /③\s*注意事项/i,
                    ],
                  },
                ];

                // 滑动窗口扫描：找到所有章节标题的位置
                interface SectionMatch {
                  key: 'currentSituation' | 'adjustmentSuggestions' | '注意事项';
                  startIndex: number;
                  endIndex: number; // 标题结束位置（标题文本的结束）
                  fullMatch: string;
                }

                const sectionMatches: SectionMatch[] = [];

                console.log('开始匹配章节标题模式...');
                // 遍历所有章节模式，找到匹配的标题位置
                // 改进策略：每个章节只找第一个匹配，避免重复匹配导致的问题
                sectionPatterns.forEach((sectionPattern, sectionIndex) => {
                  console.log(`处理章节模式 ${sectionIndex + 1}: ${sectionPattern.key}`);
                  
                  // 如果已经找到这个章节的匹配，跳过
                  const existingMatch = sectionMatches.find(m => m.key === sectionPattern.key);
                  if (existingMatch) {
                    console.log(`  章节 ${sectionPattern.key} 已有匹配，跳过`);
                    return;
                  }
                  
                  // 尝试每个模式，找到第一个有效匹配就停止
                  for (let patternIndex = 0; patternIndex < sectionPattern.patterns.length; patternIndex++) {
                    const pattern = sectionPattern.patterns[patternIndex];
                    console.log(`  尝试模式 ${patternIndex + 1}: ${pattern}`);
                    
                    // 使用match方法而不是exec，只找第一个匹配
                    const match = response.match(pattern);
                    
                    if (match && match.index !== undefined) {
                      const startIndex = match.index;
                      const matchLength = match[0].length;
                      
                      // 确保匹配长度不为0
                      if (matchLength === 0) {
                        console.warn(`  模式 ${patternIndex + 1} 匹配到空字符串，跳过`);
                        continue;
                      }
                      
                      const endIndex = startIndex + matchLength;
                      
                      console.log(`    找到匹配: index=${startIndex}, length=${matchLength}, text="${match[0].substring(0, 30)}"`);
                      
                      // 添加匹配
                      sectionMatches.push({
                        key: sectionPattern.key,
                        startIndex,
                        endIndex,
                        fullMatch: match[0],
                      });
                      console.log(`    已添加匹配到 ${sectionPattern.key}，停止尝试其他模式`);
                      break; // 找到匹配后，停止尝试其他模式
                    } else {
                      console.log(`  模式 ${patternIndex + 1} 未找到匹配`);
                    }
                  }
                });

                console.log('章节标题匹配完成，找到的匹配数:', sectionMatches.length);
                console.log('匹配到的章节:', sectionMatches.map(m => ({ key: m.key, startIndex: m.startIndex, match: m.fullMatch.substring(0, 30) })));

                // 按位置排序
                sectionMatches.sort((a, b) => a.startIndex - b.startIndex);
                console.log('章节已按位置排序');

                // 根据标题位置切分内容
                console.log('开始切分内容，章节数:', sectionMatches.length);
                for (let i = 0; i < sectionMatches.length; i++) {
                  const currentMatch = sectionMatches[i];
                  const nextMatch = sectionMatches[i + 1];
                  
                  console.log(`处理第${i + 1}个章节:`, {
                    key: currentMatch.key,
                    startIndex: currentMatch.startIndex,
                    endIndex: currentMatch.endIndex,
                    nextStartIndex: nextMatch?.startIndex,
                  });
                  
                  // 计算内容开始位置（标题结束位置）
                  // 对于 Markdown 格式（###），需要找到标题行的结束位置
                  let contentStartIndex = currentMatch.endIndex;
                  
                  // 如果标题后面还有换行，跳过换行
                  while (contentStartIndex < response.length && 
                         (response[contentStartIndex] === '\n' || response[contentStartIndex] === '\r')) {
                    contentStartIndex++;
                  }
                  
                  // 计算内容结束位置
                  const contentEndIndex = nextMatch ? nextMatch.startIndex : response.length;
                  
                  console.log(`章节${currentMatch.key}内容范围:`, {
                    contentStartIndex,
                    contentEndIndex,
                    contentLength: contentEndIndex - contentStartIndex,
                  });
                  
                  // 提取内容（不包括标题本身）
                  // 使用 substring 精确提取，保留所有格式（包括换行、空格等）
                  let content = response.substring(contentStartIndex, contentEndIndex);
                  
                  // 只移除开头的空白字符（保留内容中的格式）
                  content = content.replace(/^[\s\n\r]+/, '');
                  
                  // 移除末尾的空白字符
                  content = content.replace(/[\s\n\r]+$/, '');
                  
                  sections[currentMatch.key] = content;
                  console.log(`章节${currentMatch.key}内容提取完成，长度:`, content.length);
                }
                console.log('所有章节内容切分完成');

                // 检查是否有章节未找到
                const foundKeys = sectionMatches.map(m => m.key);
                const allKeys: Array<'currentSituation' | 'adjustmentSuggestions' | '注意事项'> = ['currentSituation', 'adjustmentSuggestions', '注意事项'];
                const missingKeys = allKeys.filter(key => !foundKeys.includes(key));
                if (missingKeys.length > 0) {
                  console.warn('⚠️ 以下章节未找到:', missingKeys);
                }

                console.log('parseAIResponse解析完成，返回sections:', {
                  hasCurrentSituation: !!sections.currentSituation,
                  hasAdjustmentSuggestions: !!sections.adjustmentSuggestions,
                  has注意事项: !!sections['注意事项'],
                });
                return sections;
              };

              console.log('准备调用parseAIResponse，analysisResult类型:', typeof analysisResult);
              
              if (!analysisResult) {
                console.error('❌ analysisResult为空，无法解析');
                throw new Error('AI分析结果为空');
              }
              
              let parsedResult: AIAnalysisResult;
              try {
                console.log('开始调用parseAIResponse函数...');
                parsedResult = parseAIResponse(analysisResult);
                console.log('parseAIResponse函数调用成功');
              } catch (parseError) {
                console.error('❌ parseAIResponse函数执行出错:', parseError);
                console.error('错误详情:', {
                  errorMessage: parseError instanceof Error ? parseError.message : String(parseError),
                  errorStack: parseError instanceof Error ? parseError.stack : undefined,
                });
                // 即使解析失败，也创建一个基本的结果结构，避免完全失败
                parsedResult = {
                  currentSituation: '解析AI响应时出错，显示原始内容',
                  adjustmentSuggestions: '',
                  注意事项: '',
                  disclaimer: '本回答由 AI 生成，内容仅供参考，请仔细甄别。',
                  fullResponse: analysisResult,
                };
                console.log('已创建默认解析结果，使用原始响应');
              }
              
              // 添加解析后的详细日志
              console.log('AI响应解析完成:', {
                hasParsedResult: !!parsedResult,
                parsedResultKeys: parsedResult ? Object.keys(parsedResult) : [],
                hasCurrentSituation: !!parsedResult?.currentSituation,
                hasAdjustmentSuggestions: !!parsedResult?.adjustmentSuggestions,
                has注意事项: !!parsedResult?.['注意事项'],
                testResultExists: !!testResult,
                testResultId: testResult?.id,
                testResultName: testResult?.testName,
              });
              
              // 更新状态
              setAiAnalysisState({
                status: 'completed',
                result: parsedResult,
                error: null,
                hasSavedResult: true,
              });
              
              if (isRegenerating) {
                setAiButtonState('viewable');
                console.log('按钮状态已更新为 viewable (重新生成)');
              } else {
                setAiButtonState('completed');
                console.log('按钮状态已更新为 completed (首次分析)');
              }
              
              console.log('AI分析状态已更新:', {
                status: 'completed',
                hasResult: !!parsedResult,
                hasSavedResult: true,
                buttonState: isRegenerating ? 'viewable' : 'completed',
              });

              // 保存AI分析结果到数据库
              console.log('准备保存AI分析结果到数据库，条件检查:', {
                testResultExists: !!testResult,
                parsedResultExists: !!parsedResult,
                conditionMet: !!(testResult && parsedResult),
                testResultId: testResult?.id,
                testResultName: testResult?.testName,
              });
              
              if (testResult && parsedResult) {
                try {
                  console.log('开始保存AI分析结果到数据库...');
                  const dbManager = DatabaseManager.getInstance();
                  await dbManager.initialize();
                  console.log('数据库初始化完成');
                  
                  // 从当前测试记录获取必要的字段
                  const currentUser = await dbManager.getCurrentUser();
                  console.log('获取当前用户:', {
                    hasUser: !!currentUser,
                    userId: currentUser?.id || 'default-user',
                  });
                  
                  const recordId = testResult.id || params.record_id as string;
                  const recordData = {
                    id: recordId,
                    userId: currentUser?.id || 'default-user',
                    testTypeId: (() => {
                      // 根据测试名称确定正确的测试类型ID
                      if (testResult.testName.includes('心理') || testResult.testName.includes('抑郁')) {
                        return 'mental-health';
                      } else if (testResult.testName.includes('人格') || testResult.testName.includes('MBTI') || testResult.testName.includes('性格')) {
                        return 'personality';
                      } else if (testResult.testName.includes('认知')) {
                        return 'cognitive';
                      } else if (testResult.testName.includes('职业')) {
                        return 'career';
                      } else if (testResult.testName.includes('人际') || testResult.testName.includes('关系')) {
                        return 'relationship';
                      } else if (testResult.testName.includes('生活') || testResult.testName.includes('质量')) {
                        return 'quality-of-life';
                      } else if (testResult.testName.includes('自定义')) {
                        return 'custom';
                      } else if (testResult.testName.includes('压力')) {
                        return 'stress';
                      } else if (testResult.testName.includes('焦虑')) {
                        return 'anxiety';
                      } else {
                        return 'mental-health'; // 默认值
                      }
                    })(),
                    startTime: Date.now(),
                    endTime: Date.now(),
                    totalScore: testResult.score,
                    resultSummary: testResult.level,
                    improvementSuggestions: testResult.suggestions.map(s => s.text).join('; '),
                    referenceMaterials: null,
                    aiAnalysisResult: JSON.stringify(parsedResult),
                    createdAt: Date.now(),
                  };
                  
                  console.log('准备保存的测试记录数据:', {
                    id: recordData.id,
                    userId: recordData.userId,
                    testTypeId: recordData.testTypeId,
                    totalScore: recordData.totalScore,
                    hasAiAnalysisResult: !!recordData.aiAnalysisResult,
                    aiAnalysisResultLength: recordData.aiAnalysisResult?.length || 0,
                  });
                  
                  // 更新测试记录，保存AI分析结果
                  await dbManager.saveTestRecord(recordData as any);
                  
                  console.log('✅ AI分析结果已成功保存到数据库，记录ID:', recordId);
                  
                  // 更新本地状态，显示AI分析结果
                  setTestResult(prev => prev ? {
                    ...prev,
                    aiAnalysisResult: parsedResult
                  } : null);
                  
                  console.log('本地testResult状态已更新，包含AI分析结果');
                  
                } catch (dbError) {
                  console.error('❌ 保存AI分析结果到数据库失败:', dbError);
                  console.error('错误详情:', {
                    errorMessage: dbError instanceof Error ? dbError.message : String(dbError),
                    errorStack: dbError instanceof Error ? dbError.stack : undefined,
                    testResultId: testResult?.id,
                    hasParsedResult: !!parsedResult,
                  });
                  // 不阻止AI分析的完成，只是记录错误
                  // 但确保按钮状态已经正确更新
                  console.log('数据库保存失败，但按钮状态已更新，用户可以查看结果');
                }
              } else {
                console.warn('⚠️ 跳过保存AI分析结果到数据库，原因:', {
                  testResultExists: !!testResult,
                  parsedResultExists: !!parsedResult,
                  reason: !testResult ? 'testResult为空' : !parsedResult ? 'parsedResult为空' : '未知原因',
                });
              }

            } catch (error) {
              console.error('❌ AI分析失败，捕获到异常:', error);
              console.error('错误详情:', {
                errorMessage: error instanceof Error ? error.message : String(error),
                errorStack: error instanceof Error ? error.stack : undefined,
                errorType: error?.constructor?.name || typeof error,
              });
              
              // 显示具体的错误信息
              const errorMsg = error instanceof Error ? error.message : 'AI分析服务暂时不可用';
              setErrorMessage(errorMsg);
              setErrorVisible(true);
              
              setAiAnalysisState({
                status: 'error',
                result: null,
                error: errorMsg,
                hasSavedResult: false,
              });
              setAiButtonState('error');
              console.log('错误状态已设置，按钮状态已更新为error');
            }
          }}
          loading={aiButtonState === 'loading'}
        />
    {/* 错误提示组件 */}
    <ErrorToast
      visible={errorVisible}
      message={errorMessage}
      duration={3000}
      onClose={() => setErrorVisible(false)}
    />
    
    </LinearGradient>
  );
};

export default ResultDisplayScreen;

