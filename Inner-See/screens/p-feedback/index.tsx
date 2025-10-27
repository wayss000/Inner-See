

import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

type FeedbackType = '建议' | '问题' | '其他';

interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'error';
}

const FeedbackScreen: React.FC = () => {
  const router = useRouter();
  const [selectedFeedbackType, setSelectedFeedbackType] = useState<FeedbackType>('建议');
  const [feedbackContent, setFeedbackContent] = useState<string>('');
  const [contactInfo, setContactInfo] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastState, setToastState] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'success',
  });

  const feedbackContentRef = useRef<TextInput>(null);

  const feedbackTypeOptions = [
    { key: '建议' as FeedbackType, icon: 'lightbulb' },
    { key: '问题' as FeedbackType, icon: 'bug' },
    { key: '其他' as FeedbackType, icon: 'comment' },
  ];

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleFeedbackTypeSelect = (type: FeedbackType) => {
    setSelectedFeedbackType(type);
  };

  const handleFeedbackContentChange = (text: string) => {
    if (text.length <= 500) {
      setFeedbackContent(text);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastState({
      visible: true,
      message,
      type,
    });

    setTimeout(() => {
      setToastState(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const validateForm = (): boolean => {
    if (!feedbackContent.trim()) {
      showToast('请输入反馈内容', 'error');
      feedbackContentRef.current?.focus();
      return false;
    }

    if (feedbackContent.trim().length < 10) {
      showToast('反馈内容至少需要10个字符', 'error');
      feedbackContentRef.current?.focus();
      return false;
    }

    return true;
  };

  const handleSubmitFeedback = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 模拟提交过程
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 重置表单
      setFeedbackContent('');
      setContactInfo('');
      setSelectedFeedbackType('建议');
      feedbackContentRef.current?.blur();

      showToast('反馈提交成功，感谢您的建议！', 'success');

      console.log('反馈提交成功', {
        type: selectedFeedbackType,
        content: feedbackContent,
        contact: contactInfo,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      showToast('提交失败，请稍后重试', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFeedbackTypeButton = (option: { key: FeedbackType; icon: string }) => {
    const isSelected = selectedFeedbackType === option.key;
    
    return (
      <TouchableOpacity
        key={option.key}
        style={[
          styles.feedbackTypeButton,
          isSelected && styles.feedbackTypeButtonSelected,
        ]}
        onPress={() => handleFeedbackTypeSelect(option.key)}
        activeOpacity={0.7}
      >
        <FontAwesome6
          name={option.icon}
          style={[
            styles.feedbackTypeIcon,
            isSelected && styles.feedbackTypeIconSelected,
          ]}
        />
        <Text
          style={[
            styles.feedbackTypeText,
            isSelected && styles.feedbackTypeTextSelected,
          ]}
        >
          {option.key}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* 顶部导航栏 */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}
                activeOpacity={0.7}
              >
                <FontAwesome6 name="arrow-left" style={styles.backIcon} />
              </TouchableOpacity>
              <View style={styles.headerTitleSection}>
                <Text style={styles.pageTitle}>反馈建议</Text>
                <Text style={styles.pageSubtitle}>帮助我们做得更好</Text>
              </View>
            </View>

            {/* 反馈表单区域 */}
            <View style={styles.feedbackFormSection}>
              <View style={styles.feedbackFormCard}>
                {/* 反馈类型选择 */}
                <View style={styles.feedbackTypeSection}>
                  <Text style={styles.feedbackTypeLabel}>反馈类型</Text>
                  <View style={styles.feedbackTypeOptions}>
                    {feedbackTypeOptions.map(renderFeedbackTypeButton)}
                  </View>
                </View>

                {/* 反馈内容输入 */}
                <View style={styles.feedbackContentSection}>
                  <Text style={styles.feedbackContentLabel}>
                    反馈内容 <Text style={styles.requiredMark}>*</Text>
                  </Text>
                  <TextInput
                    ref={feedbackContentRef}
                    style={styles.feedbackContentInput}
                    value={feedbackContent}
                    onChangeText={handleFeedbackContentChange}
                    placeholder="请详细描述您的建议或遇到的问题，我们会认真对待每一条反馈..."
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    multiline
                    textAlignVertical="top"
                    maxLength={500}
                  />
                  <View style={styles.contentCounter}>
                    <Text style={styles.contentCount}>{feedbackContent.length}</Text>
                    <Text style={styles.contentCountMax}>/500</Text>
                  </View>
                </View>

                {/* 联系方式输入 */}
                <View style={styles.contactSection}>
                  <Text style={styles.contactInfoLabel}>
                    联系方式 <Text style={styles.optionalMark}>(可选)</Text>
                  </Text>
                  <TextInput
                    style={styles.contactInfoInput}
                    value={contactInfo}
                    onChangeText={setContactInfo}
                    placeholder="请输入您的邮箱地址，便于我们及时回复您"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <View style={styles.contactTip}>
                    <FontAwesome6 name="shield-halved" style={styles.contactTipIcon} />
                    <Text style={styles.contactTipText}>
                      您的联系方式仅用于反馈回复，我们会严格保护您的隐私
                    </Text>
                  </View>
                </View>

                {/* 提交按钮 */}
                <View style={styles.submitSection}>
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      isSubmitting && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmitFeedback}
                    disabled={isSubmitting}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={isSubmitting ? ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.2)'] : ['#6366f1', '#8b5cf6']}
                      style={styles.submitButtonGradient}
                    >
                      <Text style={styles.submitButtonText}>
                        {isSubmitting ? '提交中...' : '提交反馈'}
                      </Text>
                      {isSubmitting && (
                        <FontAwesome6
                          name="spinner"
                          style={styles.submitLoadingIcon}
                        />
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* 感谢提示 */}
            <View style={styles.thankYouSection}>
              <View style={styles.thankYouCard}>
                <View style={styles.thankYouIcon}>
                  <FontAwesome6 name="heart" style={styles.thankYouHeartIcon} />
                </View>
                <Text style={styles.thankYouTitle}>感谢您的反馈</Text>
                <Text style={styles.thankYouDesc}>
                  您的每一条建议都是我们前进的动力，我们会认真考虑并持续改进产品体验
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Toast提示 */}
        {toastState.visible && (
          <View style={styles.toastContainer}>
            <View style={styles.toast}>
              <FontAwesome6
                name={toastState.type === 'success' ? 'check-circle' : 'exclamation-circle'}
                style={[
                  styles.toastIcon,
                  toastState.type === 'success' ? styles.toastIconSuccess : styles.toastIconError,
                ]}
              />
              <Text style={styles.toastText}>{toastState.message}</Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default FeedbackScreen;

