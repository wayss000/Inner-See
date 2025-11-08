import { StyleSheet } from 'react-native';
import { TextColors, CardColors, PrimaryColors } from '../../src/constants/Colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TextColors.primary,
    textAlign: 'center',
    flex: 1,
  },
  rightPlaceholder: {
    width: 40,
    height: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: TextColors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionDesc: {
    fontSize: 16,
    color: TextColors.secondary,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  dropdownContainer: {
    marginBottom: 32,
  },
  dropdown: {
    height: 56,
    backgroundColor: CardColors.background,
    borderRadius: 16,
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  dropdownList: {
    position: 'absolute',
    top: 92,
    left: 24,
    right: 24,
    backgroundColor: CardColors.background,
    borderRadius: 16,
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
    maxHeight: 200,
    zIndex: 10,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: CardColors.borderColor,
  },
  selectedDropdownItem: {
    backgroundColor: 'rgba(217, 119, 87, 0.2)', // PrimaryColors.main with 0.2 opacity
  },
  dropdownItemText: {
    fontSize: 16,
    color: TextColors.primary,
  },
  selectedDropdownItemText: {
    color: PrimaryColors.main,
    fontWeight: '600',
  },
  placeholderStyle: {
    fontSize: 16,
    color: TextColors.tertiary,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: TextColors.primary,
  },
  inputSearchStyle: {
    fontSize: 16,
    color: TextColors.primary,
    backgroundColor: 'transparent',
  },
  iconStyle: {
    width: 20,
    height: 20,
    tintColor: TextColors.tertiary,
  },
  currentModelContainer: {
    backgroundColor: CardColors.background,
    borderRadius: 16,
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
    padding: 20,
    alignItems: 'center',
  },
  currentModelTitle: {
    fontSize: 16,
    color: TextColors.secondary,
    marginBottom: 4,
  },
  currentModelValue: {
    fontSize: 18,
    fontWeight: '600',
    color: TextColors.primary,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: 'transparent',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: CardColors.background,
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: PrimaryColors.main,
    borderColor: PrimaryColors.main,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: TextColors.primary,
  },
  saveButtonText: {
    color: TextColors.white,
  },
});