/**
 * Profile Details Screen - Complete with Advanced Features
 * Photo Gallery, Report/Block, Share, Similar Profiles, Caching, Kundli, Photo Privacy
 * (Video Call removed as per user request)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  Share,
  Alert,
  TextInput as RNTextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text, ActivityIndicator } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';
import { ProfileStackParamList, HomeStackParamList, ActivityStackParamList } from '../../navigation/types';
import { Profile, ReportType } from '../../types';
import profileService from '../../services/profile.service';
import shortlistService from '../../services/shortlist.service';
import matchService from '../../services/match.service';
import profileViewService from '../../services/profileView.service';
import blockService from '../../services/block.service';
import reportService from '../../services/report.service';
import photoRequestService from '../../services/photoRequest.service';
import profileCacheService from '../../services/profileCache.service';
import { useProfileStore } from '../../store/profileStore';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../context/ToastContext';

// Components
import PhotoCarousel from '../../components/profile/PhotoCarousel';
import SimilarProfiles from '../../components/profile/SimilarProfiles';
import KundliMatch from '../../components/profile/KundliMatch';

type ProfileDetailsScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList & HomeStackParamList & ActivityStackParamList,
  'ProfileDetails'
>;

type Props = {
  navigation: ProfileDetailsScreenNavigationProp;
  route: any;
};

const { width, height } = Dimensions.get('window');

const ProfileDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { userId } = route.params;
  const { showToast } = useToast();
  const { profile: myProfile } = useProfileStore();
  const { user: currentUser } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const [isLoadingInterest, setIsLoadingInterest] = useState(false);
  const [canChat, setCanChat] = useState(false);
  const [interestSent, setInterestSent] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumAction, setPremiumAction] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [similarProfiles, setSimilarProfiles] = useState<any[]>([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);

  const isPremium = myProfile?.isPremium || currentUser?.subscription?.status === 'ACTIVE';

  useEffect(() => {
    if (userId) {
      loadProfile();
      checkShortlistStatus();
      checkChatPermission();
      logProfileView();
      loadSimilarProfiles();
    }
  }, [userId]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);

      // Try cache first
      const cachedProfile = await profileCacheService.getCachedProfile(userId);
      if (cachedProfile) {
        setProfile(cachedProfile);
        setIsLoading(false);
      }

      // Fetch fresh data
      const data = await profileService.getProfileByUserId(userId);
      setProfile(data);

      // Cache the profile
      await profileCacheService.cacheProfile(data);
    } catch (error: any) {
      if (!profile) {
        showToast('Failed to load profile');
        navigation.goBack();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logProfileView = async () => {
    try {
      await profileViewService.logView(userId);
    } catch (error) {
      console.log('Could not log profile view');
    }
  };

  const loadSimilarProfiles = async () => {
    try {
      setIsLoadingSimilar(true);
      const response = await profileService.searchProfiles({ limit: 6 });
      const profiles = response.profiles || [];
      setSimilarProfiles(profiles.filter((p: any) => p.userId !== userId).slice(0, 5));
    } catch (error) {
      console.log('Could not load similar profiles');
    } finally {
      setIsLoadingSimilar(false);
    }
  };

  const checkShortlistStatus = async () => {
    try {
      const response = await shortlistService.getShortlist();
      const shortlists = response.results || [];
      setIsShortlisted(shortlists.some((s: any) => s.shortlistedUserId === userId));
    } catch (error) { }
  };

  const checkChatPermission = async () => {
    try {
      const matches = await matchService.getAcceptedMatches();
      setCanChat(matches.matches.some((m: any) => m.senderId === userId || m.receiverId === userId));
    } catch (error) { }
  };

  const showPremiumPopup = (action: string) => {
    setPremiumAction(action);
    setShowPremiumModal(true);
  };

  const handleShare = async () => {
    try {
      const shareUrl = `https://chhattisgarhshaadi.com/profile/${userId}`;
      await Share.share({
        message: `Check out ${profile?.firstName}'s profile on Chhattisgarh Shaadi!\n${shareUrl}`,
        title: `${profile?.firstName}'s Profile`,
        url: shareUrl,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const handleShortlist = async () => {
    if (!isPremium) { showPremiumPopup('shortlist profiles'); return; }
    const previousState = isShortlisted;
    setIsShortlisted(!isShortlisted);
    showToast(isShortlisted ? 'Removed from shortlist' : 'Added to shortlist');
    try {
      if (previousState) await shortlistService.removeFromShortlist(userId);
      else await shortlistService.addToShortlist(userId);
    } catch (error: any) {
      setIsShortlisted(previousState);
      if (error.response?.status === 403) showPremiumPopup('shortlist profiles');
      else showToast('Failed to update shortlist');
    }
  };

  const handleInterest = async () => {
    if (!isPremium) { showPremiumPopup('send interest requests'); return; }
    if (isLoadingInterest || interestSent) return;
    setInterestSent(true);
    showToast('Interest sent!');
    try {
      setIsLoadingInterest(true);
      await matchService.sendMatchRequest(userId, 'Interested in your profile');
    } catch (error: any) {
      setInterestSent(false);
      if (error.response?.status === 403) showPremiumPopup('send interest requests');
      else if (error.response?.status === 409) setInterestSent(true);
      else showToast('Failed to send interest');
    } finally {
      setIsLoadingInterest(false);
    }
  };

  const handleChat = () => {
    if (!isPremium) { showPremiumPopup('start conversations'); return; }
    if (!canChat) { showToast('You need to match first'); return; }
    navigation.navigate('ChatScreen' as any, { userId, userName: profile?.firstName || 'User' });
  };

  const handleBlock = async () => {
    setShowMenu(false);
    Alert.alert('Block User', `Block ${profile?.firstName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Block',
        style: 'destructive',
        onPress: async () => {
          try {
            await blockService.blockUser(userId, 'Blocked from profile');
            showToast(`${profile?.firstName} blocked`);
            navigation.goBack();
          } catch (error: any) {
            showToast(error.response?.data?.message || 'Failed to block');
          }
        },
      },
    ]);
  };

  const handleReport = async () => {
    if (!reportReason.trim()) { Alert.alert('Error', 'Please provide a reason'); return; }
    try {
      setIsReporting(true);
      await reportService.reportUser({ reportedUserId: userId, reason: reportReason, reportType: ReportType.PROFILE });
      setShowReportModal(false);
      setReportReason('');
      showToast('Report submitted');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to report');
    } finally {
      setIsReporting(false);
    }
  };

  const handlePhotoRequest = async () => {
    if (!isPremium) { showPremiumPopup('request photo access'); return; }
    try {
      await photoRequestService.sendRequest(userId);
      showToast('Photo request sent!');
    } catch (error: any) {
      if (error.response?.status === 409) showToast('Request already sent');
      else showToast('Failed to send request');
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const formatHeight = (cm: number) => {
    const ft = Math.floor(cm / 2.54 / 12);
    const inch = Math.round((cm / 2.54) % 12);
    return `${ft}' ${inch}" (${cm} cm)`;
  };

  // Modals
  const renderMenuModal = () => (
    <Modal visible={showMenu} transparent animationType="fade" onRequestClose={() => setShowMenu(false)}>
      <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => setShowMenu(false)}>
        <View style={styles.menuContent}>
          <TouchableOpacity style={styles.menuItem} onPress={handleShare}>
            <Icon name="share-variant" size={22} color="#666" />
            <Text style={styles.menuItemText}>Share Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); setShowReportModal(true); }}>
            <Icon name="flag-outline" size={22} color="#666" />
            <Text style={styles.menuItemText}>Report User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, styles.menuItemDanger]} onPress={handleBlock}>
            <Icon name="block-helper" size={22} color="#FF3B30" />
            <Text style={styles.menuItemTextDanger}>Block User</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderReportModal = () => (
    <Modal visible={showReportModal} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.reportContent}>
          <Text style={styles.reportTitle}>Report {profile?.firstName}</Text>
          <Text style={styles.reportSubtitle}>Tell us why you're reporting this user</Text>
          <RNTextInput
            style={styles.reportInput}
            placeholder="Describe the issue..."
            placeholderTextColor="#999"
            value={reportReason}
            onChangeText={setReportReason}
            multiline
          />
          <View style={styles.reportActions}>
            <TouchableOpacity style={styles.reportCancel} onPress={() => setShowReportModal(false)}>
              <Text style={styles.reportCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportSubmit} onPress={handleReport} disabled={isReporting}>
              {isReporting ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.reportSubmitText}>Submit</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderPremiumModal = () => (
    <Modal visible={showPremiumModal} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.premiumContent}>
          <LinearGradient colors={[Theme.colors.primary, '#FF1744']} style={styles.premiumIcon}>
            <Icon name="crown" size={36} color="#fff" />
          </LinearGradient>
          <Text style={styles.premiumTitle}>Premium Required</Text>
          <Text style={styles.premiumSubtitle}>Upgrade to {premiumAction} and unlock all features!</Text>
          <View style={styles.premiumFeatures}>
            <View style={styles.premiumFeatureRow}>
              <Icon name="check-circle" size={18} color="#4CAF50" />
              <Text style={styles.premiumFeatureText}>Unlimited Interest Requests</Text>
            </View>
            <View style={styles.premiumFeatureRow}>
              <Icon name="check-circle" size={18} color="#4CAF50" />
              <Text style={styles.premiumFeatureText}>View Contact Details</Text>
            </View>
            <View style={styles.premiumFeatureRow}>
              <Icon name="check-circle" size={18} color="#4CAF50" />
              <Text style={styles.premiumFeatureText}>Kundli Compatibility</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.premiumButton} onPress={() => { setShowPremiumModal(false); navigation.navigate('Subscription' as any); }}>
            <LinearGradient colors={[Theme.colors.primary, '#FF1744']} style={styles.premiumGradient}>
              <Text style={styles.premiumButtonText}>View Plans</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowPremiumModal(false)}>
            <Text style={styles.premiumLater}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (isLoading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={Theme.colors.primary} /></View>;
  }

  if (!profile) return null;

  const age = calculateAge(profile.dateOfBirth);
  const photos = (profile.media || []).map((m: any, i: number) => ({ id: m.id || i, url: m.url, isPrivate: m.isPrivate }));

  return (
    <View style={styles.container}>
      {renderMenuModal()}
      {renderReportModal()}
      {renderPremiumModal()}

      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{profile.firstName} {profile.lastName}</Text>
        <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.menuButton}>
          <Icon name="dots-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Photo Carousel */}
        <PhotoCarousel photos={photos} onRequestPhoto={handlePhotoRequest} showPrivateRequest={isPremium} />

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.profileName}>{profile.firstName} {profile.lastName?.charAt(0)}., {age}</Text>
            {profile.isVerified && <Icon name="check-decagram" size={20} color="#4285F4" />}
          </View>
          <View style={styles.locationRow}>
            <Icon name="map-marker" size={16} color="#666" />
            <Text style={styles.locationText}>{profile.city}, {profile.state}</Text>
          </View>
        </View>

        {/* Quick Share Button */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Icon name="share-variant" size={20} color={Theme.colors.primary} />
            <Text style={styles.shareButtonText}>Share Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Kundli Matching */}
        <KundliMatch
          matchScore={isPremium ? 24 : undefined}
          isPremium={isPremium}
          onUpgrade={() => showPremiumPopup('view kundli matching')}
          onViewDetails={() => showToast('Full report coming soon')}
        />

        {/* About */}
        {profile.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About {profile.firstName}</Text>
            <Text style={styles.bioText} numberOfLines={showFullBio ? undefined : 4}>{profile.bio}</Text>
            {profile.bio.length > 150 && (
              <TouchableOpacity onPress={() => setShowFullBio(!showFullBio)}>
                <Text style={styles.readMore}>{showFullBio ? 'Read Less' : 'Read More'}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.infoGrid}>
            <InfoItem icon="human-male-height" label="Height" value={profile.height ? formatHeight(profile.height) : '-'} />
            <InfoItem icon="ring" label="Marital Status" value={profile.maritalStatus || '-'} />
            <InfoItem icon="translate" label="Mother Tongue" value={profile.motherTongue || '-'} />
            <InfoItem icon="hands-pray" label="Religion" value={profile.religion || '-'} />
            <InfoItem icon="account-group" label="Caste" value={profile.caste || '-'} />
            <InfoItem icon="star-david" label="Sub-caste" value={profile.subCaste || '-'} />
          </View>
        </View>

        {/* Education & Career */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education & Career</Text>
          <View style={styles.infoGrid}>
            <InfoItem icon="school" label="Education" value={profile.education || '-'} />
            <InfoItem icon="briefcase" label="Occupation" value={profile.occupation || '-'} />
            <InfoItem icon="currency-inr" label="Annual Income" value={profile.annualIncome || '-'} />
          </View>
        </View>

        {/* Location Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Details</Text>
          <View style={styles.infoGrid}>
            <InfoItem icon="city" label="City" value={profile.city || '-'} />
            <InfoItem icon="map" label="State" value={profile.state || '-'} />
            <InfoItem icon="home-map-marker" label="Native District" value={profile.nativeDistrict || '-'} />
            <InfoItem icon="village" label="Native Village" value={profile.nativeVillage || '-'} />
          </View>
        </View>

        {/* Similar Profiles */}
        <SimilarProfiles
          profiles={similarProfiles.map(p => ({
            id: p.id,
            userId: p.userId,
            firstName: p.firstName,
            lastName: p.lastName,
            age: calculateAge(p.dateOfBirth),
            city: p.city,
            profilePicture: p.media?.[0]?.url,
            isVerified: p.isVerified,
          }))}
          isLoading={isLoadingSimilar}
          onProfilePress={(id) => navigation.push('ProfileDetails', { userId: id })}
          onSeeAll={() => navigation.navigate('Home' as any)}
        />

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.actionButton} onPress={handleInterest} disabled={isLoadingInterest}>
          <View style={[styles.actionCircle, interestSent ? styles.sentCircle : styles.primaryCircle]}>
            {isLoadingInterest ? <ActivityIndicator size="small" color="#fff" /> : <Icon name={interestSent ? "check" : "heart-plus"} size={24} color="#fff" />}
          </View>
          <Text style={styles.actionLabel}>{interestSent ? 'Sent' : 'Interest'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShortlist}>
          <View style={[styles.actionCircle, styles.outlinedCircle]}>
            <Icon name={isShortlisted ? "star" : "star-outline"} size={24} color={isShortlisted ? "#FFD700" : "#666"} />
          </View>
          <Text style={styles.actionLabel}>Shortlist</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleChat}>
          <View style={[styles.actionCircle, styles.outlinedCircle]}>
            <Icon name="message-text" size={24} color={canChat ? Theme.colors.primary : "#666"} />
          </View>
          <Text style={styles.actionLabel}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handlePhotoRequest}>
          <View style={[styles.actionCircle, styles.outlinedCircle]}>
            <Icon name="image-lock" size={24} color="#666" />
          </View>
          <Text style={styles.actionLabel}>Photos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const InfoItem: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    <Icon name={icon} size={18} color={Theme.colors.primary} />
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#333', flex: 1, textAlign: 'center', marginHorizontal: 16 },
  menuButton: { padding: 4 },
  profileInfo: { padding: 20, paddingTop: 16 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  profileName: { fontSize: 24, fontWeight: '700', color: '#333' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  locationText: { fontSize: 14, color: '#666' },
  quickActions: { paddingHorizontal: 20, marginBottom: 8 },
  shareButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, backgroundColor: '#FFF0F5', borderRadius: 12 },
  shareButtonText: { fontSize: 14, fontWeight: '600', color: Theme.colors.primary },
  section: { padding: 20, borderTopWidth: 8, borderTopColor: '#F5F5F5' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 16 },
  bioText: { fontSize: 15, color: '#555', lineHeight: 22 },
  readMore: { fontSize: 14, color: Theme.colors.primary, fontWeight: '600', marginTop: 8 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  infoItem: { width: '50%', flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, gap: 12 },
  infoLabel: { fontSize: 12, color: '#888', marginBottom: 2 },
  infoValue: { fontSize: 14, color: '#333', fontWeight: '500' },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F0F0F0', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  actionButton: { alignItems: 'center', flex: 1 },
  actionCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  primaryCircle: { backgroundColor: Theme.colors.primary },
  sentCircle: { backgroundColor: '#4CAF50' },
  outlinedCircle: { backgroundColor: '#F5F5F5', borderWidth: 1.5, borderColor: '#E0E0E0' },
  actionLabel: { color: '#666', fontSize: 11, fontWeight: '500' },
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: 80, paddingRight: 16 },
  menuContent: { backgroundColor: '#fff', borderRadius: 12, paddingVertical: 8, minWidth: 180, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  menuItemDanger: { borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  menuItemText: { fontSize: 15, color: '#333' },
  menuItemTextDanger: { fontSize: 15, color: '#FF3B30' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  reportContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 340 },
  reportTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 4 },
  reportSubtitle: { fontSize: 13, color: '#666', marginBottom: 16 },
  reportInput: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 12, fontSize: 14, color: '#333', minHeight: 100, textAlignVertical: 'top' },
  reportActions: { flexDirection: 'row', marginTop: 16, gap: 12 },
  reportCancel: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8, backgroundColor: '#F5F5F5' },
  reportCancelText: { fontSize: 14, fontWeight: '600', color: '#666' },
  reportSubmit: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8, backgroundColor: Theme.colors.primary },
  reportSubmitText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  premiumContent: { backgroundColor: '#fff', borderRadius: 24, padding: 24, width: '100%', maxWidth: 320, alignItems: 'center' },
  premiumIcon: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  premiumTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 8 },
  premiumSubtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 16 },
  premiumFeatures: { width: '100%', marginBottom: 20 },
  premiumFeatureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  premiumFeatureText: { fontSize: 14, color: '#333' },
  premiumButton: { width: '100%', borderRadius: 24, overflow: 'hidden', marginBottom: 12 },
  premiumGradient: { paddingVertical: 14, alignItems: 'center' },
  premiumButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  premiumLater: { fontSize: 14, color: '#999', paddingVertical: 8 },
});

export default ProfileDetailsScreen;
