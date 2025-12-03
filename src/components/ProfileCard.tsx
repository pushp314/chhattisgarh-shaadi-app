import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Surface, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Profile } from '../types';
import { Theme } from '../constants/theme';

type Props = {
  profile: Profile;
  onPress: () => void;
  showDistance?: boolean;
};

const ProfileCard: React.FC<Props> = ({ profile, onPress }) => {
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const primaryPhoto = profile.media?.[0]?.url;
  const age = profile.dateOfBirth ? calculateAge(profile.dateOfBirth) : null;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Surface style={styles.card} elevation={2}>
        {/* Profile Image */}
        <View style={styles.imageContainer}>
          {primaryPhoto ? (
            <Image source={{ uri: primaryPhoto }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage}>
              <Icon name="account" size={64} color={Theme.colors.textSecondary} />
            </View>
          )}
          {profile.isVerified && (
            <View style={styles.verifiedBadge}>
              <Icon name="check-decagram" size={24} color={Theme.colors.success} />
            </View>
          )}
        </View>

        {/* Profile Info */}
        <View style={styles.info}>
          <Text variant="titleMedium" style={styles.name} numberOfLines={1}>
            {profile.firstName} {profile.lastName}
          </Text>

          <View style={styles.detailsRow}>
            {age && (
              <View style={styles.detail}>
                <Icon name="cake" size={16} color={Theme.colors.textSecondary} />
                <Text style={styles.detailText}>{age} yrs</Text>
              </View>
            )}
            {profile.height && (
              <View style={styles.detail}>
                <Icon name="human-male-height" size={16} color={Theme.colors.textSecondary} />
                <Text style={styles.detailText}>{profile.height} cm</Text>
              </View>
            )}
          </View>

          {(profile.city || profile.state) && (
            <View style={styles.detailsRow}>
              <Icon name="map-marker" size={16} color={Theme.colors.textSecondary} />
              <Text style={styles.detailText} numberOfLines={1}>
                {profile.city}
                {profile.city && profile.state && ', '}
                {profile.state}
              </Text>
            </View>
          )}

          {profile.occupation && (
            <View style={styles.detailsRow}>
              <Icon name="briefcase" size={16} color={Theme.colors.textSecondary} />
              <Text style={styles.detailText} numberOfLines={1}>
                {profile.occupation}
              </Text>
            </View>
          )}

          {profile.education && (
            <View style={styles.detailsRow}>
              <Icon name="school" size={16} color={Theme.colors.textSecondary} />
              <Text style={styles.detailText} numberOfLines={1}>
                {profile.education}
              </Text>
            </View>
          )}

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {profile.religion && (
              <Chip style={styles.chip} textStyle={styles.chipText}>
                {profile.religion}
              </Chip>
            )}
            {profile.caste && (
              <Chip style={styles.chip} textStyle={styles.chipText}>
                {profile.caste}
              </Chip>
            )}
          </View>
        </View>
      </Surface>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Theme.colors.white,
    marginBottom: 16,
    ...Theme.shadows.md,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
    backgroundColor: Theme.colors.surfaceCard,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.surfaceCard,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Theme.colors.white,
    borderRadius: 20,
    padding: 4,
    ...Theme.shadows.sm,
  },
  info: {
    padding: 16,
    backgroundColor: Theme.colors.white,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: Theme.colors.text,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    height: 28,
    backgroundColor: Theme.colors.surfaceCardAlt,
  },
  chipText: {
    fontSize: 12,
    color: Theme.colors.primary,
  },
});

export default ProfileCard;
