

import { StyleSheet, Platform, Dimensions } from 'react-native';
import { PrimaryColors, CardColors, TextColors } from '../../src/constants/Colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: TextColors.primary,
    fontSize: 16,
    fontWeight: '500',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerTitleSection: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TextColors.primary,
  },
  testName: {
    fontSize: 14,
    color: TextColors.secondary,
    marginTop: 4,
  },
  shareButtonHeader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  scrollView: {
    flex: 1,
  },
  scoreSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  scoreCard: {
    backgroundColor: CardColors.background,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
  },
  scoreCircleContainer: {
    marginBottom: 24,
  },
  scoreCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    padding: 4,
    backgroundColor: PrimaryColors.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  scoreLevel: {
    width: '100%',
    marginBottom: 16,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TextColors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  levelBarContainer: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    marginBottom: 8,
  },
  levelBar: {
    height: 12,
    backgroundColor: '#f59e0b',
    borderRadius: 6,
  },
  levelRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelRangeText: {
    fontSize: 12,
    color: TextColors.tertiary,
  },
  testMeta: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  testMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  testMetaText: {
    fontSize: 14,
    color: TextColors.secondary,
  },
  interpretationSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  interpretationCard: {
    backgroundColor: CardColors.background,
    borderRadius: 16,
    padding: 24,
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TextColors.primary,
  },
  interpretationContent: {
    gap: 12,
  },
  interpretationText: {
    fontSize: 16,
    lineHeight: 24,
    color: TextColors.primary,
  },
  suggestionsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  suggestionsCard: {
    backgroundColor: CardColors.background,
    borderRadius: 16,
    padding: 24,
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
  },
  suggestionsList: {
    gap: 16,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  suggestionIcon: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: TextColors.primary,
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 14,
    lineHeight: 20,
    color: TextColors.secondary,
  },
  referencesSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  referencesCard: {
    backgroundColor: CardColors.background,
    borderRadius: 16,
    padding: 24,
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
  },
  referencesContent: {
    gap: 16,
  },
  referenceItem: {
    borderLeftWidth: 4,
    borderLeftColor: 'rgba(255, 255, 255, 0.3)',
    paddingLeft: 16,
  },
  referenceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: TextColors.primary,
    marginBottom: 8,
  },
  referenceText: {
    fontSize: 14,
    lineHeight: 20,
    color: TextColors.secondary,
    marginBottom: 8,
  },
  referenceScoring: {
    gap: 4,
  },
  referenceScoringText: {
    fontSize: 12,
    color: TextColors.tertiary,
  },
  emergencyNotice: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  emergencyTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fb923c',
  },
  emergencyText: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(251, 146, 60, 0.8)',
  },
  bottomSpacing: {
    height: 100,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 24, // 只保留水平内边距
    paddingVertical: 16, // 减少垂直内边距
    paddingTop: 12, // 进一步减少顶部内边距
    paddingBottom: 20, // 减少底部内边距
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12, // 减少按钮间距
  },
  shareButton: {
    flex: 1,
    borderRadius: 12, // 减少圆角
    overflow: 'hidden',
  },
  shareButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14, // 减少垂直内边距
    paddingHorizontal: 20, // 减少水平内边距
    gap: 6, // 减少图标和文字间距
  },
  shareButtonText: {
    fontSize: 15, // 稍微减小字体
    fontWeight: '600',
    color: TextColors.white,
  },
  homeButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12, // 减少圆角
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14, // 减少垂直内边距
    paddingHorizontal: 20, // 减少水平内边距
    gap: 6, // 减少图标和文字间距
  },
  homeButtonText: {
    fontSize: 15, // 稍微减小字体
    fontWeight: '600',
    color: TextColors.primary,
  },

  // 答题详情区域样式
  questionDetailsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  questionDetailsCard: {
    backgroundColor: CardColors.background,
    borderRadius: 16,
    padding: 24,
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
  },
  questionDetailsList: {
    gap: 16,
  },
  questionDetailItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  questionNumber: {
    backgroundColor: PrimaryColors.main,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  questionNumberText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  questionContent: {
    flex: 1,
  },
  questionText: {
    fontSize: 16,
    lineHeight: 24,
    color: TextColors.primary,
    marginBottom: 8,
  },
  userAnswerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 8,
  },
  userAnswerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f59e0b',
  },
  userAnswerText: {
    fontSize: 14,
    color: TextColors.secondary,
  },

  // AI分析区域样式
  aiSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  aiCard: {
    backgroundColor: CardColors.background,
    borderRadius: 16,
    padding: 24,
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
  },
  aiContent: {
    alignItems: 'center',
    gap: 16,
  },
  aiDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: TextColors.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  aiModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8, // 进一步减少padding，让弹窗占据更多屏幕空间
    zIndex: 1000,
    // 确保overlay可见
    minHeight: 400,
    minWidth: 300,
  },
  aiModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.92, // 使用屏幕高度的92%，在安卓设备上占据更多空间
    minHeight: Math.min(SCREEN_HEIGHT * 0.7, 600), // 最小高度为屏幕的70%或600px，取较小值
    // 移除 overflow: 'hidden'，允许内容完全显示
    flexDirection: 'column', // 确保垂直布局
    // 确保内容可见
    elevation: 10, // Android
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  aiModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12, // 减少头部内边距，从16减少到12
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  aiModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  aiModalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiModalScrollView: {
    flex: 1, // 确保ScrollView可以滚动
    backgroundColor: 'transparent', // 确保背景透明
    // 移除 minHeight，让ScrollView根据内容自适应
  },
  aiFloatingButton: {
    position: 'absolute',
    right: 24,
    bottom: 80,
    backgroundColor: PrimaryColors.main,
    borderRadius: 30,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000,
  },
  aiFloatingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
 // 自定义测试提示区域样式
 customTestHintSection: {
   paddingHorizontal: 24,
   marginBottom: 32,
 },
 customTestHintCard: {
   backgroundColor: CardColors.background,
   borderRadius: 16,
   padding: 24,
   borderWidth: CardColors.borderWidth,
   borderColor: CardColors.borderColor,
 },
 customTestHintContent: {
   gap: 20,
 },
 customTestHintText: {
   fontSize: 16,
   lineHeight: 24,
   color: TextColors.primary,
   textAlign: 'center',
   marginBottom: 16,
 },
 customTestHintFeatures: {
   flexDirection: 'row',
   justifyContent: 'space-around',
   alignItems: 'center',
   paddingVertical: 12,
   backgroundColor: 'rgba(245, 158, 11, 0.1)',
   borderRadius: 12,
 },
 hintFeatureItem: {
   alignItems: 'center',
   gap: 6,
 },
 hintFeatureText: {
   fontSize: 12,
   fontWeight: '500',
   color: PrimaryColors.main,
 },
 aiActionButton: {
   borderRadius: 12,
   overflow: 'hidden',
   marginTop: 12,
 },
 aiActionButtonGradient: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'center',
   paddingVertical: 14,
   paddingHorizontal: 24,
   gap: 8,
 },
 aiActionButtonText: {
   fontSize: 16,
   fontWeight: '600',
   color: TextColors.white,
 },
});

