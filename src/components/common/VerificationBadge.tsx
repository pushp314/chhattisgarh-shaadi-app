import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';
import { useAppTheme } from '../../hooks/useAppTheme';

type Props = {
    size?: number;
    showText?: boolean;
    style?: ViewStyle;
    variant?: 'inline' | 'overlay';
};

const VerificationBadge: React.FC<Props> = ({
    size = 20,
    showText = false,
    style,
    variant = 'inline',
}) => {
    const { theme } = useAppTheme();

    if (variant === 'overlay') {
        return (
            <View style={[styles.overlayBadge, { backgroundColor: theme.colors.surface }, style]}>
                <Icon name="check-decagram" size={size} color={theme.colors.success} />
                {showText && <Text style={[styles.verifiedText, { color: theme.colors.success }]}>Verified</Text>}
            </View>
        );
    }

    return (
        <View style={[styles.inlineBadge, style]}>
            <Icon name="check-decagram" size={size} color={theme.colors.success} />
            {showText && <Text style={[styles.verifiedText, { color: theme.colors.success }]}>Verified</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    overlayBadge: {
        borderRadius: 12,
        padding: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        ...Theme.shadows.sm,
    },
    inlineBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    verifiedText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
});

export default VerificationBadge;
