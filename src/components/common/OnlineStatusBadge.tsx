/**
 * Online Status Badge Component
 * Shows online/offline status with optional last seen time
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Theme } from '../../constants/theme';

interface OnlineStatusBadgeProps {
    isOnline: boolean;
    lastSeen?: string;
    size?: 'small' | 'medium' | 'large';
    showText?: boolean;
}

const OnlineStatusBadge: React.FC<OnlineStatusBadgeProps> = ({
    isOnline,
    lastSeen,
    size = 'medium',
    showText = true,
}) => {
    const sizeMap = {
        small: 8,
        medium: 10,
        large: 12,
    };

    const badgeSize = sizeMap[size];

    const formatLastSeen = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
        });
    };

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.badge,
                    {
                        width: badgeSize,
                        height: badgeSize,
                        borderRadius: badgeSize / 2,
                        backgroundColor: isOnline ? Theme.colors.success : Theme.colors.textSecondary,
                    },
                ]}
            />
            {showText && (
                <Text variant="bodySmall" style={styles.text}>
                    {isOnline ? 'Online' : lastSeen ? formatLastSeen(lastSeen) : 'Offline'}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    badge: {
        borderWidth: 2,
        borderColor: Theme.colors.white,
    },
    text: {
        color: Theme.colors.textSecondary,
        fontSize: 12,
    },
});

export default OnlineStatusBadge;
