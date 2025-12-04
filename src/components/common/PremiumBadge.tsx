import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';
import LinearGradient from 'react-native-linear-gradient';

import { useAppTheme } from '../../hooks/useAppTheme';

type Props = {
    size?: number;
    showText?: boolean;
    style?: ViewStyle;
    variant?: 'inline' | 'overlay' | 'chip';
};

const PremiumBadge: React.FC<Props> = ({
    size = 20,
    showText = false,
    style,
    variant = 'inline',
}) => {
    const { theme } = useAppTheme();

    if (variant === 'overlay') {
        return (
            <LinearGradient
                colors={['#FFD700', '#FFA500']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.overlayBadge, style]}
            >
                <Icon name="crown" size={size} color={theme.colors.white} />
                {showText && <Text style={[styles.premiumText, { color: theme.colors.white }]}>Premium</Text>}
            </LinearGradient>
        );
    }

    if (variant === 'chip') {
        return (
            <LinearGradient
                colors={['#FFD700', '#FFA500']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.chipBadge, style]}
            >
                <Icon name="crown" size={size} color={theme.colors.white} />
                <Text style={[styles.chipText, { color: theme.colors.white }]}>Premium Member</Text>
            </LinearGradient>
        );
    }

    return (
        <View style={[styles.inlineBadge, style]}>
            <Icon name="crown" size={size} color="#FFA500" />
            {showText && <Text style={styles.inlineText}>Premium</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    overlayBadge: {
        borderRadius: 20,
        padding: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        ...Theme.shadows.sm,
    },
    chipBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
        alignSelf: 'flex-start',
    },
    inlineBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    premiumText: {
        color: Theme.colors.white,
        fontWeight: 'bold',
        fontSize: 12,
    },
    chipText: {
        color: Theme.colors.white,
        fontWeight: 'bold',
        fontSize: 12,
    },
    inlineText: {
        color: '#FFA500',
        fontWeight: 'bold',
        fontSize: 12,
    },
});

export default PremiumBadge;
