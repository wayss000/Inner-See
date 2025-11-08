

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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: TextColors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: TextColors.tertiary,
  },
});

