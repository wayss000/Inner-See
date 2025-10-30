

import * as React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import TestTypeItem from './components/TestTypeItem';
import styles from './styles';
import { ApiService } from '../../src/services/ApiService';

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
      
      // 转换为UI组件需要的格式
      const uiTestTypes: TestType[] = testTypesFromAPI.map(testType => ({
        id: testType.id,
        title: testType.name,
        description: testType.description,
        duration: `${testType.estimatedDuration}分钟`,
        questions: `${testType.questionCount}题`,
        icon: testType.icon,
        gradientColors: ['#f59e0b', '#ea580c']
      }));
      
      setDisplayTestTypes(uiTestTypes);
      console.log(`成功加载 ${testTypesFromAPI.length} 个测试类型`);
    } catch (error) {
      console.error('加载测试类型失败:', error);
      // 回退到模拟数据
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
        }
      ];
      
      setTestTypesData(fallbackTestTypes);
      const uiTestTypes: TestType[] = fallbackTestTypes.map(testType => ({
        id: testType.id,
        title: testType.name,
        description: testType.description,
        duration: `${testType.estimatedDuration}分钟`,
        questions: `${testType.questionCount}题`,
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
      id: 'mental-health',
      title: '心理健康评估',
      description: '评估您的情绪状态、压力水平、焦虑程度和抑郁倾向',
      duration: '10分钟',
      questions: '20题',
      icon: 'heart',
      gradientColors: ['#f59e0b', '#ea580c']
    },
    {
      id: 'personality',
      title: '人格特质分析',
      description: '分析您的性格类型、行为倾向和价值观',
      duration: '15分钟',
      questions: '25题',
      icon: 'person',
      gradientColors: ['#ec4899', '#8b5cf6']
    },
    {
      id: 'stress',
      title: '压力水平评估',
      description: '科学评估当前压力状态，提供缓解建议',
      duration: '5分钟',
      questions: '15题',
      icon: 'bolt',
      gradientColors: ['#ef4444', '#ec4899']
    },
    {
      id: 'anxiety',
      title: '焦虑症筛查',
      description: '评估焦虑症状的严重程度，提供专业建议',
      duration: '8分钟',
      questions: '18题',
      icon: 'triangle-exclamation',
      gradientColors: ['#ea580c', '#ef4444']
    },
    {
      id: 'depression',
      title: '抑郁症评估',
      description: '专业的抑郁症状筛查，帮助您了解心理状态',
      duration: '12分钟',
      questions: '22题',
      icon: 'cloud',
      gradientColors: ['#6366f1', '#8b5cf6']
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

