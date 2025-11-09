import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

// --- REANIMATED IMPORTS ---
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type OtpVerificationScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'OtpVerification'
>;

type OtpVerificationScreenRouteProp = RouteProp<
  AuthStackParamList,
  'OtpVerification'
>;

const OtpVerificationScreen = () => {
  const navigation = useNavigation<OtpVerificationScreenNavigationProp>();
  const route = useRoute<OtpVerificationScreenRouteProp>();

  const { phoneNumber, countryCode } = route.params;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  // --- REANIMATED: Shared value for shake animation ---
  const shakeTranslateX = useSharedValue(0);

  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // --- REANIMATED: Trigger shake animation on error ---
  useEffect(() => {
    if (error) {
      shakeTranslateX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    }
  }, [error, shakeTranslateX]);

  const handleOtpChange = (value: string, index: number) => {
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(''); // Clear error on new input

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 5 && value) {
      const fullOtp = [...newOtp.slice(0, 5), value].join('');
      if (fullOtp.length === 6) {
        handleVerify(fullOtp);
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (otpCode?: string) => {
    const otpToVerify = otpCode || otp.join('');

    if (otpToVerify.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    // Mock OTP verification
    setTimeout(() => {
      setLoading(false);
      // Mock failure (uncomment to test shake)
      // if (otpToVerify !== '123456') {
      //   setError('Invalid OTP. Please try again.');
      //   return;
      // }
      navigation.navigate('LanguageSelection');
    }, 2000);
  };

  const handleResendOtp = () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(30);
    setOtp(['', '', '', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
    // onResendOtp();
  };

  const handleEditNumber = () => {
    navigation.goBack();
  };

  // --- REANIMATED: Animated style for the shake ---
  const animatedOtpContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeTranslateX.value }],
    };
  });

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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.messageIcon}>💬</Text>
          </View>
          <Text style={styles.title}>Verify Phone Number</Text>
          <Text style={styles.titleHindi}>फोन नंबर सत्यापित करें</Text>
          <Text style={styles.titleCg}>फोन नंबर चेक करव</Text>
          <Text style={styles.subtitle}>Enter the 6-digit code sent to</Text>
          <Text style={styles.subtitleHindi}>
            भेजे गए 6-अंकों का कोड दर्ज करें
          </Text>
          <View style={styles.phoneNumberContainer}>
            <Text style={styles.phoneNumber}>
              {countryCode} {phoneNumber}
            </Text>
            <TouchableOpacity onPress={handleEditNumber}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- REANIMATED: Apply animated style to this View --- */}
        <Animated.View style={[styles.otpContainer, animatedOtpContainerStyle]}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              // --- FIXED: Added curly braces to ref callback to return void ---
              ref={ref => {
                inputRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                digit ? styles.otpInputFilled : {},
                error ? styles.otpInputError : {},
              ]}
              value={digit}
              onChangeText={value => handleOtpChange(value, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              autoFocus={index === 0}
            />
          ))}
        </Animated.View>

        {/* Error Message */}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          {canResend ? (
            <TouchableOpacity onPress={handleResendOtp}>
              <Text style={styles.resendLink}>Resend OTP</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.resendTimer}>
              Resend in {resendTimer}s
            </Text>
          )}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            (loading || otp.join('').length !== 6) &&
              styles.verifyButtonDisabled,
          ]}
          onPress={() => handleVerify()}
          disabled={loading || otp.join('').length !== 6}
          activeOpacity={0.8}>
          <Text style={styles.verifyButtonText}>
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </Text>
          <Text style={styles.verifyButtonTextHindi}>
            {loading
              ? 'सत्यापित किया जा रहा है...'
              : 'सत्यापित करें और जारी रखें'}
          </Text>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoIcon}>✨</Text>
          <Text style={styles.infoText}>
            OTP will be verified automatically when all digits are entered
          </Text>
        </View>

        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Having trouble?</Text>
          <Text style={styles.helpText}>
            • Make sure you have network connectivity{'\n'}
            • Check if you entered the correct phone number{'\n'}
            • Wait for 30 seconds before requesting a new code{'\n'}
            • Check your SMS inbox for the verification code
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// (Styles remain the same)
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
    backgroundColor: colors.secondary.lighter,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  messageIcon: {
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
    marginBottom: 12,
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.gray50,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginRight: 12,
  },
  editButton: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary.main,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: colors.neutral.gray300,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.text.primary,
    backgroundColor: colors.neutral.white,
  },
  otpInputFilled: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.lighter,
  },
  otpInputError: {
    borderColor: colors.error,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  resendText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary.main,
  },
  resendTimer: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.disabled,
  },
  verifyButton: {
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
  verifyButtonDisabled: {
    opacity: 0.5,
  },
  verifyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.neutral.white,
    marginBottom: 2,
  },
  verifyButtonTextHindi: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.white,
    opacity: 0.95,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.info + '10',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 30,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  helpSection: {
    backgroundColor: colors.neutral.gray50,
    padding: 16,
    borderRadius: 12,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});

export default OtpVerificationScreen;