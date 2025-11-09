import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import MarkdownRenderer from './MarkdownRenderer';
import { AIAnalysisResult as AIResultType } from '../../../src/types/AITypes';
import { PrimaryColors, TextColors } from '../../../src/constants/Colors';

const { width } = Dimensions.get('window');

interface AIAnalysisResultProps {
  result: AIResultType;
  onClose: () => void;
  onRegenerate?: () => void;
}

const AIAnalysisResultComponent: React.FC<AIAnalysisResultProps> = ({ result, onClose, onRegenerate }) => {

  if (!result) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>暂无数据</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome6 name="brain" size={24} color={PrimaryColors.main} />
        <Text style={styles.title}>AI心理分析报告</Text>
      </View>

      <View style={styles.content}>
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
          {result.currentSituation ? (
            <MarkdownRenderer>{result.currentSituation}</MarkdownRenderer>
          ) : (
            <Text style={styles.sectionContent}>暂无内容</Text>
          )}
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
          {result.adjustmentSuggestions ? (
            <MarkdownRenderer>{result.adjustmentSuggestions}</MarkdownRenderer>
          ) : (
            <Text style={styles.sectionContent}>暂无内容</Text>
          )}
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
          {result.注意事项 ? (
            <MarkdownRenderer>{result.注意事项}</MarkdownRenderer>
          ) : (
            <Text style={styles.sectionContent}>暂无内容</Text>
          )}
        </LinearGradient>

        {/* 免责声明 */}
        <View style={styles.disclaimerSection}>
          <Text style={styles.disclaimerText}>{result.disclaimer}</Text>
        </View>
      </View>
      
      {/* 操作按钮区域 */}
      <View style={styles.actionButtonsContainer}>
        <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>关闭</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.regenerateButton}
          onPress={() => {
            // 触发重新生成逻辑
            if (onRegenerate) {
              onRegenerate();
            }
          }}
        >
          <Text style={styles.regenerateButtonText}>重新生成</Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // 移除 minHeight，让容器根据内容自适应高度
    backgroundColor: 'transparent', // 确保背景透明
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(217, 119, 87, 0.1)', // PrimaryColors.main with 0.1 opacity
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PrimaryColors.main,
    marginLeft: 12,
  },
  content: {
    width: '100%',
    paddingBottom: 20, // 减少底部内边距，只保留必要的间距
    // 移除 minHeight，让内容根据实际内容自适应高度
    backgroundColor: 'transparent', // 确保背景透明，内容可见
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    // 移除 minHeight，让section根据内容自适应高度
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
    padding: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
    flex: 1,
    textAlign: 'left',
  },
  actionButtonsContainer: {
    marginTop: 8, // 在按钮上方添加间距
    paddingBottom: 8, // 减少底部间距
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12, // 增加按钮内边距，让按钮更易点击
  },
  closeButton: {
    flex: 1,
    backgroundColor: '#6b7280',
    borderRadius: 8,
    paddingVertical: 10, // 减少按钮内边距，从12减少到10
    marginRight: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  regenerateButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 10, // 减少按钮内边距，从12减少到10
    marginLeft: 8,
    alignItems: 'center',
  },
  regenerateButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default AIAnalysisResultComponent;