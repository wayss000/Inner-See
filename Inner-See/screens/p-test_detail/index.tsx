

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';
import { BackgroundGradient, PrimaryColors, TextColors } from '../../src/constants/Colors';
import { ApiService } from '../../src/services/ApiService';

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

// 自定义测试的配置
const getCustomTestConfig = (): TestData => ({
  title: '自定义测试',
  category: '自定义测试',
  icon: 'puzzle-piece',
  iconGradient: ['#f59e0b', '#d97706'],
  duration: '个性化时长',
  questions: '个性化题数',
  difficulty: '自定义',
  description: '根据您的需求定制专属心理健康测试，灵活调整测试内容和难度，为您提供个性化的心理健康评估体验。',
  features: [
    '个性化定制：根据您的需求调整测试内容',
    '灵活配置：可选择测试难度和时长',
    '专业指导：基于您的具体情况提供专业建议',
    '隐私保护：所有数据本地存储，确保隐私安全'
  ]
});

const TestDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const testType = (params.test_type_id as string) || 'depression';
  const [currentTestData, setCurrentTestData] = useState<TestData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const apiService = ApiService.getInstance();

  // 根据测试类型获取对应的渐变色
  const getTestTypeGradient = (category: string): [string, string, ...string[]] => {
    const gradients: Record<string, [string, string, ...string[]]> = {
      '心理健康': ['#f472b6', '#a855f7'],
      '人格': ['#60a5fa', '#06b6d4'],
      '认知': ['#fb923c', '#ef4444'],
      '职业': ['#2dd4bf', '#06b6d4'],
      '人际': ['#818cf8', '#a855f7'],
      '生活': ['#4ade80', '#3b82f6'],
    };
    
    return gradients[category] || ['#f59e0b', '#d97706'];
  };

  // 获取测试难度等级
  const getDifficultyLevel = (duration: number): string => {
    if (duration <= 5) return '简单';
    if (duration <= 10) return '中等';
    return '困难';
  };

  // 加载测试数据
  const loadTestData = async () => {
    try {
      setIsLoading(true);
      
      // 如果是自定义测试，直接返回配置
      if (testType === 'custom') {
        setCurrentTestData(getCustomTestConfig());
        return;
      }
      
      // 从 API 获取测试类型数据
      const testTypeData = await apiService.getTestTypeById(testType);
      
      if (!testTypeData) {
        Alert.alert('错误', '测试类型不存在');
        router.back();
        return;
      }
      
      // 转换 API 数据为 UI 格式
      const testData: TestData = {
        title: testTypeData.name,
        category: testTypeData.name,
        icon: testTypeData.icon,
        iconGradient: getTestTypeGradient(testTypeData.category),
        duration: `${testTypeData.estimatedDuration}分钟`,
        questions: `${testTypeData.questionCount}题`,
        difficulty: getDifficultyLevel(testTypeData.estimatedDuration),
        description: testTypeData.description,
        features: [
          '科学评估：基于专业量表和研究',
          '个性化反馈：根据您的情况提供定制建议',
          '隐私保护：所有数据本地存储',
          '专业指导：提供改善建议和发展方向'
        ]
      };
      
      setCurrentTestData(testData);
    } catch (error) {
      console.error('加载测试数据失败:', error);
      Alert.alert('错误', '加载数据失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
    
    // 如果是自定义测试，跳转到自定义测试页面
    if (testType === 'custom') {
      router.push('/p-custom_test');
      return;
    }
    
    // 添加点击反馈效果的逻辑可以通过动画库实现
    router.push(`/p-test_question?test_type_id=${testType || 'depression'}`);
  };

  if (isLoading || !currentTestData) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={BackgroundGradient.primary}
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
        colors={BackgroundGradient.primary}
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
              <FontAwesome6 name="arrow-left" size={18} color={PrimaryColors.main} />
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
                    color={TextColors.white} 
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
                  <FontAwesome6 name="clock" size={14} color={TextColors.white} />
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
                  <FontAwesome6 name="circle-question" size={14} color={PrimaryColors.main} />
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
                  <FontAwesome6 name="star" size={14} color={PrimaryColors.main} />
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
                        <FontAwesome6 name="check" size={10} color={TextColors.white} />
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
              colors={[PrimaryColors.main, PrimaryColors.secondary]}
              style={styles.startButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome6 name="play" size={20} color={TextColors.white} />
              <Text style={styles.startButtonText}>开始测试</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default TestDetailScreen;

