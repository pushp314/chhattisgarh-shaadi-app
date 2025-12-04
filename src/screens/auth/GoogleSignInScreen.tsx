/**
 * Google Sign In Screen - Redesigned
 * Modern authentication screen with improved UX
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Theme } from '../../constants/theme';
import Svg, { Path } from 'react-native-svg';

// Google Logo Component
const GoogleLogo = () => (
  <Svg width="24" height="24" viewBox="0 0 48 48">
    <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    <Path fill="none" d="M0 0h48v48H0z" />
  </Svg>
);

type GoogleSignInScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'GoogleSignIn'
>;

interface Props {
  navigation: GoogleSignInScreenNavigationProp;
}

const GoogleSignInScreen: React.FC<Props> = ({ navigation }) => {
  const { signInWithGoogle, isLoading } = useAuthStore();
  const [error, setError] = useState<string>('');
  const [agentCode, setAgentCode] = useState<string>('');
  const [showAgentCode, setShowAgentCode] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      await signInWithGoogle(agentCode);

      const { user, isNewUser } = useAuthStore.getState();
      const isPhoneVerified = user?.isPhoneVerified;
      const hasProfile = user?.profile;

      if (isPhoneVerified) {
        if (isNewUser || !hasProfile) {
          console.log('User authenticated, no profile - AppNavigator will redirect to CreateProfile');
        } else {
          console.log('User authenticated with profile - AppNavigator will redirect to Home');
        }
      } else {
        navigation.navigate('PhoneVerification');
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      const errorMessage = err.message || 'Failed to sign in with Google';
      setError(errorMessage);
      Alert.alert('Sign In Failed', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFF5F7', '#FFFFFF']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Icon name="arrow-left" size={24} color={Theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={[Theme.colors.primary, '#FF1744']}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name="heart-multiple" size={50} color="#fff" />
              </LinearGradient>
            </View>

            {/* Title */}
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your journey
            </Text>

            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Icon name="alert-circle" size={20} color={Theme.colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Google Sign In Button */}
            <TouchableOpacity
              style={[styles.googleButton, isLoading && styles.buttonDisabled]}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={Theme.colors.primary} />
              ) : (
                <>
                  <View style={styles.googleLogoContainer}>
                    <GoogleLogo />
                  </View>
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            {/* Agent Code Section */}
            {!showAgentCode ? (
              <TouchableOpacity
                style={styles.agentCodeToggle}
                onPress={() => setShowAgentCode(true)}
                activeOpacity={0.7}
              >
                <Icon name="ticket-percent" size={20} color={Theme.colors.primary} />
                <Text style={styles.agentCodeToggleText}>Have an agent code?</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.agentCodeContainer}>
                <View style={styles.inputContainer}>
                  <Icon name="ticket-percent" size={20} color={Theme.colors.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter agent code"
                    placeholderTextColor={Theme.colors.textSecondary}
                    value={agentCode}
                    onChangeText={setAgentCode}
                    autoCapitalize="characters"
                    maxLength={20}
                  />
                  {agentCode.length > 0 && (
                    <TouchableOpacity onPress={() => setAgentCode('')}>
                      <Icon name="close-circle" size={20} color={Theme.colors.textSecondary} />
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.removeAgentCode}
                  onPress={() => {
                    setShowAgentCode(false);
                    setAgentCode('');
                  }}
                >
                  <Text style={styles.removeAgentCodeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Icon name="shield-check" size={24} color={Theme.colors.primary} />
              <Text style={styles.infoText}>
                Your data is secure and encrypted. We never share your information.
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By signing in, you agree to our{'\n'}
              <Text style={styles.footerLink}>Terms of Service</Text> and{' '}
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </Text>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignSelf: 'center',
    marginBottom: 32,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Theme.colors.text,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.error + '10',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Theme.colors.error + '30',
  },
  errorText: {
    fontSize: 14,
    color: Theme.colors.error,
    marginLeft: 8,
    flex: 1,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  googleLogoContainer: {
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text,
    letterSpacing: 0.3,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Theme.colors.border,
  },
  dividerText: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginHorizontal: 16,
    fontWeight: '500',
  },
  agentCodeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  agentCodeToggleText: {
    fontSize: 15,
    color: Theme.colors.primary,
    marginLeft: 8,
    fontWeight: '600',
  },
  agentCodeContainer: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: Theme.colors.border,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Theme.colors.text,
    marginLeft: 12,
  },
  removeAgentCode: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  removeAgentCodeText: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    textDecorationLine: 'underline',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary + '08',
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
  },
  infoText: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: Theme.colors.primary,
    fontWeight: '600',
  },
});

export default GoogleSignInScreen;
