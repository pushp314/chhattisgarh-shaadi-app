import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { Button, Input, Card } from '../../../components';
import { colors } from '../../../theme/colors';

interface AboutStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const AboutStep: React.FC<AboutStepProps> = ({
  data,
  onNext,
  onBack,
}) => {
  const [bio, setBio] = useState(data.bio || '');
  const [hobbies, setHobbies] = useState(data.hobbies || '');
  const [interests, setInterests] = useState(data.interests || '');
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};

    if (!bio.trim()) {
      newErrors.bio = 'Please write something about yourself';
    } else if (bio.trim().length < 50) {
      newErrors.bio = 'Bio should be at least 50 characters';
    } else if (bio.trim().length > 500) {
      newErrors.bio = 'Bio should not exceed 500 characters';
    }

    if (!hobbies.trim()) {
      newErrors.hobbies = 'Please mention your hobbies';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext({
        bio: bio.trim(),
        hobbies: hobbies.trim(),
        interests: interests.trim(),
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
          <Text style={styles.instructionEmoji}>✍️</Text>
          <Text style={styles.instructionTitle}>About Yourself</Text>
          <Text style={styles.instructionText}>
            Share your personality, interests, and what makes you unique
          </Text>
        </Card>

        {/* Form */}
        <Card style={styles.formCard}>
          {/* Bio */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              About Me <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.helper}>
              Write a brief description about yourself (50-500 characters)
            </Text>
            <TextInput
              style={[
                styles.textArea,
                errors.bio && styles.textAreaError,
              ]}
              placeholder="Tell us about yourself, your personality, values, and what you're looking for..."
              placeholderTextColor={colors.text.disabled}
              value={bio}
              onChangeText={(text) => {
                setBio(text);
                setErrors({ ...errors, bio: '' });
              }}
              multiline
              numberOfLines={6}
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>
              {bio.length}/500 characters
            </Text>
            {errors.bio && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errors.bio}</Text>
              </View>
            )}
          </View>

          {/* Hobbies */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Hobbies <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.helper}>
              What do you enjoy doing in your free time?
            </Text>
            <TextInput
              style={[
                styles.textArea,
                styles.textAreaSmall,
                errors.hobbies && styles.textAreaError,
              ]}
              placeholder="e.g., Reading, Traveling, Cooking, Music, Sports..."
              placeholderTextColor={colors.text.disabled}
              value={hobbies}
              onChangeText={(text) => {
                setHobbies(text);
                setErrors({ ...errors, hobbies: '' });
              }}
              multiline
              numberOfLines={3}
              maxLength={200}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>
              {hobbies.length}/200 characters
            </Text>
            {errors.hobbies && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errors.hobbies}</Text>
              </View>
            )}
          </View>

          {/* Interests */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Interests (Optional)
            </Text>
            <Text style={styles.helper}>
              What are you passionate about?
            </Text>
            <TextInput
              style={[styles.textArea, styles.textAreaSmall]}
              placeholder="e.g., Technology, Arts, Social Work, Environment..."
              placeholderTextColor={colors.text.disabled}
              value={interests}
              onChangeText={setInterests}
              multiline
              numberOfLines={3}
              maxLength={200}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>
              {interests.length}/200 characters
            </Text>
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
  required: {
    color: colors.error,
  },
  helper: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text.primary,
    minHeight: 120,
  },
  textAreaSmall: {
    minHeight: 80,
  },
  textAreaError: {
    borderColor: colors.error,
  },
  charCount: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'right',
    marginTop: 4,
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

export default AboutStep;