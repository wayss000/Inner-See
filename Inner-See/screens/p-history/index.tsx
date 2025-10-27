

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';
import StatsCard from './components/StatsCard';
import TestRecordItem from './components/TestRecordItem';
import EmptyState from './components/EmptyState';

interface TestRecord {
  id: string;
  title: string;
  time: string;
  score?: number;
  level?: string;
  type?: string;
  description?: string;
  icon: string;
  gradientColors: [string, string, ...string[]];
  levelColor?: string;
}

interface StatsData {
  totalTests: number;
  thisWeek: number;
  avgScore: number;
}

const HistoryScreen: React.FC = () => {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(false);

  const [statsData] = useState<StatsData>({
    totalTests: 8,
    thisWeek: 3,
    avgScore: 75,
  });

  const [testRecords] = useState<TestRecord[]>([
    {
      id: 'record_001',
      title: '抑郁症评估',
      time: '今天 14:30',
      score: 22,
      level: '轻度抑郁',
      icon: 'heart',
      gradientColors: ['#f472b6', '#a855f7'],
      levelColor: '#fb923c',
    },
    {
      id: 'record_002',
      title: 'MBTI性格测试',
      time: '昨天 19:45',
      type: 'INFP',
      description: '调停者',
      icon: 'user',
      gradientColors: ['#60a5fa', '#06b6d4'],
    },
    {
      id: 'record_003',
      title: '焦虑症筛查',
      time: '2天前 16:20',
      score: 15,
      level: '正常范围',
      icon: 'brain',
      gradientColors: ['#fb923c', '#ef4444'],
      levelColor: '#4ade80',
    },
    {
      id: 'record_004',
      title: '压力水平评估',
      time: '3天前 20:15',
      score: 68,
      level: '中度压力',
      icon: 'scale-balanced',
      gradientColors: ['#4ade80', '#3b82f6'],
      levelColor: '#fbbf24',
    },
    {
      id: 'record_005',
      title: '睡眠质量评估',
      time: '1周前 22:30',
      score: 72,
      level: '良好',
      icon: 'moon',
      gradientColors: ['#818cf8', '#a855f7'],
      levelColor: '#4ade80',
    },
    {
      id: 'record_006',
      title: '职业兴趣测试',
      time: '2周前 15:45',
      type: '艺术型',
      description: 'A类',
      icon: 'briefcase',
      gradientColors: ['#2dd4bf', '#06b6d4'],
    },
  ]);

  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  const handleTestRecordPress = useCallback((recordId: string) => {
    router.push(`/p-result_display?recordId=${recordId}`);
  }, [router]);

  const handleLoadMorePress = useCallback(() => {
    setIsLoadingMore(true);
    // 模拟加载更多记录
    setTimeout(() => {
      setIsLoadingMore(false);
      Alert.alert('提示', '已加载全部记录');
    }, 1000);
  }, []);

  const handleStartFirstTestPress = useCallback(() => {
    router.push('/p-home');
  }, [router]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // 模拟刷新数据
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <FontAwesome6 name="arrow-left" size={18} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.pageTitleSection}>
            <Text style={styles.pageTitle}>测试历史</Text>
            <Text style={styles.pageSubtitle}>查看您的测试记录</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderStatsSection = () => (
    <View style={styles.statsSection}>
      <StatsCard statsData={statsData} />
    </View>
  );

  const renderTestRecordsSection = () => (
    <View style={styles.testRecordsSection}>
      <View style={styles.recordsHeader}>
        <Text style={styles.recordsTitle}>测试记录</Text>
        <Text style={styles.recordsCount}>共{testRecords.length}条记录</Text>
      </View>
      
      <View style={styles.recordsList}>
        {testRecords.map((record) => (
          <TestRecordItem
            key={record.id}
            record={record}
            onPress={() => handleTestRecordPress(record.id)}
          />
        ))}
      </View>

      <View style={styles.loadMoreSection}>
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={handleLoadMorePress}
          activeOpacity={0.7}
          disabled={isLoadingMore}
        >
          <FontAwesome6 
            name="chevron-down" 
            size={14} 
            color="#ffffff" 
            style={styles.loadMoreIcon} 
          />
          <Text style={styles.loadMoreText}>
            {isLoadingMore ? '加载中...' : '查看更多记录'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#ffffff"
              colors={['#ffffff']}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {renderHeader()}
          
          {!showEmptyState && renderStatsSection()}
          
          {showEmptyState ? (
            <EmptyState onStartTest={handleStartFirstTestPress} />
          ) : (
            renderTestRecordsSection()
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HistoryScreen;

