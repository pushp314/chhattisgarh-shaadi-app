import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'; // For navigation
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Navigation type
import { MainStackParamList } from '../../navigation/types'; // Import navigation types

import { colors } from '../../theme/colors';
import MatchItem from '../../components/matches/MatchItem';
import { recommendedProfiles as mockProfiles } from '../../data/mockData';
import { UserProfile } from '../../data/mockData';
import { FullScreenLoader, ErrorState } from '../../components/common';

type ScreenStatus = 'loading' | 'success' | 'error';

// Add IDs for demonstration
const matchesWithIds = mockProfiles.map(p => ({
  ...p,
  id: p.id || Math.random(),
}));

// Define the navigation prop type
type MatchesNavigationProp = NativeStackNavigationProp<MainStackParamList>;

const MatchesScreen = () => {
  // Add the navigation hook
  const navigation = useNavigation<MatchesNavigationProp>();

  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [status, setStatus] = useState<ScreenStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  const loadMatches = useCallback(() => {
    setStatus('loading');
    setError(null);
    setTimeout(() => {
      setMatches(matchesWithIds);
      setStatus('success');
    }, 1500);
  }, []);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const handleMatchPress = (profileId: number) => {
    console.log('Navigate to profile detail with match:', profileId);
    // UPDATED: Navigate to the ProfileDetail screen
    navigation.navigate('ProfileDetail', { profileId: profileId });
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>💔</Text>
      <Text style={styles.emptyText}>No matches yet.</Text>
      <Text style={styles.emptySubText}>Keep swiping to find your match!</Text>
    </View>
  );

  const renderContent = () => {
    if (status === 'loading') {
      return <FullScreenLoader message="Loading matches..." />;
    }

    if (status === 'error') {
      return <ErrorState message={error!} onRetry={loadMatches} />;
    }

    return (
      <FlatList
        data={matches}
        renderItem={({ item }) => (
          <MatchItem profile={item} onPress={() => handleMatchPress(item.id)} />
        )}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyComponent}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.neutral.white} barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches & Likes</Text>
        <TouchableOpacity style={styles.filterButton} onPress={loadMatches}>
          <Text style={styles.filterIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray200,
    backgroundColor: colors.neutral.white,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  filterButton: {
    padding: 8,
  },
  filterIcon: {
    fontSize: 24,
  },
  listContainer: {
    padding: 10,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    minHeight: 400,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default MatchesScreen;