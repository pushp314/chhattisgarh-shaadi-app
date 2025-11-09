import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Button, Input, Card } from '../../../components';
import { colors } from '../../../theme/colors';

interface EducationStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const EDUCATION_OPTIONS = [
  'High School',
  'Diploma',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'Doctorate (PhD)',
  'Professional Degree',
];

const FIELD_OPTIONS = [
  'Engineering',
  'Medicine',
  'Commerce',
  'Arts',
  'Science',
  'Law',
  'Management',
  'Computer Science',
  'Architecture',
  'Pharmacy',
  'Agriculture',
  'Education',
  'Other',
];

const EducationStep: React.FC<EducationStepProps> = ({
  data,
  onNext,
  onBack,
}) => {
  const [highestEducation, setHighestEducation] = useState(data.highestEducation || '');
  const [fieldOfStudy, setFieldOfStudy] = useState(data.fieldOfStudy || '');
  const [collegeName, setCollegeName] = useState(data.collegeName || '');
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};

    if (!highestEducation) {
      newErrors.highestEducation = 'Please select your highest education';
    }
    if (!fieldOfStudy) {
      newErrors.fieldOfStudy = 'Please select your field of study';
    }
    if (!collegeName.trim()) {
      newErrors.collegeName = 'Please enter your college/university name';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext({
        highestEducation,
        fieldOfStudy,
        collegeName: collegeName.trim(),
      });
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
          <Text style={styles.instructionEmoji}>🎓</Text>
          <Text style={styles.instructionTitle}>Education Details</Text>
          <Text style={styles.instructionText}>
            Share your educational background and qualifications
          </Text>
        </Card>

        {/* Form */}
        <Card style={styles.formCard}>
          {/* Highest Education */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Highest Education <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.optionsColumn}>
              {EDUCATION_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    highestEducation === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setHighestEducation(option);
                    setErrors({ ...errors, highestEducation: '' });
                  }}>
                  <Text
                    style={[
                      styles.optionText,
                      highestEducation === option && styles.optionTextSelected,
                    ]}>
                    {option}
                  </Text>
                  {highestEducation === option && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            {errors.highestEducation && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errors.highestEducation}</Text>
              </View>
            )}
          </View>

          {/* Field of Study */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Field of Study <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.optionsGrid}>
              {FIELD_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButtonSmall,
                    fieldOfStudy === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setFieldOfStudy(option);
                    setErrors({ ...errors, fieldOfStudy: '' });
                  }}>
                  <Text
                    style={[
                      styles.optionTextSmall,
                      fieldOfStudy === option && styles.optionTextSelected,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.fieldOfStudy && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errors.fieldOfStudy}</Text>
              </View>
            )}
          </View>

          {/* College/University Name */}
          <Input
            label="College/University Name"
            placeholder="Enter your college or university name"
            value={collegeName}
            onChangeText={(text) => {
              setCollegeName(text);
              setErrors({ ...errors, collegeName: '' });
            }}
            error={errors.collegeName}
            required
            leftIcon={<Text style={styles.inputIcon}>🏫</Text>}
          />
        </Card>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <View style={styles.buttonRow}>
          <Button
            title="Back"
            onPress={onBack}
            variant="outline"
            style={styles.backButton}
            leftIcon={<Text style={styles.buttonIconOutline}>←</Text>}
          />
          <Button
            title="Next"
            onPress={handleNext}
            style={styles.nextButton}
            rightIcon={<Text style={styles.buttonIcon}>→</Text>}
          />
        </View>
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
    paddingBottom: 100,
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
  optionsColumn: {
    gap: 10,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
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
  optionButtonSmall: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral.gray300,
    backgroundColor: colors.neutral.white,
    minWidth: '30%',
    alignItems: 'center',
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
  optionTextSmall: {
    fontSize: 13,
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
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray200,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
  buttonIcon: {
    fontSize: 20,
    color: colors.neutral.white,
  },
  buttonIconOutline: {
    fontSize: 20,
    color: colors.primary.main,
  },
});

export default EducationStep;