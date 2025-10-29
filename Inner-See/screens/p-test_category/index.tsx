

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import TestTypeItem from './components/TestTypeItem';
import styles from './styles';
import { LazyLoadingQuestionService } from '../../src/services/LazyLoadingQuestionService';

interface TestType {
  id: string;
  title: string;
  description: string;
  duration: string;
  questions: string;
  icon: string;
  gradientColors: [string, string];
}

interface SimpleTestType {
  id: string;
  name: string;
  description: string;
  estimated_duration: number;
  question_count: number;
  category: string;
  icon: string;
}

const TestCategoryScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [testTypesData, setTestTypesData] = useState<SimpleTestType[]>([]);
  const [displayTestTypes, setDisplayTestTypes] = useState<TestType[]>([]);

  // 初始化应用和加载测试数据
  useEffect(() => {
    loadTestTypes();
  }, []);

  const loadTestTypes = async () => {
    try {
      setLoading(true);
      
      // 使用懒加载服务获取测试类型
      const questionService = LazyLoadingQuestionService.getInstance();
      await questionService.initialize();
      
      const testTypesFromDB = await questionService.getTestTypes();
      
      // 转换类型以匹配SimpleTestType接口
      const simpleTestTypes: SimpleTestType[] = testTypesFromDB.map(testType => ({
        id: testType.id,
        name: testType.name,
        description: testType.description,
        estimated_duration: testType.estimatedDuration,
        question_count: testType.questionCount,
        category: testType.category,
        icon: testType.icon
      }));
      
      setTestTypesData(simpleTestTypes);
      
      // 转换为UI组件需要的格式
      const uiTestTypes: TestType[] = testTypesFromDB.map(testType => ({
        id: testType.id,
        title: testType.name,
        description: testType.description,
        duration: `${testType.estimatedDuration}分钟`,
        questions: `${testType.questionCount}题`,
        icon: testType.icon,
        gradientColors: ['#f59e0b', '#ea580c']
      }));
      
      setDisplayTestTypes(uiTestTypes);
      console.log(`成功加载 ${testTypesFromDB.length} 个测试类型`);
    } catch (error) {
      console.error('加载测试类型失败:', error);
      // 回退到模拟数据
      const mockTestTypes: SimpleTestType[] = [
        {
          id: '1',
          name: '心理健康评估',
          description: '评估您的情绪状态、压力水平、焦虑程度和抑郁倾向',
          estimated_duration: 10,
          question_count: 20,
          category: '心理健康',
          icon: 'heart'
        },
        {
          id: '2',
          name: '人格特质分析',
          description: '分析您的性格类型、行为倾向和价值观',
          estimated_duration: 15,
          question_count: 25,
          category: '人格',
          icon: 'person'
        }
      ];
      
      setTestTypesData(mockTestTypes);
      const uiTestTypes: TestType[] = mockTestTypes.map(testType => ({
        id: testType.id,
        title: testType.name,
        description: testType.description,
        duration: `${testType.estimated_duration}分钟`,
        questions: `${testType.question_count}题`,
        icon: testType.icon,
        gradientColors: ['#f59e0b', '#ea580c']
      }));
      setDisplayTestTypes(uiTestTypes);
    } finally {
      setLoading(false);
    }
  };

  const testTypes: TestType[] = displayTestTypes.length > 0 ? displayTestTypes : [
    {
      id: 'iq-test',
      title: '智商测试',
      description: '专业的IQ测试，评估您的智力水平和认知能力',
      duration: '15-20分钟',
      questions: '30题',
      icon: 'brain',
      gradientColors: ['#f59e0b', '#ea580c']
    },
    {
      id: 'depression-test',
      title: '抑郁症评估',
      description: '专业的抑郁症状筛查，帮助您了解心理状态',
      duration: '5-8分钟',
      questions: '20题',
      icon: 'heart',
      gradientColors: ['#ec4899', '#8b5cf6']
    },
    {
      id: 'anxiety-test',
      title: '焦虑症筛查',
      description: '评估焦虑症状的严重程度，提供专业建议',
      duration: '3-5分钟',
      questions: '15题',
      icon: 'triangle-exclamation',
      gradientColors: ['#ef4444', '#ec4899']
    },
    {
      id: 'personality-test',
      title: 'MBTI性格测试',
      description: '经典的16型人格测试，深入了解性格特质',
      duration: '10-15分钟',
      questions: '40题',
      icon: 'user',
      gradientColors: ['#3b82f6', '#06b6d4']
    },
    {
      id: 'stress-test',
      title: '压力水平评估',
      description: '科学评估当前压力状态，提供缓解建议',
      duration: '3-5分钟',
      questions: '25题',
      icon: 'bolt',
      gradientColors: ['#ea580c', '#ef4444']
    },
    {
      id: 'relationship-test',
      title: '人际关系评估',
      description: '评估社交技能和人际关系处理能力',
      duration: '8-12分钟',
      questions: '35题',
      icon: 'users',
      gradientColors: ['#22c55e', '#3b82f6']
    },
    {
      id: 'career-test',
      title: '职业兴趣测试',
      description: '探索适合的职业方向和发展路径',
      duration: '12-18分钟',
      questions: '45题',
      icon: 'briefcase',
      gradientColors: ['#6366f1', '#8b5cf6']
    },
    {
      id: 'sleep-test',
      title: '睡眠质量评估',
      description: '评估睡眠状况，提供改善睡眠的建议',
      duration: '4-6分钟',
      questions: '20题',
      icon: 'moon',
      gradientColors: ['#6366f1', '#9333ea']
    },
    {
      id: 'sexuality-test',
      title: '性心理评估',
      description: '专业的性心理健康评估和指导',
      duration: '10-15分钟',
      questions: '30题',
      icon: 'heart-crack',
      gradientColors: ['#ec4899', '#dc2626']
    }
  ];

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleTestTypePress = (testId: string) => {
    router.push(`/p-test_detail?test_type_id=${testId}`);
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, paddingHorizontal: 24 }}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={{ color: '#ffffff', marginTop: 16, fontSize: 16 }}>正在加载测试类型...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* 顶部导航栏 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <FontAwesome6 name="arrow-left" size={18} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.titleSection}>
            <Text style={styles.pageTitle}>测试分类</Text>
            <Text style={styles.pageSubtitle}>选择您感兴趣的测试类型</Text>
          </View>
        </View>

        {/* 测试类型列表 */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.testTypesList}>
            {testTypes.map((testType) => (
              <TestTypeItem
                key={testType.id}
                testType={testType}
                onPress={() => handleTestTypePress(testType.id)}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default TestCategoryScreen;

