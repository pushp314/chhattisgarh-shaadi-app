import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Button,
  Surface,
  Divider,
  IconButton,
  ProgressBar,
  Chip,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SearchStackParamList } from '../../navigation/types';
import { Profile } from '../../types';
import profileService from '../../services/profile.service';
import matchService from '../../services/match.service';

type ProfileDetailsScreenNavigationProp = NativeStackNavigationProp<
  SearchStackParamList,
  'ProfileDetails'
>;

type ProfileDetailsScreenRouteProp = RouteProp<
  SearchStackParamList,
  'ProfileDetails'
>;

type Props = {
  navigation: ProfileDetailsScreenNavigationProp;
  route: ProfileDetailsScreenRouteProp;
};

const { width } = Dimensions.get('window');

const ProfileDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { userId } = route.params;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const loadProfile = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      console.log('Loading profile for userId:', userId);
      const profileData = await profileService.getProfileById(userId);
      setProfile(profileData);
    } catch (error: any) {
      console.error('Error loading profile:', error);
      setProfile(null);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSendMatchRequest = async () => {
    setSendingRequest(true);
    try {
      console.log('Sending match request to userId:', userId);
      await matchService.sendMatchRequest(userId);
      // Show success message and navigate back
      navigation.goBack();
    } catch (error: any) {
      console.error('Error sending match request:', error);
      // You could show an error alert here
    } finally {
      setSendingRequest(false);
    }
  };

  const renderPhotos = () => {
    const photos = profile?.media || [];
    if (photos.length === 0) {
      return (
        <View style={styles.photoContainer}>
          <View style={styles.placeholderPhoto}>
            <Icon name="account" size={80} color="#ccc" />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.photoContainer}>
        <Image
          source={{ uri: photos[currentPhotoIndex].url }}
          style={styles.photo}
          resizeMode="cover"
        />
        {photos.length > 1 && (
          <>
            <View style={styles.photoControls}>
              <IconButton
                icon="chevron-left"
                size={32}
                iconColor="#fff"
                style={styles.photoControl}
                onPress={() =>
                  setCurrentPhotoIndex(prev =>
                    prev === 0 ? photos.length - 1 : prev - 1,
                  )
                }
              />
              <IconButton
                icon="chevron-right"
                size={32}
                iconColor="#fff"
                style={styles.photoControl}
                onPress={() =>
                  setCurrentPhotoIndex(prev =>
                    prev === photos.length - 1 ? 0 : prev + 1,
                  )
                }
              />
            </View>
            <View style={styles.photoIndicators}>
              {photos.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.photoIndicator,
                    index === currentPhotoIndex && styles.photoIndicatorActive,
                  ]}
                />
              ))}
            </View>
          </>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D81B60" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={64} color="#666" />
        <Text variant="titleLarge" style={styles.errorTitle}>
          Profile Not Found
        </Text>
        <Text variant="bodyMedium" style={styles.errorText}>
          This profile is no longer available
        </Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  const age = new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear();
  const hobbies = profile.hobbies ? profile.hobbies.split(',').map(h => h.trim()) : [];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadProfile(true)}
          />
        }>
        {renderPhotos()}

        {/* Verified Badge */}
        {profile.isVerified && (
          <Surface style={styles.verifiedBadge} elevation={2}>
            <Icon name="check-decagram" size={20} color="#2196F3" />
            <Text style={styles.verifiedText}>Verified Profile</Text>
          </Surface>
        )}

        {/* Header */}
        <Surface style={styles.headerCard} elevation={1}>
          <View style={styles.headerRow}>
            <View style={styles.headerInfo}>
              <Text variant="headlineSmall" style={styles.name}>
                {profile.firstName} {profile.lastName}
              </Text>
              <Text variant="bodyLarge" style={styles.subInfo}>
                {age} years • {profile.height} cm
              </Text>
              <Text variant="bodyMedium" style={styles.location}>
                <Icon name="map-marker" size={16} />
                {' '}{profile.city}, {profile.state}
              </Text>
            </View>
          </View>

          {/* Profile Completeness */}
          {profile.profileCompleteness && profile.profileCompleteness < 100 && (
            <View style={styles.completenessContainer}>
              <Text variant="bodySmall" style={styles.completenessText}>
                Profile {profile.profileCompleteness}% Complete
              </Text>
              <ProgressBar
                progress={profile.profileCompleteness / 100}
                color="#4CAF50"
                style={styles.progressBar}
              />
            </View>
          )}
        </Surface>

        {/* Basic Info */}
        <Surface style={styles.card} elevation={1}>
          <Text variant="titleMedium" style={styles.cardTitle}>
            <Icon name="account-details" size={20} /> Basic Information
          </Text>
          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Gender</Text>
            <Text style={styles.value}>{profile.gender}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Marital Status</Text>
            <Text style={styles.value}>{profile.maritalStatus.replace('_', ' ')}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Mother Tongue</Text>
            <Text style={styles.value}>{profile.motherTongue}</Text>
          </View>
        </Surface>

        {/* Location */}
        <Surface style={styles.card} elevation={1}>
          <Text variant="titleMedium" style={styles.cardTitle}>
            <Icon name="map-marker" size={20} /> Location
          </Text>
          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Native District</Text>
            <Text style={styles.value}>{profile.nativeDistrict}, Chhattisgarh</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Currently Living In</Text>
            <Text style={styles.value}>{profile.city}, {profile.state}</Text>
          </View>
        </Surface>

        {/* Religion */}
        <Surface style={styles.card} elevation={1}>
          <Text variant="titleMedium" style={styles.cardTitle}>
            <Icon name="om" size={20} /> Religion & Caste
          </Text>
          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Religion</Text>
            <Text style={styles.value}>{profile.religion}</Text>
          </View>

          {profile.caste && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Caste</Text>
              <Text style={styles.value}>{profile.caste}</Text>
            </View>
          )}
        </Surface>

        {/* Education & Career */}
        <Surface style={styles.card} elevation={1}>
          <Text variant="titleMedium" style={styles.cardTitle}>
            <Icon name="school" size={20} /> Education & Career
          </Text>
          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Education</Text>
            <Text style={styles.value}>{profile.education}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Occupation</Text>
            <Text style={styles.value}>{profile.occupation}</Text>
          </View>

          {profile.annualIncome && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Annual Income</Text>
              <Text style={styles.value}>₹{profile.annualIncome}</Text>
            </View>
          )}
        </Surface>

        {/* About */}
        {profile.bio && (
          <Surface style={styles.card} elevation={1}>
            <Text variant="titleMedium" style={styles.cardTitle}>
              <Icon name="information" size={20} /> About
            </Text>
            <Divider style={styles.divider} />
            <Text style={styles.aboutText}>{profile.bio}</Text>
          </Surface>
        )}

        {/* Hobbies */}
        {hobbies.length > 0 && (
          <Surface style={styles.card} elevation={1}>
            <Text variant="titleMedium" style={styles.cardTitle}>
              <Icon name="heart" size={20} /> Interests & Hobbies
            </Text>
            <Divider style={styles.divider} />
            <View style={styles.hobbiesContainer}>
              {hobbies.map((hobby, index) => (
                <Chip key={index} mode="outlined" style={styles.hobbyChip}>
                  {hobby}
                </Chip>
              ))}
            </View>
          </Surface>
        )}

        {/* Photo Gallery */}
        {profile.media && profile.media.length > 1 && (
          <Surface style={styles.card} elevation={1}>
            <Text variant="titleMedium" style={styles.cardTitle}>
              <Icon name="image-multiple" size={20} /> Photo Gallery
            </Text>
            <Divider style={styles.divider} />
            <View style={styles.gallery}>
              {profile.media.map((photo, index) => (
                <Image
                  key={index}
                  source={{ uri: photo.url }}
                  style={styles.galleryPhoto}
                  resizeMode="cover"
                />
              ))}
            </View>
          </Surface>
        )}
      </ScrollView>

      {/* Fixed Bottom Button */}
      <Surface style={styles.bottomBar} elevation={4}>
        <Button
          mode="contained"
          onPress={handleSendMatchRequest}
          loading={sendingRequest}
          disabled={sendingRequest}
          style={styles.matchButton}
          contentStyle={styles.matchButtonContent}>
          Send Match Request
        </Button>
      </Surface>
    </View>
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
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  content: {
    paddingBottom: 80,
  },
  photoContainer: {
    width: width,
    height: width,
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  placeholderPhoto: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  photoControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  photoControl: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  photoIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  photoIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  photoIndicatorActive: {
    backgroundColor: '#fff',
    width: 24,
  },
  verifiedBadge: {
    position: 'absolute',
    top: width - 40,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  verifiedText: {
    marginLeft: 4,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  headerCard: {
    padding: 16,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subInfo: {
    color: '#666',
    marginBottom: 4,
  },
  location: {
    color: '#666',
  },
  completenessContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  completenessText: {
    marginBottom: 4,
    color: '#666',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  card: {
    padding: 16,
    marginTop: 12,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: {
    color: '#666',
    flex: 1,
  },
  value: {
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  aboutText: {
    lineHeight: 22,
    color: '#333',
  },
  hobbiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hobbyChip: {
    marginBottom: 4,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  galleryPhoto: {
    width: (width - 64) / 3,
    height: (width - 64) / 3,
    borderRadius: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
  },
  matchButton: {
    backgroundColor: '#D81B60',
  },
  matchButtonContent: {
    paddingVertical: 8,
  },
});

export default ProfileDetailsScreen;
