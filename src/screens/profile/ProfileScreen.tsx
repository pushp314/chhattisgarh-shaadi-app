import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {
  Text,
  Button,
  Surface,
  Chip,
  IconButton,
  ProgressBar,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { useProfileStore } from '../../store/profileStore';
import { Theme } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'ProfileScreen'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 48) / 3; // 3 photos per row with padding

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { profile, isLoading, fetchProfile } = useProfileStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      await fetchProfile();
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

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

  if (isLoading && !profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="account-alert" size={64} color="#999" />
        <Text variant="titleLarge" style={styles.emptyTitle}>
          No Profile Found
        </Text>
        <Text variant="bodyMedium" style={styles.emptyDescription}>
          Create your profile to start finding matches
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('CreateProfile')}
          style={styles.createButton}>
          Create Profile
        </Button>
      </View>
    );
  }

  const completeness = profile.profileCompleteness || 0;
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {/* Profile Completeness */}
      {completeness < 100 && (
        <Surface style={styles.completenessCard} elevation={1}>
          <View style={styles.completenessHeader}>
            <Text variant="titleMedium">Profile Completeness</Text>
            <Text variant="titleMedium" style={styles.completenessPercentage}>
              {completeness}%
            </Text>
          </View>
          <ProgressBar
            progress={completeness / 100}
            color={Theme.colors.accent}
            style={styles.completenessBar}
          />
          <Text variant="bodySmall" style={styles.completenessHint}>
            Complete your profile to increase visibility
          </Text>
        </Surface>
      )}

      {/* Profile Metrics Card */}
      <Surface style={styles.metricsCard} elevation={1}>
        <Text variant="titleMedium" style={styles.cardTitle}>
          Profile Activity
        </Text>
        <Divider style={styles.divider} />
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <View style={styles.metricIconContainer}>
              <Icon name="eye" size={24} color={Theme.colors.primary} />
            </View>
            <Text variant="headlineSmall" style={styles.metricValue}>
              {profile.viewCount || 0}
            </Text>
            <Text variant="bodySmall" style={styles.metricLabel}>
              Profile Views
            </Text>
          </View>

          <View style={styles.metricItem}>
            <View style={styles.metricIconContainer}>
              <Icon name="phone" size={24} color={Theme.colors.success} />
            </View>
            <Text variant="headlineSmall" style={styles.metricValue}>
              {profile.contactViewCount || 0}
            </Text>
            <Text variant="bodySmall" style={styles.metricLabel}>
              Contact Views
            </Text>
          </View>

          <View style={styles.metricItem}>
            <View style={styles.metricIconContainer}>
              <Icon name="bookmark" size={24} color={Theme.colors.secondary} />
            </View>
            <Text variant="headlineSmall" style={styles.metricValue}>
              {profile.shortlistCount || 0}
            </Text>
            <Text variant="bodySmall" style={styles.metricLabel}>
              Shortlisted
            </Text>
          </View>

          <View style={styles.metricItem}>
            <View style={styles.metricIconContainer}>
              <Icon name="heart" size={24} color={Theme.colors.error} />
            </View>
            <Text variant="headlineSmall" style={styles.metricValue}>
              {profile.matchRequestCount || 0}
            </Text>
            <Text variant="bodySmall" style={styles.metricLabel}>
              Interests
            </Text>
          </View>
        </View>
      </Surface>

      {/* Primary Photo */}
      {profile.media && profile.media.length > 0 && (
        <View style={styles.primaryPhotoContainer}>
          <Image
            source={{ uri: profile.media[0].url }}
            style={styles.primaryPhoto}
          />
        </View>
      )}

      {/* Basic Info Card */}
      <Surface style={styles.card} elevation={1}>
        <View style={styles.cardHeader}>
          <View style={styles.nameContainer}>
            <Text variant="titleLarge" style={styles.name}>
              {fullName}
            </Text>
            {profile.nameHi && (
              <Text variant="bodyMedium" style={styles.altName}>
                हिंदी: {profile.nameHi}
              </Text>
            )}
            {profile.nameCg && (
              <Text variant="bodyMedium" style={styles.altName}>
                छत्तीसगढ़ी: {profile.nameCg}
              </Text>
            )}
            {profile.isVerified && (
              <Icon name="check-decagram" size={24} color={Theme.colors.success} />
            )}
          </View>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => navigation.navigate('EditProfile')}
          />
        </View>

        <View style={styles.basicInfo}>
          {profile.dateOfBirth && (
            <View style={styles.infoRow}>
              <Icon name="cake" size={20} color="#666" />
              <Text style={styles.infoText}>
                {calculateAge(profile.dateOfBirth)} years old
              </Text>
            </View>
          )}
          {profile.height && (
            <View style={styles.infoRow}>
              <Icon name="human-male-height" size={20} color="#666" />
              <Text style={styles.infoText}>{profile.height} cm</Text>
            </View>
          )}
          {profile.gender && (
            <View style={styles.infoRow}>
              <Icon name="gender-male-female" size={20} color="#666" />
              <Text style={styles.infoText}>{profile.gender}</Text>
            </View>
          )}
        </View>
      </Surface>

      {/* Location Card */}
      {(profile.city || profile.state || profile.nativeDistrict) && (
        <Surface style={styles.card} elevation={1}>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Location
          </Text>
          <Divider style={styles.divider} />
          {profile.city && profile.state && (
            <View style={styles.infoRow}>
              <Icon name="map-marker" size={20} color="#666" />
              <Text style={styles.infoText}>
                {profile.city}, {profile.state}
              </Text>
            </View>
          )}
          {profile.nativeDistrict && (
            <View style={styles.infoRow}>
              <Icon name="home-city" size={20} color="#666" />
              <Text style={styles.infoText}>
                Native: {profile.nativeDistrict}
              </Text>
            </View>
          )}
          {profile.nativeVillage && (
            <View style={styles.infoRow}>
              <Icon name="domain" size={20} color="#666" />
              <Text style={styles.infoText}>
                Village: {profile.nativeVillage}
              </Text>
            </View>
          )}
        </Surface>
      )}

      {/* Religion & Community Card */}
      {(profile.religion || profile.caste || profile.maritalStatus) && (
        <Surface style={styles.card} elevation={1}>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Religion & Community
          </Text>
          <Divider style={styles.divider} />
          {profile.religion && (
            <View style={styles.infoRow}>
              <Icon name="book-cross" size={20} color="#666" />
              <Text style={styles.infoText}>{profile.religion}</Text>
            </View>
          )}
          {profile.caste && (
            <View style={styles.infoRow}>
              <Icon name="account-group" size={20} color="#666" />
              <Text style={styles.infoText}>{profile.caste}</Text>
            </View>
          )}
          {profile.maritalStatus && (
            <View style={styles.infoRow}>
              <Icon name="ring" size={20} color="#666" />
              <Text style={styles.infoText}>{profile.maritalStatus}</Text>
            </View>
          )}
          {profile.motherTongue && (
            <View style={styles.infoRow}>
              <Icon name="translate" size={20} color="#666" />
              <Text style={styles.infoText}>{profile.motherTongue}</Text>
            </View>
          )}
        </Surface>
      )}

      {/* Education & Career Card */}
      {(profile.education || profile.occupation) && (
        <Surface style={styles.card} elevation={1}>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Education & Career
          </Text>
          <Divider style={styles.divider} />
          {profile.education && (
            <View style={styles.infoRow}>
              <Icon name="school" size={20} color="#666" />
              <Text style={styles.infoText}>{profile.education}</Text>
            </View>
          )}
          {profile.occupation && (
            <View style={styles.infoRow}>
              <Icon name="briefcase" size={20} color="#666" />
              <Text style={styles.infoText}>{profile.occupation}</Text>
            </View>
          )}
          {profile.annualIncome && (
            <View style={styles.infoRow}>
              <Icon name="currency-inr" size={20} color="#666" />
              <Text style={styles.infoText}>{profile.annualIncome}</Text>
            </View>
          )}
        </Surface>
      )}

      {/* About Me Card */}
      {profile.bio && (
        <Surface style={styles.card} elevation={1}>
          <Text variant="titleMedium" style={styles.cardTitle}>
            About Me
          </Text>
          <Divider style={styles.divider} />
          <Text style={styles.aboutText}>{profile.bio}</Text>
        </Surface>
      )}

      {/* Hobbies Card */}
      {profile.hobbies && (
        <Surface style={styles.card} elevation={1}>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Hobbies & Interests
          </Text>
          <Divider style={styles.divider} />
          <View style={styles.hobbiesContainer}>
            {profile.hobbies.split(',').map((hobby: string, index: number) => (
              <Chip key={index} style={styles.hobbyChip}>
                {hobby.trim()}
              </Chip>
            ))}
          </View>
        </Surface>
      )}

      {/* Photo Gallery */}
      {profile.media && profile.media.length > 1 && (
        <Surface style={styles.card} elevation={1}>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Photo Gallery
          </Text>
          <Divider style={styles.divider} />
          <View style={styles.photoGallery}>
            {profile.media.slice(1).map((photo, index) => (
              <Image
                key={index}
                source={{ uri: photo.url }}
                style={styles.galleryPhoto}
              />
            ))}
          </View>
        </Surface>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <Button
          mode="contained"
          icon="pencil"
          onPress={() => navigation.navigate('EditProfile')}
          style={styles.actionButton}
          buttonColor={Theme.colors.accent}>
          Edit Profile
        </Button>
        <Button
          mode="outlined"
          icon="image-multiple"
          onPress={() => navigation.navigate('PhotoManagement')}
          style={styles.actionButton}
          textColor={Theme.colors.primary}>
          Manage Photos
        </Button>
        <Button
          mode="outlined"
          icon="heart-multiple"
          onPress={() => navigation.navigate('PartnerPreferences')}
          style={styles.actionButton}
          textColor={Theme.colors.primary}>
          Partner Preferences
        </Button>
        <Button
          mode="outlined"
          icon="bookmark-multiple"
          onPress={() => navigation.navigate('Shortlist')}
          style={styles.actionButton}
          textColor={Theme.colors.primary}>
          My Shortlist
        </Button>
        <Button
          mode="outlined"
          icon="cog"
          onPress={() => navigation.navigate('Settings')}
          style={styles.actionButton}
          textColor={Theme.colors.primary}>
          Settings
        </Button>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
  },
  loadingText: {
    marginTop: 16,
    color: Theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: Theme.colors.background,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    color: Theme.colors.text,
  },
  emptyDescription: {
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    paddingHorizontal: 24,
    backgroundColor: Theme.colors.primary,
  },
  completenessCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Theme.colors.surfaceCard,
  },
  completenessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  completenessPercentage: {
    color: Theme.colors.accent,
    fontWeight: 'bold',
  },
  completenessBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  completenessHint: {
    color: Theme.colors.textSecondary,
  },
  metricsCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Theme.colors.white,
    ...Theme.shadows.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricItem: {
    width: '48%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Theme.colors.background,
    borderRadius: 12,
  },
  metricIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...Theme.shadows.sm,
  },
  metricValue: {
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 4,
  },
  metricLabel: {
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  primaryPhotoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryPhoto: {
    width: width - 32,
    height: width - 32,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: Theme.colors.accent,
  },
  card: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Theme.colors.white,
    ...Theme.shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: Theme.colors.text,
  },
  divider: {
    marginBottom: 12,
    backgroundColor: Theme.colors.surfaceCard,
  },
  name: {
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  altName: {
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  basicInfo: {
    gap: 8,
    marginTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: Theme.colors.text,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    color: Theme.colors.text,
  },
  hobbiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hobbyChip: {
    marginBottom: 8,
    backgroundColor: Theme.colors.surfaceCardAlt,
  },
  photoGallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  galleryPhoto: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 8,
  },
  actionsContainer: {
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 8,
  },
  bottomPadding: {
    height: 32,
  },
});

export default ProfileScreen;
