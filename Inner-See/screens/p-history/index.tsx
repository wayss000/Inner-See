

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';
import StatsCard from './components/StatsCard';
import TestRecordItem from './components/TestRecordItem';
import EmptyState from './components/EmptyState';
import { DatabaseManager } from '../../src/database/DatabaseManager';
import { convertDbRecordToUI, PAGINATION_CONFIG } from '../../src/utils/HistoryUtils';

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
  const [isLoading, setIsLoading] = useState(true);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [statsData, setStatsData] = useState<StatsData>({
    totalTests: 0,
    thisWeek: 0,
    avgScore: 0,
  });

  const [testRecords, setTestRecords] = useState<TestRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 加载测试记录数据
  const loadTestRecords = async (page: number = 1, isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else if (page > 1) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const dbManager = DatabaseManager.getInstance();
      await dbManager.initialize();

      // 计算偏移量
      const offset = (page - 1) * PAGINATION_CONFIG.pageSize;
      
      // 获取测试记录（从数据库获取所有记录，然后手动分页）
      const allRecords = await dbManager.getAllTestRecords();
      
      // 更新统计数据
      const totalTests = allRecords.length;
      const thisWeek = allRecords.filter(record => {
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        return record.createdAt > weekAgo;
      }).length;
      
      const avgScore = totalTests > 0
        ? Math.round(allRecords.reduce((sum, record) => sum + (record.totalScore || 0), 0) / totalTests)
        : 0;

      setStatsData({
        totalTests,
        thisWeek,
        avgScore
      });

      // 转换数据并分页
      const uiRecords = allRecords
        .sort((a, b) => b.createdAt - a.createdAt) // 按时间倒序
        .slice(0, page * PAGINATION_CONFIG.pageSize)
        .map(convertDbRecordToUI);

      if (isRefresh) {
        setTestRecords(uiRecords);
        setCurrentPage(1);
      } else {
        setTestRecords(prev => page === 1 ? uiRecords : [...prev, ...uiRecords.slice(prev.length)]);
      }

      // 检查是否还有更多记录
      setHasMore(allRecords.length > page * PAGINATION_CONFIG.pageSize);
      
      // 显示空状态
      setShowEmptyState(uiRecords.length === 0);
      
      setHasError(false);

    } catch (error) {
      console.error('加载测试记录失败:', error);
      setHasError(true);
      Alert.alert('错误', '当前数据文件已损坏，请重新安装应用或联系客服');
    } finally {
      setIsRefreshing(false);
      setIsLoadingMore(false);
      setIsLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadTestRecords(1, false);
  }, []);

  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  const handleTestRecordPress = useCallback((recordId: string) => {
    router.push(`/p-result_display?record_id=${recordId}`);
  }, [router]);

  const handleLoadMorePress = useCallback(async () => {
    if (hasMore && !isLoadingMore) {
      const nextPage = currentPage + 1;
      await loadTestRecords(nextPage, false);
      setCurrentPage(nextPage);
    }
  }, [currentPage, hasMore, isLoadingMore]);

  const handleStartFirstTestPress = useCallback(() => {
    router.push('/p-home');
  }, [router]);

  const handleRefresh = useCallback(async () => {
    await loadTestRecords(1, true);
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
        <Text style={styles.recordsCount}>共{statsData.totalTests}条记录</Text>
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

      {hasMore && (
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
      )}
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#ffffff" />
      <Text style={styles.loadingText}>加载中...</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <FontAwesome6 name="exclamation-triangle" size={48} color="#fbbf24" />
      <Text style={styles.errorTitle}>数据文件损坏</Text>
      <Text style={styles.errorText}>当前数据文件已损坏，请重新安装应用或联系客服</Text>
      <TouchableOpacity style={styles.errorButton} onPress={handleRefresh}>
        <Text style={styles.errorButtonText}>重新尝试</Text>
      </TouchableOpacity>
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
        {isLoading ? (
          renderLoading()
        ) : hasError ? (
          renderErrorState()
        ) : (
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
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HistoryScreen;

