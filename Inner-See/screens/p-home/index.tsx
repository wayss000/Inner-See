

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from './styles';
import { getRandomItems, generateRandomHotTests, generateRandomCategories } from '../../src/utils/RandomUtils';
import { ApiService } from '../../src/services/ApiService';
import { BackgroundGradient, PrimaryColors } from '../../src/constants/Colors';

interface HotTestItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  icon: string;
  gradientColors: [string, string, ...string[]];
}

interface CustomTestItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  questions: string;
  icon: string;
  gradientColors: [string, string, ...string[]];
}

interface CategoryItem {
  id: string;
  title: string;
  count: string;
  duration: string;
  icon: string;
  gradientColors: [string, string, ...string[]];
}

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [hotTests, setHotTests] = useState<(HotTestItem | CustomTestItem)[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载随机测试数据
  const loadRandomTestData = async () => {
    try {
      setLoading(true);
      
      // 从API获取测试类型数据
      const apiService = ApiService.getInstance();
      const testTypes = await apiService.getTestTypes();
      
      if (testTypes && testTypes.length > 0) {
        // 从API数据中随机选择2个作为热门测试（自定义测试会占第一个位置）
        const hotTestOptions = testTypes.map(testType => ({
          id: testType.id,
          title: testType.name,
          description: testType.description,
          duration: `${testType.estimatedDuration}分钟`,
          difficulty: testType.estimatedDuration <= 5 ? '简单' : testType.estimatedDuration <= 10 ? '中等' : '困难',
          icon: testType.icon,
          gradientColors: getTestTypeGradient(testType.category)
        }));
        
        const selectedHotTests = getRandomItems(hotTestOptions, 2);
        // 将自定义测试添加到热门测试的第一个位置
        const customTest = getCustomTestConfig();
        setHotTests([customTest, ...selectedHotTests]);
        
        // 从API数据中随机选择4个作为首页展示的分类
        const categoryOptions = testTypes.map(testType => ({
          id: testType.id,
          title: testType.name,
          count: `${testType.questionCount}题`,
          duration: `${testType.estimatedDuration}分钟`,
          icon: testType.icon,
          gradientColors: getTestTypeGradient(testType.category)
        }));
        
        const selectedCategories = getRandomItems(categoryOptions, 4);
        setCategories(selectedCategories);
      } else {
        // API数据不可用时，使用备用的随机数据
        const backupHotTests = generateRandomHotTests(2);
        const customTest = getCustomTestConfig();
        setHotTests([customTest, ...backupHotTests]);
        setCategories(generateRandomCategories(4));
      }
    } catch (error) {
      console.error('加载测试数据失败:', error);
      // 出错时使用备用的随机数据
      const backupHotTests = generateRandomHotTests(2);
      const customTest = getCustomTestConfig();
      setHotTests([customTest, ...backupHotTests]);
      setCategories(generateRandomCategories(4));
    } finally {
      setLoading(false);
    }
  };

  // 获取测试类型对应的渐变色
  const getTestTypeGradient = (category: string): [string, string, ...string[]] => {
    const gradients: Record<string, [string, string, ...string[]]> = {
      '心理健康': ['#f472b6', '#a855f7'],
      '人格': ['#60a5fa', '#06b6d4'],
      '认知': ['#fb923c', '#ef4444'],
      '职业': ['#2dd4bf', '#06b6d4'],
      '人际': ['#818cf8', '#a855f7'],
      '生活': ['#4ade80', '#3b82f6'],
    };
    
    return gradients[category] || ['#f59e0b', '#ea580c'];
  };

  /**
   * 获取自定义测试的配置
   * @returns 自定义测试配置
   */
  const getCustomTestConfig = (): CustomTestItem => {
    return {
      id: 'custom',
      title: '自定义测试',
      description: '根据您的需求定制专属心理健康测试',
      duration: '个性化时长',
      questions: '个性化题数',
      icon: 'puzzle-piece',
      gradientColors: ['#f59e0b', '#d97706']
    };
  };

  useEffect(() => {
    loadRandomTestData();
  }, []);

  const handleNotificationPress = () => {
    console.log('通知功能暂未实现');
  };

  const handleHotTestPress = (testId: string) => {
    router.push(`/p-test_detail?test_type_id=${testId}`);
  };

  const handleViewAllHotTests = () => {
    router.push('/p-test_category');
  };

  // 分类到测试类型的映射关系
  const categoryToTestMap: Record<string, string> = {
    'mental-health': 'mental-health',      // 心理健康评估 -> 心理健康评估
    'personality': 'personality',          // 人格特质分析 -> 人格特质分析
    'cognitive': 'cognitive',              // 认知能力测试 -> 认知能力测试
    'career': 'career',                    // 职业发展评估 -> 职业发展评估
    'relationship': 'relationship',        // 人际关系测评 -> 人际关系测评
    'quality-of-life': 'quality-of-life',  // 生活质量评估 -> 生活质量评估
  };

  const handleCategoryPress = (categoryId: string) => {
    // 根据分类ID获取对应的测试类型ID
    const testTypeId = categoryToTestMap[categoryId];
    if (testTypeId) {
      // 直接跳转到测试详情页
      router.push(`/p-test_detail?test_type_id=${testTypeId}`);
    } else {
      // 如果没有找到对应的测试类型，则跳转到分类页面
      router.push(`/p-test_category?category=${categoryId}`);
    }
  };

  const handleViewAllActivity = () => {
    router.push('/p-history');
  };

  const handleRecentActivityPress = () => {
    router.push('/p-result_display?record_id=recent_activity_1');
  };

  const renderHotTestItem = ({ item }: { item: HotTestItem | CustomTestItem }) => (
    <TouchableOpacity
      style={styles.hotTestCard}
      onPress={() => {
        if (item.id === 'custom') {
          router.push('/p-custom_test');
        } else {
          handleHotTestPress(item.id);
        }
      }}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={item.gradientColors}
        style={styles.hotTestIcon}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <FontAwesome6 name={item.icon} size={20} color="#ffffff" />
      </LinearGradient>
      <Text style={styles.hotTestTitle}>{item.title}</Text>
      <Text style={styles.hotTestDescription}>{item.description}</Text>
      <View style={styles.hotTestMeta}>
        <View style={styles.hotTestMetaItem}>
          <FontAwesome6 name="clock" size={10} color="rgba(255, 255, 255, 0.6)" />
          <Text style={styles.hotTestMetaText}>{item.duration}</Text>
        </View>
        {item.id !== 'custom' && (
          <View style={styles.hotTestMetaItem}>
            <FontAwesome6 name="star" size={10} color="rgba(255, 255, 255, 0.6)" />
            <Text style={styles.hotTestMetaText}>{(item as HotTestItem).difficulty}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: CategoryItem }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item.id)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={item.gradientColors}
        style={styles.categoryIcon}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <FontAwesome6 name={item.icon} size={24} color="#ffffff" />
      </LinearGradient>
      <Text style={styles.categoryTitle}>{item.title}</Text>
      <View style={styles.categoryMeta}>
        <Text style={styles.categoryCount}>{item.count}</Text>
        <Text style={styles.categoryDuration}>{item.duration}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
      return (
        <LinearGradient
          colors={BackgroundGradient.primary}
          style={styles.container}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          // 为Android平台添加额外的亮度调整
          {...(Platform.OS === 'android' ? { opacity: 0.95 } : {})}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>正在加载测试数据...</Text>
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
        // 为Android平台添加额外的亮度调整
        {...(Platform.OS === 'android' ? { opacity: 0.95 } : {})}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
          {/* 顶部导航栏 */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={['#ffffff', '#f3f4f6']}
                  style={styles.logoBackground}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FontAwesome6 name="brain" size={24} color={PrimaryColors.main} />
                </LinearGradient>
              </View>
              <View style={styles.appTitleSection}>
                <Text style={styles.appTitle}>心探</Text>
                <Text style={styles.appSubtitle}>探索内心，了解自我</Text>
              </View>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={handleNotificationPress}
                activeOpacity={0.8}
              >
                <FontAwesome6 name="bell" size={18} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 热门测试推荐区 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>热门测试</Text>
              <TouchableOpacity onPress={handleViewAllHotTests} activeOpacity={0.8}>
                <Text style={styles.viewAllButton}>查看全部</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={hotTests}
              renderItem={renderHotTestItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hotTestsContainer}
            />
          </View>

          {/* 测试分类入口区 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>测试分类</Text>
            </View>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.categoryRow}
              scrollEnabled={false}
            />
          </View>

          {/* 最近活动区 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>最近活动</Text>
              <TouchableOpacity onPress={handleViewAllActivity} activeOpacity={0.8}>
                <Text style={styles.viewAllButton}>查看全部</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.recentActivityCard}
              onPress={handleRecentActivityPress}
              activeOpacity={0.8}
            >
              <View style={styles.activityContent}>
                <LinearGradient
                  colors={['#4ade80', '#3b82f6']}
                  style={styles.activityIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FontAwesome6 name="check" size={18} color="#ffffff" />
                </LinearGradient>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>完成焦虑症筛查</Text>
                  <Text style={styles.activityTime}>2小时前</Text>
                </View>
                <View style={styles.activityScore}>
                  <Text style={styles.scoreValue}>15</Text>
                  <Text style={styles.scoreLabel}>测试分数</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomeScreen;

