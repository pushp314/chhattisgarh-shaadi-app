/**
 * Activity Screen - Redesigned to match reference UI
 * Shows match requests with stats cards at top
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    RefreshControl,
} from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { ActivityStackParamList } from '../../navigation/types';
import { MatchRequest } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { Theme } from '../../constants/theme';
import matchService from '../../services/match.service';
import profileViewService from '../../services/profileView.service';
import shortlistService from '../../services/shortlist.service';

type ActivityScreenNavigationProp = NativeStackNavigationProp<ActivityStackParamList>;
type TabType = 'received' | 'sent' | 'accepted';

const ActivityScreen: React.FC = () => {
    const navigation = useNavigation<ActivityScreenNavigationProp>();
    const currentUser = useAuthStore(state => state.user);
    const [activeTab, setActiveTab] = useState<TabType>('received');
    const [matches, setMatches] = useState<MatchRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

    // Stats
    const [profileVisits, setProfileVisits] = useState(0);
    const [shortlistCount, setShortlistCount] = useState(0);
    const [contactViews, setContactViews] = useState(0);

    useEffect(() => {
        loadStats();
        loadMatches();
    }, [activeTab]);

    const loadStats = async () => {
        try {
            // Load profile visits
            const viewsResponse = await profileViewService.getWhoViewedMe();
            setProfileVisits(viewsResponse.results?.length || 0);

            // Load shortlist count
            const shortlistResponse = await shortlistService.getShortlist();
            setShortlistCount(shortlistResponse.results?.length || 0);

            // Contact views - placeholder for now
            setContactViews(0);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const loadMatches = async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setIsLoading(true);
        }

        try {
            let response;
            if (activeTab === 'received') {
                // Only show PENDING requests in received tab
                response = await matchService.getReceivedMatches({ status: 'PENDING' as any });
            } else if (activeTab === 'sent') {
                response = await matchService.getSentMatches({ status: 'PENDING' as any });
            } else {
                response = await matchService.getAcceptedMatches();
            }

            let matchesArray = response?.matches || [];

            // Additional client-side filter for safety
            if (activeTab === 'received' || activeTab === 'sent') {
                matchesArray = matchesArray.filter((m: any) => m.status === 'PENDING');
            }

            setMatches(matchesArray);
        } catch (error) {
            console.error('Error loading matches:', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const handleAccept = async (matchId: number) => {
        setProcessingIds(prev => new Set(prev).add(matchId));
        try {
            await matchService.acceptMatch(matchId);
            loadMatches();
        } catch (error) {
            console.error('Error accepting match:', error);
        } finally {
            setProcessingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(matchId);
                return newSet;
            });
        }
    };

    const handleDecline = async (matchId: number) => {
        setProcessingIds(prev => new Set(prev).add(matchId));
        try {
            await matchService.rejectMatch(matchId);
            setMatches(prev => prev.filter(m => m.id !== matchId));
        } catch (error) {
            console.error('Error declining match:', error);
        } finally {
            setProcessingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(matchId);
                return newSet;
            });
        }
    };

    const calculateAge = (dateOfBirth: string): number => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const getTimeAgo = (date: string): string => {
        const now = new Date();
        const past = new Date(date);
        const diffMs = now.getTime() - past.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 14) return 'Last week';
        const diffWeeks = Math.floor(diffDays / 7);
        return `${diffWeeks} weeks ago`;
    };

    const renderMatchCard = ({ item }: { item: MatchRequest }) => {
        const user = item.sender || item.receiver;
        const profile = user?.profile;
        const isProcessing = processingIds.has(item.id);

        if (!user || !profile) return null;

        const age = profile.dateOfBirth ? calculateAge(profile.dateOfBirth) : null;
        const height = profile.height ? `${Math.floor(profile.height / 30.48)}' ${Math.round((profile.height % 30.48) / 2.54)}"` : '';
        const timeAgo = item.createdAt ? getTimeAgo(item.createdAt) : '';

        return (
            <TouchableOpacity
                style={styles.matchCard}
                onPress={() => navigation.navigate('ProfileDetails', { userId: user.id })}
                activeOpacity={0.7}
            >
                <View style={styles.cardContent}>
                    {/* Avatar */}
                    <View style={styles.avatarContainer}>
                        {user.profilePicture ? (
                            <Image source={{ uri: user.profilePicture }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                <Icon name="account" size={40} color="#999" />
                            </View>
                        )}
                    </View>

                    {/* Info */}
                    <View style={styles.infoContainer}>
                        <Text style={styles.name} numberOfLines={1}>
                            {profile.firstName} {profile.lastName?.charAt(0)}.
                        </Text>
                        <Text style={styles.details} numberOfLines={1}>
                            {age && `${age} yrs`}{age && height && ', '}{height}{(age || height) && ', ...'}
                        </Text>
                        <Text style={styles.timeAgo}>
                            {activeTab === 'received' ? 'Received' : activeTab === 'sent' ? 'Sent' : 'Accepted'} {timeAgo}
                        </Text>
                    </View>

                    {/* Actions */}
                    {activeTab === 'received' && (
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity
                                style={styles.declineButton}
                                onPress={() => handleDecline(item.id)}
                                disabled={isProcessing}
                            >
                                <Text style={styles.declineText}>Decline</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.acceptButton}
                                onPress={() => handleAccept(item.id)}
                                disabled={isProcessing}
                            >
                                <LinearGradient
                                    colors={['#E91E63', '#D81B60']}
                                    style={styles.acceptGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    {isProcessing ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Text style={styles.acceptText}>Accept</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Icon name="heart-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
                {activeTab === 'received' && 'No match requests received yet'}
                {activeTab === 'sent' && 'No match requests sent yet'}
                {activeTab === 'accepted' && 'No accepted matches yet'}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Activity</Text>
                <View style={styles.backButton} />
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
                <TouchableOpacity
                    style={styles.statCard}
                    onPress={() => navigation.navigate('WhoViewedMe')}
                >
                    <Icon name="eye" size={24} color={Theme.colors.primary} />
                    <Text style={styles.statNumber}>{profileVisits}</Text>
                    <Text style={styles.statLabel}>Profile Visits</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.statCard}
                    onPress={() => navigation.navigate('Shortlist')}
                >
                    <Icon name="heart" size={24} color={Theme.colors.primary} />
                    <Text style={styles.statNumber}>{shortlistCount}</Text>
                    <Text style={styles.statLabel}>Shortlisted</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.statCard}>
                    <Icon name="phone" size={24} color={Theme.colors.primary} />
                    <Text style={styles.statNumber}>{contactViews}</Text>
                    <Text style={styles.statLabel}>Contact Views</Text>
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'received' && styles.activeTab]}
                    onPress={() => setActiveTab('received')}
                >
                    <Text style={[styles.tabText, activeTab === 'received' && styles.activeTabText]}>
                        Received
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'sent' && styles.activeTab]}
                    onPress={() => setActiveTab('sent')}
                >
                    <Text style={[styles.tabText, activeTab === 'sent' && styles.activeTabText]}>
                        Sent
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'accepted' && styles.activeTab]}
                    onPress={() => setActiveTab('accepted')}
                >
                    <Text style={[styles.tabText, activeTab === 'accepted' && styles.activeTabText]}>
                        Accepted
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Match List */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={matches}
                    renderItem={renderMatchCard}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={renderEmptyState}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => loadMatches(true)}
                            colors={[Theme.colors.primary]}
                        />
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    statCard: {
        flex: 1,
        backgroundColor: '#F8F8F8',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        gap: 4,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    statLabel: {
        fontSize: 11,
        color: '#666',
        textAlign: 'center',
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: Theme.colors.primary,
    },
    tabText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#999',
    },
    activeTabText: {
        color: '#333',
        fontWeight: '600',
    },
    listContent: {
        padding: 16,
        gap: 12,
    },
    matchCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
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
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    details: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
    },
    timeAgo: {
        fontSize: 12,
        color: '#999',
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    declineButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
    },
    declineText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    acceptButton: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    acceptGradient: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        minWidth: 80,
        alignItems: 'center',
    },
    acceptText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyText: {
        fontSize: 15,
        color: '#999',
        marginTop: 16,
        textAlign: 'center',
    },
});

export default ActivityScreen;
