

import { StyleSheet, Dimensions } from 'react-native';
import { PrimaryColors, CardColors, TextColors } from '../../src/constants/Colors';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
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
  pageTitleSection: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: TextColors.primary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: CardColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  userInfoCard: {
    backgroundColor: CardColors.background,
    borderRadius: 16,
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
    padding: 24,
  },
  userInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  userAvatarContainer: {
    position: 'relative',
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarEditIndicator: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    backgroundColor: PrimaryColors.main,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userNickname: {
    fontSize: 18,
    fontWeight: '600',
    color: TextColors.primary,
    marginBottom: 4,
  },
  userJoinDate: {
    fontSize: 14,
    color: TextColors.secondary,
    marginBottom: 8,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statCount: {
    fontSize: 16,
    fontWeight: '600',
    color: TextColors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: TextColors.tertiary,
  },
  userArrow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  menuList: {
    gap: 12,
  },
  menuItem: {
    backgroundColor: CardColors.background,
    borderRadius: 16,
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
    padding: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: TextColors.primary,
    marginBottom: 2,
  },
  menuItemDesc: {
    fontSize: 14,
    color: TextColors.secondary,
  },
  menuItemArrow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appInfoSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  appInfoCard: {
    backgroundColor: CardColors.background,
    borderRadius: 16,
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
    padding: 20,
  },
  appInfoContent: {
    alignItems: 'center',
  },
  appLogo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
    color: TextColors.primary,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: TextColors.secondary,
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 12,
    color: TextColors.tertiary,
  },
});

