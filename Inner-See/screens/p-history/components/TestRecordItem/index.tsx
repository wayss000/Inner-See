

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface TestRecord {
  id: string;
  title: string;
  time: string;
  score?: number;
  level?: string;
  type?: string;
  description?: string;
  icon: string;
  gradientColors: [string, string, ...string[]];
  levelColor?: string;
}

interface TestRecordItemProps {
  record: TestRecord;
  onPress: () => void;
}

const TestRecordItem: React.FC<TestRecordItemProps> = ({ record, onPress }) => {
  const {
    title,
    time,
    score,
    level,
    type,
    description,
    icon,
    gradientColors,
    levelColor,
  } = record;

  const renderResult = () => {
    if (score !== undefined && level) {
      return (
        <View style={styles.resultContainer}>
          <Text style={styles.resultValue}>{score}</Text>
          <Text style={[styles.resultDescription, { color: levelColor || '#9ca3af' }]}>
            {level}
          </Text>
        </View>
      );
    }
    
    if (type && description) {
      return (
        <View style={styles.resultContainer}>
          <Text style={styles.resultValue}>{type}</Text>
          <Text style={styles.resultDescription}>{description}</Text>
        </View>
      );
    }
    
    return null;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <LinearGradient
          colors={gradientColors}
          style={styles.iconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <FontAwesome6 name={icon} size={18} color="#ffffff" />
        </LinearGradient>
        
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        
        {renderResult()}
      </View>
    </TouchableOpacity>
  );
};

export default TestRecordItem;

