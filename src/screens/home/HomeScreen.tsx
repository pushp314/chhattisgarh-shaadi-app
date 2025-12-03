import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import {
  Text,
  ActivityIndicator,
  IconButton,
  Badge,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
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
import { Profile } from '../../types';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeScreen'
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const rootNavigation = useNavigation<any>(); // For navigating outside HomeStack
  const user = useAuthStore(state => state.user);
  const { profile } = useProfileStore();

  // State
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [notificationCount, setNotificationCount] = useState(3); // TODO: Get from API

  useEffect(() => {
    if (profile?.gender) {
      loadProfiles();
    }
  }, [profile?.gender, activeFilter]);

  const loadProfiles = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      // Build filter params based on active filter
      const params: any = {
        page: 1,
        limit: 20,
      };

      if (activeFilter === 'verified') {
        params.isVerified = true;
      } else if (activeFilter === 'justJoined') {
        // Get profiles created in last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        params.createdAfter = sevenDaysAgo.toISOString();
      } else if (activeFilter === 'nearby') {
        // Filter by same state/city
        if (profile?.state) {
          params.state = profile.state;
        }
      }

      const response = await profileService.searchProfiles(params);
      setProfiles(response.profiles);
    } catch (err: any) {
      console.error('Error loading profiles:', err);
      setError(err.response?.data?.message || 'Failed to load profiles');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleInterest = async (profileId: number) => {
    try {
      await matchService.sendMatchRequest(profileId, 'Looking forward to connecting!');
      // Remove profile from list after sending interest
      setProfiles(prev => prev.filter(p => p.id !== profileId));
      console.log('Interest sent successfully');
      // TODO: Show success toast
    } catch (error: any) {
      // Handle 409 - Match request already exists
      if (error.response?.status === 409) {
        console.log('Match request already sent to this profile');
        // Remove from list anyway since interest was already sent
        setProfiles(prev => prev.filter(p => p.id !== profileId));
      } else {
        console.error('Error sending interest:', error);
      }
    }
  };

  const handleSuperInterest = async (profileId: number) => {
    // TODO: Check if user has premium subscription
    // For now, just send regular interest
    handleInterest(profileId);
  };

  const handleShortlist = async (profileId: number) => {
    try {
      await shortlistService.addToShortlist(profileId);
      console.log('Added to shortlist');
      // TODO: Show success toast
    } catch (error: any) {
      if (error.response?.status === 409) {
        console.log('Profile already in shortlist');
      } else {
        console.error('Error adding to shortlist:', error);
      }
    }
  };

  const handleChat = (userId: number) => {
    // Navigate to Messages tab, then to Chat
    rootNavigation.navigate('Main', {
      screen: 'Messages',
      params: {
        screen: 'Chat',
        params: { userId },
      },
    });
  };

  const handleProfilePress = (userId: number) => {
    navigation.navigate('ProfileDetails', { userId });
  };

  const handleSearch = () => {
    // Navigate to Search tab
    rootNavigation.navigate('Main', {
      screen: 'Search',
    });
  };

  const handleNotifications = () => {
    // Navigate to Notifications (in drawer or profile stack)
    rootNavigation.navigate('Main', {
      screen: 'ProfileStack',
      params: {
        screen: 'NotificationCenter',
      },
    });
  };

  const handleAdvancedFilter = () => {
    // TODO: Open advanced filter modal
    console.log('Open advanced filters');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {/* User Avatar */}
        <TouchableOpacity onPress={() => rootNavigation.navigate('Main', { screen: 'ProfileStack' })}>
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
      message="Try adjusting your filters or check back later for new profiles"
      actionLabel="Refresh"
      onAction={() => loadProfiles(true)}
    />
  );

  if (isLoading && !refreshing) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
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
            onInterest={() => handleInterest(item.id)}
            onSuperInterest={() => handleSuperInterest(item.id)}
            onShortlist={() => handleShortlist(item.id)}
            onChat={() => handleChat(item.userId)}
            onPress={() => handleProfilePress(item.userId)}
            canChat={false} // TODO: Check if already matched
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
