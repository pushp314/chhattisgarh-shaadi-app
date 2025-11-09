import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: string;
  style?: ViewStyle;
}

const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  thickness = 1,
  color = colors.neutral.gray300,
  style,
}) => {
  return (
    <View
      style={[
        styles.divider,
        orientation === 'horizontal'
          ? { height: thickness, width: '100%' }
          : { width: thickness, height: '100%' },
        { backgroundColor: color },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    marginVertical: 8,
  },
});

export default Divider;