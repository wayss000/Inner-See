

import { StyleSheet, Platform } from 'react-native';
import { PrimaryColors, CardColors, TextColors } from '../../src/constants/Colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
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
    alignItems: 'center',
    justifyContent: 'center',
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
  testTitleSection: {
    flex: 1,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TextColors.primary,
    marginBottom: 2,
  },
  questionProgress: {
    fontSize: 14,
    color: TextColors.secondary,
  },
  timerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
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
  progressSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(217, 119, 87, 0.8)', // PrimaryColors.main with 0.8 opacity
    borderRadius: 4,
  },
  progressText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressTextItem: {
    fontSize: 12,
    color: TextColors.tertiary,
  },
  questionSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  questionCard: {
    backgroundColor: CardColors.background,
    borderRadius: 16,
    padding: 24,
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: TextColors.primary,
    lineHeight: 28,
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
  },
  optionCardSelected: {
    backgroundColor: 'rgba(217, 119, 87, 0.3)', // PrimaryColors.main with 0.3 opacity
    borderColor: 'rgba(217, 119, 87, 0.5)', // PrimaryColors.main with 0.5 opacity
    ...Platform.select({
      ios: {
        shadowColor: PrimaryColors.main,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2.5, // 增加边框宽度，更明显
    borderColor: 'rgba(0, 0, 0, 0.3)', // 加深颜色，提高对比度
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PrimaryColors.main,
  },
  optionText: {
    fontSize: 16,
    color: TextColors.primary,
    flex: 1,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 34,
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
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
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  prevButton: {
    backgroundColor: CardColors.background,
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
  },
  prevButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: TextColors.primary,
  },
  nextButton: {
    backgroundColor: PrimaryColors.main,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: TextColors.white,
  },
  disabledButton: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: CardColors.background,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  abandonModalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  submitModalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TextColors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: TextColors.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButton: {
    backgroundColor: CardColors.background,
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
  },
  modalConfirmButton: {
    backgroundColor: '#f59e0b',
  },
  modalSubmitButton: {
    backgroundColor: '#10b981',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: TextColors.white,
  },
});

