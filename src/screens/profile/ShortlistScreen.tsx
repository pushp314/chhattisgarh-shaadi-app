import React, { useState, useCallback, useRef } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    RefreshControl,
    Alert,
    Animated,
} from 'react-native';
import {
    ActivityIndicator,
    IconButton,
    Snackbar,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ProfileStackParamList } from '../../navigation/types';
import shortlistService from '../../services/shortlist.service';
import { Shortlist } from '../../types';
import ProfileCard from '../../components/ProfileCard';
import ProfileCardSkeleton from '../../components/profile/ProfileCardSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import GradientBackground from '../../components/common/GradientBackground';

type ShortlistScreenNavigationProp = NativeStackNavigationProp<
    ProfileStackParamList,
    'Shortlist'
>;

// type Props removed as we use useNavigation

const ShortlistItem = React.memo(({ item, index, onRemove }: { item: Shortlist; index: number; onRemove: (profileId: number) => void }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    // Entrance animation
    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                delay: index * 50,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                delay: index * 50,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, scaleAnim, index]);

    if (!item.profile) return null;

    return (
        <Animated.View
            style={[
                styles.itemContainer,
                {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                },
            ]}>
            <View style={styles.cardWrapper}>
                <ProfileCard
                    profile={item.profile}
                    onPress={() => {
                        Alert.alert('Profile', `Viewing profile: ${item.profile?.firstName}`);
                    }}
                />
            </View>
            <IconButton
                icon="heart-off"
                size={24}
                iconColor="#D81B60"
                style={styles.removeButton}
                onPress={() => onRemove(item.profileId)}
            />
        </Animated.View>
    );
});

const ShortlistScreen: React.FC = () => {
    const navigation = useNavigation<ShortlistScreenNavigationProp>();
    const [shortlist, setShortlist] = useState<Shortlist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useFocusEffect(
        useCallback(() => {
            loadShortlist(true);
        }, []), // eslint-disable-line react-hooks/exhaustive-deps
    );

    const loadShortlist = async (refresh: boolean = false) => {
        if (refresh) {
            setIsRefreshing(true);
            setPage(1);
        } else {
            setIsLoading(true);
        }

        setError(null);

        try {
            const currentPage = refresh ? 1 : page;
            const { results, pagination } = await shortlistService.getShortlist({
                page: currentPage,
                limit: 20,
            });

            if (refresh) {
                setShortlist(results);
            } else {
                setShortlist(prev => [...prev, ...results]);
            }

            setHasMore(currentPage < pagination.totalPages);
            setPage(currentPage + 1);
        } catch (err: any) {
            console.error('Error loading shortlist:', err);
            setError(err.response?.data?.message || 'Failed to load shortlist');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleRemove = async (profileId: number) => {
        Alert.alert(
            'Remove from Shortlist',
            'Are you sure you want to remove this profile from your shortlist?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await shortlistService.removeFromShortlist(profileId);

                            // Animate removal
                            setShortlist(prev => prev.filter(item => item.profileId !== profileId));

                            // Show success feedback
                            setSnackbarMessage('Profile removed from shortlist');
                            setSnackbarVisible(true);
                        } catch (error: any) {
                            console.error('Error removing from shortlist:', error);
                            setSnackbarMessage('Failed to remove from shortlist');
                            setSnackbarVisible(true);
                        }
                    },
                },
            ],
        );
    };

    const renderItem = ({ item, index }: { item: Shortlist; index: number }) => (
        <ShortlistItem
            item={item}
            index={index}
            onRemove={handleRemove}
        />
    );

    const renderEmpty = () => {
        if (isLoading) {
            return (
                <View style={styles.skeletonContainer}>
                    <ProfileCardSkeleton />
                    <ProfileCardSkeleton />
                    <ProfileCardSkeleton />
                </View>
            );
        }

        if (error) {
            return (
                <ErrorState
                    message={error}
                    onRetry={() => loadShortlist(true)}
                />
            );
        }

        return (
            <EmptyState
                icon="heart-outline"
                title="No Shortlisted Profiles"
                message="Browse profiles and tap the heart icon to add them to your shortlist. Your favorites will appear here."
                actionLabel="Browse Profiles"
                onAction={() => navigation.navigate('ProfileScreen')}
            />
        );
    };

    const renderFooter = () => {
        if (!isLoading || isRefreshing) return null;

        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#D81B60" />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <GradientBackground variant="card">
                <FlatList
                    data={shortlist}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={renderEmpty}
                    ListFooterComponent={renderFooter}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={() => loadShortlist(true)}
                            colors={['#D81B60']}
                        />
                    }
                    onEndReached={() => {
                        if (hasMore && !isLoading) {
                            loadShortlist(false);
                        }
                    }}
                    onEndReachedThreshold={0.5}
                />

                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={3000}
                    action={{
                        label: 'OK',
                        onPress: () => setSnackbarVisible(false),
                    }}>
                    {snackbarMessage}
                </Snackbar>
            </GradientBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContent: {
        padding: 16,
        flexGrow: 1,
    },
    itemContainer: {
        marginBottom: 16,
        position: 'relative',
    },
    cardWrapper: {
        flex: 1,
    },
    removeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.9)',
        elevation: 4,
    },
    skeletonContainer: {
        padding: 16,
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});

export default ShortlistScreen;
