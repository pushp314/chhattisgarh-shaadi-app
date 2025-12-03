/**
 * Notification Center Screen
 * Display notification history with filtering and management
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import {
    Text,
    Surface,
    IconButton,
    ActivityIndicator,
    Chip,
    Badge,
    Divider,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';
import { Notification, NotificationType } from '../../types';
import notificationService from '../../services/notification.service';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

type NotificationCenterScreenNavigationProp = NativeStackNavigationProp<any>;

type Props = {
    navigation: NotificationCenterScreenNavigationProp;
};

const NotificationCenterScreen: React.FC<Props> = ({ navigation }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    useFocusEffect(
        useCallback(() => {
            loadNotifications();
        }, [])
    );

    const loadNotifications = async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setIsLoading(true);
        }
        setError(null);

        try {
            const { results } = await notificationService.getNotifications({
                page: 1,
                limit: 50,
            });
            setNotifications(results || []);
        } catch (err: any) {
            console.error('Error loading notifications:', err);
            setError(err.response?.data?.message || 'Failed to load notifications');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markRead();
            // Update local state
            setNotifications(prev =>
                prev.map(n => ({ ...n, isRead: true }))
            );
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    const getNotificationIcon = (type: NotificationType): string => {
        switch (type) {
            case 'MATCH_REQUEST':
                return 'heart';
            case 'MATCH_ACCEPTED':
                return 'heart-multiple';
            case 'MATCH_REJECTED':
                return 'heart-broken';
            case 'NEW_MESSAGE':
                return 'message';
            case 'PROFILE_VIEW':
                return 'eye';
            case 'SHORTLISTED':
                return 'bookmark';
            case 'SUBSCRIPTION_EXPIRY':
                return 'alert-circle';
            case 'PROFILE_VERIFIED':
                return 'check-decagram';
            case 'PROFILE_REJECTED':
                return 'account-alert';
            case 'PAYMENT_SUCCESS':
                return 'credit-card-check';
            case 'PAYMENT_FAILED':
                return 'credit-card-off';
            case 'SYSTEM_ALERT':
            case 'SECURITY_ALERT':
                return 'alert';
            default:
                return 'bell';
        }
    };

    const getNotificationColor = (type: NotificationType): string => {
        switch (type) {
            case 'MATCH_REQUEST':
            case 'MATCH_ACCEPTED':
            case 'PROFILE_VERIFIED':
            case 'PAYMENT_SUCCESS':
                return Theme.colors.success;
            case 'MATCH_REJECTED':
            case 'PROFILE_REJECTED':
            case 'PAYMENT_FAILED':
                return Theme.colors.primary;
            case 'NEW_MESSAGE':
                return Theme.colors.secondary;
            case 'PROFILE_VIEW':
            case 'SHORTLISTED':
                return Theme.colors.accent;
            case 'SUBSCRIPTION_EXPIRY':
            case 'SYSTEM_ALERT':
            case 'SECURITY_ALERT':
                return Theme.colors.primary;
            default:
                return Theme.colors.textSecondary;
        }
    };

    const formatTimestamp = (dateString: string) => {
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
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
    };

    const handleNotificationPress = (notification: Notification) => {
        // Navigate based on notification type
        try {
            const data = notification.data ? JSON.parse(notification.data) : {};

            switch (notification.type) {
                case 'MATCH_REQUEST':
                case 'MATCH_ACCEPTED':
                case 'MATCH_REJECTED':
                    navigation.navigate('Matches');
                    break;
                case 'NEW_MESSAGE':
                    if (data.userId && data.userName) {
                        navigation.navigate('Messages', {
                            screen: 'ChatScreen',
                            params: { userId: data.userId, userName: data.userName },
                        });
                    }
                    break;
                case 'PROFILE_VIEW':
                    // Navigate to "Who viewed me" screen when implemented
                    break;
                case 'SHORTLISTED':
                    // Navigate to shortlist screen
                    break;
                case 'SUBSCRIPTION_EXPIRY':
                case 'PAYMENT_SUCCESS':
                case 'PAYMENT_FAILED':
                    // Navigate to subscription screen
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('Error handling notification press:', error);
        }
    };

    const renderNotification = ({ item }: { item: Notification }) => {
        const icon = getNotificationIcon(item.type);
        const iconColor = getNotificationColor(item.type);

        return (
            <TouchableOpacity onPress={() => handleNotificationPress(item)}>
                <Surface
                    style={[
                        styles.notificationCard,
                        !item.isRead && styles.unreadCard,
                    ]}
                    elevation={item.isRead ? 0 : 1}>
                    <View style={styles.iconContainer}>
                        <View
                            style={[
                                styles.iconCircle,
                                { backgroundColor: iconColor + '20' },
                            ]}>
                            <Icon name={icon} size={24} color={iconColor} />
                        </View>
                        {!item.isRead && <View style={styles.unreadDot} />}
                    </View>

                    <View style={styles.contentContainer}>
                        <Text
                            variant="titleSmall"
                            style={[
                                styles.title,
                                !item.isRead && styles.unreadTitle,
                            ]}>
                            {item.title}
                        </Text>
                        <Text
                            variant="bodyMedium"
                            style={styles.message}
                            numberOfLines={2}>
                            {item.message}
                        </Text>
                        <Text variant="bodySmall" style={styles.timestamp}>
                            {formatTimestamp(item.createdAt)}
                        </Text>
                    </View>

                    <IconButton
                        icon="chevron-right"
                        size={20}
                        iconColor={Theme.colors.textSecondary}
                    />
                </Surface>
                <Divider />
            </TouchableOpacity>
        );
    };

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.isRead)
        : notifications;

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Theme.colors.primary} />
                <Text style={styles.loadingText}>Loading notifications...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <ErrorState
                message={error}
                onRetry={() => loadNotifications()}
            />
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <Surface style={styles.header} elevation={2}>
                <View style={styles.headerContent}>
                    <View style={styles.headerLeft}>
                        <Text variant="titleLarge" style={styles.headerTitle}>
                            Notifications
                        </Text>
                        {unreadCount > 0 && (
                            <Badge size={24} style={styles.badge}>
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </Badge>
                        )}
                    </View>
                    {unreadCount > 0 && (
                        <TouchableOpacity onPress={handleMarkAllRead}>
                            <Text style={styles.markAllRead}>Mark all read</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Filter Chips */}
                <View style={styles.filterContainer}>
                    <Chip
                        selected={filter === 'all'}
                        onPress={() => setFilter('all')}
                        style={styles.filterChip}
                        selectedColor={Theme.colors.primary}>
                        All ({notifications.length})
                    </Chip>
                    <Chip
                        selected={filter === 'unread'}
                        onPress={() => setFilter('unread')}
                        style={styles.filterChip}
                        selectedColor={Theme.colors.primary}>
                        Unread ({unreadCount})
                    </Chip>
                </View>
            </Surface>

            {/* Notifications List */}
            <FlatList
                data={filteredNotifications}
                renderItem={renderNotification}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <EmptyState
                        icon="bell-outline"
                        title={filter === 'unread' ? 'No Unread Notifications' : 'No Notifications'}
                        message={
                            filter === 'unread'
                                ? "You're all caught up! No unread notifications."
                                : "You haven't received any notifications yet."
                        }
                    />
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => loadNotifications(true)}
                        colors={[Theme.colors.primary]}
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Theme.colors.background,
    },
    loadingText: {
        marginTop: 16,
        color: Theme.colors.textSecondary,
    },
    header: {
        backgroundColor: Theme.colors.white,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerTitle: {
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    badge: {
        backgroundColor: Theme.colors.secondary,
    },
    markAllRead: {
        color: Theme.colors.primary,
        fontWeight: '600',
    },
    filterContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    filterChip: {
        borderRadius: 20,
    },
    listContent: {
        flexGrow: 1,
    },
    notificationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: Theme.colors.white,
        gap: 12,
    },
    unreadCard: {
        backgroundColor: Theme.colors.surfaceCard,
    },
    iconContainer: {
        position: 'relative',
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unreadDot: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Theme.colors.secondary,
        borderWidth: 2,
        borderColor: Theme.colors.white,
    },
    contentContainer: {
        flex: 1,
    },
    title: {
        marginBottom: 4,
        color: Theme.colors.text,
    },
    unreadTitle: {
        fontWeight: 'bold',
    },
    message: {
        color: Theme.colors.textSecondary,
        marginBottom: 4,
    },
    timestamp: {
        color: Theme.colors.textSecondary,
        fontSize: 12,
    },
});

export default NotificationCenterScreen;
