import React, {useState} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {
  TextInput,
  Button,
  SegmentedButtons,
  Text,
  Surface,
  HelperText,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {ProfileFormData} from '../../types/profileForm';

type Props = {
  data: Partial<ProfileFormData>;
  onUpdate: (data: Partial<ProfileFormData>) => void;
  onNext: () => void;
};

const BasicInfoStep: React.FC<Props> = ({data, onUpdate, onNext}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validate = () => {
    const newErrors: {[key: string]: string} = {};

    if (!data.name || data.name.trim().length < 2) {
      newErrors.name = 'Please enter a valid name (at least 2 characters)';
    }

    if (!data.dateOfBirth) {
      newErrors.dateOfBirth = 'Please select your date of birth';
    } else {
      const age = Math.floor(
        (Date.now() - data.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
      );
      if (age < 18) {
        newErrors.dateOfBirth = 'You must be at least 18 years old';
      }
      if (age > 100) {
        newErrors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }

    if (!data.gender) {
      newErrors.gender = 'Please select your gender';
    }

    if (!data.height || data.height < 120 || data.height > 250) {
      newErrors.height = 'Please enter a valid height (120-250 cm)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      onUpdate({dateOfBirth: selectedDate});
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'Select Date';
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Surface style={styles.container} elevation={1}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Tell us about yourself
      </Text>

      <TextInput
        label="Full Name *"
        value={data.name || ''}
        onChangeText={text => onUpdate({name: text})}
        mode="outlined"
        style={styles.input}
        error={!!errors.name}
      />
      <HelperText type="error" visible={!!errors.name}>
        {errors.name}
      </HelperText>

      <View style={styles.datePickerContainer}>
        <Text variant="bodyMedium" style={styles.label}>
          Date of Birth *
        </Text>
        <Button
          mode="outlined"
          onPress={() => setShowDatePicker(true)}
          style={styles.dateButton}
          icon="calendar">
          {formatDate(data.dateOfBirth)}
        </Button>
        {showDatePicker && (
          <DateTimePicker
            value={data.dateOfBirth || new Date(2000, 0, 1)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
            minimumDate={new Date(1940, 0, 1)}
          />
        )}
        <HelperText type="error" visible={!!errors.dateOfBirth}>
          {errors.dateOfBirth}
        </HelperText>
      </View>

      <View style={styles.segmentContainer}>
        <Text variant="bodyMedium" style={styles.label}>
          Gender *
        </Text>
        <SegmentedButtons
          value={data.gender || ''}
          onValueChange={value => onUpdate({gender: value})}
          buttons={[
            {value: 'Male', label: 'Male'},
            {value: 'Female', label: 'Female'},
          ]}
          style={styles.segmentedButtons}
        />
        <HelperText type="error" visible={!!errors.gender}>
          {errors.gender}
        </HelperText>
      </View>

      <TextInput
        label="Height (in cm) *"
        value={data.height ? String(data.height) : ''}
        onChangeText={text => {
          const height = parseInt(text, 10);
          if (!isNaN(height) || text === '') {
            onUpdate({height: isNaN(height) ? undefined : height});
          }
        }}
        keyboardType="number-pad"
        mode="outlined"
        style={styles.input}
        error={!!errors.height}
        placeholder="e.g., 165"
      />
      <HelperText type="error" visible={!!errors.height}>
        {errors.height}
      </HelperText>

      <Button
        mode="contained"
        onPress={handleNext}
        style={styles.nextButton}
        contentStyle={styles.buttonContent}>
        Next
      </Button>
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
  datePickerContainer: {
    marginBottom: 8,
  },
  dateButton: {
    marginBottom: 4,
  },
  segmentContainer: {
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 4,
  },
  nextButton: {
    marginTop: 24,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default BasicInfoStep;
