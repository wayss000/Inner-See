import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { AIAnalysisResult as AIResultType } from '../../../src/types/AITypes';

const { width } = Dimensions.get('window');

interface AIAnalysisResultProps {
  result: AIResultType;
  onClose: () => void;
}

const AIAnalysisResultComponent: React.FC<AIAnalysisResultProps> = ({ result }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome6 name="brain" size={24} color="#6366f1" />
        <Text style={styles.title}>AI心理分析报告</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 当前情况分析 */}
        <LinearGradient
          colors={['#60a5fa', '#3b82f6']}
          style={styles.section}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.sectionHeader}>
            <FontAwesome6 name="chart-line" size={20} color="#ffffff" />
            <Text style={styles.sectionTitle}>当前情况分析</Text>
          </View>
          <Text style={styles.sectionContent}>{result.currentSituation}</Text>
        </LinearGradient>

        {/* 调整建议 */}
        <LinearGradient
          colors={['#4ade80', '#22c55e']}
          style={styles.section}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.sectionHeader}>
            <FontAwesome6 name="lightbulb" size={20} color="#ffffff" />
            <Text style={styles.sectionTitle}>调整建议</Text>
          </View>
          <Text style={styles.sectionContent}>{result.adjustmentSuggestions}</Text>
        </LinearGradient>

        {/* 注意事项 */}
        <LinearGradient
          colors={['#fbbf24', '#f59e0b']}
          style={styles.section}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.sectionHeader}>
            <FontAwesome6 name="exclamation-triangle" size={20} color="#ffffff" />
            <Text style={styles.sectionTitle}>注意事项</Text>
          </View>
          <Text style={styles.sectionContent}>{result.注意事项}</Text>
        </LinearGradient>

        {/* 免责声明 */}
        <View style={styles.disclaimerSection}>
          <FontAwesome6 name="info-circle" size={16} color="#6b7280" />
          <Text style={styles.disclaimerText}>{result.disclaimer}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
    marginLeft: 12,
  },
  content: {
    flex: 1,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#ffffff',
    textAlign: 'left',
  },
  disclaimerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
    flex: 1,
    textAlign: 'left',
  },
});

export default AIAnalysisResultComponent;