import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  Text,
  Button,
  FAB,
  Portal,
  Modal,
  Surface,
} from 'react-native-paper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {SearchStackParamList} from '../../navigation/types';
import ProfileCard from '../../components/ProfileCard';
import SearchFilters from '../../components/SearchFilters';
import {Profile} from '../../types';
// import profileService from '../../services/profile.service';

type SearchResultsScreenNavigationProp = NativeStackNavigationProp<
  SearchStackParamList,
  'SearchResults'
>;

type SearchResultsScreenRouteProp = RouteProp<
  SearchStackParamList,
  'SearchResults'
>;

type Props = {
  navigation: SearchResultsScreenNavigationProp;
  route: SearchResultsScreenRouteProp;
};

const SearchResultsScreen: React.FC<Props> = ({navigation, route}) => {
  const {query, filters} = route.params;
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(filters || {});

  useEffect(() => {
    loadProfiles(1);
  }, [activeFilters]);

  const loadProfiles = async (pageNum: number) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // TODO: Call profileService.searchProfiles(query, activeFilters, pageNum)
      console.log('Searching profiles:', {query, activeFilters, pageNum});
      
      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfiles([]);
      setHasMore(false);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadProfiles(nextPage);
    }
  };

  const handleProfilePress = (profile: Profile) => {
    navigation.navigate('ProfileDetails', {profileId: profile.id});
  };

  const handleApplyFilters = (newFilters: any) => {
    setActiveFilters(newFilters);
    setShowFilters(false);
    setPage(1);
    setProfiles([]);
  };

  const activeFilterCount = Object.keys(activeFilters).filter(
    key => activeFilters[key] !== undefined && activeFilters[key] !== '',
  ).length;

  const renderItem = ({item}: {item: Profile}) => (
    <ProfileCard
      profile={item}
      onPress={() => handleProfilePress(item)}
    />
  );

  const renderEmpty = () => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text variant="titleLarge" style={styles.emptyTitle}>
          No Profiles Found
        </Text>
        <Text variant="bodyMedium" style={styles.emptyText}>
          Try adjusting your filters or search query
        </Text>
        <Button
          mode="outlined"
          onPress={() => setShowFilters(true)}
          style={styles.emptyButton}>
          Adjust Filters
        </Button>
      </View>
    );
  };

  const renderFooter = () => {
    if (!isLoading) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#D81B60" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Filter Summary */}
      {activeFilterCount > 0 && (
        <Surface style={styles.filterSummary} elevation={1}>
          <Text variant="bodyMedium">
            {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied
          </Text>
          <Button
            mode="text"
            onPress={() => {
              setActiveFilters({});
              setPage(1);
            }}
            compact>
            Clear All
          </Button>
        </Surface>
      )}

      <FlatList
        data={profiles}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        refreshing={isLoading && page === 1}
        onRefresh={() => {
          setPage(1);
          loadProfiles(1);
        }}
      />

      {/* Filter FAB */}
      <FAB
        icon="filter-variant"
        label={`Filters${activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}`}
        style={styles.fab}
        onPress={() => setShowFilters(true)}
      />

      {/* Filter Modal */}
      <Portal>
        <Modal
          visible={showFilters}
          onDismiss={() => setShowFilters(false)}
          contentContainerStyle={styles.modalContent}>
          <SearchFilters
            initialFilters={activeFilters}
            onApply={handleApplyFilters}
            onClose={() => setShowFilters(false)}
          />
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#D81B60',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
});

export default SearchResultsScreen;
