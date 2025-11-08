import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { PrimaryColors, TextColors } from '../../../src/constants/Colors';

interface AIAskButtonProps {
  onPress: () => void;
  loading?: boolean;
  completed?: boolean;
  error?: boolean;
}

const AIAskButton: React.FC<AIAskButtonProps> = ({
  onPress,
  loading = false,
  completed = false,
  error = false,
}) => {
  const getButtonStyle = () => {
    if (error) {
      return [styles.button, styles.buttonError];
    }
    if (completed) {
      return [styles.button, styles.buttonCompleted];
    }
    return [styles.button, styles.buttonIdle];
  };

  const getButtonText = () => {
    if (loading) {
      return 'AI分析中...';
    }
    if (completed) {
      return '查看AI分析';
    }
    if (error) {
      return '分析失败，重试';
    }
    return '问AI';
  };

  const getButtonColors = (): [string, string] => {
    if (error) {
      return ['#ef4444', '#dc2626'];
    }
    if (completed) {
      return ['#10b981', '#059669'];
    }
    return [PrimaryColors.main, PrimaryColors.secondary];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getButtonColors()}
        style={styles.button}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={TextColors.white} />
        ) : (
          <>
            <FontAwesome6 
              name={completed ? "eye" : error ? "refresh" : "robot"} 
              size={16} 
              color={TextColors.white} 
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>{getButtonText()}</Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIdle: {
    backgroundColor: PrimaryColors.main,
  },
  buttonCompleted: {
    backgroundColor: '#10b981',
  },
  buttonError: {
    backgroundColor: '#ef4444',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default AIAskButton;