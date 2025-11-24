/**
 * Phone Verification Screen
 * One-time phone verification after Google sign-in
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { AuthStackParamList, ProfileStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

type PhoneVerificationScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList | ProfileStackParamList,
  'PhoneVerification'
>;

interface Props {
  navigation: PhoneVerificationScreenNavigationProp;
}

const PhoneVerificationScreen: React.FC<Props> = ({ navigation }) => {
  const rootNavigation = useNavigation<any>();
  const { sendPhoneOTP, verifyPhoneOTP, isLoading } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  React.useEffect(() => {
    let interval: any;
    if (otpSent && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [otpSent, resendTimer]);

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setError('');
      await sendPhoneOTP(phone, '+91');
      setOtpSent(true);
      setResendTimer(30);
      setCanResend(false);
      Alert.alert('OTP Sent', 'Please check your phone for the verification code');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to send OTP';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setError('');
      await verifyPhoneOTP(phone, otp);

      // Navigate to Home tab after successful verification
      // Get the parent navigator (Main tab navigator) and navigate to Home
      const parent = rootNavigation.getParent();
      if (parent) {
        parent.navigate('Home');
      } else {
        // Fallback: navigate to Main -> Home
        rootNavigation.navigate('Main', { screen: 'Home' });
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Invalid OTP';
      setError(errorMessage);
      Alert.alert('Verification Failed', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F06292', '#D81B60']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Verify Phone</Text>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <View style={styles.iconContainer}>
              <Icon name="phone-android" size={60} color="#FFFFFF" />
            </View>

            <Text style={styles.title}>Verify Your Phone Number</Text>
            <Text style={styles.subtitle}>
              {otpSent
                ? 'Enter the 6-digit code sent to your phone'
                : 'We need to verify your phone number for security'}
            </Text>

            {error ? (
              <View style={styles.errorContainer}>
                <Icon name="error-outline" size={20} color="#FF5252" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {!otpSent ? (
              <View style={styles.inputSection}>
                <View style={styles.phoneInputContainer}>
                  <Text style={styles.countryCode}>+91</Text>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="Enter 10-digit phone number"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                  onPress={handleSendOTP}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#D81B60" />
                  ) : (
                    <Text style={styles.buttonText}>Send OTP</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.inputSection}>
                <TextInput
                  style={styles.otpInput}
                  placeholder="Enter 6-digit OTP"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                />

                <TouchableOpacity
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                  onPress={handleVerifyOTP}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#D81B60" />
                  ) : (
                    <Text style={styles.buttonText}>Verify OTP</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.resendButton, !canResend && styles.buttonDisabled]}
                  onPress={handleSendOTP}
                  disabled={!canResend || isLoading}
                >
                  <Text style={styles.resendText}>
                    {canResend ? 'Resend OTP' : `Resend OTP in ${resendTimer}s`}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.infoBox}>
              <Icon name="info-outline" size={20} color="#FFFFFF" />
              <Text style={styles.infoText}>
                Phone verification is required only once for security purposes. We will never share your number.
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 16,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  errorText: {
    fontSize: 14,
    color: '#FF5252',
    marginLeft: 8,
    flex: 1,
  },
  inputSection: {
    width: '100%',
    marginBottom: 20,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 16,
  },
  otpInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D81B60',
  },
  resendButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    width: '100%',
  },
  infoText: {
    fontSize: 13,
    color: '#FFFFFF',
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },
});

export default PhoneVerificationScreen;
