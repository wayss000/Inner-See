import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { DatabaseManager } from '../../src/database/DatabaseManager';
import { User } from '../../src/entities/TestEntities';
import AvatarSelector from '../../src/components/AvatarSelector';
import styles from './styles';

// 创建一个简单的事件系统来通知数据更新
const eventEmitter = {
  listeners: new Map(),
  
  on(event: string, callback: () => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  },
  
  off(event: string, callback: () => void) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)!;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  },
  
  emit(event: string) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach((callback: () => void) => callback());
    }
  }
};

const ProfileEditScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [gender, setGender] = useState<'男' | '女' | '其他' | undefined>(undefined);
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const dbManager = DatabaseManager.getInstance();
      await dbManager.initialize();
      
      const currentUser = await dbManager.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setNickname(currentUser.nickname);
        setSelectedAvatar(currentUser.avatarEmoji);
        setGender(currentUser.gender);
        setAge(currentUser.age?.toString() || '');
        setOccupation(currentUser.occupation || '');
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
      Alert.alert('错误', '加载用户数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
  };

  const handleGenderSelect = (selectedGender: '男' | '女' | '其他') => {
    setGender(selectedGender);
  };

  const handleSave = async () => {
    try {
      if (!nickname.trim()) {
        Alert.alert('提示', '请输入昵称');
        return;
      }

      if (nickname.length > 20) {
        Alert.alert('提示', '昵称不能超过20个字符');
        return;
      }

      const ageNum = age ? parseInt(age) : undefined;
      if (age && (isNaN(ageNum!) || ageNum! < 12 || ageNum! > 100)) {
        Alert.alert('提示', '年龄必须是12-100之间的数字');
        return;
      }

      setIsSaving(true);

      const updatedUser: User = {
        ...user!,
        nickname: nickname.trim(),
        avatarEmoji: selectedAvatar,
        gender,
        age: ageNum,
        occupation: occupation.trim() || undefined
      };

      const dbManager = DatabaseManager.getInstance();
      await dbManager.updateUser(updatedUser);

      // 验证数据是否正确保存
      const savedUser = await dbManager.getCurrentUser();
      console.log('保存后的用户数据:', savedUser);
      console.log('更新前的用户数据:', user);

      Alert.alert('成功', '个人信息保存成功', [
        {
          text: '确定',
          onPress: () => {
            // 通知其他页面数据已更新
            eventEmitter.emit('userUpdated');
            router.back();
          }
        }
      ]);

    } catch (error) {
      console.error('保存用户数据失败:', error);
      Alert.alert('错误', '保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <FontAwesome6 name="spinner" size={24} color="#ffffff" style={styles.loadingIcon} />
            <Text style={styles.loadingText}>加载中...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* 顶部导航栏 */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleCancel} activeOpacity={0.7}>
              <FontAwesome6 name="arrow-left" size={18} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>编辑个人信息</Text>
            <View style={styles.headerRight} />
          </View>

          {/* 表单内容 */}
          <View style={styles.formContainer}>
            {/* 昵称 */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>昵称</Text>
              <TextInput
                style={styles.input}
                value={nickname}
                onChangeText={setNickname}
                placeholder="请输入昵称（最多20个字符）"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                maxLength={20}
              />
              <Text style={styles.characterCount}>{nickname.length}/20</Text>
            </View>

            {/* 头像选择 */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>头像</Text>
              <AvatarSelector
                selectedAvatar={selectedAvatar}
                onAvatarSelect={handleAvatarSelect}
              />
            </View>

            {/* 性别 */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>性别</Text>
              <View style={styles.genderContainer}>
                {(['男', '女', '其他'] as const).map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.genderButton,
                      gender === option && styles.selectedGenderButton
                    ]}
                    onPress={() => handleGenderSelect(option)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.genderText,
                      gender === option && styles.selectedGenderText
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 年龄 */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>年龄</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="请输入年龄（12-100）"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                keyboardType="numeric"
              />
            </View>

            {/* 职业 */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>职业</Text>
              <TextInput
                style={styles.input}
                value={occupation}
                onChangeText={setOccupation}
                placeholder="请输入职业"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </View>

            {/* 保存按钮 */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                activeOpacity={0.7}
                disabled={isSaving}
              >
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.saveButtonText}>
                    {isSaving ? '保存中...' : '保存'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                activeOpacity={0.7}
                disabled={isSaving}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

// 导出事件发射器供其他组件使用
(ProfileEditScreen as any).eventEmitter = eventEmitter;

export default ProfileEditScreen;