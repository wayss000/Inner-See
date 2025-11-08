

import { StyleSheet, Platform } from 'react-native';
import { CardColors, TextColors } from '../../../../src/constants/Colors';

export default StyleSheet.create({
  testItem: {
    backgroundColor: CardColors.background,
    borderRadius: 16,
    padding: 20,
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
  },
  testItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  testInfo: {
    flex: 1,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TextColors.primary,
    marginBottom: 4,
  },
  testDescription: {
    fontSize: 14,
    color: TextColors.secondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  testMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: TextColors.tertiary,
  },
  arrowContainer: {
    marginLeft: 8,
  },
});

