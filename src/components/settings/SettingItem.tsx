import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { colors } from '../../theme/colors';

type SettingItemProps = {
  icon: string;
  title: string;
  subtitle?: string;
  type: 'navigate' | 'toggle' | 'danger';
  onPress?: () => void;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
};

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  type,
  onPress,
  toggleValue = false,
  onToggleChange,
}) => {
  const isDanger = type === 'danger';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={type === 'toggle'}
      activeOpacity={0.6}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, isDanger && styles.dangerText]}>{title}</Text>
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>

      {type === 'navigate' && (
        <Text style={[styles.arrow, isDanger && styles.dangerText]}>›</Text>
      )}
      
      {type === 'toggle' && (
        <Switch
          value={toggleValue}
          onValueChange={onToggleChange}
          trackColor={{ false: colors.neutral.gray300, true: colors.primary.main }}
          thumbColor={colors.neutral.white}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary.lighter,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
  },
  arrow: {
    fontSize: 24,
    color: colors.neutral.gray500,
    fontWeight: '300',
  },
  dangerText: {
    color: colors.error,
  },
});

export default SettingItem;