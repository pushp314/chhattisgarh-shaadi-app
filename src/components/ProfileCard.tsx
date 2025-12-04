import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Surface, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Profile } from '../types';
import { Theme } from '../constants/theme';
import VerificationBadge from './common/VerificationBadge';
import PremiumBadge from './common/PremiumBadge';

type Props = {
  profile: Profile;
  onPress: () => void;
  showDistance?: boolean;
};

import { useAppTheme } from '../hooks/useAppTheme';

const ProfileCard: React.FC<Props> = ({ profile, onPress }) => {
  const { theme } = useAppTheme();

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
      <Surface style={[styles.card, { backgroundColor: theme.colors.surface }, profile.isPremium && styles.premiumCard]} elevation={2}>
        {/* Profile Image */}
        <View style={[styles.imageContainer, { backgroundColor: theme.colors.surfaceCard }]}>
          {primaryPhoto ? (
            <Image source={{ uri: primaryPhoto }} style={styles.image} />
          ) : (
            <View style={[styles.placeholderImage, { backgroundColor: theme.colors.surfaceCard }]}>
              <Icon name="account" size={64} color={theme.colors.textSecondary} />
            </View>
          )}
          {profile.isVerified && (
            <VerificationBadge variant="overlay" size={24} style={styles.verifiedBadge} />
          )}
          {profile.isPremium && (
            <PremiumBadge variant="overlay" size={24} style={styles.premiumBadge} />
          )}
        </View>

        {/* Profile Info */}
        <View style={[styles.info, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>
            {profile.firstName} {profile.lastName}
          </Text>

          <View style={styles.detailsRow}>
            {age && (
              <View style={[styles.detail, { backgroundColor: theme.colors.background }]}>
                <Icon name="cake" size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>{age} yrs</Text>
              </View>
            )}
            {profile.height && (
              <View style={[styles.detail, { backgroundColor: theme.colors.background }]}>
                <Icon name="human-male-height" size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>{profile.height} cm</Text>
              </View>
            )}
          </View>

          {(profile.city || profile.state) && (
            <View style={styles.detailsRow}>
              <Icon name="map-marker" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.detailText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                {profile.city}
                {profile.city && profile.state && ', '}
                {profile.state}
              </Text>
            </View>
          )}

          {profile.occupation && (
            <View style={styles.detailsRow}>
              <Icon name="briefcase" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.detailText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                {profile.occupation}
              </Text>
            </View>
          )}

          {profile.education && (
            <View style={styles.detailsRow}>
              <Icon name="school" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.detailText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                {profile.education}
              </Text>
            </View>
          )}

          {/* Tags */}
          <View style={[styles.tagsContainer, { borderTopColor: theme.colors.border }]}>
            {profile.religion && (
              <Chip style={[styles.chip, { backgroundColor: theme.colors.surfaceCardAlt }]} textStyle={[styles.chipText, { color: theme.colors.primary }]}>
                {profile.religion}
              </Chip>
            )}
            {profile.caste && (
              <Chip style={[styles.chip, { backgroundColor: theme.colors.surfaceCardAlt }]} textStyle={[styles.chipText, { color: theme.colors.primary }]}>
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
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  premiumCard: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 4 / 5, // Standard portrait ratio
    backgroundColor: Theme.colors.surfaceCard,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
  },
  premiumBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  info: {
    padding: 16,
    backgroundColor: Theme.colors.white,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: Theme.colors.text,
    letterSpacing: 0.3,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    gap: 6,
    backgroundColor: Theme.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  detailText: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  chip: {
    height: 28,
    backgroundColor: Theme.colors.surfaceCardAlt,
    borderRadius: 8,
  },
  chipText: {
    fontSize: 12,
    color: Theme.colors.primary,
    fontWeight: '600',
  },
});

export default ProfileCard;
