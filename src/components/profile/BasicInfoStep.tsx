import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextInput, Button, SegmentedButtons, Text, HelperText } from 'react-native-paper';
import { useOnboardingStore } from '../../store/onboardingStore';
import { Gender } from '../../constants/enums';
import { DatePickerInput } from 'react-native-paper-dates';
import { generateBasicInfo } from '../../utils/testDataGenerator';

// 1. Define the Zod validation schema for this step
const basicInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.date().refine((date) => {
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
  // Select specific fields to avoid infinite loop
  const firstName = useOnboardingStore((state) => state.firstName);
  const lastName = useOnboardingStore((state) => state.lastName);
  const dateOfBirth = useOnboardingStore((state) => state.dateOfBirth);
  const gender = useOnboardingStore((state) => state.gender);
  const height = useOnboardingStore((state) => state.height);
  const updateOnboardingData = useOnboardingStore((state) => state.updateOnboardingData);

  // 3. Initialize React Hook Form with store data and Zod resolver
  const { control, handleSubmit, formState: { errors }, setValue } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      firstName: firstName || '',
      lastName: lastName || '',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender: gender,
      height: height || undefined,
    },
  });

  // Auto-fill handler for testing
  const handleAutoFill = () => {
    const testData = generateBasicInfo();
    setValue('firstName', testData.firstName);
    setValue('lastName', testData.lastName);
    setValue('dateOfBirth', testData.dateOfBirth);
    setValue('gender', testData.gender);
    setValue('height', testData.height);
  };

  // 4. On valid submission, update the central store and navigate
  const onSubmit = (data: BasicInfoFormData) => {
    updateOnboardingData('firstName', data.firstName);
    updateOnboardingData('lastName', data.lastName);
    updateOnboardingData('dateOfBirth', data.dateOfBirth.toISOString()); // Store as string in store if needed, or Date if type allows
    updateOnboardingData('gender', data.gender);
    updateOnboardingData('height', data.height);
    onNext();
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Tell us about yourself
      </Text>

      {/* Auto-Fill Button for Testing */}
      <Button
        mode="outlined"
        onPress={handleAutoFill}
        style={styles.autoFillButton}
        icon="auto-fix"
      >
        Auto-Fill Test Data
      </Button>

      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="First Name *"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            mode="outlined"
            style={styles.input}
            error={!!errors.firstName}
          />
        )}
      />
      <HelperText type="error" visible={!!errors.firstName}>
        {errors.firstName?.message}
      </HelperText>

      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Last Name *"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            mode="outlined"
            style={styles.input}
            error={!!errors.lastName}
          />
        )}
      />
      <HelperText type="error" visible={!!errors.lastName}>
        {errors.lastName?.message}
      </HelperText>

      {/* Date of Birth - Simplified for now, using TextInput or DatePicker if available */}
      {/* Assuming DatePickerInput is available or using a simple text input for demo */}
      <Controller
        control={control}
        name="dateOfBirth"
        render={({ field: { onChange, value } }) => (
          <DatePickerInput
            locale="en"
            label="Date of Birth"
            value={value}
            onChange={onChange}
            inputMode="start"
            style={styles.input}
            error={!!errors.dateOfBirth}
          />
        )}
      />
      <HelperText type="error" visible={!!errors.dateOfBirth}>
        {errors.dateOfBirth?.message}
      </HelperText>


      <Controller
        control={control}
        name="gender"
        render={({ field: { onChange, value } }) => (
          <SegmentedButtons
            value={value}
            onValueChange={onChange}
            buttons={[
              { value: Gender.MALE, label: 'Male' },
              { value: Gender.FEMALE, label: 'Female' },
            ]}
            style={styles.input}
          />
        )}
      />
      <HelperText type="error" visible={!!errors.gender}>
        {errors.gender?.message}
      </HelperText>

      <Controller
        control={control}
        name="height"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Height (cm) *"
            value={value ? String(value) : ''}
            onChangeText={(text) => onChange(Number(text))}
            onBlur={onBlur}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            error={!!errors.height}
          />
        )}
      />
      <HelperText type="error" visible={!!errors.height}>
        {errors.height?.message}
      </HelperText>

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
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
  autoFillButton: {
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
