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
  gothram: z.string().optional(),
  maritalStatus: z.nativeEnum(MaritalStatus),
  motherTongue: z.nativeEnum(MotherTongue).optional(),
});

type ReligionFormData = z.infer<typeof religionSchema>;

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const ReligionStep: React.FC<Props> = ({ onNext, onBack }) => {
  // Use individual selectors to avoid re-render loops
  const religion = useOnboardingStore((state) => state.religion);
  const caste = useOnboardingStore((state) => state.caste);
  const subCaste = useOnboardingStore((state) => state.subCaste);
  const gothram = useOnboardingStore((state) => state.gothram);
  const maritalStatus = useOnboardingStore((state) => state.maritalStatus);
  const motherTongue = useOnboardingStore((state) => state.motherTongue);
  const updateOnboardingData = useOnboardingStore((state) => state.updateOnboardingData);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<ReligionFormData>({
    resolver: zodResolver(religionSchema),
    defaultValues: {
      religion: religion,
      caste: caste || '',
      subCaste: subCaste || '',
      gothram: gothram || '',
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
    updateOnboardingData('gothram', data.gothram);
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

      {/* Caste */}
      <Controller
        control={control}
        name="caste"
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <TextInput
              label="Caste *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              style={styles.input}
              error={!!errors.caste}
            />
            <HelperText type="error" visible={!!errors.caste}>{errors.caste?.message}</HelperText>
          </View>
        )}
      />

      {/* Sub-Caste (Optional) */}
      <Controller
        control={control}
        name="subCaste"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Sub-Caste (Optional)"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            mode="outlined"
            style={styles.input}
          />
        )}
      />

      {/* Gothram (Optional) */}
      <Controller
        control={control}
        name="gothram"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Gothram (Optional)"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., Bharadwaja, Kashyapa"
          />
        )}
      />

      {/* Marital Status Menu */}
      <Controller
        control={control}
        name="maritalStatus"
        render={({ field: { value } }) => (
          <View style={styles.menuContainer}>
            <Text style={styles.label}>Marital Status *</Text>
            <Menu
              visible={maritalMenuVisible}
              onDismiss={() => setMaritalMenuVisible(false)}
              anchor={<Button mode="outlined" onPress={() => setMaritalMenuVisible(true)}>{value || 'Select Marital Status'}</Button>}
            >
              {Object.values(MaritalStatus).map((status) => (
                <Menu.Item
                  key={status}
                  onPress={() => {
                    setValue('maritalStatus', status, { shouldValidate: true });
                    setMaritalMenuVisible(false);
                  }}
                  title={status.replace(/_/g, ' ')}
                />
              ))}
            </Menu>
            <HelperText type="error" visible={!!errors.maritalStatus}>{errors.maritalStatus?.message}</HelperText>
          </View>
        )}
      />

      {/* Mother Tongue Menu */}
      <Controller
        control={control}
        name="motherTongue"
        render={({ field: { value } }) => (
          <View style={styles.menuContainer}>
            <Text style={styles.label}>Mother Tongue</Text>
            <Menu
              visible={motherTongueMenuVisible}
              onDismiss={() => setMotherTongueMenuVisible(false)}
              anchor={<Button mode="outlined" onPress={() => setMotherTongueMenuVisible(true)}>{value || 'Select Mother Tongue'}</Button>}
            >
              {Object.values(MotherTongue).map((lang) => (
                <Menu.Item
                  key={lang}
                  onPress={() => {
                    setValue('motherTongue', lang, { shouldValidate: true });
                    setMotherTongueMenuVisible(false);
                  }}
                  title={lang}
                />
              ))}
            </Menu>
            <HelperText type="error" visible={!!errors.motherTongue}>{errors.motherTongue?.message}</HelperText>
          </View>
        )}
      />

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
  input: { marginBottom: 4 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, gap: 12 },
  backButton: { flex: 1 },
  nextButton: { flex: 1 },
});

export default ReligionStep;
