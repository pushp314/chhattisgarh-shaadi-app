/**
 * Phone Verification Screen
 * Uses Firebase Phone Auth for OTP, then verifies with backend
 */

import React, { useState, useRef } from 'react';
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
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { AuthStackParamList, ProfileStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import authService from '../../services/auth.service';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Theme } from '../../constants/theme';

type PhoneVerificationScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList | ProfileStackParamList,
  'PhoneVerification'
>;

interface Props {
  navigation: PhoneVerificationScreenNavigationProp;
}

const PhoneVerificationScreen: React.FC<Props> = ({ navigation }) => {
  const rootNavigation = useNavigation<any>();
  const { isLoading: authLoading } = useAuthStore();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Firebase confirmation result
  const confirmationRef = useRef<FirebaseAuthTypes.ConfirmationResult | null>(null);

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

  // Check if phone is already verified on mount
  React.useEffect(() => {
    const { user } = useAuthStore.getState();
    if (user?.isPhoneVerified) {
      setTimeout(() => {
        if (user?.profile) {
          rootNavigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Main', params: { screen: 'Home' } }],
            })
          );
        } else {
          rootNavigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Main', params: { screen: 'Profile', params: { screen: 'CreateProfile' } } }],
            })
          );
        }
      }, 100);
    }
  }, []);

  /**
   * Send OTP via Firebase Phone Auth
   */
  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const formattedPhone = `+91${phone}`;

      // Firebase sends OTP directly
      const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
      confirmationRef.current = confirmation;

      setOtpSent(true);
      setResendTimer(30);
      setCanResend(false);
      Alert.alert('OTP Sent', 'Please check your phone for the verification code');
    } catch (err: any) {
      console.error('Firebase OTP Error:', err);
      let errorMessage = 'Failed to send OTP. Please try again.';
      if (err.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      } else if (err.code === 'auth/quota-exceeded') {
        errorMessage = 'SMS quota exceeded. Please try again later.';
      }
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verify OTP with Firebase, then send token to backend
   */
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    if (!confirmationRef.current) {
      setError('Session expired. Please request a new OTP.');
      setOtpSent(false);
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // 1. Verify OTP with Firebase (client-side)
      const credential = await confirmationRef.current.confirm(otp);

      if (!credential?.user) {
        throw new Error('Firebase verification failed');
      }

      // 2. Get Firebase ID Token
      const firebaseIdToken = await credential.user.getIdToken();

      // 3. Send Firebase token to our backend for verification
      await authService.verifyFirebasePhone(firebaseIdToken);

      // 4. Reload user data to get updated isPhoneVerified status
      await useAuthStore.getState().loadUserData();

      const { user, isNewUser } = useAuthStore.getState();

      Alert.alert('Success', 'Phone number verified successfully!', [
        {
          text: 'OK',
          onPress: () => {
            if (isNewUser || !user?.profile) {
              rootNavigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Main', params: { screen: 'Profile', params: { screen: 'CreateProfile' } } }],
                })
              );
            } else {
              rootNavigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Main', params: { screen: 'Home' } }],
                })
              );
            }
          },
        },
      ]);
    } catch (err: any) {
      console.error('Verification Error:', err);
      let errorMessage = 'Verification failed. Please try again.';
      if (err.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid OTP. Please check and try again.';
      } else if (err.code === 'auth/session-expired') {
        errorMessage = 'OTP expired. Please request a new one.';
        setOtpSent(false);
      } else if (err.response?.data?.message) {
        // Backend error
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
      Alert.alert('Verification Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loading = isLoading || authLoading;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={Theme.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verify Phone</Text>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <View style={styles.iconContainer}>
            <Icon name="phone-android" size={60} color={Theme.colors.primary} />
          </View>

          <Text style={styles.title}>Verify Your Phone Number</Text>
          <Text style={styles.subtitle}>
            {otpSent
              ? 'Enter the 6-digit code sent to your phone'
              : 'We need to verify your phone number for security'}
          </Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Icon name="error-outline" size={20} color={Theme.colors.error} />
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
                  placeholderTextColor={Theme.colors.textSecondary}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSendOTP}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={Theme.colors.textOnPrimary} />
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
                placeholderTextColor={Theme.colors.textSecondary}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
              />

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleVerifyOTP}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={Theme.colors.textOnPrimary} />
                ) : (
                  <Text style={styles.buttonText}>Verify OTP</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.resendButton, !canResend && styles.buttonDisabled]}
                onPress={handleSendOTP}
                disabled={!canResend || loading}
              >
                <Text style={styles.resendText}>
                  {canResend ? 'Resend OTP' : `Resend OTP in ${resendTimer}s`}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.infoBox}>
            <Icon name="info-outline" size={20} color={Theme.colors.textSecondary} />
            <Text style={styles.infoText}>
              Phone verification is required only once for security purposes. We will never share your number.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
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
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borderRadius.md,
    ...Theme.shadows.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.colors.text,
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
    backgroundColor: Theme.colors.surfaceCardAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 3,
    borderColor: Theme.colors.secondary,
    ...Theme.shadows.md,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Theme.colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.lg,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: Theme.colors.error,
  },
  errorText: {
    fontSize: 14,
    color: Theme.colors.error,
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
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borderRadius.lg,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.sm,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text,
    marginRight: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: Theme.colors.text,
    paddingVertical: 16,
  },
  otpInput: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borderRadius.lg,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 24,
    color: Theme.colors.text,
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Theme.colors.borderFocus,
    ...Theme.shadows.sm,
  },
  button: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 16,
    borderRadius: Theme.borderRadius.round,
    alignItems: 'center',
    ...Theme.shadows.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.textOnPrimary,
    letterSpacing: 0.5,
  },
  resendButton: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 8,
  },
  resendText: {
    fontSize: 14,
    color: Theme.colors.primary,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Theme.colors.surfaceCard,
    padding: 16,
    borderRadius: Theme.borderRadius.lg,
    marginTop: 24,
    width: '100%',
  },
  infoText: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },
});

export default PhoneVerificationScreen;
