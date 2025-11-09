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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TextColors.primary,
  },
  headerRight: {
    width: 40,
    height: 40,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: TextColors.primary,
    marginBottom: 12,
  },
  input: {
    backgroundColor: CardColors.background,
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: TextColors.primary,
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: TextColors.secondary,
    marginTop: 4,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: CardColors.background,
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectedGenderButton: {
    backgroundColor: 'rgba(217, 119, 87, 0.3)', // PrimaryColors.main with 0.3 opacity
    borderColor: PrimaryColors.main,
  },
  genderText: {
    fontSize: 16,
    color: TextColors.primary,
  },
  selectedGenderText: {
    color: PrimaryColors.main,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  saveButton: {
    flex: 1,
  },
  saveButtonGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: CardColors.background,
    borderWidth: CardColors.borderWidth,
    borderColor: CardColors.borderColor,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: TextColors.primary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIcon: {
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 16,
    color: TextColors.primary,
  },
});