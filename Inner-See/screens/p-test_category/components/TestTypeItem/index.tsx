

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles';

interface TestType {
  id: string;
  title: string;
  description: string;
  duration: string;
  questions: string;
  icon: string;
  gradientColors: [string, string, ...string[]];
}

interface TestTypeItemProps {
  testType: TestType;
  onPress: () => void;
}

const TestTypeItem: React.FC<TestTypeItemProps> = ({ testType, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.testItem}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.testItemContent}>
        <LinearGradient
          colors={testType.gradientColors}
          style={styles.iconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <FontAwesome6 name={testType.icon} size={24} color="#ffffff" />
        </LinearGradient>
        
        <View style={styles.testInfo}>
          <Text style={styles.testTitle}>{testType.title}</Text>
          <Text style={styles.testDescription}>{testType.description}</Text>
          <View style={styles.testMeta}>
            <View style={styles.metaItem}>
              <FontAwesome6 name="clock" size={10} color="rgba(255, 255, 255, 0.6)" />
              <Text style={styles.metaText}>{testType.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <FontAwesome6 name="list" size={10} color="rgba(255, 255, 255, 0.6)" />
              <Text style={styles.metaText}>{testType.questions}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.arrowContainer}>
          <FontAwesome6 name="chevron-right" size={18} color="rgba(255, 255, 255, 0.6)" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TestTypeItem;

