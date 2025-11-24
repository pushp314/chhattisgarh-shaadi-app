import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  FlatList,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  ActivityIndicator,
  Searchbar,
  Chip,
  FAB,
  Snackbar,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HomeStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import ProfileCard from '../../components/ProfileCard';
import profileService from '../../services/profile.service';
import { Profile, SearchProfilesParams } from '../../types';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeScreen'
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const user = useAuthStore(state => state.user);
  const { profile, profileCompleteness } = useProfileStore();

  // State for recommended profiles
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchProfilesParams>({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async (isRefresh = false, pageNum = 1) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        setPage(1);
      } else if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError(null);

      // Build search params based on user's gender
      const searchParams: SearchProfilesParams = {
        ...filters,
        page: pageNum,
        limit: 10,
        // Show opposite gender by default
        gender: profile?.gender === 'MALE' ? 'FEMALE' : 'MALE',
      };

      const response = await profileService.searchProfiles(searchParams);

      if (isRefresh || pageNum === 1) {
        setProfiles(response.profiles);
      } else {
        setProfiles(prev => [...prev, ...response.profiles]);
      }

      setHasMore(
        response.pagination.page < response.pagination.totalPages
      );
    } catch (err: any) {
      console.error('Error loading profiles:', err);
      setError(err.response?.data?.message || 'Failed to load profiles');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadProfiles(false, nextPage);
    }
  };

  const handleProfilePress = (selectedProfile: Profile) => {
    navigation.navigate('ProfileDetails', { userId: selectedProfile.userId });
  };

  const handleSearch = () => {
    setPage(1);
    loadProfiles(false, 1);
  };

  const renderHeader = () => {
    if (!profile || profileCompleteness === 100) return null;

    return (
      <Card style={styles.completionCard}>
        <Card.Content>
          <View style={styles.completionHeader}>
            <Icon name="account-check" size={28} color="#FF9800" />
            <View style={styles.completionInfo}>
              <Text variant="titleSmall" style={styles.completionTitle}>
                Complete Your Profile
              </Text>
              <Text variant="bodySmall" style={styles.completionSubtitle}>
                {profileCompleteness}% Complete - Get 5x more matches!
              </Text>
            </View>
          </View>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('ProfileDetails', { userId: user?.id! })}
            style={styles.completeButton}
            buttonColor="#FF9800"
            compact>
            Complete Now
          </Button>
        </Card.Content>
      </Card>
    );
  };

  const renderQuickFilters = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickFiltersContainer}
        contentContainerStyle={styles.quickFiltersContent}>
        <Chip
          mode="outlined"
          selected={!filters.nativeDistrict}
          onPress={() => {
            setFilters(prev => ({ ...prev, nativeDistrict: undefined }));
            setPage(1);
          }}
          style={styles.filterChip}>
          All Regions
        </Chip>
        <Chip
          mode="outlined"
          selected={filters.speaksChhattisgarhi}
          onPress={() => {
            setFilters(prev => ({
              ...prev,
              speaksChhattisgarhi: !prev.speaksChhattisgarhi,
            }));
            setPage(1);
          }}
          style={styles.filterChip}
          icon="translate">
          Speaks Chhattisgarhi
        </Chip>
        <Chip
          mode="outlined"
          onPress={() => navigation.getParent()?.navigate('Search')}
          style={styles.filterChip}
          icon="tune">
          More Filters
        </Chip>
      </ScrollView>
    );
  };

  const renderEmptyState = () => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyState}>
        <Icon name="account-search" size={80} color="#ccc" />
        <Text variant="titleMedium" style={styles.emptyTitle}>
          No Profiles Found
        </Text>
        <Text variant="bodyMedium" style={styles.emptySubtitle}>
          Try adjusting your filters or check back later
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.getParent()?.navigate('Search')}
          style={styles.emptyButton}>
          Adjust Filters
        </Button>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#D81B60" />
        <Text variant="bodySmall" style={styles.footerText}>
          Loading more profiles...
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D81B60" />
        <Text variant="bodyMedium" style={styles.loadingText}>
          Finding your perfect matches...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search by name, location..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
          style={styles.searchBar}
          icon="magnify"
          clearIcon="close"
        />
      </View>

      {/* Quick Filters */}
      {renderQuickFilters()}

      {/* Profile List */}
      <FlatList
        data={profiles}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ProfileCard
            profile={item}
            onPress={() => handleProfilePress(item)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadProfiles(true)}
            colors={['#D81B60']}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button to navigate to Search */}
      <FAB
        icon="tune"
        style={styles.fab}
        onPress={() => navigation.getParent()?.navigate('Search')}
        label="Filters"
        color="#fff"
      />

      {/* Error Snackbar */}
      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        duration={3000}
        action={{
          label: 'Retry',
          onPress: () => loadProfiles(true),
        }}>
        {error}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  searchBar: {
    backgroundColor: '#f5f5f5',
    elevation: 0,
  },
  quickFiltersContainer: {
    backgroundColor: '#fff',
    paddingBottom: 12,
    elevation: 2,
  },
  quickFiltersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  completionCard: {
    marginBottom: 16,
    backgroundColor: '#FFF3E0',
  },
  completionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  completionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  completionTitle: {
    fontWeight: 'bold',
    color: '#333',
  },
  completionSubtitle: {
    color: '#666',
    marginTop: 2,
  },
  completeButton: {
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: 'bold',
  },
  emptySubtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  emptyButton: {
    marginTop: 8,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    marginTop: 8,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#D81B60',
  },
});

export default HomeScreen;
