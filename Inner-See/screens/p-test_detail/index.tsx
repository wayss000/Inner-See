

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface TestData {
  title: string;
  category: string;
  icon: string;
  iconGradient: [string, string, ...string[]];
  duration: string;
  questions: string;
  difficulty: string;
  description: string;
  features: string[];
}

const TestDetailScreen = () => {
  const router = useRouter();
  const { testType } = useLocalSearchParams<{ testType: string }>();
  const [currentTestData, setCurrentTestData] = useState<TestData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 测试数据模拟
  const testDataMap: Record<string, TestData> = {
    'depression': {
      title: '抑郁症评估',
      category: '心理健康',
      icon: 'heart',
      iconGradient: ['#f472b6', '#a855f7'],
      duration: '5-8分钟',
      questions: '20题',
      difficulty: '简单',
      description: '这是一份专业的抑郁症评估量表，基于国际通用的抑郁症状筛查标准编制。通过回答一系列问题，您可以了解自己当前的心理状态，及时发现潜在的抑郁倾向。',
      features: [
        '专业权威：基于国际标准量表',
        '隐私保护：所有数据本地存储',
        '详细解读：提供专业改善建议'
      ]
    },
    'personality': {
      title: 'MBTI性格测试',
      category: '性格分析',
      icon: 'user',
      iconGradient: ['#60a5fa', '#06b6d4'],
      duration: '10-15分钟',
      questions: '48题',
      difficulty: '中等',
      description: '经典的MBTI 16型人格测试，通过对您的行为偏好和思维方式的评估，帮助您深入了解自己的性格特质和适合的发展方向。',
      features: [
        '经典权威：国际知名的性格测试',
        '深度分析：16种人格类型详细解读',
        '实用建议：基于性格的发展指导'
      ]
    },
    'stress': {
      title: '压力水平评估',
      category: '心理健康',
      icon: 'brain',
      iconGradient: ['#fb923c', '#ef4444'],
      duration: '3-5分钟',
      questions: '15题',
      difficulty: '简单',
      description: '科学的压力水平评估工具，帮助您了解当前的压力状态，识别压力来源，并提供有效的压力管理建议。',
      features: [
        '快速便捷：3-5分钟完成评估',
        '科学准确：基于压力心理学研究',
        '实用建议：个性化压力管理方案'
      ]
    },
    'anxiety': {
      title: '焦虑症筛查',
      category: '心理健康',
      icon: 'triangle-exclamation',
      iconGradient: ['#fbbf24', '#f97316'],
      duration: '4-6分钟',
      questions: '18题',
      difficulty: '简单',
      description: '专业的焦虑症状筛查工具，帮助您识别焦虑倾向，了解焦虑程度，并获得专业的应对建议。',
      features: [
        '专业筛查：早期识别焦虑症状',
        '分级评估：准确判断焦虑程度',
        '应对策略：实用的缓解方法'
      ]
    },
    'sleep': {
      title: '睡眠质量评估',
      category: '心理健康',
      icon: 'moon',
      iconGradient: ['#818cf8', '#a855f7'],
      duration: '3-4分钟',
      questions: '12题',
      difficulty: '简单',
      description: '全面的睡眠质量评估，帮助您了解睡眠状况，识别睡眠问题，并提供改善睡眠的专业建议。',
      features: [
        '全面评估：多维度睡眠质量分析',
        '问题识别：准确发现睡眠障碍',
        '改善方案：科学的睡眠建议'
      ]
    }
  };

  useEffect(() => {
    const loadTestData = () => {
      try {
        setIsLoading(true);
        const testTypeKey = testType || 'depression';
        const testData = testDataMap[testTypeKey];
        
        if (!testData) {
          Alert.alert('错误', '测试类型不存在');
          router.back();
          return;
        }
        
        setCurrentTestData(testData);
      } catch (error) {
        console.error('加载测试数据失败:', error);
        Alert.alert('错误', '加载数据失败，请重试');
      } finally {
        setIsLoading(false);
      }
    };

    loadTestData();
  }, [testType, router]);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/p-home');
    }
  };

  const handleStartTestPress = () => {
    if (!currentTestData) return;
    
    // 添加点击反馈效果的逻辑可以通过动画库实现
    router.push(`/p-test_question?testType=${testType || 'depression'}`);
  };

  if (isLoading || !currentTestData) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>加载中...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 顶部导航栏 */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <FontAwesome6 name="arrow-left" size={18} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.headerTitleSection}>
              <Text style={styles.pageTitle}>测试详情</Text>
            </View>
          </View>

          {/* 测试信息区 */}
          <View style={styles.testInfoSection}>
            {/* 测试标题和图标 */}
            <View style={styles.testHeaderCard}>
              <View style={styles.testHeaderContent}>
                <LinearGradient
                  colors={currentTestData.iconGradient}
                  style={styles.testIconContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FontAwesome6 
                    name={currentTestData.icon as any} 
                    size={30} 
                    color="#ffffff" 
                  />
                </LinearGradient>
                <View style={styles.testTitleSection}>
                  <Text style={styles.testTitle}>{currentTestData.title}</Text>
                  <Text style={styles.testCategory}>{currentTestData.category}</Text>
                </View>
              </View>
            </View>

            {/* 测试元信息 */}
            <View style={styles.testMetaSection}>
              <View style={styles.metaItem}>
                <LinearGradient
                  colors={['#60a5fa', '#06b6d4']}
                  style={styles.metaIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FontAwesome6 name="clock" size={14} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.metaValue}>{currentTestData.duration}</Text>
                <Text style={styles.metaLabel}>预计时长</Text>
              </View>
              
              <View style={styles.metaItem}>
                <LinearGradient
                  colors={['#4ade80', '#3b82f6']}
                  style={styles.metaIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FontAwesome6 name="circle-question" size={14} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.metaValue}>{currentTestData.questions}</Text>
                <Text style={styles.metaLabel}>题目数量</Text>
              </View>
              
              <View style={styles.metaItem}>
                <LinearGradient
                  colors={['#fb923c', '#ef4444']}
                  style={styles.metaIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FontAwesome6 name="star" size={14} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.metaValue}>{currentTestData.difficulty}</Text>
                <Text style={styles.metaLabel}>难度等级</Text>
              </View>
            </View>

            {/* 测试详细描述 */}
            <View style={styles.testDescriptionCard}>
              <Text style={styles.descriptionTitle}>测试介绍</Text>
              <View style={styles.testDescription}>
                <Text style={styles.descriptionText}>
                  {currentTestData.description}
                </Text>
                <View style={styles.descriptionFeatures}>
                  {currentTestData.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <LinearGradient
                        colors={['#4ade80', '#3b82f6']}
                        style={styles.featureIcon}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <FontAwesome6 name="check" size={10} color="#ffffff" />
                      </LinearGradient>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* 测试注意事项 */}
            <View style={styles.testNoticeCard}>
              <View style={styles.noticeTitleContainer}>
                <FontAwesome6 name="circle-info" size={16} color="#f59e0b" />
                <Text style={styles.noticeTitle}>测试须知</Text>
              </View>
              <View style={styles.testNotice}>
                <View style={styles.noticeItem}>
                  <View style={styles.noticeBullet} />
                  <Text style={styles.noticeText}>
                    请在安静的环境中完成测试，确保答案真实反映您的实际情况
                  </Text>
                </View>
                <View style={styles.noticeItem}>
                  <View style={styles.noticeBullet} />
                  <Text style={styles.noticeText}>
                    测试结果仅供参考，不能替代专业的医学诊断
                  </Text>
                </View>
                <View style={styles.noticeItem}>
                  <View style={styles.noticeBullet} />
                  <Text style={styles.noticeText}>
                    如测试结果显示需要专业帮助，请及时咨询心理医生或专业人士
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* 底部开始测试按钮 */}
        <View style={styles.bottomAction}>
          <TouchableOpacity 
            style={styles.startTestButton}
            onPress={handleStartTestPress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              style={styles.startButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome6 name="play" size={20} color="#ffffff" />
              <Text style={styles.startButtonText}>开始测试</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default TestDetailScreen;

