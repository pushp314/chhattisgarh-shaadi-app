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

interface PhysicalAttributesStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const COMPLEXION_OPTIONS = ['Very Fair', 'Fair', 'Wheatish', 'Dusky', 'Dark'];
const BODY_TYPE_OPTIONS = ['Slim', 'Average', 'Athletic', 'Heavy'];

const PhysicalAttributesStep: React.FC<PhysicalAttributesStepProps> = ({
  data,
  onNext,
  onBack,
}) => {
  const [height, setHeight] = useState(data.height?.toString() || '');
  const [weight, setWeight] = useState(data.weight?.toString() || '');
  const [complexion, setComplexion] = useState(data.complexion || '');
  const [bodyType, setBodyType] = useState(data.bodyType || '');
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};

    if (!height) {
      newErrors.height = 'Please enter your height';
    } else {
      const heightNum = parseInt(height);
      if (heightNum < 120 || heightNum > 250) {
        newErrors.height = 'Height must be between 120-250 cm';
      }
    }

    if (!weight) {
      newErrors.weight = 'Please enter your weight';
    } else {
      const weightNum = parseInt(weight);
      if (weightNum < 30 || weightNum > 200) {
        newErrors.weight = 'Weight must be between 30-200 kg';
      }
    }

    if (!complexion) {
      newErrors.complexion = 'Please select your complexion';
    }

    if (!bodyType) {
      newErrors.bodyType = 'Please select your body type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext({
        height: parseInt(height),
        weight: parseInt(weight),
        complexion,
        bodyType,
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
          <Text style={styles.instructionEmoji}>💪</Text>
          <Text style={styles.instructionTitle}>Physical Attributes</Text>
          <Text style={styles.instructionText}>
            Help us with your physical characteristics
          </Text>
        </Card>

        {/* Form */}
        <Card style={styles.formCard}>
          {/* Height */}
          <Input
            label="Height (in cm)"
            placeholder="e.g., 170"
            value={height}
            onChangeText={(text) => {
              setHeight(text.replace(/[^0-9]/g, ''));
              setErrors({ ...errors, height: '' });
            }}
            error={errors.height}
            required
            keyboardType="numeric"
            leftIcon={<Text style={styles.inputIcon}>📏</Text>}
            helperText="Enter your height in centimeters"
          />

          {/* Weight */}
          <Input
            label="Weight (in kg)"
            placeholder="e.g., 65"
            value={weight}
            onChangeText={(text) => {
              setWeight(text.replace(/[^0-9]/g, ''));
              setErrors({ ...errors, weight: '' });
            }}
            error={errors.weight}
            required
            keyboardType="numeric"
            leftIcon={<Text style={styles.inputIcon}>⚖️</Text>}
            helperText="Enter your weight in kilograms"
          />

          {/* Complexion */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Complexion <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.optionsRow}>
              {COMPLEXION_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    complexion === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setComplexion(option);
                    setErrors({ ...errors, complexion: '' });
                  }}>
                  <Text
                    style={[
                      styles.optionText,
                      complexion === option && styles.optionTextSelected,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.complexion && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errors.complexion}</Text>
              </View>
            )}
          </View>

          {/* Body Type */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Body Type <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.optionsRow}>
              {BODY_TYPE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    bodyType === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setBodyType(option);
                    setErrors({ ...errors, bodyType: '' });
                  }}>
                  <Text
                    style={[
                      styles.optionText,
                      bodyType === option && styles.optionTextSelected,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.bodyType && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errors.bodyType}</Text>
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

export default PhysicalAttributesStep;