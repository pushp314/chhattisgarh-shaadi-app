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
};

const EducationStep: React.FC<Props> = ({ onNext, onBack }) => {
  const { education, occupation, annualIncome, educationDetails, occupationDetails, updateOnboardingData } = useOnboardingStore((state) => ({...state}));

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education: education?.[0],
      educationDetails: educationDetails,
      occupation: occupation,
      occupationDetails: occupationDetails,
      annualIncome: annualIncome,
    },
  });

  const [educationMenuVisible, setEducationMenuVisible] = React.useState(false);
  const [occupationMenuVisible, setOccupationMenuVisible] = React.useState(false);
  const [incomeMenuVisible, setIncomeMenuVisible] = React.useState(false);

  const onSubmit = (data: EducationFormData) => {
    updateOnboardingData('education', [data.education]);
    updateOnboardingData('educationDetails', data.educationDetails);
    updateOnboardingData('occupation', data.occupation);
    updateOnboardingData('occupationDetails', data.occupationDetails);
    updateOnboardingData('annualIncome', data.annualIncome);
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

      {/* Other fields will be similarly refactored... */}

      <View style={styles.buttonContainer}>
        <Button mode="outlined" onPress={onBack} style={styles.backButton}>Back</Button>
        <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.nextButton}>Next</Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  sectionTitle: { marginBottom: 16 },
  label: { marginBottom: 8 },
  menuContainer: { marginBottom: 12 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, gap: 12 },
  backButton: { flex: 1 },
  nextButton: { flex: 1 },
});

export default EducationStep;
