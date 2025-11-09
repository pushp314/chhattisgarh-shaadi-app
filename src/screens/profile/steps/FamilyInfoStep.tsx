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

interface FamilyInfoStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const FamilyInfoStep: React.FC<FamilyInfoStepProps> = ({
  data,
  onNext,
  onBack,
}) => {
  const [fatherName, setFatherName] = useState(data.fatherName || '');
  const [fatherOccupation, setFatherOccupation] = useState(data.fatherOccupation || '');
  const [motherName, setMotherName] = useState(data.motherName || '');
  const [motherOccupation, setMotherOccupation] = useState(data.motherOccupation || '');
  const [numberOfBrothers, setNumberOfBrothers] = useState(data.numberOfBrothers?.toString() || '0');
  const [numberOfSisters, setNumberOfSisters] = useState(data.numberOfSisters?.toString() || '0');
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};

    if (!fatherName.trim()) {
      newErrors.fatherName = "Please enter your father's name";
    }

    if (!motherName.trim()) {
      newErrors.motherName = "Please enter your mother's name";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext({
        fatherName: fatherName.trim(),
        fatherOccupation: fatherOccupation.trim(),
        motherName: motherName.trim(),
        motherOccupation: motherOccupation.trim(),
        numberOfBrothers: parseInt(numberOfBrothers) || 0,
        numberOfSisters: parseInt(numberOfSisters) || 0,
      });
    }
  };

  const renderNumberButtons = (
    value: string,
    setValue: (val: string) => void,
    max: number = 10
  ) => {
    const numbers = Array.from({ length: max + 1 }, (_, i) => i.toString());
    return (
      <View style={styles.numberGrid}>
        {numbers.map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.numberButton,
              value === num && styles.numberButtonSelected,
            ]}
            onPress={() => setValue(num)}>
            <Text
              style={[
                styles.numberText,
                value === num && styles.numberTextSelected,
              ]}>
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Instructions */}
        <Card style={styles.instructionCard}>
          <Text style={styles.instructionEmoji}>👨‍👩‍👧‍👦</Text>
          <Text style={styles.instructionTitle}>Family Details</Text>
          <Text style={styles.instructionText}>
            Tell us about your family background
          </Text>
        </Card>

        {/* Form */}
        <Card style={styles.formCard}>
          {/* Father's Name */}
          <Input
            label="Father's Name"
            placeholder="Enter your father's name"
            value={fatherName}
            onChangeText={(text) => {
              setFatherName(text);
              setErrors({ ...errors, fatherName: '' });
            }}
            error={errors.fatherName}
            required
            leftIcon={<Text style={styles.inputIcon}>👨</Text>}
          />

          {/* Father's Occupation */}
          <Input
            label="Father's Occupation (Optional)"
            placeholder="e.g., Business, Teacher, Retired"
            value={fatherOccupation}
            onChangeText={setFatherOccupation}
            leftIcon={<Text style={styles.inputIcon}>💼</Text>}
          />

          {/* Mother's Name */}
          <Input
            label="Mother's Name"
            placeholder="Enter your mother's name"
            value={motherName}
            onChangeText={(text) => {
              setMotherName(text);
              setErrors({ ...errors, motherName: '' });
            }}
            error={errors.motherName}
            required
            leftIcon={<Text style={styles.inputIcon}>👩</Text>}
          />

          {/* Mother's Occupation */}
          <Input
            label="Mother's Occupation (Optional)"
            placeholder="e.g., Homemaker, Teacher, Business"
            value={motherOccupation}
            onChangeText={setMotherOccupation}
            leftIcon={<Text style={styles.inputIcon}>💼</Text>}
          />

          {/* Number of Brothers */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Number of Brothers</Text>
            <Text style={styles.helper}>Select the number</Text>
            {renderNumberButtons(numberOfBrothers, setNumberOfBrothers, 5)}
          </View>

          {/* Number of Sisters */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Number of Sisters</Text>
            <Text style={styles.helper}>Select the number</Text>
            {renderNumberButtons(numberOfSisters, setNumberOfSisters, 5)}
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
    marginBottom: 4,
  },
  helper: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  inputIcon: {
    fontSize: 20,
  },
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  numberButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.neutral.gray300,
    backgroundColor: colors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberButtonSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.main,
  },
  numberText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  numberTextSelected: {
    color: colors.neutral.white,
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

export default FamilyInfoStep;