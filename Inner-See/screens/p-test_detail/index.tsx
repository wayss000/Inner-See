

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
  const params = useLocalSearchParams();
  const testType = (params.test_type_id as string) || 'depression';
  const [currentTestData, setCurrentTestData] = useState<TestData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 测试数据模拟
  const testDataMap: Record<string, TestData> = {
    'mental-health': {
      title: '心理健康评估',
      category: '心理健康评估',
      icon: 'heart',
      iconGradient: ['#f472b6', '#a855f7'],
      duration: '10分钟',
      questions: '20题',
      difficulty: '简单',
      description: '全面的心理健康评估，涵盖情绪状态、压力水平、焦虑程度和抑郁倾向的综合测评。通过科学的量表和专业的评估方法，帮助您全面了解自己的心理状态。',
      features: [
        '全面评估：涵盖多个心理健康维度',
        '专业权威：基于国际标准量表',
        '隐私保护：所有数据本地存储',
        '详细解读：提供专业改善建议'
      ]
    },
    'personality': {
      title: '人格特质分析',
      category: '人格特质分析',
      icon: 'user',
      iconGradient: ['#60a5fa', '#06b6d4'],
      duration: '15分钟',
      questions: '25题',
      difficulty: '中等',
      description: '专业的人格特质分析测试，基于MBTI理论和大五人格模型，深入分析您的性格类型、行为倾向和价值观取向。',
      features: [
        '科学理论：基于MBTI和大五人格',
        '深度分析：多维度人格特质解读',
        '实用建议：基于性格的发展指导',
        '职业匹配：提供职业发展建议'
      ]
    },
    'cognitive': {
      title: '认知能力测试',
      category: '认知能力测试',
      icon: 'brain',
      iconGradient: ['#8b5cf6', '#06b6d4'],
      duration: '12分钟',
      questions: '15题',
      difficulty: '中等',
      description: '全面的认知能力评估，测试您的逻辑思维、空间想象、语言理解和记忆力等核心认知能力。',
      features: [
        '全面测试：涵盖多种认知能力',
        '科学设计：基于认知心理学研究',
        '能力评估：准确评估认知水平',
        '发展建议：提供能力提升指导'
      ]
    },
    'career': {
      title: '职业发展评估',
      category: '职业发展评估',
      icon: 'briefcase',
      iconGradient: ['#fb923c', '#ef4444'],
      duration: '10分钟',
      questions: '18题',
      difficulty: '简单',
      description: '专业的职业发展评估，涵盖职业兴趣、工作满意度、职业规划和职业技能的全面测评。',
      features: [
        '职业规划：明确职业发展方向',
        '兴趣匹配：发现适合的职业类型',
        '能力评估：了解职业技能水平',
        '发展建议：提供职业发展指导'
      ]
    },
    'relationship': {
      title: '人际关系测评',
      category: '人际关系测评',
      icon: 'users',
      iconGradient: ['#4ade80', '#3b82f6'],
      duration: '8分钟',
      questions: '16题',
      difficulty: '简单',
      description: '全面的人际关系测评，评估您的亲密关系、社交能力、沟通风格和冲突处理能力。',
      features: [
        '关系评估：全面评估人际关系',
        '沟通分析：了解沟通风格',
        '社交能力：评估社交技巧',
        '改善建议：提供关系改善指导'
      ]
    },
    'quality-of-life': {
      title: '生活质量评估',
      category: '生活质量评估',
      icon: 'leaf',
      iconGradient: ['#10b981', '#f59e0b'],
      duration: '10分钟',
      questions: '14题',
      difficulty: '简单',
      description: '全面的生活质量评估，涵盖睡眠质量、生活习惯、情绪管理和生活平衡的综合测评。',
      features: [
        '全面评估：涵盖生活质量多个维度',
        '健康指导：提供健康生活建议',
        '平衡评估：评估工作生活平衡',
        '改善方案：提供生活质量提升建议'
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
    router.push(`/p-test_question?test_type_id=${testType || 'depression'}`);
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

