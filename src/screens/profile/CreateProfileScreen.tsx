import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Surface,
  useTheme,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { ProfileFormData } from '../../types/profileForm';
import profileService from '../../services/profile.service';
import { useProfileStore } from '../../store/profileStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import { autoFillCompleteProfile } from '../../utils/autoFillProfile';
import { Theme } from '../../constants/theme';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import step components
import BasicInfoStep from '../../components/profile/BasicInfoStep';
import LocationStep from '../../components/profile/LocationStep';
import ReligionStep from '../../components/profile/ReligionStep';
import PhysicalLifestyleStep from '../../components/profile/PhysicalLifestyleStep';
import EducationStep from '../../components/profile/EducationStep';
import FamilyDetailsStep from '../../components/profile/FamilyDetailsStep';
import AboutStep from '../../components/profile/AboutStep';
import HoroscopeStep from '../../components/profile/HoroscopeStep';
import PhotosStep from '../../components/profile/PhotosStep';
import ProgressStepper from '../../components/common/ProgressStepper';

type CreateProfileScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'CreateProfile'
>;

type Props = {
  navigation: CreateProfileScreenNavigationProp;
};

const CreateProfileScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { fetchProfile } = useProfileStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get data from store for submission
  const onboardingData = useOnboardingStore(state => state);
  const resetOnboardingState = useOnboardingStore(state => state.resetOnboardingState);
  const religion = useOnboardingStore(state => state.religion);

  // Dynamic total steps: 8 base steps + 1 horoscope step if Hindu
  const TOTAL_STEPS = religion === 'HINDU' ? 9 : 8;

  const progress = currentStep / TOTAL_STEPS;

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAutoFill = () => {
    try {
      autoFillCompleteProfile();
      Alert.alert('Success', 'Profile filled with test data! You can now navigate through the steps.');
    } catch (error) {
      Alert.alert('Error', 'Failed to auto-fill profile');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log('Creating profile...');

      // Transform form data to match API requirements
      const profilePayload: any = {
        firstName: onboardingData.firstName,
        lastName: onboardingData.lastName,
        dateOfBirth: onboardingData.dateOfBirth ? new Date(onboardingData.dateOfBirth).toISOString() : undefined,
        gender: onboardingData.gender,
        bio: onboardingData.bio,
        city: onboardingData.city,
        state: onboardingData.state,
        country: onboardingData.country || 'India',
        nativeDistrict: onboardingData.nativeDistrict,
        nativeTehsil: onboardingData.nativeTehsil,
        nativeVillage: onboardingData.nativeVillage,
        speaksChhattisgarhi: onboardingData.speaksChhattisgarhi ?? false,
        religion: onboardingData.religion,
        caste: onboardingData.caste,
        subCaste: onboardingData.subCaste,
        gothram: onboardingData.gothram,
        height: onboardingData.height,
        weight: onboardingData.weight,
        bloodGroup: onboardingData.bloodGroup,
        complexion: onboardingData.complexion,
        bodyType: onboardingData.bodyType,
        diet: onboardingData.diet,
        smokingHabit: onboardingData.smokingHabit,
        drinkingHabit: onboardingData.drinkingHabit,
        maritalStatus: onboardingData.maritalStatus,
        motherTongue: onboardingData.motherTongue || 'HINDI',
        fatherName: onboardingData.fatherName,
        fatherOccupation: onboardingData.fatherOccupation,
        motherName: onboardingData.motherName,
        motherOccupation: onboardingData.motherOccupation,
        numberOfBrothers: onboardingData.numberOfBrothers,
        numberOfSisters: onboardingData.numberOfSisters,
        familyType: onboardingData.familyType,
        familyStatus: onboardingData.familyStatus,
        hobbies: onboardingData.hobbies,
        partnerExpectations: onboardingData.partnerExpectations,
        manglik: onboardingData.manglik,
        birthTime: onboardingData.birthTime,
        birthPlace: onboardingData.birthPlace,
        rashi: onboardingData.rashi,
        nakshatra: onboardingData.nakshatra,
      };

      // Validate required fields
      const requiredFields = {
        firstName: onboardingData.firstName,
        lastName: onboardingData.lastName,
        dateOfBirth: onboardingData.dateOfBirth,
        gender: onboardingData.gender,
        maritalStatus: onboardingData.maritalStatus,
        religion: onboardingData.religion,
        state: onboardingData.state,
        city: onboardingData.city,
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value || value === '')
        .map(([key]) => key);

      if (missingFields.length > 0) {
        Alert.alert(
          'Incomplete Profile',
          `Please complete all required fields:\n${missingFields.map(f => `• ${f.replace(/([A-Z])/g, ' $1').trim()}`).join('\n')}`,
          [{ text: 'OK' }]
        );
        setIsSubmitting(false);
        return;
      }

      // Remove undefined, null, and empty string values
      const cleanedProfileData = Object.entries(profilePayload).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      console.log('Cleaned profile data:', JSON.stringify(cleanedProfileData, null, 2));
      const profileResponse = await profileService.createProfile(cleanedProfileData);
      console.log('Profile created:', profileResponse);

      // Upload Photos
      if (onboardingData.photos && onboardingData.photos.length > 0) {
        console.log('Uploading photos...');
        try {
          for (const photoUri of onboardingData.photos) {
            await profileService.uploadProfilePhoto(photoUri);
          }
          console.log('Photos uploaded');
        } catch (photoError) {
          console.error('Error uploading photos:', photoError);
        }
      }

      Alert.alert('Success', 'Profile created successfully!');
      await fetchProfile();
      resetOnboardingState();
      navigation.navigate('PhoneVerification');

    } catch (error: any) {
      console.error('Profile creation failed:', error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessage = Array.isArray(errors)
          ? errors.map((e: any) => e.message || e.msg).join('\n')
          : 'Validation failed';
        Alert.alert('Validation Error', errorMessage);
      } else {
        Alert.alert('Error', error.message || 'Failed to create profile. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep onNext={handleNext} />;
      case 2:
        return <LocationStep onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <ReligionStep onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <PhysicalLifestyleStep onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <EducationStep onNext={handleNext} onBack={handleBack} />;
      case 6:
        return <FamilyDetailsStep onNext={handleNext} onBack={handleBack} />;
      case 7:
        return <AboutStep onNext={handleNext} onBack={handleBack} />;
      case 8:
        if (religion === 'HINDU') {
          return <HoroscopeStep onNext={handleNext} onBack={handleBack} />;
        } else {
          return (
            <PhotosStep
              onSubmit={handleSubmit}
              onBack={handleBack}
              isSubmitting={isSubmitting}
            />
          );
        }
      case 9:
        return (
          <PhotosStep
            onSubmit={handleSubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Basic Information';
      case 2:
        return 'Location Details';
      case 3:
        return 'Religion & Community';
      case 4:
        return 'Physical & Lifestyle';
      case 5:
        return 'Education & Career';
      case 6:
        return 'Family Details';
      case 7:
        return 'About & Hobbies';
      case 8:
        return religion === 'HINDU' ? 'Horoscope Details' : 'Add Photos';
      case 9:
        return 'Add Photos';
      default:
        return '';
    }
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case 1: return 'account-circle';
      case 2: return 'map-marker';
      case 3: return 'hands-pray';
      case 4: return 'human';
      case 5: return 'school';
      case 6: return 'account-group';
      case 7: return 'text-box';
      case 8: return religion === 'HINDU' ? 'star-circle' : 'camera';
      case 9: return 'camera';
      default: return 'check';
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

      {/* Premium Header */}
      <LinearGradient
        colors={['#FFFFFF', '#FFF5F7']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          {/* Step Icon */}
          <View style={styles.stepIconContainer}>
            <LinearGradient
              colors={[Theme.colors.primary, '#FF1744']}
              style={styles.stepIconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name={getStepIcon()} size={32} color="#fff" />
            </LinearGradient>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text style={styles.headerTitle}>Create Your Profile</Text>
              <TouchableOpacity
                style={styles.autoFillButton}
                onPress={handleAutoFill}
                activeOpacity={0.7}
              >
                <Icon name="auto-fix" size={18} color={Theme.colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.stepIndicator}>
              Step {currentStep} of {TOTAL_STEPS} • {getStepTitle()}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <LinearGradient
              colors={[Theme.colors.primary, '#FF1744']}
              style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progress * 100)}% Complete</Text>
        </View>

        {/* Stepper */}
        <ProgressStepper
          steps={[
            'Basic',
            'Location',
            'Religion',
            'Physical',
            'Education',
            'Family',
            'About',
            religion === 'HINDU' ? 'Horoscope' : 'Photos',
            religion === 'HINDU' ? 'Photos' : '',
          ].filter(Boolean)}
          currentStep={currentStep}
          onStepPress={(step) => {
            if (step < currentStep) {
              setCurrentStep(step);
            }
          }}
        />
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {renderStep()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  stepIconContainer: {
    marginRight: 16,
  },
  stepIconGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  titleSection: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Theme.colors.text,
    letterSpacing: 0.3,
  },
  autoFillButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndicator: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    fontWeight: '500',
  },
  progressBarContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    fontWeight: '600',
    textAlign: 'right',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
});

export default CreateProfileScreen;
