import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  HelperText,
  Menu,
} from 'react-native-paper';
import {ProfileFormData} from '../../types/profileForm';

type Props = {
  data: Partial<ProfileFormData>;
  onUpdate: (data: Partial<ProfileFormData>) => void;
  onNext: () => void;
  onBack: () => void;
};

// Chhattisgarh districts
const CG_DISTRICTS = [
  'Balod',
  'Baloda Bazar',
  'Balrampur',
  'Bastar',
  'Bemetara',
  'Bijapur',
  'Bilaspur',
  'Dantewada',
  'Dhamtari',
  'Durg',
  'Gariaband',
  'Gaurela-Pendra-Marwahi',
  'Janjgir-Champa',
  'Jashpur',
  'Kabirdham',
  'Kanker',
  'Kondagaon',
  'Korba',
  'Koriya',
  'Mahasamund',
  'Mungeli',
  'Narayanpur',
  'Raigarh',
  'Raipur',
  'Rajnandgaon',
  'Sukma',
  'Surajpur',
  'Surguja',
];

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

const LocationStep: React.FC<Props> = ({data, onUpdate, onNext, onBack}) => {
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [stateMenuVisible, setStateMenuVisible] = useState(false);
  const [districtMenuVisible, setDistrictMenuVisible] = useState(false);

  const validate = () => {
    const newErrors: {[key: string]: string} = {};

    if (!data.state || data.state.trim().length === 0) {
      newErrors.state = 'Please select your current state';
    }

    if (!data.city || data.city.trim().length < 2) {
      newErrors.city = 'Please enter your city name';
    }

    if (!data.nativeDistrict || data.nativeDistrict.trim().length === 0) {
      newErrors.nativeDistrict = 'Please select your native district';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <Surface style={styles.container} elevation={1}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Where are you from?
      </Text>

      <View style={styles.menuContainer}>
        <Text variant="bodyMedium" style={styles.label}>
          Current State *
        </Text>
        <Menu
          visible={stateMenuVisible}
          onDismiss={() => setStateMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setStateMenuVisible(true)}
              style={styles.menuButton}
              icon="chevron-down"
              contentStyle={styles.menuButtonContent}>
              {data.state || 'Select State'}
            </Button>
          }>
          {INDIAN_STATES.map(state => (
            <Menu.Item
              key={state}
              onPress={() => {
                onUpdate({state});
                setStateMenuVisible(false);
              }}
              title={state}
            />
          ))}
        </Menu>
        <HelperText type="error" visible={!!errors.state}>
          {errors.state}
        </HelperText>
      </View>

      <TextInput
        label="Current City *"
        value={data.city || ''}
        onChangeText={text => onUpdate({city: text})}
        mode="outlined"
        style={styles.input}
        error={!!errors.city}
        placeholder="e.g., Raipur"
      />
      <HelperText type="error" visible={!!errors.city}>
        {errors.city}
      </HelperText>

      <View style={styles.menuContainer}>
        <Text variant="bodyMedium" style={styles.label}>
          Native District (Chhattisgarh) *
        </Text>
        <Menu
          visible={districtMenuVisible}
          onDismiss={() => setDistrictMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setDistrictMenuVisible(true)}
              style={styles.menuButton}
              icon="chevron-down"
              contentStyle={styles.menuButtonContent}>
              {data.nativeDistrict || 'Select District'}
            </Button>
          }>
          {CG_DISTRICTS.map(district => (
            <Menu.Item
              key={district}
              onPress={() => {
                onUpdate({nativeDistrict: district});
                setDistrictMenuVisible(false);
              }}
              title={district}
            />
          ))}
        </Menu>
        <HelperText type="error" visible={!!errors.nativeDistrict}>
          {errors.nativeDistrict}
        </HelperText>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={onBack}
          style={styles.backButton}
          contentStyle={styles.buttonContent}>
          Back
        </Button>
        <Button
          mode="contained"
          onPress={handleNext}
          style={styles.nextButton}
          contentStyle={styles.buttonContent}>
          Next
        </Button>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 4,
  },
  label: {
    marginBottom: 8,
    color: '#666',
  },
  menuContainer: {
    marginBottom: 8,
  },
  menuButton: {
    marginBottom: 4,
    justifyContent: 'flex-start',
  },
  menuButtonContent: {
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default LocationStep;
