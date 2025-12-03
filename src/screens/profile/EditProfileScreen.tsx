import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
} from 'react-native';
import {
  Text,
  Surface,
  useTheme,
  ActivityIndicator,
  List,
  IconButton,
  Divider,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ProfileStackParamList } from '../../navigation/types';
import { Theme } from '../../constants/theme';
import { useProfileStore } from '../../store/profileStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useToast } from '../../providers/ToastProvider';

// Import step components
import BasicInfoStep from '../../components/profile/BasicInfoStep';
import LocationStep from '../../components/profile/LocationStep';
import ReligionStep from '../../components/profile/ReligionStep';
import EducationStep from '../../components/profile/EducationStep';
import AboutStep from '../../components/profile/AboutStep';
import PhotosStep from '../../components/profile/PhotosStep';

type EditProfileScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'EditProfile'
>;

type EditProfileScreenRouteProp = RouteProp<ProfileStackParamList, 'EditProfile'>;

type Props = {
  navigation: EditProfileScreenNavigationProp;
  route: EditProfileScreenRouteProp;
};

const SECTIONS = [
  { id: 'basic', title: 'Basic Information', icon: 'account', component: BasicInfoStep },
  { id: 'location', title: 'Location Details', icon: 'map-marker', component: LocationStep },
  { id: 'religion', title: 'Religion & Community', icon: 'book-cross', component: ReligionStep },
  { id: 'education', title: 'Education & Career', icon: 'school', component: EducationStep },
  { id: 'about', title: 'About Me', icon: 'text-box', component: AboutStep },
  { id: 'photos', title: 'Photos', icon: 'image-multiple', component: PhotosStep },
];

const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const toast = useToast();
  const { profile, fetchProfile, updateProfile } = useProfileStore();
  const { updateOnboardingData } = useOnboardingStore();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadProfileData();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (selectedSection) {
        setSelectedSection(null);
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [selectedSection]);

  const loadProfileData = async () => {
    setIsLoading(true);
    try {
      await fetchProfile();
      if (profile) {
        // Populate onboarding store with profile data
        updateOnboardingData('firstName', profile.firstName || '');
        updateOnboardingData('lastName', profile.lastName || '');
        updateOnboardingData('firstNameHi', profile.nameHi || '');
        updateOnboardingData('firstNameCg', profile.nameCg || '');
        // Note: We don't have separate last names for languages in profile type yet, 
        // assuming they are handled or we need to split nameHi/nameCg if needed.
        // For now, let's just map what we can.

        updateOnboardingData('dateOfBirth', profile.dateOfBirth || '');
        updateOnboardingData('gender', profile.gender || '');
        updateOnboardingData('height', profile.height || undefined);
        updateOnboardingData('state', profile.state || '');
        updateOnboardingData('city', profile.city || '');
        updateOnboardingData('nativeDistrict', profile.nativeDistrict || '');
        updateOnboardingData('nativeTehsil', profile.nativeTehsil || '');
        updateOnboardingData('nativeVillage', profile.nativeVillage || '');
        updateOnboardingData('religion', profile.religion || '');
        updateOnboardingData('caste', profile.caste || '');
        updateOnboardingData('subCaste', profile.subCaste || '');
        updateOnboardingData('gothram', profile.gothram || '');
        updateOnboardingData('maritalStatus', profile.maritalStatus || '');
        updateOnboardingData('motherTongue', profile.motherTongue || '');
        updateOnboardingData('education', profile.education || '');
        updateOnboardingData('occupation', profile.occupation || '');
        updateOnboardingData('annualIncome', profile.annualIncome || '');
        updateOnboardingData('bio', profile.bio || '');
        updateOnboardingData('hobbies', profile.hobbies || '');
        updateOnboardingData('photos', profile.media?.map((m: any) => m.url) || []);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSectionSave = async () => {
    setIsSubmitting(true);
    try {
      const onboardingData = useOnboardingStore.getState();

      // Transform onboarding data to API format
      const updateData: any = {
        firstName: onboardingData.firstName,
        lastName: onboardingData.lastName,
        nameHi: onboardingData.firstNameHi, // Assuming simple mapping for now
        nameCg: onboardingData.firstNameCg,
        dateOfBirth: onboardingData.dateOfBirth,
        gender: onboardingData.gender,
        height: onboardingData.height,
        state: onboardingData.state,
        city: onboardingData.city,
        nativeDistrict: onboardingData.nativeDistrict,
        nativeTehsil: onboardingData.nativeTehsil,
        nativeVillage: onboardingData.nativeVillage,
        religion: onboardingData.religion,
        caste: onboardingData.caste,
        subCaste: onboardingData.subCaste,
        gothram: onboardingData.gothram,
        maritalStatus: onboardingData.maritalStatus,
        motherTongue: onboardingData.motherTongue,
        education: onboardingData.education,
        occupation: onboardingData.occupation,
        annualIncome: onboardingData.annualIncome,
        bio: onboardingData.bio,
        hobbies: onboardingData.hobbies,
      };

      // Remove undefined values and empty strings for optional fields
      Object.keys(updateData).forEach(key => {
        const value = updateData[key];
        if (value === undefined) {
          delete updateData[key];
        } else if (typeof value === 'string' && value.trim() === '') {
          // List of optional fields that should not be sent if empty
          const optionalFields = [
            'nameHi', 'nameCg', 'subCaste', 'gothram',
            'nativeDistrict', 'nativeTehsil', 'nativeVillage',
            'bio', 'hobbies', 'education', 'occupation', 'annualIncome'
          ];

          if (optionalFields.includes(key)) {
            delete updateData[key];
          }
        }
      });

      await updateProfile(updateData);
      await fetchProfile(); // Refresh local data
      toast.success('Profile updated successfully');
      setSelectedSection(null); // Go back to list
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // Render selected section
  if (selectedSection) {
    const section = SECTIONS.find(s => s.id === selectedSection);
    if (!section) return null;

    const StepComponent = section.component;

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Surface style={styles.header} elevation={2}>
          <View style={styles.headerRow}>
            <IconButton icon="arrow-left" onPress={() => setSelectedSection(null)} />
            <Text variant="titleLarge" style={styles.headerTitle}>
              {section.title}
            </Text>
          </View>
        </Surface>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled">
          <StepComponent
            onNext={handleSectionSave}
            onBack={() => setSelectedSection(null)}
            submitLabel="Save Changes"
            isSubmitting={isSubmitting}
            // @ts-ignore - Some steps might not have all props yet, we will fix them
            onSubmit={handleSectionSave}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Render Section List
  return (
    <View style={styles.container}>
      <Surface style={styles.header} elevation={2}>
        <View style={styles.headerRow}>
          <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          <Text variant="titleLarge" style={styles.headerTitle}>
            Edit Profile
          </Text>
        </View>
      </Surface>

      <ScrollView style={styles.content}>
        <Surface style={styles.listSurface} elevation={1}>
          {SECTIONS.map((section, index) => (
            <React.Fragment key={section.id}>
              <List.Item
                title={section.title}
                left={props => <List.Icon {...props} icon={section.icon} color={Theme.colors.primary} />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => setSelectedSection(section.id)}
                style={styles.listItem}
              />
              {index < SECTIONS.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Surface>
      </ScrollView>
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
  header: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: Theme.colors.surfaceCard,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  listSurface: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: Theme.colors.surfaceCard,
    overflow: 'hidden',
  },
  listItem: {
    paddingVertical: 12,
  },
});

export default EditProfileScreen;
