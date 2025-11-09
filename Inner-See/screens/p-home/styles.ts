

import { StyleSheet, Platform, StatusBar } from 'react-native';
import { CardColors, TextColors } from '../../src/constants/Colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    // 解决Android屏幕变暗问题
    ...(Platform.OS === 'android' ? {
      // 确保应用使用亮色主题
      backgroundColor: '#ffffff',
      // 调整状态栏样式
      paddingTop: StatusBar.currentHeight,
    } : {}),
  },
  safeArea: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    // 为Android平台添加额外的亮度调整
    ...(Platform.OS === 'android' ? {
      // 增加背景的亮度，减轻系统自动变暗的效果
      opacity: 0.95,
    } : {}),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // 为底部导航栏留出空间
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    marginRight: 12,
  },
  logoBackground: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  appTitleSection: {
    flex: 1,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: TextColors.primary,
  },
  appSubtitle: {
    fontSize: 14,
    color: TextColors.secondary,
    marginTop: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.37,
        shadowRadius: 32,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TextColors.primary,
  },
  viewAllButton: {
    fontSize: 14,
    color: TextColors.secondary,
  },
  hotTestsContainer: {
    paddingRight: 24,
  },
  hotTestCard: {
    backgroundColor: CardColors.background,
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    minWidth: 280,
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
  },
  hotTestIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  hotTestTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TextColors.primary,
    marginBottom: 8,
  },
  hotTestDescription: {
    fontSize: 14,
    color: TextColors.secondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  hotTestMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hotTestMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hotTestMetaText: {
    fontSize: 12,
    color: TextColors.tertiary,
    marginLeft: 4,
  },
  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: CardColors.background,
    borderRadius: 16,
    padding: 16,
    width: '48%',
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
    marginBottom: 16,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TextColors.primary,
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: TextColors.tertiary,
  },
  categoryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  categoryDuration: {
    fontSize: 12,
    color: TextColors.tertiary,
  },
  recentActivityCard: {
    backgroundColor: CardColors.background,
    borderRadius: 16,
    padding: 20,
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: TextColors.primary,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 14,
    color: TextColors.tertiary,
  },
  activityScore: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '600',
    color: TextColors.primary,
  },
  scoreLabel: {
    fontSize: 12,
    color: TextColors.tertiary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 16,
    color: TextColors.primary,
    marginTop: 16,
  },
});

