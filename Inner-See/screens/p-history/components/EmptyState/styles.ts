

import { StyleSheet, Platform } from 'react-native';
import { TextColors, CardColors } from '../../../../src/constants/Colors';

export default StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: 40,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: TextColors.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: TextColors.tertiary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
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
  startIcon: {
    marginRight: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: TextColors.primary,
  },
});

