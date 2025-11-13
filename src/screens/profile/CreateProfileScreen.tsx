import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  Button,
  ProgressBar,
  Surface,
  useTheme,
} from 'react-native-paper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ProfileStackParamList} from '../../navigation/types';
import {ProfileFormData} from '../../types/profileForm';

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
      // TODO: Call profileService.createProfile(formData)
      console.log('Submitting profile:', formData);
      
      // Navigate to profile screen after successful creation
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Error creating profile:', error);
      // TODO: Show error message
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
