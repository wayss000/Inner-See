import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface AvatarSelectorProps {
  selectedAvatar: string;
  onAvatarSelect: (avatar: string) => void;
  disabled?: boolean;
}

const DEFAULT_AVATARS = [
  'smiley', 'heart', 'star', 'sun', 'moon', 'cat', 'dog', 'flower', 
  'tree', 'coffee', 'book', 'music', 'gamepad', 'rocket', 'gem', 
  'crown', 'gift', 'balloon', 'cookie', 'smile-beam'
];

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ 
  selectedAvatar, 
  onAvatarSelect,
  disabled = false 
}) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {DEFAULT_AVATARS.map((avatar) => (
        <TouchableOpacity
          key={avatar}
          style={[
            styles.avatarItem,
            selectedAvatar === avatar && styles.selectedAvatarItem,
            disabled && styles.disabledAvatarItem
          ]}
          onPress={() => !disabled && onAvatarSelect(avatar)}
          activeOpacity={0.7}
          disabled={disabled}
        >
          <FontAwesome6 
            name={avatar as any}
            size={32}
            color={selectedAvatar === avatar ? '#667eea' : '#6b7280'}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 12,
  },
  avatarItem: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatarItem: {
    borderColor: '#667eea',
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
  },
  disabledAvatarItem: {
    opacity: 0.5,
  },
});

export default AvatarSelector;