import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');
const MODAL_WIDTH = Math.min(screenWidth * 0.9, 360);

interface AISupplementInputProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (supplement: string) => void;
  loading?: boolean;
}

const AISupplementInput: React.FC<AISupplementInputProps> = ({
  visible,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [supplement, setSupplement] = useState('');
  const [characterCount, setCharacterCount] = useState(0);

  const handleSubmit = () => {
    if (supplement.trim()) {
      onSubmit(supplement.trim());
    }
  };

  const handleTextChange = (text: string) => {
    setSupplement(text);
    setCharacterCount(text.length);
  };

  const handleClose = () => {
    if (!loading) {
      setSupplement('');
      setCharacterCount(0);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.5)']}
          style={styles.overlay}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={['#ffffff', '#f9fafb']}
              style={styles.modalContent}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              {/* 模态框头部 */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>补充更多信息</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                  disabled={loading}
                >
                  <FontAwesome6 name="times" size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {/* 输入框 */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  multiline
                  placeholder="您可以补充更多个人信息、当前状态、具体困扰或想要获得的建议..."
                  placeholderTextColor="#9ca3af"
                  value={supplement}
                  onChangeText={handleTextChange}
                  maxLength={500}
                  editable={!loading}
                  autoFocus
                />
                
                {/* 字符计数 */}
                <View style={styles.characterCountContainer}>
                  <Text style={styles.characterCount}>
                    {characterCount}/500
                  </Text>
                </View>
              </View>

              {/* 提示信息 */}
              <Text style={styles.hintText}>
                温馨提示：补充的信息越详细，AI分析结果会越精准
              </Text>

              {/* 按钮区域 */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={loading || !supplement.trim()}
                >
                  <LinearGradient
                    colors={supplement.trim() && !loading ? ['#6366f1', '#8b5cf6'] : ['#9ca3af', '#d1d5db']}
                    style={styles.submitButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.submitButtonText}>
                      {loading ? '分析中...' : '提交分析'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    width: MODAL_WIDTH,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  modalContent: {
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 16,
    position: 'relative',
    width: '100%',
  },
  textInput: {
    height: 120,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width: '100%',
    minWidth: 0, // 防止宽度收缩
  },
  characterCountContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  characterCount: {
    fontSize: 10,
    color: '#ffffff',
  },
  hintText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default AISupplementInput;