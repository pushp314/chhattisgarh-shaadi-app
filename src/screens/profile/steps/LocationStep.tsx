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

interface LocationStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const COUNTRY_OPTIONS = ['India', 'USA', 'UK', 'Canada', 'Australia', 'UAE'];
const INDIA_STATES = [
  'Chhattisgarh',
  'Maharashtra',
  'Delhi',
  'Karnataka',
  'Tamil Nadu',
  'Gujarat',
  'Rajasthan',
  'Uttar Pradesh',
  'West Bengal',
  'Madhya Pradesh',
  'Other',
];

const LocationStep: React.FC<LocationStepProps> = ({
  data,
  onNext,
  onBack,
}) => {
  const [country, setCountry] = useState(data.country || 'India');
  const [state, setState] = useState(data.state || '');
  const [city, setCity] = useState(data.city || '');
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};

    if (!country) {
      newErrors.country = 'Please select your country';
    }
    if (!state.trim()) {
      newErrors.state = 'Please select or enter your state';
    }
    if (!city.trim()) {
      newErrors.city = 'Please enter your city';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext({
        country,
        state: state.trim(),
        city: city.trim(),
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
          <Text style={styles.instructionEmoji}>📍</Text>
          <Text style={styles.instructionTitle}>Location Details</Text>
          <Text style={styles.instructionText}>
            Where are you currently living?
          </Text>
        </Card>

        {/* Form */}
        <Card style={styles.formCard}>
          {/* Country */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Country <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.optionsGrid}>
              {COUNTRY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    country === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setCountry(option);
                    setErrors({ ...errors, country: '' });
                  }}>
                  <Text
                    style={[
                      styles.optionText,
                      country === option && styles.optionTextSelected,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.country && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errors.country}</Text>
              </View>
            )}
          </View>

          {/* State - Show options if India */}
          {country === 'India' ? (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                State <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.optionsGrid}>
                {INDIA_STATES.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      state === option && styles.optionButtonSelected,
                    ]}
                    onPress={() => {
                      setState(option);
                      setErrors({ ...errors, state: '' });
                    }}>
                    <Text
                      style={[
                        styles.optionText,
                        state === option && styles.optionTextSelected,
                      ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.state && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorIcon}>⚠️</Text>
                  <Text style={styles.errorText}>{errors.state}</Text>
                </View>
              )}
            </View>
          ) : (
            <Input
              label="State/Province"
              placeholder="Enter your state or province"
              value={state}
              onChangeText={(text) => {
                setState(text);
                setErrors({ ...errors, state: '' });
              }}
              error={errors.state}
              required
              leftIcon={<Text style={styles.inputIcon}>🗺️</Text>}
            />
          )}

          {/* City */}
          <Input
            label="City"
            placeholder="Enter your city"
            value={city}
            onChangeText={(text) => {
              setCity(text);
              setErrors({ ...errors, city: '' });
            }}
            error={errors.city}
            required
            leftIcon={<Text style={styles.inputIcon}>🏙️</Text>}
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
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
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

export default LocationStep;