import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  View,
} from 'react-native';
import {
  Text,
  Surface,
  useTheme,
  IconButton,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { ProfileFormData } from '../../types/profileForm';
import profileService from '../../services/profile.service';
import educationService from '../../services/education.service';
import occupationService from '../../services/occupation.service';
import { useProfileStore } from '../../store/profileStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import { autoFillCompleteProfile } from '../../utils/autoFillProfile';
import { Theme } from '../../constants/theme';

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
      // STEP 1: Create Profile
      console.log('Creating profile...');

      // Transform form data to match API requirements
      const profilePayload: any = {
        // Basic Info
        firstName: onboardingData.firstName,
        lastName: onboardingData.lastName,
        // Construct full names for multi-language fields
        nameHi: (onboardingData.firstNameHi || onboardingData.lastNameHi)
          ? `${onboardingData.firstNameHi || ''} ${onboardingData.lastNameHi || ''}`.trim()
          : undefined,
        nameCg: (onboardingData.firstNameCg || onboardingData.lastNameCg)
          ? `${onboardingData.firstNameCg || ''} ${onboardingData.lastNameCg || ''}`.trim()
          : undefined,
        dateOfBirth: onboardingData.dateOfBirth ? new Date(onboardingData.dateOfBirth).toISOString() : undefined,
        gender: onboardingData.gender,
        bio: onboardingData.bio,

        // Location
        city: onboardingData.city,
        state: onboardingData.state, // This is the main state field
        country: 'INDIA',
        nativeDistrict: onboardingData.nativeDistrict,
        nativeTehsil: onboardingData.nativeTehsil,
        nativeVillage: onboardingData.nativeVillage,
        speaksChhattisgarhi: onboardingData.speaksChhattisgarhi ?? false,

        // Religion
        religion: onboardingData.religion,
        caste: onboardingData.caste,
        subCaste: onboardingData.subCaste,
        gothram: onboardingData.gothram,

        // Physical Details & Lifestyle
        height: onboardingData.height,
        weight: onboardingData.weight,
        bloodGroup: onboardingData.bloodGroup,
        complexion: onboardingData.complexion,
        bodyType: onboardingData.bodyType,
        diet: onboardingData.diet,
        smokingHabit: onboardingData.smokingHabit,
        drinkingHabit: onboardingData.drinkingHabit,

        // Other Details
        maritalStatus: onboardingData.maritalStatus,
        motherTongue: onboardingData.motherTongue || 'HINDI',

        // Family Details
        fatherName: onboardingData.fatherName,
        fatherOccupation: onboardingData.fatherOccupation,
        motherName: onboardingData.motherName,
        motherOccupation: onboardingData.motherOccupation,
        numberOfBrothers: onboardingData.numberOfBrothers,
        numberOfSisters: onboardingData.numberOfSisters,
        familyType: onboardingData.familyType,
        familyStatus: onboardingData.familyStatus,

        // About & Partner Expectations
        hobbies: onboardingData.hobbies,
        partnerExpectations: onboardingData.partnerExpectations,

        // Horoscope (for Hindu profiles)
        manglik: onboardingData.manglik,
        birthTime: onboardingData.birthTime,
        birthPlace: onboardingData.birthPlace,
        rashi: onboardingData.rashi,
        nakshatra: onboardingData.nakshatra,
      };

      // Validate required fields before submission
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

      // NOTE: Education and Occupation endpoints require 'requireCompleteProfile' middleware
      // which blocks access until the profile is complete. We skip these during initial creation.
      // Users can add education/occupation details later through the Edit Profile screen.

      // // STEP 2: Add Education (if provided)
      // // Note: The current UI collects 'education' (level) and 'educationDetails'.
      // // We map 'education' to 'degree' and 'educationDetails' to 'field' for now.
      // if (onboardingData.education) {
      //   console.log('Adding education...');
      //   try {
      //     await educationService.createEducation({
      //       degree: Array.isArray(onboardingData.education) ? onboardingData.education[0] : onboardingData.education,
      //       institution: 'Not Specified', // Placeholder as UI doesn't collect this yet
      //       field: onboardingData.educationDetails || 'General',
      //       yearOfPassing: undefined, // UI doesn't collect this yet
      //       isCurrent: false,
      //     } as any);
      //     console.log('Education added');
      //   } catch (eduError) {
      //     console.error('Failed to add education:', eduError);
      //     // Don't block flow, just log error
      //   }
      // }

      // // STEP 3: Add Occupation (if provided)
      // if (onboardingData.occupation) {
      //   console.log('Adding occupation...');
      //   try {
      //     await occupationService.createOccupation({
      //       companyName: 'Not Specified', // Placeholder
      //       designation: onboardingData.jobTitle || (onboardingData.occupation as string),
      //       employmentType: onboardingData.occupationType || 'FULL_TIME',
      //       industry: 'Not Specified',
      //       annualIncome: onboardingData.annualIncome,
      //       isCurrent: true,
      //       location: onboardingData.workLocation,
      //     } as any);
      //     console.log('Occupation added');
      //   } catch (occError) {
      //     console.error('Failed to add occupation:', occError);
      //     // Don't block flow
      //   }
      // }

      // STEP 2: Upload Photos (if provided)
      if (onboardingData.photos && onboardingData.photos.length > 0) {
        console.log('Uploading photos...');
        try {
          for (const photoUri of onboardingData.photos) {
            await profileService.uploadProfilePhoto(photoUri);
          }
          console.log('Photos uploaded');
        } catch (photoError) {
          console.error('Error uploading photos:', photoError);
          // Continue even if photo upload fails
        }
      }

      // SUCCESS!
      Alert.alert('Success', 'Profile created successfully!');

      // Refresh profile data
      await fetchProfile();

      // Reset store
      resetOnboardingState();

      // Navigate to phone verification after profile creation
      navigation.navigate('PhoneVerification');

    } catch (error: any) {
      console.error('Profile creation failed:', error);

      if (error.response?.data?.errors) {
        // Show validation errors
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
        // If Hindu, show HoroscopeStep. Otherwise, show PhotosStep
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
        // PhotosStep for Hindu profiles (step 9)
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Surface style={styles.header} elevation={2}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextContainer}>
            <Text variant="titleLarge" style={styles.headerTitle}>
              Create Your Profile
            </Text>
            <Text variant="bodyMedium" style={styles.stepIndicator}>
              Step {currentStep} of {TOTAL_STEPS}: {getStepTitle()}
            </Text>
          </View>
          <IconButton
            icon="auto-fix"
            mode="contained-tonal"
            size={24}
            onPress={handleAutoFill}
          />
        </View>
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
      </Surface>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled">
        {renderStep()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: Theme.colors.surfaceCardAlt,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: Theme.colors.text,
  },
  stepIndicator: {
    color: Theme.colors.textSecondary,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.borderFocus,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
});

export default CreateProfileScreen;
