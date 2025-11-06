

import { StyleSheet, Platform } from 'react-native';

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
    color: '#ffffff',
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
    color: '#ffffff',
  },
  testName: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  scoreCircleContainer: {
    marginBottom: 24,
  },
  scoreCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    padding: 4,
    backgroundColor: '#6366f1',
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
    color: '#ffffff',
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
    color: 'rgba(255, 255, 255, 0.6)',
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
    color: 'rgba(255, 255, 255, 0.8)',
  },
  interpretationSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  interpretationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
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
    color: '#ffffff',
  },
  interpretationContent: {
    gap: 12,
  },
  interpretationText: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  suggestionsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  suggestionsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
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
    color: '#ffffff',
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  referencesSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  referencesCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
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
    color: '#ffffff',
    marginBottom: 8,
  },
  referenceText: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  referenceScoring: {
    gap: 4,
  },
  referenceScoringText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
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
    padding: 24,
    paddingBottom: 34,
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
    gap: 16,
  },
  shareButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  shareButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  homeButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },

  // 答题详情区域样式
  questionDetailsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  questionDetailsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
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
    backgroundColor: '#6366f1',
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
    color: 'rgba(255, 255, 255, 0.9)',
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
    color: 'rgba(255, 255, 255, 0.8)',
  },

  // AI分析区域样式
  aiSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  aiCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  aiContent: {
    alignItems: 'center',
    gap: 16,
  },
  aiDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(255, 255, 255, 0.8)',
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
    padding: 24,
    zIndex: 1000,
  },
  aiModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  aiModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
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
    padding: 16,
  },
  aiFloatingButton: {
    position: 'absolute',
    right: 24,
    bottom: 80,
    backgroundColor: '#6366f1',
    borderRadius: 30,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 100,
  },
  aiFloatingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

