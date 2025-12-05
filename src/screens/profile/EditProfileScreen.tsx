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
  ActivityIndicator,
  List,
  IconButton,
  Divider,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ProfileStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { useProfileStore } from '../../store/profileStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useToast } from '../../providers/ToastProvider';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native';

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



const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const toast = useToast();
  const { profile, fetchProfile, updateProfile } = useProfileStore();
  const { updateOnboardingData } = useOnboardingStore();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const SECTIONS = [
    { id: 'basic', title: 'Basic Information', icon: 'account', color: theme.colors.primary },
    { id: 'location', title: 'Location Details', icon: 'map-marker', color: theme.colors.success },
    { id: 'religion', title: 'Religion & Community', icon: 'book-cross', color: theme.colors.secondary },
    { id: 'education', title: 'Education & Career', icon: 'school', color: '#2196F3' },
    { id: 'about', title: 'About Me', icon: 'text-box', color: theme.colors.primary },
    { id: 'photos', title: 'Photos', icon: 'image-multiple', color: '#9C27B0' },
  ];

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

    // Get component based on section id
    const componentMap: { [key: string]: any } = {
      basic: BasicInfoStep,
      location: LocationStep,
      religion: ReligionStep,
      education: EducationStep,
      about: AboutStep,
      photos: PhotosStep,
    };
    const StepComponent = componentMap[section.id];

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => setSelectedSection(null)} style={styles.backButton}>
              <Icon name="arrow-left" size={24} color={theme.colors.white} />
            </TouchableOpacity>
            <Text variant="titleLarge" style={styles.headerTitleWhite}>
              {section.title}
            </Text>
          </View>
        </LinearGradient>

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
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={theme.colors.white} />
          </TouchableOpacity>
          <Text variant="titleLarge" style={styles.headerTitleWhite}>
            Edit Profile
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <Surface style={styles.listSurface} elevation={2}>
          {SECTIONS.map((section, index) => (
            <React.Fragment key={section.id}>
              <TouchableOpacity
                style={styles.sectionItem}
                onPress={() => setSelectedSection(section.id)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[section.color, section.color + '80']}
                  style={styles.sectionIconGradient}
                >
                  <Icon name={section.icon} size={20} color={theme.colors.white} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Icon name="chevron-right" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              {index < SECTIONS.length - 1 && <Divider style={styles.divider} />}
            </React.Fragment>
          ))}
        </Surface>
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 16,
    color: theme.colors.textSecondary,
  },
  header: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: theme.colors.surfaceCard,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
    color: theme.colors.text,
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
    backgroundColor: theme.colors.surfaceCard,
    overflow: 'hidden',
  },
  listItem: {
    paddingVertical: 12,
  },
  headerGradient: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitleWhite: {
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  sectionIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  divider: {
    marginLeft: 72,
  },
});

export default EditProfileScreen;
