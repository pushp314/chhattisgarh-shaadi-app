import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextInput, Button, Text, Menu, HelperText } from 'react-native-paper';
import { useOnboardingStore } from '../../store/onboardingStore';
import { Education, Occupation } from '../../constants/enums';

const educationSchema = z.object({
  education: z.nativeEnum(Education),
  educationDetails: z.string().optional(),
  occupation: z.nativeEnum(Occupation),
  occupationDetails: z.string().optional(),
  annualIncome: z.string().optional(),
});

type EducationFormData = z.infer<typeof educationSchema>;

type Props = {
  onNext: () => void;
  onBack: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
};

const EducationStep: React.FC<Props> = ({ onNext, onBack, submitLabel = 'Next', isSubmitting = false }) => {
  // Use individual selectors to avoid re-render loops
  const education = useOnboardingStore((state) => state.education);
  const occupation = useOnboardingStore((state) => state.occupation);
  const annualIncome = useOnboardingStore((state) => state.annualIncome);
  const educationDetails = useOnboardingStore((state) => state.educationDetails);
  const occupationDetails = useOnboardingStore((state) => state.occupationDetails);
  const updateOnboardingData = useOnboardingStore((state) => state.updateOnboardingData);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education: (Array.isArray(education) ? education[0] : education) as Education,
      educationDetails: educationDetails,
      occupation: occupation as Occupation,
      occupationDetails: occupationDetails,
      annualIncome: annualIncome,
    },
  });

  // Sync form with store when store values change (for auto-fill)
  React.useEffect(() => {
    if (education) setValue('education', (Array.isArray(education) ? education[0] : education) as Education);
    if (educationDetails) setValue('educationDetails', educationDetails);
    if (occupation) setValue('occupation', occupation as Occupation);
    if (occupationDetails) setValue('occupationDetails', occupationDetails);
    if (annualIncome) setValue('annualIncome', annualIncome);
  }, [education, educationDetails, occupation, occupationDetails, annualIncome, setValue]);

  const [educationMenuVisible, setEducationMenuVisible] = React.useState(false);
  const [occupationMenuVisible, setOccupationMenuVisible] = React.useState(false);
  const [incomeMenuVisible, setIncomeMenuVisible] = React.useState(false);

  const onSubmit = (data: EducationFormData) => {
    updateOnboardingData('education', [data.education] as any);
    updateOnboardingData('educationDetails', data.educationDetails as string);
    updateOnboardingData('occupation', data.occupation as any);
    updateOnboardingData('occupationDetails', data.occupationDetails as string);
    updateOnboardingData('annualIncome', data.annualIncome as string);
    onNext();
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.sectionTitle}>Education & Career</Text>

      {/* Education Level */}
      <Controller
        control={control}
        name="education"
        render={({ field: { value } }) => (
          <View style={styles.menuContainer}>
            <Text style={styles.label}>Education Level *</Text>
            <Menu
              visible={educationMenuVisible}
              onDismiss={() => setEducationMenuVisible(false)}
              anchor={<Button mode="outlined" onPress={() => setEducationMenuVisible(true)}>{value || 'Select Education'}</Button>}
            >
              {Object.values(Education).map((edu) => (
                <Menu.Item
                  key={edu}
                  onPress={() => {
                    setValue('education', edu, { shouldValidate: true });
                    setEducationMenuVisible(false);
                  }}
                  title={edu}
                />
              ))}
            </Menu>
            <HelperText type="error" visible={!!errors.education}>{errors.education?.message}</HelperText>
          </View>
        )}
      />

      {/* Occupation Menu */}
      <Controller
        control={control}
        name="occupation"
        render={({ field: { value } }) => (
          <View style={styles.menuContainer}>
            <Text style={styles.label}>Occupation *</Text>
            <Menu
              visible={occupationMenuVisible}
              onDismiss={() => setOccupationMenuVisible(false)}
              anchor={<Button mode="outlined" onPress={() => setOccupationMenuVisible(true)}>{value || 'Select Occupation'}</Button>}
            >
              {Object.values(Occupation).map((occ) => (
                <Menu.Item
                  key={occ}
                  onPress={() => {
                    setValue('occupation', occ, { shouldValidate: true });
                    setOccupationMenuVisible(false);
                  }}
                  title={occ}
                />
              ))}
            </Menu>
            <HelperText type="error" visible={!!errors.occupation}>{errors.occupation?.message}</HelperText>
          </View>
        )}
      />

      {/* Education Details (Optional) */}
      <Controller
        control={control}
        name="educationDetails"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Education Details (Optional)"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., Computer Science Engineering"
          />
        )}
      />

      {/* Occupation Details (Optional) */}
      <Controller
        control={control}
        name="occupationDetails"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Occupation Details (Optional)"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., Software Engineer at TCS"
          />
        )}
      />

      {/* Annual Income (Optional) */}
      <Controller
        control={control}
        name="annualIncome"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Annual Income (Optional)"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., 5-10 LPA"
          />
        )}
      />

      <View style={styles.buttonContainer}>
        <Button mode="outlined" onPress={onBack} style={styles.backButton}>Back</Button>
        <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.nextButton} loading={isSubmitting} disabled={isSubmitting}>{submitLabel}</Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  sectionTitle: { marginBottom: 16 },
  label: { marginBottom: 8 },
  menuContainer: { marginBottom: 12 },
  input: { marginBottom: 12 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, gap: 12 },
  backButton: { flex: 1 },
  nextButton: { flex: 1 },
});

export default EducationStep;
