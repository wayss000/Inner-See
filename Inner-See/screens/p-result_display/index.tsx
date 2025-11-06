

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
import styles from './styles';

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
        return ['#6366f1', '#8b5cf6'];
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
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>加载中...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* 顶部导航栏 */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <FontAwesome6 name="arrow-left" size={18} color="#ffffff" />
              </TouchableOpacity>
              <View style={styles.headerTitleSection}>
                <Text style={styles.pageTitle}>测试结果</Text>
                <Text style={styles.testName}>{testResult.testName}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.shareButtonHeader} onPress={handleSharePress}>
              <FontAwesome6 name="share-nodes" size={18} color="#ffffff" />
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
                  <FontAwesome6 name="clock" size={14} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.testMetaText}>用时 6分钟</Text>
                </View>
                <View style={styles.testMetaItem}>
                  <FontAwesome6 name="calendar" size={14} color="rgba(255, 255, 255, 0.8)" />
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
                  <FontAwesome6 name="lightbulb" size={18} color="#ffffff" />
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
                  <FontAwesome6 name="heart" size={18} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.sectionTitle}>改善建议</Text>
              </View>
              
              <View style={styles.suggestionsList}>
                {testResult.suggestions.map((suggestion, index) => (
                  <View key={index} style={styles.suggestionItem}>
                    <View style={styles.suggestionIcon}>
                      <FontAwesome6 name={suggestion.icon as any} size={14} color="#ffffff" />
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
                  <FontAwesome6 name="book" size={18} color="#ffffff" />
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
                    <FontAwesome6 name="list-ol" size={18} color="#ffffff" />
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
                colors={['#6366f1', '#8b5cf6']}
                style={styles.shareButtonGradient}
              >
                <FontAwesome6 name="share-nodes" size={16} color="#ffffff" />
                <Text style={styles.shareButtonText}>分享结果</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.homeButton} onPress={handleHomePress}>
              <FontAwesome6 name="house" size={16} color="#ffffff" />
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
              color="#ffffff"
            />
          </LinearGradient>
        </TouchableOpacity>

        {/* AI分析结果弹窗 */}
        {showAiResult && aiAnalysisState.result && (
          <View style={styles.aiModalOverlay}>
            <View style={styles.aiModalContent}>
              <View style={styles.aiModalHeader}>
                <Text style={styles.aiModalTitle}>AI深度分析</Text>
                <TouchableOpacity
                  style={styles.aiModalCloseButton}
                  onPress={() => {
                    setShowAiResult(false);
                  }}
                >
                  <FontAwesome6 name="times" size={16} color="#6b7280" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.aiModalScrollView}>
                <AIAnalysisResultComponent
                  result={aiAnalysisState.result}
                  onClose={() => {
                    setShowAiResult(false);
                    // 确保关闭弹窗后，按钮状态保持为可查看状态
                    if (aiAnalysisState.hasSavedResult && aiAnalysisState.result) {
                      setAiButtonState('viewable');
                    }
                  }}
                  onRegenerate={async () => {
                    try {
                      setAiButtonState('loading');
                      setAiAnalysisState({
                        status: 'analyzing',
                        result: null,
                        error: null,
                        hasSavedResult: false,
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
            setShowSupplementInput(false);
            setAiSupplement(supplement);
            
            try {
              // 判断是首次分析还是重新生成
              const isRegenerating = aiButtonState === 'viewable' || aiButtonState === 'completed';
              
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
              const analysisResult = await aiService.analyzeTestResult(aiRequestData);

              // 解析AI响应并更新状态
              const parseAIResponse = (response: string): AIAnalysisResult => {
                const sections = {
                  currentSituation: '',
                  adjustmentSuggestions: '',
                  注意事项: '',
                  disclaimer: '本回答由 AI 生成，内容仅供参考，请仔细甄别。',
                  fullResponse: response,
                };

                // 使用正则表达式提取分章节内容
                const currentSituationMatch = response.match(/1\.\s*当前情况分析[^2]*/i);
                const suggestionsMatch = response.match(/2\.\s*具体调整建议[^3]*/i);
                const notesMatch = response.match(/3\.\s*注意事项[^4]*/i);

                if (currentSituationMatch) {
                  sections.currentSituation = currentSituationMatch[0].replace('1. 当前情况分析', '').trim();
                }
                if (suggestionsMatch) {
                  sections.adjustmentSuggestions = suggestionsMatch[0].replace('2. 具体调整建议', '').trim();
                }
                if (notesMatch) {
                  sections.注意事项 = notesMatch[0].replace('3. 注意事项', '').trim();
                }

                return sections;
              };

              const parsedResult = parseAIResponse(analysisResult);
              
              // 更新状态
              setAiAnalysisState({
                status: 'completed',
                result: parsedResult,
                error: null,
                hasSavedResult: true,
              });
              
              if (isRegenerating) {
                setAiButtonState('viewable');
              } else {
                setAiButtonState('completed');
              }

              // 保存AI分析结果到数据库
              if (testResult && parsedResult) {
                try {
                  const dbManager = DatabaseManager.getInstance();
                  await dbManager.initialize();
                  
                  // 从当前测试记录获取必要的字段
                  const currentUser = await dbManager.getCurrentUser();
                  
                  // 更新测试记录，保存AI分析结果
                  await dbManager.saveTestRecord({
                    id: testResult.id || params.record_id as string,
                    userId: currentUser?.id || 'default-user',
                    testTypeId: testResult.testName === '抑郁症评估' ? 'mental-health' : 'mbti',
                    startTime: Date.now(),
                    endTime: Date.now(),
                    totalScore: testResult.score,
                    resultSummary: testResult.level,
                    improvementSuggestions: testResult.suggestions.map(s => s.text).join('; '),
                    referenceMaterials: null,
                    aiAnalysisResult: JSON.stringify(parsedResult),
                    createdAt: Date.now(),
                  } as any);
                  
                  console.log('AI分析结果已保存到数据库');
                  
                  // 更新本地状态，显示AI分析结果
                  setTestResult(prev => prev ? {
                    ...prev,
                    aiAnalysisResult: parsedResult
                  } : null);
                  
                } catch (dbError) {
                  console.error('保存AI分析结果到数据库失败:', dbError);
                  // 不阻止AI分析的完成，只是记录错误
                }
              }

            } catch (error) {
              console.error('AI分析失败:', error);
              setAiAnalysisState({
                status: 'error',
                result: null,
                error: error instanceof Error ? error.message : 'AI分析服务暂时不可用',
                hasSavedResult: false,
              });
              setAiButtonState('error');
            }
          }}
          loading={aiButtonState === 'loading'}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ResultDisplayScreen;

