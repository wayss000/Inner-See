

import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

interface StatsData {
  totalTests: number;
  thisWeek: number;
  avgScore: number;
}

interface StatsCardProps {
  statsData: StatsData;
}

const StatsCard: React.FC<StatsCardProps> = ({ statsData }) => {
  const { totalTests, thisWeek, avgScore } = statsData;

  return (
    <View style={styles.container}>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalTests}</Text>
          <Text style={styles.statLabel}>总测试数</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{thisWeek}</Text>
          <Text style={styles.statLabel}>本周完成</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{avgScore}</Text>
          <Text style={styles.statLabel}>平均分数</Text>
        </View>
      </View>
    </View>
  );
};

export default StatsCard;

