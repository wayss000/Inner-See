

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';
import { PrimaryColors } from '../../../../src/constants/Colors';

interface EmptyStateProps {
  onStartTest: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onStartTest }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <LinearGradient
          colors={['#9ca3af', '#6b7280']}
          style={styles.iconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <FontAwesome6 name="clock-rotate-left" size={24} color={PrimaryColors.main} />
        </LinearGradient>
        
        <Text style={styles.title}>暂无测试记录</Text>
        <Text style={styles.description}>
          开始您的第一次心理测试，了解更真实的自己
        </Text>
        
        <TouchableOpacity
          style={styles.startButton}
          onPress={onStartTest}
          activeOpacity={0.7}
        >
          <FontAwesome6 name="play" size={14} color={PrimaryColors.main} style={styles.startIcon} />
          <Text style={styles.startButtonText}>开始测试</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EmptyState;

