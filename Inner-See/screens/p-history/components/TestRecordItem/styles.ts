

import { StyleSheet, Platform } from 'react-native';
import { CardColors, TextColors } from '../../../../src/constants/Colors';

export default StyleSheet.create({
  container: {
    backgroundColor: CardColors.background,
    borderRadius: 16,
    padding: 20,
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: TextColors.primary,
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: TextColors.tertiary,
  },
  resultContainer: {
    alignItems: 'flex-end',
  },
  resultValue: {
    fontSize: 18,
    fontWeight: '600',
    color: TextColors.primary,
    marginBottom: 2,
  },
  resultDescription: {
    fontSize: 12,
    color: TextColors.tertiary,
  },
  customTestBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customTestBadgeText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 12,
  },
});

