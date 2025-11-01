

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from './styles';

interface HotTestItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  icon: string;
  gradientColors: [string, string, ...string[]];
}

interface CategoryItem {
  id: string;
  title: string;
  count: string;
  icon: string;
  gradientColors: [string, string, ...string[]];
}

const HomeScreen: React.FC = () => {
  const router = useRouter();

  const [hotTests] = useState<HotTestItem[]>([
    {
      id: 'depression',
      title: '抑郁症评估',
      description: '专业的抑郁症状筛查，帮助您了解心理状态',
      duration: '5-8分钟',
      difficulty: '简单',
      icon: 'heart',
      gradientColors: ['#f472b6', '#a855f7'],
    },
    {
      id: 'personality',
      title: 'MBTI性格测试',
      description: '经典的16型人格测试，深入了解性格特质',
      duration: '10-15分钟',
      difficulty: '中等',
      icon: 'user',
      gradientColors: ['#60a5fa', '#06b6d4'],
    },
    {
      id: 'stress',
      title: '压力水平评估',
      description: '科学评估当前压力状态，提供缓解建议',
      duration: '3-5分钟',
      difficulty: '简单',
      icon: 'brain',
      gradientColors: ['#fb923c', '#ef4444'],
    },
  ]);

  const [categories] = useState<CategoryItem[]>([
    {
      id: 'mental-health',
      title: '心理健康评估',
      count: '5个测试',
      icon: 'heart',
      gradientColors: ['#f472b6', '#a855f7'],
    },
    {
      id: 'personality',
      title: '人格特质分析',
      count: '3个测试',
      icon: 'user',
      gradientColors: ['#60a5fa', '#06b6d4'],
    },
    {
      id: 'cognitive',
      title: '认知能力测试',
      count: '3个测试',
      icon: 'brain',
      gradientColors: ['#8b5cf6', '#06b6d4'],
    },
    {
      id: 'career',
      title: '职业发展评估',
      count: '4个测试',
      icon: 'briefcase',
      gradientColors: ['#fb923c', '#ef4444'],
    },
    {
      id: 'relationship',
      title: '人际关系测评',
      count: '3个测试',
      icon: 'users',
      gradientColors: ['#4ade80', '#3b82f6'],
    },
    {
      id: 'quality-of-life',
      title: '生活质量评估',
      count: '3个测试',
      icon: 'leaf',
      gradientColors: ['#10b981', '#f59e0b'],
    },
  ]);

  const handleNotificationPress = () => {
    console.log('通知功能暂未实现');
  };

  const handleHotTestPress = (testId: string) => {
    router.push(`/p-test_detail?test_type_id=${testId}`);
  };

  const handleViewAllHotTests = () => {
    router.push('/p-test_category');
  };

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/p-test_category?category=${categoryId}`);
  };

  const handleViewAllActivity = () => {
    router.push('/p-history');
  };

  const handleRecentActivityPress = () => {
    router.push('/p-result_display?record_id=recent_activity_1');
  };

  const renderHotTestItem = ({ item }: { item: HotTestItem }) => (
    <TouchableOpacity
      style={styles.hotTestCard}
      onPress={() => handleHotTestPress(item.id)}
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
        <View style={styles.hotTestMetaItem}>
          <FontAwesome6 name="star" size={10} color="rgba(255, 255, 255, 0.6)" />
          <Text style={styles.hotTestMetaText}>{item.difficulty}</Text>
        </View>
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
      <Text style={styles.categoryCount}>{item.count}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        // 为Android平台添加额外的亮度调整
        {...(Platform.OS === 'android' ? { opacity: 0.95 } : {})}
      >
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
                  <FontAwesome6 name="brain" size={24} color="#6366f1" />
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
      </LinearGradient>
    </SafeAreaView>
  );
};

export default HomeScreen;

