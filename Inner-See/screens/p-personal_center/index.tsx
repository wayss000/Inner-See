

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from './styles';

const PersonalCenterScreen = () => {
  const router = useRouter();

  const handleSettingsPress = () => {
    console.log('设置功能待实现');
  };

  const handleUserInfoPress = () => {
    console.log('个人资料管理功能待实现');
  };

  const handleProfileManagementPress = () => {
    console.log('个人资料管理功能待实现');
  };

  const handleTestHistoryPress = () => {
    router.push('/p-history');
  };

  const handleFeedbackPress = () => {
    router.push('/p-feedback');
  };

  const handlePrivacySettingsPress = () => {
    console.log('隐私设置功能待实现');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 顶部导航栏 */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.pageTitleSection}>
                <Text style={styles.pageTitle}>我的</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity 
                  style={styles.settingsButton}
                  onPress={handleSettingsPress}
                  activeOpacity={0.7}
                >
                  <FontAwesome6 name="gear" size={18} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* 用户信息区 */}
          <View style={styles.userInfoSection}>
            <TouchableOpacity 
              style={styles.userInfoCard}
              onPress={handleUserInfoPress}
              activeOpacity={0.8}
            >
              <View style={styles.userInfoContent}>
                <View style={styles.userAvatarContainer}>
                  <Image 
                    source={{ uri: 'https://s.coze.cn/image/kIO2djAu2Ck/' }}
                    style={styles.userAvatar}
                  />
                  <View style={styles.avatarEditIndicator}>
                    <FontAwesome6 name="pen" size={10} color="#ffffff" />
                  </View>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userNickname}>小雨</Text>
                  <Text style={styles.userJoinDate}>加入心探 3 个月</Text>
                  <View style={styles.userStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statCount}>12</Text>
                      <Text style={styles.statLabel}>完成测试</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statCount}>45</Text>
                      <Text style={styles.statLabel}>测试天数</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.userArrow}>
                  <FontAwesome6 name="chevron-right" size={18} color="rgba(255, 255, 255, 0.6)" />
                </View>
              </View>
            </TouchableOpacity>
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
                      <FontAwesome6 name="user-pen" size={18} color="#ffffff" />
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
                      <FontAwesome6 name="clock-rotate-left" size={18} color="#ffffff" />
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

              {/* 反馈建议 */}
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
                      <FontAwesome6 name="comment-dots" size={18} color="#ffffff" />
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
                      <FontAwesome6 name="shield-halved" size={18} color="#ffffff" />
                    </LinearGradient>
                    <View style={styles.menuItemInfo}>
                      <Text style={styles.menuItemTitle}>隐私设置</Text>
                      <Text style={styles.menuItemDesc}>管理您的数据和隐私选项</Text>
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
                  colors={['#6366f1', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.appLogo}
                >
                  <FontAwesome6 name="heart" size={24} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.appName}>心探</Text>
                <Text style={styles.appVersion}>版本 1.0.0</Text>
                <Text style={styles.appDescription}>探索内心，了解自我</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default PersonalCenterScreen;

