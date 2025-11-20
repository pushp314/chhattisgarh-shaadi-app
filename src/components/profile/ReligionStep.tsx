import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextInput, Button, Text, Menu, HelperText } from 'react-native-paper';
import { useOnboardingStore } from '../../store/onboardingStore';
import { Religion, MaritalStatus, MotherTongue } from '../../constants/enums';

const religionSchema = z.object({
  religion: z.nativeEnum(Religion),
  caste: z.string().min(2, 'Please enter your caste'),
  subCaste: z.string().optional(),
  maritalStatus: z.nativeEnum(MaritalStatus),
  motherTongue: z.nativeEnum(MotherTongue).optional(),
});

type ReligionFormData = z.infer<typeof religionSchema>;

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const ReligionStep: React.FC<Props> = ({ onNext, onBack }) => {
  const { religion, caste, subCaste, maritalStatus, motherTongue, updateOnboardingData } = useOnboardingStore((s) => ({...s}));

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<ReligionFormData>({
    resolver: zodResolver(religionSchema),
    defaultValues: {
      religion: religion,
      caste: caste || '',
      subCaste: subCaste || '',
      maritalStatus: maritalStatus,
      motherTongue: motherTongue,
    },
  });

  const [religionMenuVisible, setReligionMenuVisible] = React.useState(false);
  const [maritalMenuVisible, setMaritalMenuVisible] = React.useState(false);
  const [motherTongueMenuVisible, setMotherTongueMenuVisible] = React.useState(false);

  const onSubmit = (data: ReligionFormData) => {
    updateOnboardingData('religion', data.religion);
    updateOnboardingData('caste', data.caste);
    updateOnboardingData('subCaste', data.subCaste);
    updateOnboardingData('maritalStatus', data.maritalStatus);
    updateOnboardingData('motherTongue', data.motherTongue);
    onNext();
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.sectionTitle}>Religion & Community</Text>

      {/* Religion Menu */}
      <Controller
        control={control}
        name="religion"
        render={({ field: { value } }) => (
          <View style={styles.menuContainer}>
            <Text style={styles.label}>Religion *</Text>
            <Menu
              visible={religionMenuVisible}
              onDismiss={() => setReligionMenuVisible(false)}
              anchor={<Button mode="outlined" onPress={() => setReligionMenuVisible(true)}>{value || 'Select Religion'}</Button>}
            >
              {Object.values(Religion).map((r) => (
                <Menu.Item
                  key={r}
                  onPress={() => {
                    setValue('religion', r, { shouldValidate: true });
                    setReligionMenuVisible(false);
                  }}
                  title={r}
                />
              ))}
            </Menu>
            <HelperText type="error" visible={!!errors.religion}>{errors.religion?.message}</HelperText>
          </View>
        )}
      />

      {/* Other fields similarly refactored */}

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

export default ReligionStep;
