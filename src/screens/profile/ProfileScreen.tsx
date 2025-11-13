import React, {useEffect, useState} from 'react';
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
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ProfileStackParamList} from '../../navigation/types';
import {useProfileStore} from '../../store/profileStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'ProfileScreen'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

const {width} = Dimensions.get('window');
const PHOTO_SIZE = (width - 48) / 3; // 3 photos per row with padding

const ProfileScreen: React.FC<Props> = ({navigation}) => {
  const {profile, isLoading, fetchProfile} = useProfileStore();
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
        <ActivityIndicator size="large" color="#D81B60" />
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
            color="#D81B60"
            style={styles.completenessBar}
          />
          <Text variant="bodySmall" style={styles.completenessHint}>
            Complete your profile to increase visibility
          </Text>
        </Surface>
      )}

      {/* Primary Photo */}
      {profile.media && profile.media.length > 0 && (
        <View style={styles.primaryPhotoContainer}>
          <Image
            source={{uri: profile.media[0].url}}
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
            {profile.isVerified && (
              <Icon name="check-decagram" size={24} color="#4CAF50" />
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
                source={{uri: photo.url}}
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
          style={styles.actionButton}>
          Edit Profile
        </Button>
        <Button
          mode="outlined"
          icon="cog"
          onPress={() => navigation.navigate('Settings')}
          style={styles.actionButton}>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f5f5f5',
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    paddingHorizontal: 24,
  },
  completenessCard: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  completenessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  completenessPercentage: {
    color: '#D81B60',
    fontWeight: 'bold',
  },
  completenessBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  completenessHint: {
    color: '#666',
  },
  primaryPhotoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryPhoto: {
    width: width - 32,
    height: width - 32,
    borderRadius: 8,
  },
  card: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
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
  },
  divider: {
    marginBottom: 12,
  },
  name: {
    fontWeight: 'bold',
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
    color: '#333',
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  hobbiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hobbyChip: {
    marginBottom: 8,
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
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
  bottomPadding: {
    height: 32,
  },
});

export default ProfileScreen;
