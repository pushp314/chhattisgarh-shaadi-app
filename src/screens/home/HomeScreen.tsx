import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {
  Text,
  ActivityIndicator,
  IconButton,
  Badge,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HomeStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import { Theme } from '../../constants/theme';
import EnhancedMatchCard from '../../components/matches/EnhancedMatchCard';
import MatchFilters, { FilterType } from '../../components/matches/MatchFilters';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import profileService from '../../services/profile.service';
import matchService from '../../services/match.service';
import shortlistService from '../../services/shortlist.service';
import { Profile, SearchProfilesParams } from '../../types';
import FilterModal from '../../components/matches/FilterModal';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeScreen'
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

import ProfileCardSkeleton from '../../components/profile/ProfileCardSkeleton';
import GradientBackground from '../../components/common/GradientBackground';
import { useToast } from '../../context/ToastContext';

// ... imports

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const user = useAuthStore(state => state.user);
  const { profile } = useProfileStore();
  const { showToast } = useToast();

  // State
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [notificationCount, setNotificationCount] = useState(3); // TODO: Get from API
  const [matchStatuses, setMatchStatuses] = useState<Record<number, string>>({}); // Track match status by userId

  const [shortlistedIds, setShortlistedIds] = useState<Set<number>>(new Set());
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<Partial<SearchProfilesParams>>({});

  useEffect(() => {
    if (profile?.gender) {
      loadProfiles();
    }
  }, [profile?.gender, activeFilter]);

  const loadProfiles = async (isRefresh = false, customFilters?: Partial<SearchProfilesParams>) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      // 1. Build filter params
      const filtersToUse = customFilters || advancedFilters;
      const params: any = {
        page: 1,
        limit: 20,
        isPublished: true,
        ...filtersToUse,
      };

      if (activeFilter === 'verified') {
        params.isVerified = true;
      } else if (activeFilter === 'justJoined') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        params.createdAfter = sevenDaysAgo.toISOString();
      } else if (activeFilter === 'nearby') {
        if (profile?.state) {
          params.state = profile.state;
        }
      }

      // 2. Fetch profiles, matches, AND shortlist in parallel
      const [profilesResponse, sentMatches, acceptedMatches, shortlistResponse] = await Promise.all([
        profileService.searchProfiles(params),
        matchService.getSentMatches(),
        matchService.getAcceptedMatches(),
        shortlistService.getShortlist({ limit: 100 }), // Fetch enough to cover likely matches
      ]);

      // 3. Create a set of excluded user IDs (sent requests and accepted matches)
      const excludedUserIds = new Set<number>();

      // Add accepted matches (with null check)
      if (acceptedMatches?.matches && Array.isArray(acceptedMatches.matches)) {
        acceptedMatches.matches.forEach((match: any) => {
          const otherUserId = match.receiverId === user?.id ? match.senderId : match.receiverId;
          excludedUserIds.add(otherUserId);
        });
      }

      // Add sent pending requests (with null check)
      if (sentMatches?.matches && Array.isArray(sentMatches.matches)) {
        sentMatches.matches.forEach((match: any) => {
          excludedUserIds.add(match.receiverId);
        });
      }

      // 4. Update Shortlist Set (with null check)
      const newShortlistedIds = new Set<number>();
      if (shortlistResponse?.results && Array.isArray(shortlistResponse.results)) {
        shortlistResponse.results.forEach((item: any) => {
          if (item.profileId) newShortlistedIds.add(item.profileId);
        });
      }
      setShortlistedIds(newShortlistedIds);

      // 5. Filter profiles
      const allProfiles = profilesResponse?.profiles || [];
      const filteredProfiles = allProfiles.filter(p => {
        // Must be published and complete
        if (!p.isPublished || p.profileCompleteness < 50) return false;
        // Must not be in excluded list
        if (excludedUserIds.has(p.userId)) return false;
        // Must not be the current user (just in case)
        if (p.userId === user?.id) return false;

        return true;
      });

      setProfiles(filteredProfiles);

      // 6. Update match statuses (with null checks)
      const statuses: Record<number, string> = {};
      if (acceptedMatches?.matches && Array.isArray(acceptedMatches.matches)) {
        acceptedMatches.matches.forEach((match: any) => {
          const otherUserId = match.receiverId === user?.id ? match.senderId : match.receiverId;
          statuses[otherUserId] = 'ACCEPTED';
        });
      }
      if (sentMatches?.matches && Array.isArray(sentMatches.matches)) {
        sentMatches.matches.forEach((match: any) => {
          statuses[match.receiverId] = match.status;
        });
      }
      setMatchStatuses(statuses);

    } catch (err: any) {
      console.error('Error loading profiles:', err);
      setError(err.response?.data?.message || 'Failed to load profiles');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleInterest = async (userId: number) => {
    try {
      await matchService.sendMatchRequest(userId, 'Looking forward to connecting!');
      // Remove profile from list after sending interest
      setProfiles(prev => prev.filter(p => p.userId !== userId));
      showToast('Interest sent successfully', 'success');
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      // Handle different error cases
      if (status === 404) {
        // Profile not found or incomplete
        console.log('Profile not available:', message);
        // Remove from list since it's not valid
        setProfiles(prev => prev.filter(p => p.userId !== userId));
        showToast('This profile is no longer available', 'info');
      } else if (status === 409) {
        // Match request already exists
        console.log('Match request already sent to this profile');
        // Remove from list anyway since interest was already sent
        setProfiles(prev => prev.filter(p => p.userId !== userId));
        showToast("You've already sent interest to this profile", 'info');
      } else {
        // Other errors
        console.error('Error sending interest:', error);
        showToast('Failed to send interest. Please try again', 'error');
      }
    }
  };

  const handleSuperInterest = async (userId: number) => {
    // TODO: Check if user has premium subscription
    // For now, just send regular interest but with a special message/toast
    try {
      await matchService.sendMatchRequest(userId, 'Super Interest! 🌟');
      setProfiles(prev => prev.filter(p => p.userId !== userId));
      showToast('Super Interest sent! 🌟', 'success');
    } catch (error: any) {
      handleInterest(userId); // Fallback to normal error handling
    }
  };

  const handleShortlist = async (userId: number) => {
    try {
      if (shortlistedIds.has(userId)) {
        // Remove from shortlist
        await shortlistService.removeFromShortlist(userId);
        setShortlistedIds(prev => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
        showToast('Removed from shortlist', 'info');
      } else {
        // Add to shortlist
        await shortlistService.addToShortlist(userId);
        setShortlistedIds(prev => {
          const next = new Set(prev);
          next.add(userId);
          return next;
        });
        showToast('Added to shortlist', 'success');
      }
    } catch (error: any) {
      console.error('Error updating shortlist:', error);
      showToast('Failed to update shortlist', 'error');
    }
  };

  const handleChat = (userId: number) => {
    // Navigate to Messages tab
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('Messages', {
        screen: 'Chat',
        params: { userId },
      });
    }
  };

  const handleProfilePress = (userId: number) => {
    navigation.navigate('ProfileDetails', { userId });
  };

  const handleSearch = () => {
    navigation.navigate('SearchScreen');
  };

  const handleNotifications = () => {
    // Navigate to Profile tab, then to NotificationCenter
    const parent = navigation.getParent();
    const drawer = parent?.getParent();
    if (drawer) {
      drawer.navigate('ProfileStack', {
        screen: 'NotificationCenter',
      });
    }
  };

  const handleAdvancedFilter = () => {
    setShowFilterModal(true);
  };

  const handleApplyFilters = (filters: Partial<SearchProfilesParams>) => {
    setAdvancedFilters(filters);
    loadProfiles(false, filters);
  };

  const handleAvatarPress = () => {
    // Navigate to Profile tab
    const parent = navigation.getParent();
    const drawer = parent?.getParent();
    if (drawer) {
      drawer.navigate('ProfileStack');
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {/* User Avatar */}
        <TouchableOpacity onPress={handleAvatarPress}>
          <Image
            source={{ uri: profile?.media?.[0]?.url || 'https://via.placeholder.com/40' }}
            style={styles.avatar}
          />
        </TouchableOpacity>

        {/* Title and Subtitle */}
        <View style={styles.headerText}>
          <Text variant="titleLarge" style={styles.headerTitle}>
            My Matches
          </Text>
          <Text variant="bodySmall" style={styles.headerSubtitle}>
            as per partner preferences
          </Text>
        </View>
      </View>

      <View style={styles.headerRight}>
        {/* Notification Icon */}
        <TouchableOpacity onPress={handleNotifications} style={styles.iconButton}>
          <Icon name="bell-outline" size={24} color={Theme.colors.text} />
          {notificationCount > 0 && (
            <Badge style={styles.badge}>{notificationCount}</Badge>
          )}
        </TouchableOpacity>

        {/* Search Icon */}
        <IconButton
          icon="magnify"
          size={24}
          iconColor={Theme.colors.text}
          onPress={handleSearch}
        />
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <EmptyState
      icon="account-search"
      title="No Matches Found"
      message="We couldn't find any new matches for you today. Try adjusting your preferences or check back tomorrow!"
      actionLabel="Refresh Matches"
      onAction={() => loadProfiles(true)}
    />
  );

  if (isLoading && !refreshing) {
    return (
      <View style={styles.container}>
        <GradientBackground variant="primary">
          <View style={styles.header}>
            <View>
              <Text variant="headlineSmall" style={styles.greeting}>
                Namaste, {user?.profile?.firstName || 'User'} 🙏
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                Here are your daily matches
              </Text>
            </View>
            <IconButton
              icon="bell"
              iconColor={Theme.colors.white}
              size={24}
              onPress={handleNotifications}
            />
          </View>
          <View style={styles.contentContainer}>
            <ScrollView contentContainerStyle={styles.listContent}>
              {[1, 2, 3].map((i) => (
                <ProfileCardSkeleton key={i} />
              ))}
            </ScrollView>
          </View>
        </GradientBackground>
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <ErrorState
          message={error}
          onRetry={() => loadProfiles()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}

      {/* Filters */}
      <MatchFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onAdvancedFilter={handleAdvancedFilter}
      />

      {/* Profile List */}
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EnhancedMatchCard
            profile={item}
            onInterest={() => handleInterest(item.userId)}
            onSuperInterest={() => handleSuperInterest(item.userId)}
            onShortlist={() => handleShortlist(item.userId)}
            onChat={() => handleChat(item.userId)}
            onPress={() => handleProfilePress(item.userId)}
            canChat={matchStatuses[item.userId] === 'ACCEPTED'}
            isShortlisted={shortlistedIds.has(item.userId)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadProfiles(true)}
            colors={[Theme.colors.primary]}
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onDismiss={() => setShowFilterModal(false)}
        onApply={handleApplyFilters}
        initialFilters={advancedFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50, // Account for status bar
    backgroundColor: Theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  headerSubtitle: {
    color: Theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Theme.colors.primary,
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: Theme.colors.textSecondary,
  },
  greeting: {
    color: Theme.colors.white,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
});

export default HomeScreen;
