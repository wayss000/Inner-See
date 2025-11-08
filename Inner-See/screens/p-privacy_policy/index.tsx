import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from './styles';
import { BackgroundGradient, PrimaryColors, TextColors } from '../../src/constants/Colors';

const PrivacyPolicyScreen = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={BackgroundGradient.primary}
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
              <TouchableOpacity 
                style={styles.backButton}
                onPress={handleBack}
                activeOpacity={0.7}
              >
                <FontAwesome6 name="arrow-left" size={18} color={TextColors.white} />
              </TouchableOpacity>
              <View style={styles.pageTitleSection}>
                <Text style={styles.pageTitle}>隐私政策</Text>
              </View>
              <View style={styles.headerActions} />
            </View>
          </View>

          {/* 主要内容 */}
          <View style={styles.contentContainer}>
            {/* 隐私保护图标 */}
            <View style={styles.illustrationContainer}>
              <View style={styles.shieldIcon}>
                <FontAwesome6 name="handshake-angle" size={48} color={PrimaryColors.main} />
              </View>
              <Text style={styles.illustrationTitle}>您的隐私，我们最重视</Text>
            </View>

            {/* 隐私政策要点 */}
            <View style={styles.policySection}>
              <View style={styles.policyItem}>
                <View style={styles.policyIcon}>
                  <FontAwesome6 name="user-secret" size={24} color={PrimaryColors.main} />
                </View>
                <View style={styles.policyContent}>
                  <Text style={styles.policyTitle}>无需注册，保护身份</Text>
                  <Text style={styles.policyDescription}>
                    您无需注册即可使用心探的所有功能，我们不会收集您的姓名、手机号、邮箱等任何个人身份信息，确保您的使用完全匿名。
                  </Text>
                </View>
              </View>

              <View style={styles.policyItem}>
                <View style={styles.policyIcon}>
                  <FontAwesome6 name="database" size={24} color={PrimaryColors.secondary} />
                </View>
                <View style={styles.policyContent}>
                  <Text style={styles.policyTitle}>数据本地存储</Text>
                  <Text style={styles.policyDescription}>
                    您的所有测试数据都安全地保存在您设备本地的SQLite数据库中，不会上传到任何服务器，完全由您自己掌控数据安全。
                  </Text>
                </View>
              </View>

              <View style={styles.policyItem}>
                <View style={styles.policyIcon}>
                  <FontAwesome6 name="brain" size={24} color={PrimaryColors.accent} />
                </View>
                <View style={styles.policyContent}>
                  <Text style={styles.policyTitle}>AI分析，匿名处理</Text>
                  <Text style={styles.policyDescription}>
                    当需要AI分析时，数据会以完全匿名的方式发送给大模型，系统不会包含任何身份标识信息，且分析完成后数据不会被持久化保存。
                  </Text>
                </View>
              </View>

              <View style={styles.policyItem}>
                <View style={styles.policyIcon}>
                  <FontAwesome6 name="lock" size={24} color={PrimaryColors.main} />
                </View>
                <View style={styles.policyContent}>
                  <Text style={styles.policyTitle}>多重安全保障</Text>
                  <Text style={styles.policyDescription}>
                    我们采用行业标准的安全措施保护您的数据，所有本地存储都经过加密处理，确保您的心理健康数据得到最高级别的保护。
                  </Text>
                </View>
              </View>
            </View>

            {/* 详细说明 */}
            <View style={styles.detailedSection}>
              <Text style={styles.sectionTitle}>详细隐私说明</Text>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailTitle}>1. 数据收集</Text>
                <Text style={styles.detailDescription}>
                  心探不会主动收集任何个人信息。应用运行过程中仅会生成必要的测试记录和用户偏好设置，这些数据完全保存在您的设备本地。
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailTitle}>2. 数据存储</Text>
                <Text style={styles.detailDescription}>
                  所有用户数据都存储在您设备的SQLite数据库中，包括测试记录、答题情况和结果分析。这些数据不会自动同步或上传到云端。
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailTitle}>3. 数据使用</Text>
                <Text style={styles.detailDescription}>
                  您的数据仅用于为您提供个性化的心理健康测试和分析服务。系统会根据您的测试历史提供更精准的测试推荐和结果解读。
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailTitle}>4. 数据共享</Text>
                <Text style={styles.detailDescription}>
                  除非获得您的明确授权，否则我们不会与任何第三方共享您的数据。即使是AI分析，也会在去除所有身份信息后进行。
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailTitle}>5. 数据保留</Text>
                <Text style={styles.detailDescription}>
                  您的数据将一直保存在您的设备上，直到您主动删除应用或手动清除数据。您可以随时导出、备份或删除自己的测试记录。
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailTitle}>6. 用户权利</Text>
                <Text style={styles.detailDescription}>
                  您拥有完全的数据控制权，可以随时查看、导出、修改或删除您的所有测试数据。我们不会设置任何障碍限制您对自己数据的访问。
                </Text>
              </View>
            </View>

            {/* 安全提示 */}
            <View style={styles.tipSection}>
              <View style={styles.tipIcon}>
                <FontAwesome6 name="lightbulb" size={20} color={PrimaryColors.secondary} />
              </View>
              <Text style={styles.tipText}>
                温馨提示：为了更好地保护您的隐私，建议您定期备份重要数据，并确保设备的安全性。
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;