import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Input, Card } from '../../../components'; // Assuming all components are in /components (not /components/common)
import { colors } from '../../../theme/colors';

interface BasicInfoStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void; // This prop is passed by CreateProfileScreen
}

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const MARITAL_STATUS_OPTIONS = [
  'Never Married',
  'Divorced',
  'Widowed',
  'Awaiting Divorce',
];

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, onNext, onBack }) => {
  const [firstName, setFirstName] = useState(data.firstName || '');
  const [lastName, setLastName] = useState(data.lastName || '');
  const [dateOfBirth, setDateOfBirth] = useState<Date>(
    data.dateOfBirth || new Date(1995, 0, 1)
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState(data.gender || '');
  const [maritalStatus, setMaritalStatus] = useState(data.maritalStatus || '');

  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!gender) {
      newErrors.gender = 'Please select your gender';
    }
    if (!maritalStatus) {
      newErrors.maritalStatus = 'Please select marital status';
    }

    const age = new Date().getFullYear() - dateOfBirth.getFullYear();
    if (age < 18) {
      newErrors.dateOfBirth = 'You must be at least 18 years old';
    }
    if (age > 80) {
      newErrors.dateOfBirth = 'Please enter a valid date of birth';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth,
        gender,
        maritalStatus,
      });
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateOfBirth(selectedDate);
      setErrors({ ...errors, dateOfBirth: '' });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Instructions */}
        <Card style={styles.instructionCard}>
          <Text style={styles.instructionEmoji}>👋</Text>
          <Text style={styles.instructionTitle}>Let's start with basics!</Text>
          <Text style={styles.instructionText}>
            Tell us your name and some basic information about yourself
          </Text>
        </Card>

        {/* Form */}
        <Card style={styles.formCard}>
          {/* First Name */}
          <Input
            label="First Name"
            placeholder="Enter your first name"
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              setErrors({ ...errors, firstName: '' });
            }}
            error={errors.firstName}
            required
            leftIcon={<Text style={styles.inputIcon}>👤</Text>}
          />

          {/* Last Name */}
          <Input
            label="Last Name"
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              setErrors({ ...errors, lastName: '' });
            }}
            error={errors.lastName}
            required
            leftIcon={<Text style={styles.inputIcon}>👤</Text>}
          />

          {/* Date of Birth */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Date of Birth <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={[
                styles.dateButton,
                errors.dateOfBirth && styles.dateButtonError,
              ]}
              onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateIcon}>📅</Text>
              <Text style={styles.dateText}>{formatDate(dateOfBirth)}</Text>
            </TouchableOpacity>
            {errors.dateOfBirth && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
              </View>
            )}
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              maximumDate={new Date(2007, 11, 31)}
              minimumDate={new Date(1945, 0, 1)}
            />
          )}

          {/* Gender */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Gender <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.optionsRow}>
              {GENDER_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    gender === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setGender(option);
                    setErrors({ ...errors, gender: '' });
                  }}>
                  <Text
                    style={[
                      styles.optionText,
                      gender === option && styles.optionTextSelected,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.gender && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errors.gender}</Text>
              </View>
            )}
          </View>

          {/* Marital Status */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Marital Status <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.optionsColumn}>
              {MARITAL_STATUS_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButtonBlock,
                    maritalStatus === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setMaritalStatus(option);
                    setErrors({ ...errors, maritalStatus: '' });
                  }}>
                  <Text
                    style={[
                      styles.optionText,
                      maritalStatus === option && styles.optionTextSelected,
                    ]}>
                    {option}
                  </Text>
                  {maritalStatus === option && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            {errors.maritalStatus && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errors.maritalStatus}</Text>
              </View>
            )}
          </View>
        </Card>
      </ScrollView>

      {/* --- UPDATED Bottom Buttons --- */}
      <View style={styles.bottomButtons}>
        <Button
          title="Back"
          onPress={onBack} // Use the onBack prop from CreateProfileScreen
          variant="outline"
          style={styles.footerButton}
          leftIcon={<Text style={styles.buttonIconBack}>←</Text>}
        />
        <Button
          title="Next"
          onPress={handleNext}
          style={styles.footerButton}
          rightIcon={<Text style={styles.buttonIconNext}>→</Text>}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Ensure space for the fixed footer
  },
  instructionCard: {
    alignItems: 'center',
    marginBottom: 20,
  },
  instructionEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  instructionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  formCard: {
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  required: {
    color: colors.error,
  },
  inputIcon: {
    fontSize: 20,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  dateButtonError: {
    borderColor: colors.error,
  },
  dateIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  dateText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optionsColumn: {
    gap: 10,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral.gray300,
    backgroundColor: colors.neutral.white,
    alignItems: 'center',
  },
  optionButtonBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral.gray300,
    backgroundColor: colors.neutral.white,
  },
  optionButtonSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.lighter,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  optionTextSelected: {
    color: colors.primary.main,
  },
  checkmark: {
    fontSize: 18,
    color: colors.primary.main,
    fontWeight: 'bold',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  errorIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30, // Extra padding for home bar
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray200,
    flexDirection: 'row', // Added
    justifyContent: 'space-between', // Added
  },
  footerButton: {
    flex: 1, // Make buttons share space
    marginHorizontal: 8, // Add spacing between buttons
  },
  buttonIconNext: {
    fontSize: 20,
    color: colors.neutral.white,
  },
  buttonIconBack: {
    fontSize: 20,
    color: colors.primary.main, // Color for outline button
  },
});

export default BasicInfoStep;