// src/screens/discover/DiscoverScreen.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../theme/colors';
import { recommendedProfiles as mockProfiles } from '../../data/mockData';
import { UserProfile } from '../../data/mockData';
import AnimatedSwipeCard from '../../components/discover/AnimatedSwipeCard';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FullScreenLoader, ErrorState } from '../../components/common';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

type ScreenStatus = 'loading' | 'success' | 'error';

const DiscoverScreen = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [status, setStatus] = useState<ScreenStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  // Load profiles
  const loadProfiles = useCallback(() => {
    setStatus('loading');
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      setProfiles(mockProfiles);
      setStatus('success');
    }, 1200);
  }, []);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  // Swipe Handler with smooth transition
  const handleSwipe = useCallback(
    (direction: 'like' | 'dislike') => {
      const swipedProfile = profiles[0];
      console.log(
        `Swiped ${direction} on: ${swipedProfile?.firstName} ${swipedProfile?.lastName}`
      );
      
      // Remove first profile after a small delay for smooth animation
      setTimeout(() => {
        setProfiles(prevProfiles => prevProfiles.slice(1));
      }, 300);
    },
    [profiles]
  );

  // Empty State
  const renderEmptyState = () => (
    <Animated.View 
      entering={FadeIn.duration(600)} 
      style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyEmoji}>✨</Text>
      </View>
      <Text style={styles.emptyTitle}>You've Seen Everyone!</Text>
      <Text style={styles.emptySubtitle}>
        Check back later for new profiles or adjust your preferences.
      </Text>
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={loadProfiles}>
        <LinearGradient
          colors={[colors.primary.main, colors.secondary.main]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.refreshGradient}>
          <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  // Main Content
  const renderContent = () => {
    if (status === 'loading') {
      return <FullScreenLoader message="Finding perfect matches..." />;
    }

    if (status === 'error') {
      return <ErrorState message={error!} onRetry={loadProfiles} />;
    }

    if (status === 'success' && profiles.length > 0) {
      return (
        <Animated.View 
          entering={FadeIn.duration(400)} 
          style={styles.cardStack}>
          {profiles
            .slice(0, 3) // Only render top 3 cards for performance
            .map((profile, index) => (
              <AnimatedSwipeCard
                key={profile.id}
                profile={profile}
                index={index}
                onSwipe={handleSwipe}
              />
            ))
            .reverse()}
        </Animated.View>
      );
    }

    if (status === 'success' && profiles.length === 0) {
      return renderEmptyState();
    }

    return null;
  };

  // Action Button Handler
  const handleButtonPress = (action: 'dislike' | 'superlike' | 'like') => {
    if (profiles.length === 0) return;
    
    if (action === 'like' || action === 'superlike') {
      handleSwipe('like');
    } else {
      handleSwipe('dislike');
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={colors.neutral.white} barStyle="dark-content" />

        {/* Header with Gradient */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={[colors.neutral.white, colors.background.default]}
            style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.titleContainer}>
                <Text style={styles.headerTitle}>Discover</Text>
                <Text style={styles.headerSubtitle}>Find Your Perfect Match</Text>
              </View>
              <TouchableOpacity style={styles.filterButton}>
                <LinearGradient
                  colors={[colors.primary.lighter, colors.secondary.lighter]}
                  style={styles.filterGradient}>
                  <Text style={styles.filterIcon}>⚙️</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Main Content Area */}
        <View style={styles.contentContainer}>{renderContent()}</View>

        {/* Action Buttons - Only show when profiles exist */}
        {status === 'success' && profiles.length > 0 && (
          <Animated.View 
            entering={FadeIn.delay(200).duration(400)}
            exiting={FadeOut.duration(200)}
            style={styles.actionsContainer}>
            <View style={styles.actionButtons}>
              {/* Dislike Button */}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleButtonPress('dislike')}
                activeOpacity={0.7}>
                <LinearGradient
                  colors={['#FFEBEE', '#FFCDD2']}
                  style={styles.actionGradient}>
                  <View style={styles.actionIconContainer}>
                    <Text style={styles.actionIcon}>✕</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Super Like Button */}
              <TouchableOpacity
                style={[styles.actionButton, styles.superLikeButton]}
                onPress={() => handleButtonPress('superlike')}
                activeOpacity={0.7}>
                <LinearGradient
                  colors={['#E3F2FD', '#BBDEFB']}
                  style={[styles.actionGradient, styles.superLikeGradient]}>
                  <View style={styles.actionIconContainer}>
                    <Text style={[styles.actionIcon, styles.superLikeIcon]}>⭐</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Like Button */}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleButtonPress('like')}
                activeOpacity={0.7}>
                <LinearGradient
                  colors={['#FCE4EC', '#F8BBD0']}
                  style={styles.actionGradient}>
                  <View style={styles.actionIconContainer}>
                    <Text style={styles.actionIcon}>❤️</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Profile Counter */}
            <View style={styles.counterContainer}>
              <Text style={styles.counterText}>
                {profiles.length} {profiles.length === 1 ? 'profile' : 'profiles'} remaining
              </Text>
            </View>
          </Animated.View>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  
  // Header Styles
  headerContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
  },
  filterButton: {
    marginLeft: 16,
  },
  filterGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filterIcon: {
    fontSize: 22,
  },

  // Content Area
  contentContainer: {
    flex: 1,
    marginTop: 16,
  },
  cardStack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary.lighter,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyEmoji: {
    fontSize: 50,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  refreshButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  refreshGradient: {
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.neutral.white,
  },

  // Action Buttons
  actionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray200,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  actionButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  actionGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  superLikeButton: {
    transform: [{ scale: 1.1 }],
  },
  superLikeGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  actionIconContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 32,
  },
  superLikeIcon: {
    fontSize: 36,
  },

  // Counter
  counterContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  counterText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
  },
});

export default DiscoverScreen;