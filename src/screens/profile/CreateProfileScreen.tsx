import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Text,
  ProgressBar,
  Surface,
  useTheme,
} from 'react-native-paper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ProfileStackParamList} from '../../navigation/types';
import {ProfileFormData} from '../../types/profileForm';
import profileService from '../../services/profile.service';
import {useProfileStore} from '../../store/profileStore';

// Import step components
import BasicInfoStep from '../../components/profile/BasicInfoStep';
import LocationStep from '../../components/profile/LocationStep';
import ReligionStep from '../../components/profile/ReligionStep';
import EducationStep from '../../components/profile/EducationStep';
import AboutStep from '../../components/profile/AboutStep';
import PhotosStep from '../../components/profile/PhotosStep';

type CreateProfileScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'CreateProfile'
>;

type Props = {
  navigation: CreateProfileScreenNavigationProp;
};

const TOTAL_STEPS = 6;

const CreateProfileScreen: React.FC<Props> = ({navigation}) => {
  const theme = useTheme();
  const {fetchProfile} = useProfileStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ProfileFormData>>({
    hobbies: [],
    photos: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = currentStep / TOTAL_STEPS;

  const updateFormData = (data: Partial<ProfileFormData>) => {
    setFormData(prev => ({...prev, ...data}));
  };

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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Transform form data to match API requirements
      const profileData: any = {
        // Basic Info
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth?.toISOString().split('T')[0], // Format as YYYY-MM-DD
        gender: formData.gender,
        aboutMe: formData.aboutMe,

        // Location
        city: formData.city,
        state: formData.state,
        country: 'INDIA',
        nativeState: formData.nativeState || formData.state,
        nativeDistrict: formData.nativeDistrict,
        speaksChhattisgarhi: formData.speaksChhattisgarhi ?? false,

        // Religion
        religion: formData.religion,
        caste: formData.caste,
        subCaste: formData.subCaste,

        // Physical Details from form or default values
        height: formData.height,
        weight: formData.weight || 70,
        complexion: formData.complexion || 'FAIR', // Corrected default
        bodyType: formData.bodyType || 'AVERAGE',
        physicalStatus: formData.physicalStatus || 'NORMAL',

        // Habits & Lifestyle
        eatingHabits: formData.eatingHabits || 'VEGETARIAN',
        drinkingHabits: formData.drinkingHabits || 'NO',
        smokingHabits: formData.smokingHabits || 'NO',

        // Other Details
        maritalStatus: formData.maritalStatus,
        motherTongue: formData.motherTongue || 'HINDI',

        // Education & Occupation
        education: formData.education,
        occupation: formData.occupation,
        annualIncome: formData.annualIncome,

        // Hobbies
        hobbies: formData.hobbies?.join(', '),
      };

      // Log the data being sent for debugging
      console.log(
        'Creating profile with data:',
        JSON.stringify(profileData, null, 2),
      );

      // Create profile first
      await profileService.createProfile(profileData);

      // Upload photos if any
      if (formData.photos && formData.photos.length > 0) {
        try {
          // Upload first photo as profile photo
          await profileService.uploadProfilePhoto(formData.photos[0]);
          
          // Upload remaining photos if any
          if (formData.photos.length > 1) {
            await profileService.uploadProfilePhotos(formData.photos.slice(1));
          }
        } catch (photoError) {
          console.error('Error uploading photos:', photoError);
          // Continue even if photo upload fails - profile is already created
        }
      }

      // Refresh profile data
      await fetchProfile();

      // Navigate to phone verification after profile creation
      navigation.navigate('PhoneVerification');
    } catch (error: any) {
      console.error('Error creating profile:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Extract detailed error message
      let errorMessage = 'Failed to create profile. Please try again.';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Check for validation errors
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const validationErrors = errorData.errors
            .map((err: any) => `${err.field || ''}: ${err.message || ''}`)
            .filter((msg: string) => msg)
            .join('\n');
          
          if (validationErrors) {
            errorMessage = `Validation Error:\n${validationErrors}`;
          } else {
            errorMessage = errorData.message || errorMessage;
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error occurred. Please check your internet connection and try again.';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Show detailed error to user
      Alert.alert(
        'Profile Creation Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <LocationStep
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <ReligionStep
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <EducationStep
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <AboutStep
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 6:
        return (
          <PhotosStep
            data={formData}
            onUpdate={updateFormData}
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
        return 'Education & Occupation';
      case 5:
        return 'About Yourself';
      case 6:
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
        <Text variant="titleLarge" style={styles.headerTitle}>
          Create Your Profile
        </Text>
        <Text variant="bodyMedium" style={styles.stepIndicator}>
          Step {currentStep} of {TOTAL_STEPS}: {getStepTitle()}
        </Text>
        <ProgressBar
          progress={progress}
          color={theme.colors.primary}
          style={styles.progressBar}
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stepIndicator: {
    color: '#666',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
});

export default CreateProfileScreen;
