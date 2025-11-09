import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  // SafeAreaView, // <-- REMOVED from 'react-native'
  StatusBar,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // <-- ADDED
import { colors } from '../../theme/colors';
import { StepIndicator } from '../../components';
import {
  BasicInfoStep,
  ReligiousInfoStep,
  PhysicalAttributesStep,
  LifestyleStep,
  LocationStep,
  AboutStep,
  FamilyInfoStep,
  HoroscopeStep,
  EducationStep,
  OccupationStep,
  PhotosStep,
} from './steps';

interface ProfileData {
  // Basic Info
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: string;
  maritalStatus?: string;

  // Religious Info
  religion?: string;
  caste?: string;
  subCaste?: string;
  motherTongue?: string;

  // Physical Attributes
  height?: number;
  weight?: number;
  complexion?: string;
  bodyType?: string;

  // Lifestyle
  diet?: string;
  smoking?: string;
  drinking?: string;

  // Location
  country?: string;
  state?: string;
  city?: string;

  // About
  bio?: string;
  hobbies?: string;
  interests?: string;

  // Family
  fatherName?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherOccupation?: string;
  numberOfBrothers?: number;
  numberOfSisters?: number;

  // Horoscope
  manglik?: boolean;
  birthTime?: string;
  birthPlace?: string;
  rashi?: string;
  nakshatra?: string;

  // Education
  highestEducation?: string;
  collegeName?: string;
  fieldOfStudy?: string;

  // Occupation
  occupation?: string;
  companyName?: string;
  designation?: string;
  annualIncome?: string;

  // Photos
  photos?: string[];
}

const STEP_LABELS = [
  'Basic Information',
  'Religious Details',
  'Physical Attributes',
  'Lifestyle',
  'Location',
  'About You',
  'Family Details',
  'Horoscope',
  'Education',
  'Occupation',
  'Photos',
];

interface CreateProfileScreenProps {
  onComplete: () => void;
}

const CreateProfileScreen: React.FC<CreateProfileScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>({});

  const totalSteps = 11;

  const handleNext = (stepData: Partial<ProfileData>) => {
    // Save current step data
    setProfileData({ ...profileData, ...stepData });

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - submit profile
      handleSubmit({ ...profileData, ...stepData });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      Alert.alert(
        'Exit Profile Creation?',
        'Your progress will be lost.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Exit', 
            onPress: () => {
              // In real app, might want to save draft
              console.log('Profile creation cancelled');
            }, 
            style: 'destructive' 
          },
        ]
      );
    }
  };

  const handleSubmit = (finalData: ProfileData) => {
    console.log('✅ Profile Data Submitted:', finalData);
    
    Alert.alert(
      '🎉 Success!',
      'Your profile has been created successfully!',
      [
        { 
          text: 'Continue to App', 
          onPress: () => {
            // Call the onComplete callback to navigate to Main App
            onComplete();
          } 
        },
      ]
    );
  };

  const renderStep = () => {
    const stepProps = {
      data: profileData,
      onNext: handleNext,
      onBack: handleBack,
    };

    switch (currentStep) {
      case 1:
        return <BasicInfoStep {...stepProps} />;
      case 2:
        return <ReligiousInfoStep {...stepProps} />;
      case 3:
        return <PhysicalAttributesStep {...stepProps} />;
      case 4:
        return <LifestyleStep {...stepProps} />;
      case 5:
        return <LocationStep {...stepProps} />;
      case 6:
        return <AboutStep {...stepProps} />;
      case 7:
        return <FamilyInfoStep {...stepProps} />;
      case 8:
        return <HoroscopeStep {...stepProps} />;
      case 9:
        return <EducationStep {...stepProps} />;
      case 10:
        return <OccupationStep {...stepProps} />;
      case 11:
        return <PhotosStep {...stepProps} />;
      default:
        return <BasicInfoStep {...stepProps} />;
    }
  };

  return (
    // <-- FIXED: SafeAreaView is now from react-native-safe-area-context
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.neutral.white} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Profile</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Step Indicator */}
      <StepIndicator
        currentStep={currentStep}
        totalSteps={totalSteps}
        labels={STEP_LABELS}
      />

      {/* Step Content */}
      <View style={styles.stepContainer}>{renderStep()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray200,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: colors.text.primary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  stepContainer: {
    flex: 1,
  },
});

export default CreateProfileScreen;