import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { DatabaseManager } from '../../src/database/DatabaseManager';
import { styles } from './styles';

interface ModelOption {
  label: string;
  value: string;
}

const ModelSelectionScreen = () => {
  const router = useRouter();
  const [currentModel, setCurrentModel] = useState<string>('KwaiKAT');
  const [selectedModel, setSelectedModel] = useState<string>('KwaiKAT');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [models, setModels] = useState<ModelOption[]>([
    { label: 'KwaiKAT模型', value: 'KwaiKAT' }
  ]);

  useEffect(() => {
    loadCurrentModel();
  }, []);

  const loadCurrentModel = async () => {
    try {
      const user = await DatabaseManager.getInstance().getCurrentUser();
      if (user?.selectedModel) {
        setCurrentModel(user.selectedModel);
        setSelectedModel(user.selectedModel);
      }
    } catch (error) {
      console.error('加载当前模型失败:', error);
    }
  };

  const handleSave = async () => {
    try {
      const user = await DatabaseManager.getInstance().getCurrentUser();
      if (user) {
        await DatabaseManager.getInstance().updateUser({
          ...user,
          selectedModel: selectedModel
        });
        setCurrentModel(selectedModel);
        Alert.alert('保存成功', '模型选择已更新');
        router.back();
      }
    } catch (error) {
      console.error('保存模型选择失败:', error);
      Alert.alert('保存失败', '模型选择更新失败，请重试');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* 标题栏 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <FontAwesome6 name="arrow-left" size={20} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.title}>模型选择</Text>
          <View style={styles.rightPlaceholder} />
        </View>

        {/* 内容区域 */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>AI模型选择</Text>
            <Text style={styles.sectionDesc}>选择您希望使用的AI模型进行心理测试</Text>
            
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setIsDropdownOpen(!isDropdownOpen)}
              activeOpacity={0.8}
            >
              <Text style={styles.selectedTextStyle}>
                {models.find(m => m.value === selectedModel)?.label || '请选择模型'}
              </Text>
              <FontAwesome6
                name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                size={20}
                color="rgba(255, 255, 255, 0.6)"
              />
            </TouchableOpacity>

            {isDropdownOpen && (
              <View style={styles.dropdownList}>
                {models.map((model) => (
                  <TouchableOpacity
                    key={model.value}
                    style={[
                      styles.dropdownItem,
                      selectedModel === model.value && styles.selectedDropdownItem
                    ]}
                    onPress={() => {
                      setSelectedModel(model.value);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      selectedModel === model.value && styles.selectedDropdownItemText
                    ]}>
                      {model.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.currentModelContainer}>
              <Text style={styles.currentModelTitle}>当前选择：</Text>
              <Text style={styles.currentModelValue}>
                {models.find(m => m.value === currentModel)?.label || currentModel}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* 底部操作按钮 */}
        <View style={styles.bottomContainer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={handleBack}>
              <Text style={styles.buttonText}>返回</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={[styles.buttonText, styles.saveButtonText]}>保存</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ModelSelectionScreen;