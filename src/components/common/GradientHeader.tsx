/**
 * Gradient Header Component
 * Reusable gradient header for screens
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';

interface GradientHeaderProps {
    title: string;
    subtitle?: string;
    icon?: string;
    iconSize?: number;
    colors?: string[];
    style?: ViewStyle;
}

const GradientHeader: React.FC<GradientHeaderProps> = ({
    title,
    subtitle,
    icon = 'crown',
    iconSize = 48,
    colors = [Theme.colors.primary, '#D81B60'],
    style,
}) => {
    return (
        <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.container, style]}
        >
            {icon && <Icon name={icon} size={iconSize} color="#FFD700" />}
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
        alignItems: 'center',
        borderRadius: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Theme.colors.white,
        marginTop: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginTop: 8,
    },
});

export default GradientHeader;
