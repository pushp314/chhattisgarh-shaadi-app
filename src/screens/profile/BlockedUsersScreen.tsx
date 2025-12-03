/**
 * Blocked Users Screen
 * Manage blocked profiles - view and unblock users
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
    RefreshControl,
    Alert,
} from 'react-native';
import {
    Text,
    Surface,
    Button,
    ActivityIndicator,
    IconButton,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';
import blockService from '../../services/block.service';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

type BlockedUsersScreenNavigationProp = NativeStackNavigationProp<any>;

type Props = {
    navigation: BlockedUsersScreenNavigationProp;
};

const BlockedUsersScreen: React.FC<Props> = ({ navigation }) => {
    const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [unblocking, setUnblocking] = useState<number | null>(null);

    useFocusEffect(
        useCallback(() => {
            loadBlockedUsers();
        }, [])
    );

    const loadBlockedUsers = async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setIsLoading(true);
        }
        setError(null);

        try {
            const { results } = await blockService.getBlockedList({
                page: 1,
                limit: 50,
            });
            setBlockedUsers(results);
        } catch (err: any) {
            console.error('Error loading blocked users:', err);
            setError(err.response?.data?.message || 'Failed to load blocked users');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const handleUnblock = async (userId: number, userName: string) => {
        Alert.alert(
            'Unblock User',
            `Are you sure you want to unblock ${userName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Unblock',
                    style: 'destructive',
                    onPress: async () => {
                        setUnblocking(userId);
                        try {
                            await blockService.unblockUser(userId);
                            // Remove from local state
                            setBlockedUsers(prev => prev.filter(u => u.blockedUserId !== userId));
                            Alert.alert('Success', `${userName} has been unblocked`);
                        } catch (error: any) {
                            Alert.alert('Error', error.response?.data?.message || 'Failed to unblock user');
                        } finally {
                            setUnblocking(null);
                        }
                    },
                },
            ]
        );
    };

    const renderBlockedUser = ({ item }: { item: any }) => {
        const blockedProfile = item.blockedUser?.profile;
        if (!blockedProfile) return null;

        const fullName = `${blockedProfile.firstName} ${blockedProfile.lastName}`.trim();
        const profilePic = blockedProfile.media?.[0]?.url;
        const isUnblocking = unblocking === item.blockedUserId;

        return (
            <Surface style={styles.userCard} elevation={1}>
                <View style={styles.cardContent}>
                    {/* Profile Picture */}
                    {profilePic ? (
                        <Image source={{ uri: profilePic }} style={styles.profilePic} />
                    ) : (
                        <View style={styles.profilePicPlaceholder}>
                            <Icon name="account" size={40} color={Theme.colors.textSecondary} />
                        </View>
                    )}

                    {/* User Info */}
                    <View style={styles.infoContainer}>
                        <Text variant="titleMedium" style={styles.name}>
                            {fullName}
                        </Text>
                        {blockedProfile.city && blockedProfile.state && (
                            <View style={styles.locationRow}>
                                <Icon name="map-marker" size={16} color={Theme.colors.textSecondary} />
                                <Text style={styles.locationText}>
                                    {blockedProfile.city}, {blockedProfile.state}
                                </Text>
                            </View>
                        )}
                        <Text variant="bodySmall" style={styles.blockedDate}>
                            Blocked on {new Date(item.createdAt).toLocaleDateString('en-IN')}
                        </Text>
                    </View>

                    {/* Unblock Button */}
                    <Button
                        mode="outlined"
                        onPress={() => handleUnblock(item.blockedUserId, fullName)}
                        loading={isUnblocking}
                        disabled={isUnblocking}
                        style={styles.unblockButton}
                        textColor={Theme.colors.primary}
                        icon="account-cancel-outline">
                        Unblock
                    </Button>
                </View>
            </Surface>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Theme.colors.primary} />
                <Text style={styles.loadingText}>Loading blocked users...</Text>
            </View>
        );
    }

    if (error) {
        return <ErrorState message={error} onRetry={() => loadBlockedUsers()} />;
    }

    return (
        <View style={styles.container}>
            {/* Header Info */}
            {blockedUsers.length > 0 && (
                <Surface style={styles.header} elevation={1}>
                    <Icon name="account-cancel" size={24} color={Theme.colors.primary} />
                    <Text variant="bodyMedium" style={styles.headerText}>
                        You have blocked {blockedUsers.length} {blockedUsers.length === 1 ? 'user' : 'users'}
                    </Text>
                </Surface>
            )}

            {/* Blocked Users List */}
            <FlatList
                data={blockedUsers}
                renderItem={renderBlockedUser}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <EmptyState
                        icon="account-check"
                        title="No Blocked Users"
                        message="You haven't blocked anyone yet. Blocked users won't be able to contact you or view your profile."
                    />
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => loadBlockedUsers(true)}
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
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
        backgroundColor: Theme.colors.white,
        marginBottom: 8,
    },
    headerText: {
        flex: 1,
        color: Theme.colors.text,
    },
    listContent: {
        padding: 16,
        flexGrow: 1,
    },
    userCard: {
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: Theme.colors.white,
        ...Theme.shadows.md,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    profilePic: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    profilePicPlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Theme.colors.surfaceCard,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 4,
    },
    locationText: {
        fontSize: 14,
        color: Theme.colors.textSecondary,
    },
    blockedDate: {
        color: Theme.colors.textSecondary,
        marginTop: 4,
    },
    unblockButton: {
        borderRadius: 8,
        borderColor: Theme.colors.primary,
    },
});

export default BlockedUsersScreen;
