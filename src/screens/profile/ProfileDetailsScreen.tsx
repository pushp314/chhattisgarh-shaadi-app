/**
 * Profile Details Screen
 * View detailed profile of other users with match/contact request options
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  Chip,
  ActivityIndicator,
  IconButton,
  Dialog,
  Portal,
  TextInput,
  Divider,
  Modal,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';
import { ProfileStackParamList } from '../../navigation/types';
import { Profile, MatchResult } from '../../types';
import profileService from '../../services/profile.service';
import matchService from '../../services/match.service';
import matchingService from '../../services/matching.service';
import shortlistService from '../../services/shortlist.service';
import contactRequestService from '../../services/contactRequest.service';
import photoRequestService from '../../services/photoRequest.service';
import reportService from '../../services/report.service';
import { useProfileStore } from '../../store/profileStore';
import ReportProfileDialog, { ReportReason } from '../../components/profile/ReportProfileDialog';

type ProfileDetailsScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'ProfileDetails'
>;

type ProfileDetailsScreenRouteProp = RouteProp<ProfileStackParamList, 'ProfileDetails'>;

type Props = {
  navigation: ProfileDetailsScreenNavigationProp;
  route: ProfileDetailsScreenRouteProp;
};

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 48) / 3;

const ProfileDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { userId } = route.params;
  const { profile: myProfile } = useProfileStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showPhotoRequestDialog, setShowPhotoRequestDialog] = useState(false);
  const [matchMessage, setMatchMessage] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [photoRequestMessage, setPhotoRequestMessage] = useState('');
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [isSendingPhotoRequest, setIsSendingPhotoRequest] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userId) {
      loadProfile();
      checkShortlistStatus();
    } else {
      console.error('ProfileDetailsScreen: userId is undefined');
      Alert.alert('Error', 'Invalid profile ID');
      navigation.goBack();
    }
  }, [userId]);

  useEffect(() => {
    if (profile && myProfile) {
      const result = matchingService.calculateMatchScore(myProfile, profile);
      setMatchResult(result);
    }
  }, [profile, myProfile]);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      console.log('Loading profile for userId:', userId);
      if (!userId) {
        throw new Error('User ID is required');
      }
      const profileData = await profileService.getProfileById(userId);
      setProfile(profileData);
    } catch (error: any) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const checkShortlistStatus = async () => {
    try {
      const { results } = await shortlistService.getShortlist();
      const isInShortlist = results.some((s: any) => s.profileId === userId);
      setIsShortlisted(isInShortlist);
    } catch (error) {
      console.error('Error checking shortlist:', error);
    }
  };

  const handleShortlist = async () => {
    try {
      if (isShortlisted) {
        await shortlistService.removeFromShortlist(userId);
        setIsShortlisted(false);
        Alert.alert('Success', 'Removed from shortlist');
      } else {
        await shortlistService.addToShortlist(userId);
        setIsShortlisted(true);
        Alert.alert('Success', 'Added to shortlist');
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update shortlist');
    }
  };

  const handleSendMatchRequest = async () => {
    setIsSubmitting(true);
    try {
      await matchService.sendMatchRequest(userId, matchMessage);
      setShowMatchModal(false);
      setMatchMessage('');
      Alert.alert('Success', 'Match request sent successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send match request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendContactRequest = async () => {
    setIsSendingContact(true);
    try {
      await contactRequestService.createContactRequest({
        profileId: userId,
        requestType: 'PHONE' as any,
        message: contactMessage,
      });
      setShowContactDialog(false);
      setContactMessage('');
      Alert.alert('Success', 'Contact request sent successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send contact request');
    } finally {
      setIsSendingContact(false);
    }
  };

  const handleSendPhotoRequest = async () => {
    if (!profile?.media || profile.media.length === 0) {
      Alert.alert('Error', 'This profile has no photos');
      return;
    }

    setIsSendingPhotoRequest(true);
    try {
      // Send request for the first photo (primary photo)
      await photoRequestService.sendRequest({
        photoId: profile.media[0].id,
        message: photoRequestMessage,
      });
      setShowPhotoRequestDialog(false);
      setPhotoRequestMessage('');
      Alert.alert('Success', 'Photo view request sent successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send photo request');
    } finally {
      setIsSendingPhotoRequest(false);
    }
  };

  const handleReport = async (reason: ReportReason, details?: string) => {
    setIsReporting(true);
    try {
      await reportService.reportUser({
        reportedUserId: userId,
        reason,
        description: details,
        reportType: 'PROFILE' as any,
      });
      setShowReportDialog(false);
      Alert.alert(
        'Report Submitted',
        'Thank you for reporting. We will review this profile and take appropriate action.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit report');
    } finally {
      setIsReporting(false);
    }
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

  if (isLoading) {
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
        <Icon name="account-alert" size={64} color={Theme.colors.textSecondary} />
        <Text variant="titleLarge" style={styles.emptyTitle}>
          Profile Not Found
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          buttonColor={Theme.colors.primary}>
          Go Back
        </Button>
      </View>
    );
  }

  const fullName = `${profile.firstName} ${profile.lastName}`.trim();
  const age = profile.dateOfBirth ? calculateAge(profile.dateOfBirth) : null;

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
            iconColor={Theme.colors.white}
          />
          <View style={styles.headerActions}>
            <IconButton
              icon="flag"
              size={24}
              onPress={() => setShowReportDialog(true)}
              iconColor={Theme.colors.white}
            />
            <IconButton
              icon={isShortlisted ? 'bookmark' : 'bookmark-outline'}
              size={24}
              onPress={handleShortlist}
              iconColor={isShortlisted ? Theme.colors.secondary : Theme.colors.white}
            />
          </View>
        </View>

        {/* Primary Photo */}
        {profile.media && profile.media.length > 0 && (
          <View style={styles.primaryPhotoContainer}>
            <Image
              source={{ uri: profile.media[0].url }}
              style={styles.primaryPhoto}
            />
            {profile.isVerified && (
              <View style={styles.verifiedBadge}>
                <Icon name="check-decagram" size={32} color={Theme.colors.success} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
        )}

        {/* Basic Info Card */}
        <Surface style={styles.card} elevation={1}>
          <View style={styles.nameContainer}>
            <Text variant="headlineMedium" style={styles.name}>
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
              <Icon name="check-decagram" size={28} color={Theme.colors.success} />
            )}
          </View>

          <View style={styles.basicInfo}>
            {age && (
              <View style={styles.infoRow}>
                <Icon name="cake" size={20} color={Theme.colors.textSecondary} />
                <Text style={styles.infoText}>{age} years old</Text>
              </View>
            )}
            {profile.height && (
              <View style={styles.infoRow}>
                <Icon name="human-male-height" size={20} color={Theme.colors.textSecondary} />
                <Text style={styles.infoText}>{profile.height} cm</Text>
              </View>
            )}
            {profile.gender && (
              <View style={styles.infoRow}>
                <Icon name="gender-male-female" size={20} color={Theme.colors.textSecondary} />
                <Text style={styles.infoText}>{profile.gender}</Text>
              </View>
            )}
          </View>
        </Surface>

        {/* Compatibility Match Card */}
        {matchResult && (
          <Surface style={styles.card} elevation={1}>
            <View style={styles.cardHeader}>
              <Text variant="titleMedium" style={styles.cardTitle}>
                Compatibility Match
              </Text>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreText}>{matchResult.totalScore}%</Text>
              </View>
            </View>
            <Divider style={styles.divider} />

            <View style={styles.matchRow}>
              <View style={styles.matchItem}>
                <Text style={styles.matchLabel}>Guna Milan</Text>
                <Text style={styles.matchValue}>{matchResult.gunaMilan.score}/{matchResult.gunaMilan.maxScore}</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.matchItem}>
                <Text style={styles.matchLabel}>Manglik</Text>
                <Text style={[
                  styles.matchValue,
                  { color: matchResult.manglik.isCompatible ? Theme.colors.success : Theme.colors.error }
                ]}>
                  {matchResult.manglik.isCompatible ? 'Compatible' : 'Mismatch'}
                </Text>
              </View>
            </View>

            {matchResult.preferences.matches.length > 0 && (
              <View style={styles.highlightsContainer}>
                {matchResult.preferences.matches.slice(0, 3).map((match, index) => (
                  <View key={index} style={styles.highlightItem}>
                    <Icon name="check-circle-outline" size={16} color={Theme.colors.success} />
                    <Text style={styles.highlightText}>{match}</Text>
                  </View>
                ))}
              </View>
            )}
          </Surface>
        )}

        {/* Location Card */}
        {(profile.city || profile.state || profile.nativeDistrict) && (
          <Surface style={styles.card} elevation={1}>
            <Text variant="titleMedium" style={styles.cardTitle}>
              Location
            </Text>
            <Divider style={styles.divider} />
            {profile.city && profile.state && (
              <View style={styles.infoRow}>
                <Icon name="map-marker" size={20} color={Theme.colors.textSecondary} />
                <Text style={styles.infoText}>
                  {profile.city}, {profile.state}
                </Text>
              </View>
            )}
            {profile.nativeDistrict && (
              <View style={styles.infoRow}>
                <Icon name="home-city" size={20} color={Theme.colors.textSecondary} />
                <Text style={styles.infoText}>
                  Native: {profile.nativeDistrict}
                </Text>
              </View>
            )}
            {profile.nativeVillage && (
              <View style={styles.infoRow}>
                <Icon name="domain" size={20} color={Theme.colors.textSecondary} />
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
                <Icon name="book-cross" size={20} color={Theme.colors.textSecondary} />
                <Text style={styles.infoText}>{profile.religion}</Text>
              </View>
            )}
            {profile.caste && (
              <View style={styles.infoRow}>
                <Icon name="account-group" size={20} color={Theme.colors.textSecondary} />
                <Text style={styles.infoText}>{profile.caste}</Text>
              </View>
            )}
            {profile.maritalStatus && (
              <View style={styles.infoRow}>
                <Icon name="ring" size={20} color={Theme.colors.textSecondary} />
                <Text style={styles.infoText}>{profile.maritalStatus}</Text>
              </View>
            )}
            {profile.motherTongue && (
              <View style={styles.infoRow}>
                <Icon name="translate" size={20} color={Theme.colors.textSecondary} />
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
                <Icon name="school" size={20} color={Theme.colors.textSecondary} />
                <Text style={styles.infoText}>{profile.education}</Text>
              </View>
            )}
            {profile.occupation && (
              <View style={styles.infoRow}>
                <Icon name="briefcase" size={20} color={Theme.colors.textSecondary} />
                <Text style={styles.infoText}>{profile.occupation}</Text>
              </View>
            )}
            {profile.annualIncome && (
              <View style={styles.infoRow}>
                <Icon name="currency-inr" size={20} color={Theme.colors.textSecondary} />
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
                <TouchableOpacity key={index}>
                  <Image
                    source={{ uri: photo.url }}
                    style={styles.galleryPhoto}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </Surface>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Action Buttons */}
      <Surface style={styles.actionBar} elevation={4}>
        <Button
          mode="outlined"
          icon="phone"
          onPress={() => setShowContactDialog(true)}
          style={styles.actionButton}
          textColor={Theme.colors.primary}>
          Contact
        </Button>
        <Button
          mode="outlined"
          icon="image-lock"
          onPress={() => setShowPhotoRequestDialog(true)}
          style={styles.actionButton}
          textColor={Theme.colors.secondary}>
          Request Photos
        </Button>
        <Button
          mode="contained"
          icon="heart"
          onPress={() => setShowMatchModal(true)}
          style={styles.actionButton}
          buttonColor={Theme.colors.secondary}
          textColor={Theme.colors.primaryDark}>
          Send Request
        </Button>
      </Surface>

      {/* Match Request Modal */}
      <Portal>
        <Modal
          visible={showMatchModal}
          onDismiss={() => setShowMatchModal(false)}
          contentContainerStyle={styles.modalContainer}>
          <Text variant="titleLarge" style={styles.modalTitle}>
            Send Match Request
          </Text>
          <Text variant="bodyMedium" style={styles.modalSubtitle}>
            Send a match request to {profile.firstName}
          </Text>
          <TextInput
            label="Message (Optional)"
            value={matchMessage}
            onChangeText={setMatchMessage}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            outlineColor={Theme.colors.border}
            activeOutlineColor={Theme.colors.secondary}
          />
          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setShowMatchModal(false)}
              style={styles.modalButton}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSendMatchRequest}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.modalButton}
              buttonColor={Theme.colors.secondary}
              textColor={Theme.colors.primaryDark}>
              Send
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Contact Request Modal */}
      <Portal>
        <Modal
          visible={showContactDialog}
          onDismiss={() => setShowContactDialog(false)}
          contentContainerStyle={styles.modalContainer}>
          <Text variant="titleLarge" style={styles.modalTitle}>
            Request Contact Details
          </Text>
          <Text variant="bodyMedium" style={styles.modalSubtitle}>
            Request phone number from {profile.firstName}
          </Text>
          <TextInput
            label="Message (Optional)"
            value={contactMessage}
            onChangeText={setContactMessage}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            outlineColor={Theme.colors.border}
            activeOutlineColor={Theme.colors.secondary}
          />
          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setShowContactDialog(false)}
              style={styles.modalButton}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSendContactRequest}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.modalButton}
              buttonColor={Theme.colors.secondary}
              textColor={Theme.colors.primaryDark}>
              Send
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Photo Request Modal */}
      <Portal>
        <Modal
          visible={showPhotoRequestDialog}
          onDismiss={() => setShowPhotoRequestDialog(false)}
          contentContainerStyle={styles.modalContainer}>
          <Text variant="titleLarge" style={styles.modalTitle}>
            Request Photo Access
          </Text>
          <Text variant="bodyMedium" style={styles.modalSubtitle}>
            Request to view {profile.firstName}'s private photos
          </Text>
          <TextInput
            label="Message (Optional)"
            value={photoRequestMessage}
            onChangeText={setPhotoRequestMessage}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            placeholder="Why would you like to view the photos?"
            outlineColor={Theme.colors.border}
            activeOutlineColor={Theme.colors.secondary}
          />
          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setShowPhotoRequestDialog(false)}
              style={styles.modalButton}
              textColor={Theme.colors.text}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSendPhotoRequest}
              loading={isSendingPhotoRequest}
              disabled={isSendingPhotoRequest}
              style={styles.modalButton}
              buttonColor={Theme.colors.secondary}
              textColor={Theme.colors.primaryDark}>
              Send Request
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Report Profile Dialog */}
      <ReportProfileDialog
        visible={showReportDialog}
        onDismiss={() => setShowReportDialog(false)}
        onSubmit={handleReport}
        isSubmitting={isReporting}
      />
    </View>
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
    marginBottom: 24,
    textAlign: 'center',
    color: Theme.colors.text,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    paddingTop: 40,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryPhotoContainer: {
    position: 'relative',
    width: '100%',
    height: width,
  },
  primaryPhoto: {
    width: '100%',
    height: '100%',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: Theme.colors.white,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...Theme.shadows.md,
  },
  verifiedText: {
    color: Theme.colors.success,
    fontWeight: 'bold',
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
  scoreBadge: {
    backgroundColor: Theme.colors.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  scoreText: {
    color: Theme.colors.white,
    fontWeight: 'bold',
  },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  matchItem: {
    flex: 1,
    alignItems: 'center',
  },
  matchLabel: {
    color: Theme.colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  matchValue: {
    color: Theme.colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  verticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: Theme.colors.border,
  },
  highlightsContainer: {
    marginTop: 12,
    gap: 8,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  highlightText: {
    color: Theme.colors.text,
    fontSize: 14,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  name: {
    fontWeight: 'bold',
    color: Theme.colors.text,
    flex: 1,
  },
  altName: {
    color: Theme.colors.textSecondary,
    marginTop: 2,
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
  basicInfo: {
    gap: 8,
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
  bottomPadding: {
    height: 100,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: Theme.colors.white,
    ...Theme.shadows.lg,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
  },
  modalContainer: {
    backgroundColor: Theme.colors.white,
    padding: 24,
    margin: 20,
    borderRadius: 16,
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: Theme.colors.text,
  },
  modalSubtitle: {
    color: Theme.colors.textSecondary,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
  },
});

export default ProfileDetailsScreen;
