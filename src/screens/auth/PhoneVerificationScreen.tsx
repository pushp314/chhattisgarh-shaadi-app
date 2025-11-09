import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
// ADDED navigation imports
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Assuming the path to your navigation types is correct:
import { AuthStackParamList } from '../../navigation/types'; 

import { colors } from '../../theme/colors';

// ADDED type for navigation prop
type PhoneVerificationScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'PhoneVerification'
>;

interface CountryCode {
  code: string;
  name: string;
  dial_code: string;
  flag: string;
}

const countryCodes: CountryCode[] = [
  { code: 'IN', name: 'India', dial_code: '+91', flag: '🇮🇳' },
  { code: 'US', name: 'United States', dial_code: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dial_code: '+44', flag: '🇬🇧' },
  { code: 'AE', name: 'United Arab Emirates', dial_code: '+971', flag: '🇦🇪' },
  { code: 'AU', name: 'Australia', dial_code: '+61', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', dial_code: '+1', flag: '🇨🇦' },
  { code: 'SG', name: 'Singapore', dial_code: '+65', flag: '🇸🇬' },
];

// REMOVED old interface PhoneVerificationScreenProps
// UPDATED component to use navigation hook
const PhoneVerificationScreen = () => {
  // ADDED navigation hook
  const navigation = useNavigation<PhoneVerificationScreenNavigationProp>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
    countryCodes[0]
  );
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePhoneNumber = (phone: string): boolean => {
    // Remove all non-digits
    const digitsOnly = phone.replace(/\D/g, '');

    // Indian phone number validation (10 digits)
    if (selectedCountry.code === 'IN') {
      return digitsOnly.length === 10 && /^[6-9]/.test(digitsOnly);
    }

    // General validation (7-15 digits)
    return digitsOnly.length >= 7 && digitsOnly.length <= 15;
  };

  const formatPhoneNumber = (text: string): string => {
    // Remove all non-digits
    const digitsOnly = text.replace(/\D/g, '');

    // Format for Indian numbers (10 digits)
    if (selectedCountry.code === 'IN') {
      if (digitsOnly.length <= 5) {
        return digitsOnly;
      } else if (digitsOnly.length <= 10) {
        return `${digitsOnly.slice(0, 5)} ${digitsOnly.slice(5)}`;
      }
      return `${digitsOnly.slice(0, 5)} ${digitsOnly.slice(5, 10)}`;
    }

    return digitsOnly;
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
    setError('');
  };

  const handleContinue = () => {
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    // Mock API call
    setTimeout(() => {
      setLoading(false);
      // UPDATED to use navigation.navigate
      navigation.navigate('OtpVerification', {
        phoneNumber: phoneNumber,
        countryCode: selectedCountry.dial_code,
      });
    }, 1500);
  };

  const renderCountryItem = ({ item }: { item: CountryCode }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => {
        setSelectedCountry(item);
        setShowCountryPicker(false);
        setPhoneNumber('');
        setError('');
      }}
      activeOpacity={0.7}>
      <Text style={styles.countryFlag}>{item.flag}</Text>
      <View style={styles.countryInfo}>
        <Text style={styles.countryName}>{item.name}</Text>
        <Text style={styles.countryDialCode}>{item.dial_code}</Text>
      </View>
      {selectedCountry.code === item.code && (
        <Text style={styles.checkMark}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar
        backgroundColor={colors.neutral.white}
        barStyle="dark-content"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        {/* Back Button */}
        {/* UPDATED onPress to use navigation.goBack() */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.phoneIcon}>📱</Text>
          </View>

          <Text style={styles.title}>Enter Your Phone Number</Text>
          <Text style={styles.titleHindi}>अपना फोन नंबर दर्ज करें</Text>
          <Text style={styles.titleCg}>अपन फोन नंबर डालव</Text>

          <Text style={styles.subtitle}>
            We'll send you a verification code
          </Text>
          <Text style={styles.subtitleHindi}>
            हम आपको एक सत्यापन कोड भेजेंगे
          </Text>
        </View>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <Text style={styles.labelHindi}>फोन नंबर</Text>

          <View style={styles.phoneInputWrapper}>
            {/* Country Code Selector */}
            <TouchableOpacity
              style={styles.countrySelector}
              onPress={() => setShowCountryPicker(true)}
              activeOpacity={0.7}>
              <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
              <Text style={styles.dialCode}>{selectedCountry.dial_code}</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>

            {/* Phone Number Input */}
            <TextInput
              style={styles.phoneInput}
              placeholder="Enter phone number"
              placeholderTextColor={colors.text.disabled}
              value={phoneNumber}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              maxLength={selectedCountry.code === 'IN' ? 12 : 20}
              autoFocus={true}
            />
          </View>

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Helper Text */}
          <View style={styles.helperContainer}>
            <Text style={styles.helperIcon}>ℹ️</Text>
            <Text style={styles.helperText}>
              A 6-digit OTP will be sent to this number for verification
            </Text>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            loading && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={loading}
          activeOpacity={0.8}>
          <Text style={styles.continueButtonText}>
            {loading ? 'Sending OTP...' : 'Continue'}
          </Text>
          <Text style={styles.continueButtonTextHindi}>
            {loading ? 'OTP भेजा जा रहा है...' : 'जारी रखें'}
          </Text>
        </TouchableOpacity>

        {/* Privacy Note */}
        <View style={styles.privacyNote}>
          <Text style={styles.privacyIcon}>🔒</Text>
          <Text style={styles.privacyText}>
            Your phone number is safe with us and will never be shared
          </Text>
        </View>
      </ScrollView>

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCountryPicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity
                onPress={() => setShowCountryPicker(false)}
                style={styles.modalCloseButton}>
                <Text style={styles.modalCloseIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={countryCodes}
              renderItem={renderCountryItem}
              keyExtractor={item => item.code}
              style={styles.countryList}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 30,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.neutral.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  backIcon: {
    fontSize: 24,
    color: colors.text.primary,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary.lighter,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  phoneIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 6,
  },
  titleHindi: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  titleCg: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitleHindi: {
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  labelHindi: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.neutral.gray300,
    borderRadius: 12,
    backgroundColor: colors.neutral.white,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRightWidth: 1,
    borderRightColor: colors.neutral.gray300,
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 8,
  },
  dialCode: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginRight: 4,
  },
  dropdownIcon: {
    fontSize: 10,
    color: colors.text.secondary,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.text.primary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  errorText: {
    fontSize: 13,
    color: colors.error,
  },
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  helperIcon: {
    fontSize: 16,
    marginRight: 6,
    marginTop: 2,
  },
  helperText: {
    flex: 1,
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  continueButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: colors.primary.main,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.neutral.white,
    marginBottom: 2,
  },
  continueButtonTextHindi: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.white,
    opacity: 0.95,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '10',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  privacyIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  privacyText: {
    flex: 1,
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray200,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neutral.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseIcon: {
    fontSize: 18,
    color: colors.text.primary,
  },
  countryList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
  },
  countryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 2,
  },
  countryDialCode: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  checkMark: {
    fontSize: 20,
    color: colors.primary.main,
    fontWeight: 'bold',
  },
});

export default PhoneVerificationScreen;