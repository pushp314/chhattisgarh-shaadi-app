import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { Badge } from '../common';

interface ProfileCardProps {
  profile: {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    location: string;
    profession: string;
    height: string;
    photos: string[];
    verified: boolean;
    premium: boolean;
    matchPercentage?: number;
    online?: boolean;
  };
  onPress: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: profile.photos[0] }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Online Indicator */}
        {profile.online && (
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        )}

        {/* Match Percentage */}
        {profile.matchPercentage && (
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>{profile.matchPercentage}% Match</Text>
          </View>
        )}

        {/* Premium Badge */}
        {profile.premium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumIcon}>👑</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {profile.firstName} {profile.lastName}
          </Text>
          {profile.verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedIcon}>✓</Text>
            </View>
          )}
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detail}>
            {profile.age} yrs • {profile.height}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detail} numberOfLines={1}>
            📍 {profile.location}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detail} numberOfLines={1}>
            💼 {profile.profession}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  imageContainer: {
    width: '100%',
    height: 320,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  onlineBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.neutral.white,
    marginRight: 6,
  },
  onlineText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.neutral.white,
  },
  matchBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.primary.main,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  matchText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.neutral.white,
  },
  premiumBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.premium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumIcon: {
    fontSize: 18,
  },
  infoContainer: {
    padding: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    flex: 1,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  verifiedIcon: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.neutral.white,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detail: {
    fontSize: 13,
    color: colors.text.secondary,
  },
});

export default ProfileCard;