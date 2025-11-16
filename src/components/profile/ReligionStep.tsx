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
import {Religion, MaritalStatus, MotherTongue} from '../../constants/enums';

type Props = {
  data: Partial<ProfileFormData>;
  onUpdate: (data: Partial<ProfileFormData>) => void;
  onNext: () => void;
  onBack: () => void;
};

const RELIGIONS = Object.values(Religion);
const MARITAL_STATUSES = Object.values(MaritalStatus);
const MOTHER_TONGUES = Object.values(MotherTongue);

// Format enum for display (convert SNAKE_CASE to Title Case)
const formatEnumForDisplay = (enumValue: string) => {
  return enumValue
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

const ReligionStep: React.FC<Props> = ({data, onUpdate, onNext, onBack}) => {
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [religionMenuVisible, setReligionMenuVisible] = useState(false);
  const [maritalMenuVisible, setMaritalMenuVisible] = useState(false);
  const [motherTongueMenuVisible, setMotherTongueMenuVisible] = useState(false);

  const validate = () => {
    const newErrors: {[key: string]: string} = {};

    if (!data.religion) {
      newErrors.religion = 'Please select your religion';
    }

    if (!data.caste || data.caste.trim().length < 2) {
      newErrors.caste = 'Please enter your caste';
    }

    if (!data.maritalStatus) {
      newErrors.maritalStatus = 'Please select your marital status';
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
        Religion & Community
      </Text>

      <View style={styles.menuContainer}>
        <Text variant="bodyMedium" style={styles.label}>
          Religion *
        </Text>
        <Menu
          visible={religionMenuVisible}
          onDismiss={() => setReligionMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setReligionMenuVisible(true)}
              style={styles.menuButton}
              icon="chevron-down"
              contentStyle={styles.menuButtonContent}>
              {data.religion ? formatEnumForDisplay(data.religion) : 'Select Religion'}
            </Button>
          }>
          {RELIGIONS.map(religion => (
            <Menu.Item
              key={religion}
              onPress={() => {
                onUpdate({religion});
                setReligionMenuVisible(false);
              }}
              title={formatEnumForDisplay(religion)}
            />
          ))}
        </Menu>
        <HelperText type="error" visible={!!errors.religion}>
          {errors.religion}
        </HelperText>
      </View>

      <TextInput
        label="Caste *"
        value={data.caste || ''}
        onChangeText={text => onUpdate({caste: text})}
        mode="outlined"
        style={styles.input}
        error={!!errors.caste}
        placeholder="e.g., Satnami, Kurmi, etc."
      />
      <HelperText type="error" visible={!!errors.caste}>
        {errors.caste}
      </HelperText>

      <TextInput
        label="Sub-Caste (Optional)"
        value={data.subCaste || ''}
        onChangeText={text => onUpdate({subCaste: text})}
        mode="outlined"
        style={styles.input}
        placeholder="If applicable"
      />

      <View style={styles.menuContainer}>
        <Text variant="bodyMedium" style={styles.label}>
          Marital Status *
        </Text>
        <Menu
          visible={maritalMenuVisible}
          onDismiss={() => setMaritalMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMaritalMenuVisible(true)}
              style={styles.menuButton}
              icon="chevron-down"
              contentStyle={styles.menuButtonContent}>
              {data.maritalStatus ? formatEnumForDisplay(data.maritalStatus) : 'Select Status'}
            </Button>
          }>
          {MARITAL_STATUSES.map(status => (
            <Menu.Item
              key={status}
              onPress={() => {
                onUpdate({maritalStatus: status});
                setMaritalMenuVisible(false);
              }}
              title={formatEnumForDisplay(status)}
            />
          ))}
        </Menu>
        <HelperText type="error" visible={!!errors.maritalStatus}>
          {errors.maritalStatus}
        </HelperText>
      </View>

      <View style={styles.menuContainer}>
        <Text variant="bodyMedium" style={styles.label}>
          Mother Tongue (Optional)
        </Text>
        <Menu
          visible={motherTongueMenuVisible}
          onDismiss={() => setMotherTongueMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMotherTongueMenuVisible(true)}
              style={styles.menuButton}
              icon="chevron-down"
              contentStyle={styles.menuButtonContent}>
              {data.motherTongue ? formatEnumForDisplay(data.motherTongue) : 'Select Mother Tongue'}
            </Button>
          }>
          {MOTHER_TONGUES.map(tongue => (
            <Menu.Item
              key={tongue}
              onPress={() => {
                onUpdate({motherTongue: tongue});
                setMotherTongueMenuVisible(false);
              }}
              title={formatEnumForDisplay(tongue)}
            />
          ))}
        </Menu>
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

export default ReligionStep;
