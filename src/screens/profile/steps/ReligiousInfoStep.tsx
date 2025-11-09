import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Button, Input, Card } from '../../../components'; // Assuming components are here
import { colors } from '../../../theme/colors';

interface ReligiousInfoStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void; // Passed from CreateProfileScreen
}

// Your specific options
const RELIGION_OPTIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Other'];
const CASTE_OPTIONS = ['General', 'OBC', 'SC', 'ST', 'Other'];
const MOTHER_TONGUE_OPTIONS = [
  'Chhattisgarhi', 'Hindi', 'English', 'Bengali', 'Telugu', 'Marathi',
  'Tamil', 'Gujarati', 'Urdu', 'Kannada', 'Odia', 'Malayalam',
  'Punjabi', 'Other',
];

const ReligiousInfoStep: React.FC<ReligiousInfoStepProps> = ({
  data,
  onNext,
  onBack, // Receive the onBack function
}) => {
  const [religion, setReligion] = useState(data.religion || '');
  const [caste, setCaste] = useState(data.caste || '');
  const [subCaste, setSubCaste] = useState(data.subCaste || '');
  const [motherTongue, setMotherTongue] = useState(data.motherTongue || '');
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};
    if (!religion) newErrors.religion = 'Please select your religion';
    if (!caste) newErrors.caste = 'Please select your caste';
    if (!motherTongue) newErrors.motherTongue = 'Please select your mother tongue';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext({
        religion,
        caste,
        subCaste: subCaste.trim(),
        motherTongue,
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
          <Text style={styles.instructionEmoji}>🙏</Text>
          <Text style={styles.instructionTitle}>Religious Information</Text>
          <Text style={styles.instructionText}>
            Help us understand your religious background and preferences
          </Text>
        </Card>

        {/* Form */}
        <Card style={styles.formCard}>
          {/* Religion */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Religion <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.optionsGrid}>
              {RELIGION_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    religion === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setReligion(option);
                    setErrors({ ...errors, religion: '' });
                  }}>
                  <Text
                    style={[
                      styles.optionText,
                      religion === option && styles.optionTextSelected,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.religion && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errors.religion}</Text>
              </View>
            )}
          </View>

          {/* Caste */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Caste <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.optionsRow}>
              {CASTE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButtonSmall,
                    caste === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setCaste(option);
                    setErrors({ ...errors, caste: '' });
                  }}>
                  <Text
                    style={[
                      styles.optionText,
                      caste === option && styles.optionTextSelected,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.caste && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errors.caste}</Text>
              </View>
            )}
          </View>

          {/* Sub Caste */}
          <Input
            label="Sub Caste (Optional)"
            placeholder="Enter your sub caste"
            value={subCaste}
            onChangeText={setSubCaste}
            leftIcon={<Text style={styles.inputIcon}>👥</Text>}
          />

          {/* Mother Tongue */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Mother Tongue <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.optionsGrid}>
              {MOTHER_TONGUE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    motherTongue === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setMotherTongue(option);
                    setErrors({ ...errors, motherTongue: '' });
                  }}>
                  <Text
                    style={[
                      styles.optionText,
                      motherTongue === option && styles.optionTextSelected,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.motherTongue && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errors.motherTongue}</Text>
              </View>
            )}
          </View>
        </Card>
      </ScrollView>

      {/* --- UPDATED Bottom Buttons Layout --- */}
      <View style={styles.bottomButtons}>
          <Button
            title="Back"
            onPress={onBack} // Use the onBack prop
            variant="outline"
            style={styles.backButton} // Use flex: 1 style
            leftIcon={<Text style={styles.buttonIconOutline}>←</Text>}
          />
          <Button
            title="Next"
            onPress={handleNext}
            style={styles.nextButton} // Use flex: 2 style
            rightIcon={<Text style={styles.buttonIcon}>→</Text>}
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
    paddingBottom: 100, // Space for the fixed footer
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
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral.gray300,
    backgroundColor: colors.neutral.white,
    minWidth: '30%', // Adjust for grid layout
    alignItems: 'center',
  },
  optionButtonSmall: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral.gray300,
    backgroundColor: colors.neutral.white,
    // flex: 1, // Let width be determined by content or grid
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
  optionTextSelected: {
    color: colors.primary.main,
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
    // --- UPDATED: Use flexDirection row directly ---
    flexDirection: 'row',
    gap: 12, // Use gap for spacing
  },
  // REMOVED buttonRow style
  backButton: {
    flex: 1, // Back button takes 1 part of space
  },
  nextButton: {
    flex: 2, // Next button takes 2 parts of space
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

export default ReligiousInfoStep;