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

interface OccupationStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const OCCUPATION_OPTIONS = [
  'Private Sector',
  'Government',
  'Business/Self-Employed',
  'Freelancer',
  'Not Working',
  'Student',
  'Homemaker',
];

const INCOME_OPTIONS = [
  'Below ₹3 Lakhs',
  '₹3-5 Lakhs',
  '₹5-7 Lakhs',
  '₹7-10 Lakhs',
  '₹10-15 Lakhs',
  '₹15-20 Lakhs',
  '₹20-30 Lakhs',
  'Above ₹30 Lakhs',
  'Prefer not to say',
];

const OccupationStep: React.FC<OccupationStepProps> = ({
  data,
  onNext,
  onBack,
}) => {
  const [occupation, setOccupation] = useState(data.occupation || '');
  const [companyName, setCompanyName] = useState(data.companyName || '');
  const [designation, setDesignation] = useState(data.designation || '');
  const [annualIncome, setAnnualIncome] = useState(data.annualIncome || '');
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};

    if (!occupation) {
      newErrors.occupation = 'Please select your occupation type';
    }

    if (occupation === 'Private Sector' || occupation === 'Government' || occupation === 'Business/Self-Employed') {
      if (!companyName.trim()) {
        newErrors.companyName = 'Please enter your company/business name';
      }
      if (!designation.trim()) {
        newErrors.designation = 'Please enter your designation/role';
      }
    }

    if (!annualIncome) {
      newErrors.annualIncome = 'Please select your annual income';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext({
        occupation,
        companyName: companyName.trim(),
        designation: designation.trim(),
        annualIncome,
      });
    }
  };

  const showCompanyFields = ['Private Sector', 'Government', 'Business/Self-Employed'].includes(occupation);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Instructions */}
        <Card style={styles.instructionCard}>
          <Text style={styles.instructionEmoji}>💼</Text>
          <Text style={styles.instructionTitle}>Occupation Details</Text>
          <Text style={styles.instructionText}>
            Tell us about your professional background
          </Text>
        </Card>

        {/* Form */}
        <Card style={styles.formCard}>
          {/* Occupation Type */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Occupation Type <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.optionsColumn}>
              {OCCUPATION_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    occupation === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setOccupation(option);
                    setErrors({ ...errors, occupation: '' });
                  }}>
                  <Text
                    style={[
                      styles.optionText,
                      occupation === option && styles.optionTextSelected,
                    ]}>
                    {option}
                  </Text>
                  {occupation === option && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            {errors.occupation && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errors.occupation}</Text>
              </View>
            )}
          </View>

          {/* Company/Business Name - Conditional */}
          {showCompanyFields && (
            <Input
              label={occupation === 'Business/Self-Employed' ? 'Business Name' : 'Company Name'}
              placeholder={occupation === 'Business/Self-Employed' ? 'Enter your business name' : 'Enter your company name'}
              value={companyName}
              onChangeText={(text) => {
                setCompanyName(text);
                setErrors({ ...errors, companyName: '' });
              }}
              error={errors.companyName}
              required
              leftIcon={<Text style={styles.inputIcon}>🏢</Text>}
            />
          )}

          {/* Designation - Conditional */}
          {showCompanyFields && (
            <Input
              label="Designation/Role"
              placeholder="e.g., Software Engineer, Manager, CEO"
              value={designation}
              onChangeText={(text) => {
                setDesignation(text);
                setErrors({ ...errors, designation: '' });
              }}
              error={errors.designation}
              required
              leftIcon={<Text style={styles.inputIcon}>👔</Text>}
            />
          )}

          {/* Annual Income */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Annual Income <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.optionsColumn}>
              {INCOME_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    annualIncome === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setAnnualIncome(option);
                    setErrors({ ...errors, annualIncome: '' });
                  }}>
                  <Text
                    style={[
                      styles.optionText,
                      annualIncome === option && styles.optionTextSelected,
                    ]}>
                    {option}
                  </Text>
                  {annualIncome === option && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            {errors.annualIncome && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errors.annualIncome}</Text>
              </View>
            )}
          </View>
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

export default OccupationStep;