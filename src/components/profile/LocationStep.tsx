import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextInput, Button, Text, Menu, Switch, HelperText } from 'react-native-paper';
import { useOnboardingStore } from '../../store/onboardingStore';
import { IndianState } from '../../constants/enums'; // Assuming you have this enum

const CG_DISTRICTS = ['Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 'Bilaspur', 'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Gaurela-Pendra-Marwahi', 'Janjgir-Champa', 'Jashpur', 'Kabirdham', 'Kanker', 'Kondagaon', 'Korba', 'Koriya', 'Mahasamund', 'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Sukma', 'Surajpur', 'Surguja'];

const locationSchema = z.object({
  state: z.nativeEnum(IndianState),
  city: z.string().min(2, 'City name must be at least 2 characters'),
  nativeDistrict: z.string().min(1, 'Please select your native district'),
  speaksChhattisgarhi: z.boolean(),
});

type LocationFormData = z.infer<typeof locationSchema>;

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const LocationStep: React.FC<Props> = ({ onNext, onBack }) => {
  const { state, city, nativeDistrict, speaksChhattisgarhi, updateOnboardingData } = useOnboardingStore((s) => ({...s}));

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      state: state,
      city: city || '',
      nativeDistrict: nativeDistrict || '',
      speaksChhattisgarhi: speaksChhattisgarhi ?? false,
    },
  });

  const [stateMenuVisible, setStateMenuVisible] = React.useState(false);
  const [districtMenuVisible, setDistrictMenuVisible] = React.useState(false);

  const onSubmit = (data: LocationFormData) => {
    updateOnboardingData('state', data.state);
    updateOnboardingData('city', data.city);
    updateOnboardingData('nativeDistrict', data.nativeDistrict);
    updateOnboardingData('speaksChhattisgarhi', data.speaksChhattisgarhi);
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
                  key={s}
                  onPress={() => {
                    setValue('state', s, { shouldValidate: true });
                    setStateMenuVisible(false);
                  }}
                  title={s}
                />
              ))}
            </Menu>
            <HelperText type="error" visible={!!errors.state}>{errors.state?.message}</HelperText>
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

export default LocationStep;
