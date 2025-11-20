import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextInput, Button, SegmentedButtons, Text, HelperText } from 'react-native-paper';
import { useOnboardingStore } from '../../store/onboardingStore';
import { Gender } from '../../constants/enums';

// 1. Define the Zod validation schema for this step
const basicInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  dob: z.date().refine((date) => {
    const age = (new Date()).getFullYear() - date.getFullYear();
    return age >= 18;
  }, 'You must be at least 18 years old'),
  gender: z.nativeEnum(Gender, { errorMap: () => ({ message: 'Please select a gender' }) }),
  height: z.number().min(120, 'Height must be at least 120cm').max(250, 'Height cannot exceed 250cm'),
});

// Infer the type from the schema
type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

type Props = {
  onNext: () => void; // Keep onNext to control navigation
};

const BasicInfoStep: React.FC<Props> = ({ onNext }) => {
  // 2. Get data and actions from the Zustand store
  const { fullName, dob, gender, height, updateOnboardingData } = useOnboardingStore((state) => ({...state}));

  // 3. Initialize React Hook Form with store data and Zod resolver
  const { control, handleSubmit, formState: { errors } } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      fullName: fullName || '',
      dob: dob ? new Date(dob) : new Date(),
      gender: gender,
      height: height || undefined,
    },
  });

  // 4. On valid submission, update the central store and navigate
  const onSubmit = (data: BasicInfoFormData) => {
    updateOnboardingData('fullName', data.fullName);
    updateOnboardingData('dob', data.dob);
    updateOnboardingData('gender', data.gender);
    updateOnboardingData('height', data.height);
    onNext();
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Tell us about yourself
      </Text>

      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Full Name *"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            mode="outlined"
            style={styles.input}
            error={!!errors.fullName}
          />
        )}
      />
      <HelperText type="error" visible={!!errors.fullName}>
        {errors.fullName?.message}
      </HelperText>

      {/* Other fields will be similarly refactored... */}

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)} // Use handleSubmit from React Hook Form
        style={styles.nextButton}
      >
        Next
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 4,
  },
  nextButton: {
    marginTop: 24,
  },
});

export default BasicInfoStep;
