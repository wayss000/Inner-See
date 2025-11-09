

import * as React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import TestTypeItem from './components/TestTypeItem';
import styles from './styles';
import { ApiService } from '../../src/services/ApiService';
import { BackgroundGradient } from '../../src/constants/Colors';

const { useEffect, useState } = React;

interface TestType {
  id: string;
  title: string;
  description: string;
  duration: string;
  questions: string;
  icon: string;
  gradientColors: [string, string];
}

interface ApiTestType {
  id: string;
  name: string;
  description: string;
  estimatedDuration: number;
  questionCount: number;
  category: string;
  icon: string;
}

/**
 * 根据测试类型分类获取对应的渐变色
 * @param category 测试类型分类
 * @returns 渐变色数组
 */
function getTestTypeGradient(category: string): [string, string] {
  const gradients: Record<string, [string, string]> = {
    '心理健康': ['#f472b6', '#a855f7'],
    '人格': ['#60a5fa', '#06b6d4'],
    '认知': ['#fb923c', '#ef4444'],
    '职业': ['#2dd4bf', '#06b6d4'],
    '人际': ['#818cf8', '#a855f7'],
    '生活': ['#4ade80', '#3b82f6'],
  };
  
  return gradients[category] || ['#f59e0b', '#ea580c'];
}


const TestCategoryScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [testTypesData, setTestTypesData] = useState<ApiTestType[]>([]);
  const [displayTestTypes, setDisplayTestTypes] = useState<TestType[]>([]);

  // 初始化应用和加载测试数据
  useEffect(() => {
    loadTestTypes();
  }, []);

  const loadTestTypes = async () => {
    try {
      setLoading(true);
      
      // 使用HTTP API服务获取测试类型
      const apiService = ApiService.getInstance();
      const testTypesFromAPI = await apiService.getTestTypes();
      
      setTestTypesData(testTypesFromAPI);
      
      // 转换所有API数据为UI格式，不进行随机选择
      const allTestTypes = testTypesFromAPI.map(testType => ({
        id: testType.id,
        title: testType.name,
        description: testType.description,
        duration: `${testType.estimatedDuration}分钟`,
        questions: `${testType.questionCount}题`,
        icon: testType.icon,
        gradientColors: getTestTypeGradient(testType.category)
      }));
      
      setDisplayTestTypes(allTestTypes);
      console.log(`成功加载 ${testTypesFromAPI.length} 个测试类型`);
    } catch (error) {
      console.error('加载测试类型失败:', error);
      
      // 回退到模拟数据，展示全部6个测试类型
      const fallbackTestTypes: ApiTestType[] = [
        {
          id: 'mental-health',
          name: '心理健康评估',
          description: '评估您的情绪状态、压力水平、焦虑程度和抑郁倾向',
          estimatedDuration: 10,
          questionCount: 20,
          category: '心理健康',
          icon: 'heart'
        },
        {
          id: 'personality',
          name: '人格特质分析',
          description: '分析您的性格类型、行为倾向和价值观',
          estimatedDuration: 15,
          questionCount: 25,
          category: '人格',
          icon: 'person'
        },
        {
          id: 'cognitive',
          name: '认知能力测试',
          description: '测试您的逻辑思维、空间想象和语言理解能力',
          estimatedDuration: 12,
          questionCount: 15,
          category: '认知',
          icon: 'brain'
        },
        {
          id: 'career',
          name: '职业发展评估',
          description: '评估您的职业兴趣、工作满意度和职业规划',
          estimatedDuration: 10,
          questionCount: 18,
          category: '职业',
          icon: 'briefcase'
        },
        {
          id: 'relationship',
          name: '人际关系测评',
          description: '评估您的亲密关系、社交能力和沟通风格',
          estimatedDuration: 8,
          questionCount: 16,
          category: '人际',
          icon: 'users'
        },
        {
          id: 'quality-of-life',
          name: '生活质量评估',
          description: '评估您的睡眠质量、生活习惯和情绪管理能力',
          estimatedDuration: 10,
          questionCount: 14,
          category: '生活',
          icon: 'leaf'
        }
      ];
      
      setTestTypesData(fallbackTestTypes);
      
      // 将所有fallback数据转换为UI格式
      const allFallbackTestTypes = fallbackTestTypes.map(testType => ({
        id: testType.id,
        title: testType.name,
        description: testType.description,
        duration: `${testType.estimatedDuration}分钟`,
        questions: `${testType.questionCount}题`,
        icon: testType.icon,
        gradientColors: getTestTypeGradient(testType.category)
      }));
      
      setDisplayTestTypes(allFallbackTestTypes);
    } finally {
      setLoading(false);
    }
  };

  const testTypes: TestType[] = displayTestTypes.length > 0 ? displayTestTypes : [
    {
      id: 'mental-health',
      title: '心理健康评估',
      description: '评估您的情绪状态、压力水平、焦虑程度和抑郁倾向',
      duration: '10分钟',
      questions: '20题',
      icon: 'heart',
      gradientColors: ['#f472b6', '#a855f7']
    },
    {
      id: 'personality',
      title: '人格特质分析',
      description: '分析您的性格类型、行为倾向和价值观',
      duration: '15分钟',
      questions: '25题',
      icon: 'user',
      gradientColors: ['#60a5fa', '#06b6d4']
    },
    {
      id: 'cognitive',
      title: '认知能力测试',
      description: '测试您的逻辑思维、空间想象和语言理解能力',
      duration: '12分钟',
      questions: '15题',
      icon: 'brain',
      gradientColors: ['#fb923c', '#ef4444']
    },
    {
      id: 'career',
      title: '职业发展评估',
      description: '评估您的职业兴趣、工作满意度和职业规划',
      duration: '10分钟',
      questions: '18题',
      icon: 'briefcase',
      gradientColors: ['#2dd4bf', '#06b6d4']
    },
    {
      id: 'relationship',
      title: '人际关系测评',
      description: '评估您的亲密关系、社交能力和沟通风格',
      duration: '8分钟',
      questions: '16题',
      icon: 'users',
      gradientColors: ['#818cf8', '#a855f7']
    },
    {
      id: 'quality-of-life',
      title: '生活质量评估',
      description: '评估您的睡眠质量、生活习惯和情绪管理能力',
      duration: '10分钟',
      questions: '14题',
      icon: 'leaf',
      gradientColors: ['#4ade80', '#3b82f6']
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
        colors={BackgroundGradient.primary}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>正在加载测试类型...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={BackgroundGradient.primary}
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
            {/* 其他测试类型 */}
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

