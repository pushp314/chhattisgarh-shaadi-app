import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {
  Searchbar,
  Button,
  Surface,
  Text,
  IconButton,
  Badge,
} from 'react-native-paper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SearchStackParamList} from '../../navigation/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type SearchScreenNavigationProp = NativeStackNavigationProp<
  SearchStackParamList,
  'SearchScreen'
>;

type Props = {
  navigation: SearchScreenNavigationProp;
};

type Filters = {
  minAge?: number;
  maxAge?: number;
  minHeight?: number;
  maxHeight?: number;
  religion?: string;
  caste?: string;
  maritalStatus?: string;
  education?: string;
  occupation?: string;
  state?: string;
  nativeDistrict?: string;
};

const SearchScreen: React.FC<Props> = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({});

  const activeFilterCount = Object.keys(filters).filter(
    key => filters[key as keyof Filters] !== undefined,
  ).length;

  const handleSearch = () => {
    navigation.navigate('SearchResults', {
      query: searchQuery,
      filters,
    });
  };

  const openFilters = () => {
    navigation.navigate('SearchResults', {
      query: searchQuery,
      filters,
    });
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.searchContainer} elevation={0}>
        <View style={styles.searchRow}>
          <Searchbar
            placeholder="Search by name, location..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
            onSubmitEditing={handleSearch}
          />
          <View style={styles.filterButtonContainer}>
            <IconButton
              icon="filter-variant"
              size={24}
              onPress={openFilters}
              style={styles.filterButton}
            />
            {activeFilterCount > 0 && (
              <Badge style={styles.filterBadge}>{activeFilterCount}</Badge>
            )}
          </View>
        </View>
      </Surface>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Quick Search Categories */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Quick Search
        </Text>

        <View style={styles.categoryGrid}>
          <CategoryCard
            icon="account-search"
            title="Browse Profiles"
            subtitle="Discover matches"
            onPress={() => navigation.navigate('SearchResults', {filters: {}})}
          />
          <CategoryCard
            icon="map-marker-radius"
            title="Nearby"
            subtitle="Profiles near you"
            onPress={() => navigation.navigate('SearchResults', {filters: {}})}
          />
          <CategoryCard
            icon="star"
            title="New Members"
            subtitle="Recently joined"
            onPress={() => navigation.navigate('SearchResults', {filters: {}})}
          />
          <CategoryCard
            icon="check-decagram"
            title="Verified"
            subtitle="Verified profiles"
            onPress={() => navigation.navigate('SearchResults', {filters: {}})}
          />
        </View>

        {/* Filter Shortcuts */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Search by Community
        </Text>

        <View style={styles.chipContainer}>
          {['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain'].map(religion => (
            <Button
              key={religion}
              mode="outlined"
              onPress={() =>
                navigation.navigate('SearchResults', {
                  filters: {religion},
                })
              }
              style={styles.chip}>
              {religion}
            </Button>
          ))}
        </View>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Search by Location
        </Text>

        <View style={styles.chipContainer}>
          {['Raipur', 'Bilaspur', 'Durg', 'Rajnandgaon', 'Korba'].map(city => (
            <Button
              key={city}
              mode="outlined"
              onPress={() =>
                navigation.navigate('SearchResults', {
                  filters: {state: 'Chhattisgarh'},
                })
              }
              style={styles.chip}>
              {city}
            </Button>
          ))}
        </View>

        {/* Info Card */}
        <Surface style={styles.infoCard} elevation={1}>
          <Icon name="information" size={24} color="#D81B60" />
          <View style={styles.infoContent}>
            <Text variant="titleSmall" style={styles.infoTitle}>
              Find Your Perfect Match
            </Text>
            <Text variant="bodySmall" style={styles.infoText}>
              Use filters to narrow down your search and find profiles that match your preferences.
            </Text>
          </View>
        </Surface>
      </ScrollView>
    </View>
  );
};

type CategoryCardProps = {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
};

const CategoryCard: React.FC<CategoryCardProps> = ({
  icon,
  title,
  subtitle,
  onPress,
}) => (
  <Surface style={styles.categoryCard} elevation={1}>
    <Button
      mode="text"
      onPress={onPress}
      contentStyle={styles.categoryCardContent}
      style={styles.categoryCardButton}>
      <View style={styles.categoryCardInner}>
        <Icon name={icon} size={32} color="#D81B60" />
        <Text variant="titleSmall" style={styles.categoryTitle}>
          {title}
        </Text>
        <Text variant="bodySmall" style={styles.categorySubtitle}>
          {subtitle}
        </Text>
      </View>
    </Button>
  </Surface>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchbar: {
    flex: 1,
    elevation: 0,
  },
  filterButtonContainer: {
    position: 'relative',
  },
  filterButton: {
    margin: 0,
  },
  filterBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#D81B60',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  categoryCard: {
    width: '48%',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  categoryCardButton: {
    borderRadius: 12,
  },
  categoryCardContent: {
    height: 140,
  },
  categoryCardInner: {
    alignItems: 'center',
    padding: 16,
  },
  categoryTitle: {
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  categorySubtitle: {
    color: '#666',
    textAlign: 'center',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    borderRadius: 20,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFF3F8',
    gap: 12,
    marginTop: 8,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#D81B60',
  },
  infoText: {
    color: '#666',
  },
});

export default SearchScreen;
