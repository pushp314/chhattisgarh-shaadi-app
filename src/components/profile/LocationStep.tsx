import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextInput, Button, Text, Menu, Switch, HelperText } from 'react-native-paper';
import { useOnboardingStore } from '../../store/onboardingStore';
import { IndianState } from '../../constants/enums';

const CG_DISTRICTS = ['Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 'Bilaspur', 'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Gaurela-Pendra-Marwahi', 'Janjgir-Champa', 'Jashpur', 'Kabirdham', 'Kanker', 'Kondagaon', 'Korba', 'Koriya', 'Mahasamund', 'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Sukma', 'Surajpur', 'Surguja'];

const locationSchema = z.object({
  state: z.nativeEnum(IndianState),
  city: z.string().min(2, 'City name must be at least 2 characters'),
  nativeDistrict: z.string().min(1, 'Please select your native district'),
  nativeTehsil: z.string().optional(),
  nativeVillage: z.string().optional(),
  speaksChhattisgarhi: z.boolean(),
});

type LocationFormData = z.infer<typeof locationSchema>;

type Props = {
  onNext: () => void;
  onBack: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
};

const LocationStep: React.FC<Props> = ({ onNext, onBack, submitLabel = 'Next', isSubmitting = false }) => {
  const state = useOnboardingStore((s) => s.state);
  const city = useOnboardingStore((s) => s.city);
  const nativeDistrict = useOnboardingStore((s) => s.nativeDistrict);
  const nativeTehsil = useOnboardingStore((s) => s.nativeTehsil);
  const nativeVillage = useOnboardingStore((s) => s.nativeVillage);
  const speaksChhattisgarhi = useOnboardingStore((s) => s.speaksChhattisgarhi);
  const updateOnboardingData = useOnboardingStore((s) => s.updateOnboardingData);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      state: (state as IndianState) || IndianState.CHHATTISGARH,
      city: city || '',
      nativeDistrict: nativeDistrict || '',
      nativeTehsil: nativeTehsil || '',
      nativeVillage: nativeVillage || '',
      speaksChhattisgarhi: speaksChhattisgarhi ?? false,
    },
  });

  // Sync form with store when store values change (for auto-fill)
  React.useEffect(() => {
    if (state) setValue('state', state as IndianState);
    if (city) setValue('city', city);
    if (nativeDistrict) setValue('nativeDistrict', nativeDistrict);
    if (nativeTehsil) setValue('nativeTehsil', nativeTehsil);
    if (nativeVillage) setValue('nativeVillage', nativeVillage);
    if (speaksChhattisgarhi !== undefined) setValue('speaksChhattisgarhi', speaksChhattisgarhi);
  }, [state, city, nativeDistrict, nativeTehsil, nativeVillage, speaksChhattisgarhi, setValue]);

  const [stateMenuVisible, setStateMenuVisible] = React.useState(false);
  const [districtMenuVisible, setDistrictMenuVisible] = React.useState(false);

  const onSubmit = (data: LocationFormData) => {
    updateOnboardingData('state', data.state as string);
    updateOnboardingData('city', data.city as string);
    updateOnboardingData('nativeDistrict', data.nativeDistrict as string);
    if (data.nativeTehsil) updateOnboardingData('nativeTehsil', data.nativeTehsil);
    if (data.nativeVillage) updateOnboardingData('nativeVillage', data.nativeVillage);
    updateOnboardingData('speaksChhattisgarhi', data.speaksChhattisgarhi as boolean);
    onNext();
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.sectionTitle}>Where are you from?</Text>

      {/* State Menu */}
      <Controller
        control={control}
        name="state"
        render={({ field: { value } }) => (
          <View style={styles.menuContainer}>
            <Text style={styles.label}>Current State *</Text>
            <Menu
              visible={stateMenuVisible}
              onDismiss={() => setStateMenuVisible(false)}
              anchor={<Button mode="outlined" onPress={() => setStateMenuVisible(true)}>{value || 'Select State'}</Button>}
            >
              {Object.values(IndianState).map((s) => (
                <Menu.Item
                  key={s as string}
                  onPress={() => {
                    setValue('state', s, { shouldValidate: true });
                    setStateMenuVisible(false);
                  }}
                  title={s as string}
                />
              ))}
            </Menu>
            <HelperText type="error" visible={!!errors.state}>{errors.state?.message}</HelperText>
          </View>
        )}
      />

      <Controller
        control={control}
        name="city"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Current City *"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            mode="outlined"
            style={styles.input}
            error={!!errors.city}
          />
        )}
      />
      <HelperText type="error" visible={!!errors.city}>{errors.city?.message}</HelperText>

      {/* Native District Menu (Only if Chhattisgarh) */}
      <Controller
        control={control}
        name="nativeDistrict"
        render={({ field: { value } }) => (
          <View style={styles.menuContainer}>
            <Text style={styles.label}>Native District (Chhattisgarh) *</Text>
            <Menu
              visible={districtMenuVisible}
              onDismiss={() => setDistrictMenuVisible(false)}
              anchor={<Button mode="outlined" onPress={() => setDistrictMenuVisible(true)}>{value || 'Select District'}</Button>}
            >
              {CG_DISTRICTS.map((d) => (
                <Menu.Item
                  key={d}
                  onPress={() => {
                    setValue('nativeDistrict', d, { shouldValidate: true });
                    setDistrictMenuVisible(false);
                  }}
                  title={d}
                />
              ))}
            </Menu>
            <HelperText type="error" visible={!!errors.nativeDistrict}>{errors.nativeDistrict?.message}</HelperText>
          </View>
        )}
      />

      {/* Native Tehsil (Optional) */}
      <Controller
        control={control}
        name="nativeTehsil"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            label="Native Tehsil / Block (Optional)"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., Abhanpur, Dhamtari"
          />
        )}
      />

      {/* Native Village (Optional) */}
      <Controller
        control={control}
        name="nativeVillage"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            label="Native Village / Town (Optional)"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., Kharora, Mandir Hasaud"
          />
        )}
      />

      <Controller
        control={control}
        name="speaksChhattisgarhi"
        render={({ field: { value, onChange } }) => (
          <View style={styles.switchContainer}>
            <Text>Do you speak Chhattisgarhi?</Text>
            <Switch value={value} onValueChange={onChange} />
          </View>
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
  input: { marginBottom: 4 },
  switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 16 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, gap: 12 },
  backButton: { flex: 1 },
  nextButton: { flex: 1 },
});

export default LocationStep;
