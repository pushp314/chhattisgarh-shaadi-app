import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Button, Card } from '../../../components';
import { colors } from '../../../theme/colors';

interface LifestyleStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const DIET_OPTIONS = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan'];
const SMOKING_OPTIONS = ['No', 'Yes', 'Occasionally'];
const DRINKING_OPTIONS = ['No', 'Yes', 'Socially', 'Occasionally'];

const LifestyleStep: React.FC<LifestyleStepProps> = ({
  data,
  onNext,
  onBack,
}) => {
  const [diet, setDiet] = useState(data.diet || '');
  const [smoking, setSmoking] = useState(data.smoking || '');
  const [drinking, setDrinking] = useState(data.drinking || '');
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};

    if (!diet) {
      newErrors.diet = 'Please select your diet preference';
    }
    if (!smoking) {
      newErrors.smoking = 'Please select your smoking habit';
    }
    if (!drinking) {
      newErrors.drinking = 'Please select your drinking habit';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext({
        diet,
        smoking,
        drinking,
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
          <Text style={styles.instructionEmoji}>🌟</Text>
          <Text style={styles.instructionTitle}>Lifestyle Preferences</Text>
          <Text style={styles.instructionText}>
            Tell us about your lifestyle choices and habits
          </Text>
        </Card>

        {/* Form */}
        <Card style={styles.formCard}>
          {/* Diet */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Diet Preference <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.helper}>What type of food do you prefer?</Text>
            <View style={styles.optionsRow}>
              {DIET_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    diet === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setDiet(option);
                    setErrors({ ...errors, diet: '' });
                  }}>
                  <Text
                    style={[
                      styles.optionText,
                      diet === option && styles.optionTextSelected,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.diet && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errors.diet}</Text>
              </View>
            )}
          </View>

          {/* Smoking */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Smoking Habit <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.helper}>Do you smoke?</Text>
            <View style={styles.optionsRow}>
              {SMOKING_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    smoking === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setSmoking(option);
                    setErrors({ ...errors, smoking: '' });
                  }}>
                  <Text
                    style={[
                      styles.optionText,
                      smoking === option && styles.optionTextSelected,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.smoking && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errors.smoking}</Text>
              </View>
            )}
          </View>

          {/* Drinking */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Drinking Habit <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.helper}>Do you drink alcohol?</Text>
            <View style={styles.optionsRow}>
              {DRINKING_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    drinking === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setDrinking(option);
                    setErrors({ ...errors, drinking: '' });
                  }}>
                  <Text
                    style={[
                      styles.optionText,
                      drinking === option && styles.optionTextSelected,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.drinking && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errors.drinking}</Text>
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
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  required: {
    color: colors.error,
  },
  helper: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral.gray300,
    backgroundColor: colors.neutral.white,
    alignItems: 'center',
    minWidth: '45%',
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

export default LifestyleStep;