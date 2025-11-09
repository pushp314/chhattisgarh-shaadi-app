import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface BadgeProps {
  text: string;
  color?: 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary';
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Badge: React.FC<BadgeProps> = ({
  text,
  color = 'primary',
  variant = 'solid',
  size = 'md',
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    if (variant === 'outline') return 'transparent';
    
    switch (color) {
      case 'success': return colors.success;
      case 'warning': return colors.warning;
      case 'error': return colors.error;
      case 'info': return colors.info;
      case 'primary': return colors.primary.main;
      case 'secondary': return colors.secondary.main;
      default: return colors.primary.main;
    }
  };

  const getBorderColor = () => {
    switch (color) {
      case 'success': return colors.success;
      case 'warning': return colors.warning;
      case 'error': return colors.error;
      case 'info': return colors.info;
      case 'primary': return colors.primary.main;
      case 'secondary': return colors.secondary.main;
      default: return colors.primary.main;
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') {
      return getBorderColor();
    }
    return colors.neutral.white;
  };

  return (
    <View
      style={[
        styles.badge,
        styles[`badge_${size}`],
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
        },
        style,
      ]}>
      <Text
        style={[
          styles.text,
          styles[`text_${size}`],
          { color: getTextColor() },
          textStyle,
        ]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badge_sm: {
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  badge_md: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  badge_lg: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  text: {
    fontWeight: '600',
  },
  text_sm: {
    fontSize: 10,
  },
  text_md: {
    fontSize: 12,
  },
  text_lg: {
    fontSize: 14,
  },
});

export default Badge;