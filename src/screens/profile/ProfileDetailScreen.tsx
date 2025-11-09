import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  // Dimensions and ImageBackground are no longer needed here
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { recommendedProfiles, UserProfile } from '../../data/mockData';
import { InfoSection, InfoItem } from '../../components/profile/InfoSection';
import ProfileHeader from '../../components/profile/ProfileHeader'; // <-- Import the new header

// Define navigation and route prop types
type ScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'ProfileDetail'
>;
type ScreenRouteProp = RouteProp<MainStackParamList, 'ProfileDetail'>;

const ProfileDetailScreen = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const route = useRoute<ScreenRouteProp>();

  const { profileId } = route.params;

  // --- Mock Data Fetch ---
  const profile: UserProfile | undefined = recommendedProfiles.find(
    p => p.id === profileId,
  );
  // ---

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Profile not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" />

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        {/* --- REFACTORED: Use ProfileHeader component --- */}
        <ProfileHeader profile={profile} />

        {/* --- Profile Info Sections --- */}

        {/* About Section */}
        <InfoSection title="About Me" icon="👤">
          <Text style={styles.bioText}>{profile.bio}</Text>
        </InfoSection>

        {/* --- FIXED: Added all fields back --- */}

        {/* Basic Info */}
        <InfoSection title="Basic Details" icon="✨">
          <InfoItem label="Marital Status" value={profile.maritalStatus} />
          <InfoItem label="Height" value={profile.height} />
          <InfoItem label="Diet" value={profile.diet} />
        </InfoSection>

        {/* Religious Info */}
        <InfoSection title="Religious Details" icon="🕉️">
          <InfoItem label="Religion" value={profile.religion} />
          <InfoItem label="Caste" value={profile.caste} />
          <InfoItem label="Mother Tongue" value={profile.motherTongue} />
        </InfoSection>

        {/* Education & Career */}
        <InfoSection title="Education & Career" icon="💼">
          <InfoItem label="Education" value={profile.education} />
          <InfoItem label="Profession" value={profile.profession} />
        </InfoSection>

        {/* Family Details */}
        <InfoSection title="Family Details" icon="👨‍👩‍👧‍👦">
          <InfoItem label="Father's Status" value={profile.fatherStatus} />
          <InfoItem label="Mother's Status" value={profile.motherStatus} />
        </InfoSection>

        {/* Bottom Padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* --- Fixed Action Bar --- */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={[styles.actionButton, styles.dislikeButton]}>
          <Text style={styles.actionIcon}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.likeButton]}>
          <Text style={styles.actionIcon}>❤️</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: colors.error,
  },
  scrollView: {
    flex: 1,
  },
  // --- REMOVED headerImage, overlay, name, location (moved to ProfileHeader.tsx) ---
  backButton: {
    position: 'absolute',
    top: 50, // Adjust based on status bar
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  backIcon: {
    fontSize: 24,
    color: colors.neutral.white,
  },
  bioText: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 30, // For safe area
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 20,
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  dislikeButton: {
    backgroundColor: colors.neutral.white,
    borderColor: colors.error,
    borderWidth: 2,
  },
  likeButton: {
    backgroundColor: colors.primary.main,
  },
  actionIcon: {
    fontSize: 32,
  },
});

export default ProfileDetailScreen;