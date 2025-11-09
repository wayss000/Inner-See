import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';
import { CustomTestConfig, GeneratedTest } from '../../src/types/AITypes';
import { AIService } from '../../src/services/AIService';
import { BackgroundGradient, PrimaryColors } from '../../src/constants/Colors';

const CustomTestScreen = () => {
  console.log('CustomTestScreen 组件开始渲染');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'select' | 'interactive' | 'direct'>('select');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [userDescription, setUserDescription] = useState('');
  
  // 测试分类选项
  const categoryOptions = [
    { id: 'mental-health', name: '心理健康', icon: 'heart' },
    { id: 'personality', name: '人格', icon: 'user' },
    { id: 'cognitive', name: '认知', icon: 'brain' },
    { id: 'career', name: '职业', icon: 'briefcase' },
    { id: 'relationship', name: '人际', icon: 'users' },
    { id: 'quality-of-life', name: '生活', icon: 'leaf' }
  ];

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleModeSelect = (testMode: 'interactive' | 'direct') => {
    console.log('选择测试模式:', testMode);
    setMode(testMode);
  };

  const toggleCategory = (categoryId: string) => {
    console.log('切换分类选择:', categoryId, '当前选中:', selectedCategories);
    setSelectedCategories(prev => {
      const newSelection = prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId];
      console.log('更新后的选中:', newSelection);
      return newSelection;
    });
  };

  const handleGenerateTest = async () => {
    console.log('开始生成测试', { mode, selectedCategories, userDescription });
    if (loading) return;

    // 验证输入
    if (mode === 'interactive' && selectedCategories.length === 0) {
      console.log('交互式模式未选择分类');
      Alert.alert('提示', '请至少选择一个测试分类');
      return;
    }

    if (mode === 'direct' && (!userDescription || userDescription.trim().length === 0)) {
      console.log('直接模式未输入描述');
      Alert.alert('提示', '请输入您的问题描述');
      return;
    }

    console.log('验证通过，开始调用AI服务');
    setLoading(true);

    try {
      const config: CustomTestConfig = {
        mode: mode as 'interactive' | 'direct',
        selectedCategories: mode === 'interactive' ? selectedCategories : undefined,
        userDescription: mode === 'direct' ? userDescription.trim() : undefined
      };

      console.log('配置信息:', config);
      const aiService = AIService.getInstance();
      console.log('AI服务实例:', aiService);
      const generatedTest = await aiService.generateCustomTest(config);
      console.log('AI生成结果:', generatedTest);

      // 跳转到测试题目页面
      router.push({
        pathname: '/p-test_question',
        params: {
          testData: JSON.stringify(generatedTest),
          config: JSON.stringify(config),
          test_type_id: 'custom'
        }
      });
      console.log('页面跳转完成');
    } catch (error) {
      console.error('生成测试失败:', error);
      Alert.alert('错误', '生成测试失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const renderSelectMode = () => (
    <View style={styles.modeSelectionContainer}>
      <Text style={styles.sectionTitle}>选择测试生成方式</Text>
      
      <TouchableOpacity
        style={styles.modeOption}
        onPress={() => handleModeSelect('interactive')}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['#60a5fa', '#06b6d4']}
          style={styles.modeIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <FontAwesome6 name="list-check" size={24} color="#ffffff" />
        </LinearGradient>
        <Text style={styles.modeTitle}>交互式选择</Text>
        <Text style={styles.modeDescription}>
          通过选择感兴趣的测试分类，生成综合性测试
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.modeOption}
        onPress={() => handleModeSelect('direct')}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['#f59e0b', '#d97706']}
          style={styles.modeIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <FontAwesome6 name="comment-dots" size={24} color="#ffffff" />
        </LinearGradient>
        <Text style={styles.modeTitle}>直接描述</Text>
        <Text style={styles.modeDescription}>
          直接描述您的困扰或需求，AI为您定制测试
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderInteractiveMode = () => (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>选择测试分类</Text>
      <Text style={styles.sectionSubtitle}>
        请选择您感兴趣的测试分类（可多选）
      </Text>
      
      <View style={styles.categoryGrid}>
        {categoryOptions.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryItem,
              selectedCategories.includes(category.id) && styles.categoryItemSelected
            ]}
            onPress={() => {
              console.log('点击分类按钮:', category.id);
              toggleCategory(category.id);
            }}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={selectedCategories.includes(category.id) ? ['#60a5fa', '#06b6d4'] : ['#e5e7eb', '#d1d5db']}
              style={styles.categoryIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome6 
                name={category.icon as any} 
                size={20} 
                color={selectedCategories.includes(category.id) ? "#ffffff" : "#6b7280"} 
              />
            </LinearGradient>
            <Text style={[
              styles.categoryName,
              selectedCategories.includes(category.id) && styles.categoryNameSelected
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.hintText}>
        已选择 {selectedCategories.length} 个分类
      </Text>
    </View>
  );

  const renderDirectMode = () => (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>描述您的需求</Text>
      <Text style={styles.sectionSubtitle}>
        请描述您近期的困惑、烦恼或想要分析的问题
      </Text>
      
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          value={userDescription}
          onChangeText={setUserDescription}
          placeholder="例如：最近总是感到焦虑，睡眠质量下降，工作效率降低..."
          placeholderTextColor="#9ca3af"
          multiline
          textAlignVertical="top"
        />
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={BackgroundGradient.primary}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* 顶部导航栏 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <FontAwesome6 name="arrow-left" size={18} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.titleSection}>
            <Text style={styles.pageTitle}>自定义测试</Text>
            <Text style={styles.pageSubtitle}>创建属于您的个性化测试</Text>
          </View>
        </View>

        {/* 内容区域 */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {mode === 'select' ? renderSelectMode() : null}
          {mode === 'interactive' ? renderInteractiveMode() : null}
          {mode === 'direct' ? renderDirectMode() : null}
        </ScrollView>

        {/* 底部操作按钮 */}
        {mode !== 'select' && (
          <View style={styles.bottomAction}>
            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGenerateTest}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={loading ? ['#9ca3af', '#6b7280'] : [PrimaryColors.main, PrimaryColors.secondary]}
                style={styles.generateButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <FontAwesome6 name="puzzle-piece" size={20} color="#ffffff" />
                    <Text style={styles.generateButtonText}>生成测试</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default CustomTestScreen;