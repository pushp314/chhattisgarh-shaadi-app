/**
 * Who Viewed Me Screen
 * Display profile view tracking - who viewed your profile
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import {
    Text,
    Surface,
    ActivityIndicator,
    Chip,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';
import { ProfileView } from '../../types';
import profileViewService from '../../services/profileView.service';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

type WhoViewedMeScreenNavigationProp = NativeStackNavigationProp<any>;

// type Props removed as we use useNavigation

const WhoViewedMeScreen: React.FC = () => {
    const navigation = useNavigation<WhoViewedMeScreenNavigationProp>();
    const [views, setViews] = useState<ProfileView[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');

    useFocusEffect(
        useCallback(() => {
            loadViews();
        }, [])
    );

    const loadViews = async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setIsLoading(true);
        }
        setError(null);

        try {
            const { results } = await profileViewService.getWhoViewedMe({
                page: 1,
                limit: 50,
            });
            setViews(results);
        } catch (err: any) {
            console.error('Error loading profile views:', err);
            setError(err.response?.data?.message || 'Failed to load profile views');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
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
        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
    };

    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const filterViews = () => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const safeViews = views || [];

        switch (filter) {
            case 'today':
                return safeViews.filter(v => new Date(v.createdAt) >= todayStart);
            case 'week':
                return safeViews.filter(v => new Date(v.createdAt) >= weekStart);
            default:
                return safeViews;
        }
    };

    const handleViewProfile = (userId: number) => {
        navigation.navigate('ProfileDetails', { userId });
    };

    const renderView = ({ item }: { item: ProfileView }) => {
        const viewer = item.viewer;
        const profile = viewer?.profile;

        if (!profile) {
            return null;
        }

        const fullName = `${profile.firstName} ${profile.lastName}`.trim();
        const age = profile.dateOfBirth ? calculateAge(profile.dateOfBirth) : null;
        const profilePic = profile.media?.[0]?.url;

        return (
            <TouchableOpacity onPress={() => handleViewProfile(item.viewerId)}>
                <Surface style={styles.viewCard} elevation={1}>
                    <View style={styles.cardContent}>
                        {/* Profile Picture */}
                        {profilePic ? (
                            <Image source={{ uri: profilePic }} style={styles.profilePic} />
                        ) : (
                            <View style={styles.profilePicPlaceholder}>
                                <Icon name="account" size={40} color={Theme.colors.textSecondary} />
                            </View>
                        )}

                        {/* Profile Info */}
                        <View style={styles.infoContainer}>
                            <View style={styles.nameRow}>
                                <Text variant="titleMedium" style={styles.name}>
                                    {fullName}
                                </Text>
                                {profile.isVerified && (
                                    <Icon name="check-decagram" size={20} color={Theme.colors.success} />
                                )}
                            </View>

                            <View style={styles.detailsRow}>
                                {age && (
                                    <View style={styles.detail}>
                                        <Icon name="cake" size={16} color={Theme.colors.textSecondary} />
                                        <Text style={styles.detailText}>{age} years</Text>
                                    </View>
                                )}
                                {profile.height && (
                                    <View style={styles.detail}>
                                        <Icon name="human-male-height" size={16} color={Theme.colors.textSecondary} />
                                        <Text style={styles.detailText}>{profile.height} cm</Text>
                                    </View>
                                )}
                            </View>

                            {profile.city && profile.state && (
                                <View style={styles.locationRow}>
                                    <Icon name="map-marker" size={16} color={Theme.colors.textSecondary} />
                                    <Text style={styles.locationText}>
                                        {profile.city}, {profile.state}
                                    </Text>
                                </View>
                            )}

                            <Text variant="bodySmall" style={styles.timestamp}>
                                Viewed {formatTimestamp(item.createdAt)}
                            </Text>
                        </View>

                        {/* Chevron */}
                        <Icon name="chevron-right" size={24} color={Theme.colors.textSecondary} />
                    </View>
                </Surface>
            </TouchableOpacity>
        );
    };

    const filteredViews = filterViews();
    const todayCount = (views || []).filter(v => {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        return new Date(v.createdAt) >= todayStart;
    }).length;

    const weekCount = (views || []).filter(v => {
        const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return new Date(v.createdAt) >= weekStart;
    }).length;

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Theme.colors.primary} />
                <Text style={styles.loadingText}>Loading profile views...</Text>
            </View>
        );
    }

    if (error) {
        return <ErrorState message={error} onRetry={() => loadViews()} />;
    }

    return (
        <View style={styles.container}>
            {/* Header with Stats */}
            <Surface style={styles.header} elevation={2}>
                <Text variant="titleLarge" style={styles.headerTitle}>
                    Who Viewed Me
                </Text>

                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text variant="headlineSmall" style={styles.statNumber}>
                            {(views || []).length}
                        </Text>
                        <Text variant="bodySmall" style={styles.statLabel}>
                            Total Views
                        </Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text variant="headlineSmall" style={styles.statNumber}>
                            {todayCount}
                        </Text>
                        <Text variant="bodySmall" style={styles.statLabel}>
                            Today
                        </Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text variant="headlineSmall" style={styles.statNumber}>
                            {weekCount}
                        </Text>
                        <Text variant="bodySmall" style={styles.statLabel}>
                            This Week
                        </Text>
                    </View>
                </View>

                {/* Filter Chips */}
                <View style={styles.filterContainer}>
                    <Chip
                        selected={filter === 'all'}
                        onPress={() => setFilter('all')}
                        style={styles.filterChip}
                        selectedColor={Theme.colors.primary}>
                        All ({(views || []).length})
                    </Chip>
                    <Chip
                        selected={filter === 'today'}
                        onPress={() => setFilter('today')}
                        style={styles.filterChip}
                        selectedColor={Theme.colors.primary}>
                        Today ({todayCount})
                    </Chip>
                    <Chip
                        selected={filter === 'week'}
                        onPress={() => setFilter('week')}
                        style={styles.filterChip}
                        selectedColor={Theme.colors.primary}>
                        This Week ({weekCount})
                    </Chip>
                </View>
            </Surface>

            {/* Views List */}
            <FlatList
                data={filteredViews}
                renderItem={renderView}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <EmptyState
                        icon="eye-off"
                        title="No Profile Views"
                        message={
                            filter === 'all'
                                ? "No one has viewed your profile yet. Keep your profile updated to attract more views!"
                                : `No profile views ${filter === 'today' ? 'today' : 'this week'}.`
                        }
                    />
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => loadViews(true)}
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
    headerTitle: {
        fontWeight: 'bold',
        marginBottom: 16,
        color: Theme.colors.text,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: Theme.colors.surfaceCard,
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    statNumber: {
        fontWeight: 'bold',
        color: Theme.colors.primary,
    },
    statLabel: {
        color: Theme.colors.textSecondary,
        marginTop: 4,
    },
    filterContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    filterChip: {
        borderRadius: 20,
    },
    listContent: {
        padding: 16,
        flexGrow: 1,
    },
    viewCard: {
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
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    name: {
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    detailsRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 4,
    },
    detail: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailText: {
        fontSize: 14,
        color: Theme.colors.textSecondary,
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
    timestamp: {
        color: Theme.colors.textSecondary,
        marginTop: 4,
    },
});

export default WhoViewedMeScreen;
