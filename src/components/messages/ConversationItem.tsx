/**
 * Conversation Item Component
 * Modern WhatsApp-style conversation list item
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Text, Badge } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';

interface ConversationItemProps {
    avatar?: string;
    name: string;
    age?: number;
    lastMessage: string;
    timestamp: string;
    unreadCount?: number;
    isOnline?: boolean;
    onPress: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
    avatar,
    name,
    age,
    lastMessage,
    timestamp,
    unreadCount = 0,
    isOnline = false,
    onPress,
}) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Avatar with online indicator */}
            <View style={styles.avatarContainer}>
                {avatar ? (
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <Icon name="account" size={32} color="#999" />
                    </View>
                )}
                {isOnline && <View style={styles.onlineIndicator} />}
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name} numberOfLines={1}>
                        {name}{age ? `, ${age}` : ''}
                    </Text>
                    <Text style={styles.timestamp}>{timestamp}</Text>
                </View>

                <View style={styles.messageRow}>
                    <Text
                        style={[
                            styles.lastMessage,
                            unreadCount > 0 && styles.unreadMessage
                        ]}
                        numberOfLines={1}
                    >
                        {lastMessage}
                    </Text>
                    {unreadCount > 0 && (
                        <Badge style={styles.badge} size={20}>
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                </View>
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
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    avatarPlaceholder: {
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
        marginLeft: 8,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    unreadMessage: {
        color: '#333',
        fontWeight: '500',
    },
    badge: {
        backgroundColor: Theme.colors.primary,
        marginLeft: 8,
    },
});

export default ConversationItem;
