/**
 * Notification Item Component
 * Modern notification list item with action buttons
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';

type NotificationType = 'match' | 'message' | 'view' | 'shortlist';

interface NotificationItemProps {
    type: NotificationType;
    avatar?: string;
    name: string;
    message: string;
    timestamp: string;
    isUnread?: boolean;
    onPress?: () => void;
    onAccept?: () => void;
    onDecline?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
    type,
    avatar,
    name,
    message,
    timestamp,
    isUnread = false,
    onPress,
    onAccept,
    onDecline,
}) => {
    const getIcon = () => {
        switch (type) {
            case 'match': return '💝';
            case 'message': return '💬';
            case 'view': return '👁️';
            case 'shortlist': return '⭐';
            default: return '📬';
        }
    };

    return (
        <TouchableOpacity
            style={[styles.container, isUnread && styles.unreadContainer]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {isUnread && <View style={styles.unreadIndicator} />}

            <Text style={styles.icon}>{getIcon()}</Text>

            {avatar && (
                <Image source={{ uri: avatar }} style={styles.avatar} />
            )}

            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={1}>
                    {name}
                </Text>
                <Text style={styles.message} numberOfLines={2}>
                    {message}
                </Text>
                <Text style={styles.timestamp}>{timestamp}</Text>

                {type === 'match' && (onAccept || onDecline) && (
                    <View style={styles.actions}>
                        {onDecline && (
                            <Button
                                mode="outlined"
                                onPress={onDecline}
                                style={styles.declineButton}
                                labelStyle={styles.declineLabel}
                                compact
                            >
                                Decline
                            </Button>
                        )}
                        {onAccept && (
                            <Button
                                mode="contained"
                                onPress={onAccept}
                                style={styles.acceptButton}
                                buttonColor={Theme.colors.primary}
                                compact
                            >
                                Accept
                            </Button>
                        )}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        position: 'relative',
    },
    unreadContainer: {
        backgroundColor: '#FFF5F8',
    },
    unreadIndicator: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        backgroundColor: Theme.colors.primary,
    },
    icon: {
        fontSize: 24,
        marginRight: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    message: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
        lineHeight: 18,
    },
    timestamp: {
        fontSize: 11,
        color: '#999',
        marginBottom: 8,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
    },
    acceptButton: {
        flex: 1,
    },
    declineButton: {
        flex: 1,
        borderColor: '#DDD',
    },
    declineLabel: {
        color: '#666',
    },
});

export default NotificationItem;
