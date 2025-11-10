

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { DatabaseManager } from '../../src/database/DatabaseManager';
import { User } from '../../src/entities/TestEntities';
import { styles } from './styles';
import { BackgroundGradient, PrimaryColors, TextColors } from '../../src/constants/Colors';

// 导入事件发射器
import ProfileEditScreen from '../p-profile_edit';

const PersonalCenterScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    completedTests: 0,
    testDays: 0
  });

  useEffect(() => {
    loadUserData();
  }, []);

  // 在用户数据加载完成后，立即加载统计数据
  useEffect(() => {
    if (user !== null) {
      loadStatsData();
    }
  }, [user]);

  // 监听用户数据更新事件
  useEffect(() => {
    const handleUserUpdated = () => {
      console.log('收到用户数据更新通知，重新加载数据');
      loadUserData();
    };

    // 监听用户数据更新事件
    if ((ProfileEditScreen as any).eventEmitter) {
      (ProfileEditScreen as any).eventEmitter.on('userUpdated', handleUserUpdated);
    }

    // 清理事件监听
    return () => {
      if ((ProfileEditScreen as any).eventEmitter) {
        (ProfileEditScreen as any).eventEmitter.off('userUpdated', handleUserUpdated);
      }
    };
  }, []);

  // 监听用户数据变化，确保数据更新后能正确显示
  useEffect(() => {
    if (user) {
      console.log('用户数据已更新:', {
        nickname: user.nickname,
        avatarEmoji: user.avatarEmoji,
        gender: user.gender,
        age: user.age
      });
    }
  }, [user]);

  // 加载测试统计数据
  const loadStatsData = async () => {
    try {
      const dbManager = DatabaseManager.getInstance();
      await dbManager.initialize();

      // 获取所有测试记录
      const allRecords = await dbManager.getAllTestRecords();
      
      // 计算完成测试数
      const completedTests = allRecords.length;
      
      // 计算测试天数（参与测试的不同天数）
      const uniqueTestDays = new Set(
        allRecords.map(record => {
          // 将时间戳转换为日期字符串（格式：YYYY-MM-DD）
          const date = new Date(record.createdAt);
          return date.toISOString().split('T')[0];
        })
      );
      const testDays = uniqueTestDays.size;
      
      setStatsData({
        completedTests,
        testDays
      });
      
      console.log('统计数据加载完成:', { completedTests, testDays });
    } catch (error) {
      console.error('加载统计数据失败:', error);
      // 如果加载失败，保持默认值
      setStatsData({
        completedTests: 0,
        testDays: 0
      });
    }
  };

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = await DatabaseManager.getInstance().getCurrentUser();
      if (userData) {
        setUser(userData);
      } else {
        // 如果没有用户数据，创建默认用户
        const defaultUser: User = {
          id: `user-${Date.now()}`,
          nickname: '小雨',
          avatarEmoji: 'smiley',
          joinDate: Date.now(),
          gender: '女',
          age: 25,
          selectedModel: 'KwaiKAT',
        };
        await DatabaseManager.getInstance().createUser(defaultUser);
        const newUser = await DatabaseManager.getInstance().getCurrentUser();
        setUser(newUser);
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
      // 创建默认用户作为回退
      const defaultUser: User = {
        id: `user-${Date.now()}`,
        nickname: '小雨',
        avatarEmoji: 'smiley',
        joinDate: Date.now(),
        gender: '女',
        age: 25,
        selectedModel: 'KwaiKAT',
      };
      setUser(defaultUser as User);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsPress = () => {
    console.log('设置功能待实现');
  };

  const handleProfileManagementPress = () => {
    router.push('/p-profile_edit');
  };

  const handleTestHistoryPress = () => {
    router.push('/p-history');
  };

  const handleFeedbackPress = () => {
    router.push('/p-feedback');
  };

  const handlePrivacySettingsPress = () => {
    router.push('/p-privacy_policy');
  };

  return (
    <LinearGradient
      colors={BackgroundGradient.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 顶部导航栏 */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.pageTitleSection} />
              <View style={styles.headerActions} />
            </View>
          </View>

          {/* 用户信息区 */}
          <View style={styles.userInfoSection}>
            {loading ? (
              <View style={styles.userInfoCard}>
                <View style={styles.userInfoContent}>
                  <View style={styles.userAvatarContainer}>
                    <View style={[styles.userAvatar, { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 50 }]} />
                  </View>
                  <View style={styles.userDetails}>
                    <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', height: 16, borderRadius: 8, marginBottom: 4 }} />
                    <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', height: 16, borderRadius: 8, marginBottom: 8, width: '60%' }} />
                    <View style={styles.userStats}>
                      <View style={styles.statItem}>
                        <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', height: 16, borderRadius: 8, marginBottom: 4 }} />
                        <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', height: 16, borderRadius: 8, marginBottom: 4 }} />
                      </View>
                      <View style={styles.statItem}>
                        <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', height: 16, borderRadius: 8, marginBottom: 4 }} />
                        <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', height: 16, borderRadius: 8, marginBottom: 4 }} />
                      </View>
                    </View>
                  </View>
                  <View style={styles.userArrow}>
                    <FontAwesome6 name="chevron-right" size={18} color="rgba(255, 255, 255, 0.6)" />
                  </View>
                </View>
              </View>
            ) : user ? (
              <TouchableOpacity
                style={styles.userInfoCard}
                onPress={handleProfileManagementPress}
                activeOpacity={0.8}
              >
                <View style={styles.userInfoContent}>
                  <View style={styles.userAvatarContainer}>
                    <Image
                      source={{ uri: `https://s.coze.cn/image/kIO2djAu2Ck/` }}
                      style={styles.userAvatar}
                    />
                    <View style={styles.avatarEditIndicator}>
                      <FontAwesome6 name="pen" size={10} color={TextColors.white} />
                    </View>
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.userNickname}>{user.nickname}</Text>
                    <Text style={styles.userJoinDate}>加入心探 {user.joinDate ? `${Math.ceil((new Date().getTime() - new Date(user.joinDate).getTime()) / (1000 * 3600 * 24 * 30))} 个月` : '3 个月'}</Text>
                    <View style={styles.userStats}>
                      <View style={styles.statItem}>
                        <Text style={styles.statCount}>{statsData.completedTests}</Text>
                        <Text style={styles.statLabel}>完成测试</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statCount}>{statsData.testDays}</Text>
                        <Text style={styles.statLabel}>测试天数</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.userArrow}>
                    <FontAwesome6 name="chevron-right" size={18} color="rgba(255, 255, 255, 0.6)" />
                  </View>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* 功能菜单区 */}
          <View style={styles.menuSection}>
            <View style={styles.menuList}>
              {/* 个人资料管理 */}
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={handleProfileManagementPress}
                activeOpacity={0.8}
              >
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemLeft}>
                    <LinearGradient
                      colors={['#60a5fa', '#06b6d4']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.menuIcon}
                    >
                      <FontAwesome6 name="user-pen" size={18} color={PrimaryColors.main} />
                    </LinearGradient>
                    <View style={styles.menuItemInfo}>
                      <Text style={styles.menuItemTitle}>个人资料管理</Text>
                      <Text style={styles.menuItemDesc}>编辑个人信息和偏好设置</Text>
                    </View>
                  </View>
                  <View style={styles.menuItemArrow}>
                    <FontAwesome6 name="chevron-right" size={18} color="rgba(255, 255, 255, 0.6)" />
                  </View>
                </View>
              </TouchableOpacity>

              {/* 测试历史记录 */}
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={handleTestHistoryPress}
                activeOpacity={0.8}
              >
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemLeft}>
                    <LinearGradient
                      colors={['#4ade80', '#3b82f6']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.menuIcon}
                    >
                      <FontAwesome6 name="clock-rotate-left" size={18} color={PrimaryColors.main} />
                    </LinearGradient>
                    <View style={styles.menuItemInfo}>
                      <Text style={styles.menuItemTitle}>测试历史记录</Text>
                      <Text style={styles.menuItemDesc}>查看所有已完成的测试结果</Text>
                    </View>
                  </View>
                  <View style={styles.menuItemArrow}>
                    <FontAwesome6 name="chevron-right" size={18} color="rgba(255, 255, 255, 0.6)" />
                  </View>
                </View>
              </TouchableOpacity>

              {/*
              反馈建议 - 当前版本隐藏此功能
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleFeedbackPress}
                activeOpacity={0.8}
              >
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemLeft}>
                    <LinearGradient
                      colors={['#fb923c', '#ef4444']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.menuIcon}
                    >
                      <FontAwesome6 name="comment-dots" size={18} color={PrimaryColors.main} />
                    </LinearGradient>
                    <View style={styles.menuItemInfo}>
                      <Text style={styles.menuItemTitle}>反馈建议</Text>
                      <Text style={styles.menuItemDesc}>帮助我们改进产品体验</Text>
                    </View>
                  </View>
                  <View style={styles.menuItemArrow}>
                    <FontAwesome6 name="chevron-right" size={18} color="rgba(255, 255, 255, 0.6)" />
                  </View>
                </View>
              </TouchableOpacity>
              */}

              {/* 模型选择 */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/p-model-selection')}
                activeOpacity={0.8}
              >
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemLeft}>
                    <LinearGradient
                      colors={['#f59e0b', '#eab308']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.menuIcon}
                    >
                      <FontAwesome6 name="brain" size={18} color={PrimaryColors.main} />
                    </LinearGradient>
                    <View style={styles.menuItemInfo}>
                      <Text style={styles.menuItemTitle}>模型选择</Text>
                      <Text style={styles.menuItemDesc}>选择AI模型进行测试</Text>
                    </View>
                  </View>
                  <View style={styles.menuItemArrow}>
                    <FontAwesome6 name="chevron-right" size={18} color="rgba(255, 255, 255, 0.6)" />
                  </View>
                </View>
              </TouchableOpacity>

              {/* 隐私设置 */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handlePrivacySettingsPress}
                activeOpacity={0.8}
              >
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemLeft}>
                    <LinearGradient
                      colors={['#a78bfa', '#ec4899']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.menuIcon}
                    >
                      <FontAwesome6 name="shield-halved" size={18} color={PrimaryColors.main} />
                    </LinearGradient>
                    <View style={styles.menuItemInfo}>
                      <Text style={styles.menuItemTitle}>隐私设置</Text>
                      <Text style={styles.menuItemDesc}>了解我们如何保护您的数据安全</Text>
                    </View>
                  </View>
                  <View style={styles.menuItemArrow}>
                    <FontAwesome6 name="chevron-right" size={18} color="rgba(255, 255, 255, 0.6)" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* 应用信息区 */}
          <View style={styles.appInfoSection}>
            <View style={styles.appInfoCard}>
              <View style={styles.appInfoContent}>
                <LinearGradient
                  colors={[PrimaryColors.main, PrimaryColors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.appLogo}
                >
                  <FontAwesome6 name="heart" size={24} color={TextColors.white} />
                </LinearGradient>
                <Text style={styles.appName}>心探</Text>
                <Text style={styles.appVersion}>版本 1.0.0</Text>
                <Text style={styles.appDescription}>探索内心，了解自我</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PersonalCenterScreen;

