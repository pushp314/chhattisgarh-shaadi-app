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
import { Button, Input, Card } from '../../../components';
import { colors } from '../../../theme/colors';

interface HoroscopeStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const MANGLIK_OPTIONS = ['Yes', 'No', "Don't Know"];
const RASHI_OPTIONS = [
  'Mesh (Aries)',
  'Vrishabh (Taurus)',
  'Mithun (Gemini)',
  'Kark (Cancer)',
  'Simha (Leo)',
  'Kanya (Virgo)',
  'Tula (Libra)',
  'Vrishchik (Scorpio)',
  'Dhanu (Sagittarius)',
  'Makar (Capricorn)',
  'Kumbh (Aquarius)',
  'Meen (Pisces)',
];

const HoroscopeStep: React.FC<HoroscopeStepProps> = ({
  data,
  onNext,
  onBack,
}) => {
  const [manglik, setManglik] = useState(data.manglik === true ? 'Yes' : data.manglik === false ? 'No' : "Don't Know");
  const [birthTime, setBirthTime] = useState(data.birthTime ? new Date(`2000-01-01T${data.birthTime}`) : new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [birthPlace, setBirthPlace] = useState(data.birthPlace || '');
  const [rashi, setRashi] = useState(data.rashi || '');
  const [nakshatra, setNakshatra] = useState(data.nakshatra || '');

  const handleNext = () => {
    const timeString = `${birthTime.getHours().toString().padStart(2, '0')}:${birthTime.getMinutes().toString().padStart(2, '0')}`;
    
    onNext({
      manglik: manglik === 'Yes' ? true : manglik === 'No' ? false : undefined,
      birthTime: timeString,
      birthPlace: birthPlace.trim(),
      rashi,
      nakshatra: nakshatra.trim(),
    });
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setBirthTime(selectedTime);
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Instructions */}
        <Card style={styles.instructionCard}>
          <Text style={styles.instructionEmoji}>⭐</Text>
          <Text style={styles.instructionTitle}>Horoscope Details</Text>
          <Text style={styles.instructionText}>
            Astrological information (Optional but recommended)
          </Text>
        </Card>

        {/* Form */}
        <Card style={styles.formCard}>
          {/* Manglik */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Are you Manglik?</Text>
            <View style={styles.optionsRow}>
              {MANGLIK_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    manglik === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => setManglik(option)}>
                  <Text
                    style={[
                      styles.optionText,
                      manglik === option && styles.optionTextSelected,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Birth Time */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Birth Time</Text>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowTimePicker(true)}>
              <Text style={styles.timeIcon}>⏰</Text>
              <Text style={styles.timeText}>{formatTime(birthTime)}</Text>
            </TouchableOpacity>
          </View>

          {showTimePicker && (
            <DateTimePicker
              value={birthTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onTimeChange}
            />
          )}

          {/* Birth Place */}
          <Input
            label="Birth Place"
            placeholder="City where you were born"
            value={birthPlace}
            onChangeText={setBirthPlace}
            leftIcon={<Text style={styles.inputIcon}>📍</Text>}
          />

          {/* Rashi */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Rashi (Moon Sign)</Text>
            <View style={styles.optionsGrid}>
              {RASHI_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButtonBlock,
                    rashi === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => setRashi(option)}>
                  <Text
                    style={[
                      styles.optionText,
                      rashi === option && styles.optionTextSelected,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Nakshatra */}
          <Input
            label="Nakshatra (Birth Star)"
            placeholder="e.g., Ashwini, Rohini, Mrigashira"
            value={nakshatra}
            onChangeText={setNakshatra}
            leftIcon={<Text style={styles.inputIcon}>✨</Text>}
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
  inputIcon: {
    fontSize: 20,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  timeIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  timeText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionsGrid: {
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
  },
  optionButtonBlock: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral.gray300,
    backgroundColor: colors.neutral.white,
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

export default HoroscopeStep;