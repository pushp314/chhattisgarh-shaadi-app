// src/components/discover/AnimatedSwipeCard.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../theme/colors';
import { UserProfile } from '../../data/mockData';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.92;
const CARD_HEIGHT = CARD_WIDTH * 1.55;
const SWIPE_THRESHOLD = width * 0.35;
const ROTATION_DEGREES = 12;

interface AnimatedSwipeCardProps {
  profile: UserProfile;
  onSwipe: (direction: 'like' | 'dislike') => void;
  index: number;
}

const AnimatedSwipeCard: React.FC<AnimatedSwipeCardProps> = ({
  profile,
  onSwipe,
  index,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      if (index !== 0) return;
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      
      // Subtle scale effect when swiping
      const distance = Math.sqrt(
        event.translationX ** 2 + event.translationY ** 2
      );
      scale.value = interpolate(
        distance,
        [0, 200],
        [1, 0.95],
        Extrapolation.CLAMP
      );
    })
    .onEnd(event => {
      if (index !== 0) return;

      if (event.translationX > SWIPE_THRESHOLD) {
        // Like - swipe right with smooth animation
        translateX.value = withSpring(width * 2, {
          damping: 20,
          stiffness: 90,
        });
        runOnJS(onSwipe)('like');
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        // Dislike - swipe left with smooth animation
        translateX.value = withSpring(-width * 2, {
          damping: 20,
          stiffness: 90,
        });
        runOnJS(onSwipe)('dislike');
      } else {
        // Spring back to center
        translateX.value = withSpring(0, {
          damping: 15,
          stiffness: 100,
        });
        translateY.value = withSpring(0, {
          damping: 15,
          stiffness: 100,
        });
        scale.value = withSpring(1);
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(
      translateX.value,
      [-width / 2, width / 2],
      [-ROTATION_DEGREES, ROTATION_DEGREES],
      Extrapolation.CLAMP
    );

    return {
      top: interpolate(
        index,
        [0, 1, 2],
        [0, -8, -16],
        Extrapolation.CLAMP
      ),
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotateZ}deg` },
        {
          scale: interpolate(
            index,
            [0, 1, 2],
            [scale.value, 0.96, 0.92],
            Extrapolation.CLAMP
          ),
        },
      ],
      opacity: interpolate(
        index,
        [0, 1, 2, 3],
        [1, 0.9, 0.7, 0],
        Extrapolation.CLAMP
      ),
      zIndex: 100 - index,
    };
  });

  const likeOverlayStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translateX.value,
        [SWIPE_THRESHOLD / 2, SWIPE_THRESHOLD],
        [0, 1],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          scale: withTiming(
            interpolate(
              translateX.value,
              [SWIPE_THRESHOLD / 2, SWIPE_THRESHOLD],
              [0.8, 1],
              Extrapolation.CLAMP
            ),
            { duration: 150 }
          ),
        },
      ],
    };
  });

  const nopeOverlayStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translateX.value,
        [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD / 2],
        [1, 0],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          scale: withTiming(
            interpolate(
              translateX.value,
              [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD / 2],
              [1, 0.8],
              Extrapolation.CLAMP
            ),
            { duration: 150 }
          ),
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.cardContainer, animatedCardStyle]}>
        <View style={styles.cardInner}>
          <ImageBackground
            source={{ uri: profile.photos[0] }}
            style={styles.imageBackground}
            imageStyle={styles.imageStyle}>
            
            {/* Premium Badge for Premium Users */}
            {profile.premium && (
              <View style={styles.premiumBadge}>
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.premiumGradient}>
                  <Text style={styles.premiumIcon}>👑</Text>
                </LinearGradient>
              </View>
            )}

            {/* Online Indicator */}
            {profile.online && (
              <View style={styles.onlineIndicator}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Online</Text>
              </View>
            )}

            {/* Match Percentage Badge */}
            {profile.matchPercentage && profile.matchPercentage >= 80 && (
              <View style={styles.matchBadge}>
                <LinearGradient
                  colors={['#E91E63', '#9C27B0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.matchGradient}>
                  <Text style={styles.matchPercentage}>
                    {profile.matchPercentage}% Match
                  </Text>
                </LinearGradient>
              </View>
            )}

            {/* Like/Nope Overlays */}
            <Animated.View style={[styles.overlayLabel, styles.likeLabel, likeOverlayStyle]}>
              <LinearGradient
                colors={['#4CAF50', '#66BB6A']}
                style={styles.labelGradient}>
                <Text style={styles.labelText}>LIKE ❤️</Text>
              </LinearGradient>
            </Animated.View>
            
            <Animated.View style={[styles.overlayLabel, styles.nopeLabel, nopeOverlayStyle]}>
              <LinearGradient
                colors={['#F44336', '#EF5350']}
                style={styles.labelGradient}>
                <Text style={styles.labelText}>NOPE ✕</Text>
              </LinearGradient>
            </Animated.View>

            {/* Gradient Overlay for better text readability */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)']}
              style={styles.gradientOverlay}
              locations={[0, 0.5, 1]}>
              
              {/* Profile Info Section */}
              <View style={styles.infoContainer}>
                {/* Name and Verification */}
                <View style={styles.nameRow}>
                  <Text style={styles.name} numberOfLines={1}>
                    {profile.firstName} {profile.lastName}
                  </Text>
                  {profile.verified && (
                    <View style={styles.verifiedBadge}>
                      <LinearGradient
                        colors={['#2196F3', '#64B5F6']}
                        style={styles.verifiedGradient}>
                        <Text style={styles.verifiedIcon}>✓</Text>
                      </LinearGradient>
                    </View>
                  )}
                </View>

                {/* Age and Location */}
                <View style={styles.detailRow}>
                  <Text style={styles.age}>{profile.age} years</Text>
                  <View style={styles.dot} />
                  <Text style={styles.location} numberOfLines={1}>
                    {profile.location}
                  </Text>
                </View>

                {/* Profession and Education */}
                <View style={styles.infoRow}>
                  <View style={styles.iconTextRow}>
                    <Text style={styles.iconEmoji}>💼</Text>
                    <Text style={styles.infoText} numberOfLines={1}>
                      {profile.profession}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.iconTextRow}>
                    <Text style={styles.iconEmoji}>🎓</Text>
                    <Text style={styles.infoText} numberOfLines={1}>
                      {profile.education}
                    </Text>
                  </View>
                </View>

                {/* Additional Details Row */}
                <View style={styles.tagsContainer}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{profile.height}</Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{profile.religion}</Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{profile.diet}</Text>
                  </View>
                </View>

                {/* Bio Preview */}
                {profile.bio && (
                  <Text style={styles.bio} numberOfLines={2}>
                    "{profile.bio}"
                  </Text>
                )}
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: 'absolute',
  },
  cardInner: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: colors.neutral.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 24,
  },
  gradientOverlay: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 24,
  },
  
  // Premium Badge
  premiumBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
  },
  premiumGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumIcon: {
    fontSize: 18,
  },

  // Online Indicator
  onlineIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    zIndex: 10,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.neutral.white,
    marginRight: 6,
  },
  onlineText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral.white,
  },

  // Match Badge
  matchBadge: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 10,
  },
  matchGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  matchPercentage: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.neutral.white,
  },

  // Info Container
  infoContainer: {
    gap: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.neutral.white,
    flex: 1,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  verifiedBadge: {
    marginLeft: 8,
  },
  verifiedGradient: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5,
  },
  verifiedIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.neutral.white,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  age: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.neutral.white,
    opacity: 0.95,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.neutral.white,
    marginHorizontal: 10,
    opacity: 0.7,
  },
  location: {
    fontSize: 16,
    color: colors.neutral.white,
    opacity: 0.9,
    flex: 1,
  },
  infoRow: {
    marginBottom: 4,
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  infoText: {
    fontSize: 15,
    color: colors.neutral.white,
    opacity: 0.95,
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral.white,
  },
  bio: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.neutral.white,
    opacity: 0.85,
    lineHeight: 20,
    marginTop: 4,
  },

  // Overlay Labels
  overlayLabel: {
    position: 'absolute',
    top: 120,
    zIndex: 20,
  },
  likeLabel: {
    left: 30,
    transform: [{ rotate: '-20deg' }],
  },
  nopeLabel: {
    right: 30,
    transform: [{ rotate: '20deg' }],
  },
  labelGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: colors.neutral.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  labelText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.neutral.white,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});

export default AnimatedSwipeCard;