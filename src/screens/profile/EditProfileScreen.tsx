import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Text,
  Button,
  ProgressBar,
  Surface,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ProfileStackParamList } from '../../navigation/types';
import { useProfileStore } from '../../store/profileStore';
import { useOnboardingStore } from '../../store/onboardingStore';

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

const TOTAL_STEPS = 6;

const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { profile, fetchProfile, updateProfile } = useProfileStore();
  const { updateOnboardingData } = useOnboardingStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = currentStep / TOTAL_STEPS;

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setIsLoading(true);
    try {
      await fetchProfile();
      if (profile) {
        // Populate onboarding store with profile data
        updateOnboardingData('firstName', profile.firstName || '');
        updateOnboardingData('lastName', profile.lastName || '');
        updateOnboardingData('dateOfBirth', profile.dateOfBirth || '');
        updateOnboardingData('gender', profile.gender || '');
        updateOnboardingData('height', profile.height || undefined);
        updateOnboardingData('state', profile.state || '');
        updateOnboardingData('city', profile.city || '');
        updateOnboardingData('nativeDistrict', profile.nativeDistrict || '');
        updateOnboardingData('religion', profile.religion || '');
        updateOnboardingData('caste', profile.caste || '');
        updateOnboardingData('maritalStatus', profile.maritalStatus || '');
        updateOnboardingData('bio', profile.bio || '');
        updateOnboardingData('hobbies', profile.hobbies || '');
        updateOnboardingData('photos', profile.media?.map((m: any) => m.url) || []);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
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
      const onboardingData = useOnboardingStore.getState();

      // Transform onboarding data to API format
      const updateData: any = {
        firstName: onboardingData.firstName,
        lastName: onboardingData.lastName,
        dateOfBirth: onboardingData.dateOfBirth,
        gender: onboardingData.gender,
        height: onboardingData.height,
        state: onboardingData.state,
        city: onboardingData.city,
        nativeDistrict: onboardingData.nativeDistrict,
        religion: onboardingData.religion,
        caste: onboardingData.caste,
        maritalStatus: onboardingData.maritalStatus,
        bio: onboardingData.bio,
        hobbies: onboardingData.hobbies,
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      await updateProfile(updateData);

      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <LocationStep
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <ReligionStep
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <EducationStep
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <AboutStep
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 6:
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
        return 'Education & Occupation';
      case 5:
        return 'About Yourself';
      case 6:
        return 'Photos';
      default:
        return '';
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Surface style={styles.header} elevation={2}>
        <Text variant="titleLarge" style={styles.headerTitle}>
          Edit Your Profile
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
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

export default EditProfileScreen;
