

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Share, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface TestResult {
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
}

const ResultDisplayScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        const recordId = (params.record_id as string) || 'record1';
        const result = mockResults[recordId];
        
        if (result) {
          setTestResult(result);
        } else {
          Alert.alert('错误', '未找到测试记录');
        }
      } catch (error) {
        Alert.alert('错误', '加载测试结果失败');
      } finally {
        setIsLoading(false);
      }
    };

    loadTestResult();
  }, [params.record_id]);

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
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ResultDisplayScreen;

