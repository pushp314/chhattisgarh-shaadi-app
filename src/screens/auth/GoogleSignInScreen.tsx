/**
 * Google Sign In Screen
 * Handles Google authentication
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { SvgUri } from 'react-native-svg';
import { Theme } from '../../constants/theme';
import Svg, { Path, G } from 'react-native-svg';

// Google Logo Component
const GoogleLogo = () => (
  <Svg width="20" height="20" viewBox="0 0 48 48">
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

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      await signInWithGoogle(agentCode);

      // Get updated state after sign in
      const { user, isNewUser } = useAuthStore.getState();

      // Check if phone is already verified
      const isPhoneVerified = user?.isPhoneVerified;
      const hasProfile = user?.profile;

      if (isPhoneVerified) {
        // Phone already verified - navigate based on profile status
        if (isNewUser || !hasProfile) {
          // New user or no profile - go to profile creation
          // Navigation will be handled by AppNavigator based on auth state
          console.log('User authenticated, no profile - AppNavigator will redirect to CreateProfile');
        } else {
          // Existing user with profile - go to home
          console.log('User authenticated with profile - AppNavigator will redirect to Home');
        }
      } else {
        // Phone not verified - go to phone verification
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
        colors={Theme.gradients.romantic}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color={Theme.colors.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sign In</Text>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <View style={styles.iconContainer}>
              <SvgUri
                uri="https://res.cloudinary.com/dupmez35w/image/upload/v1764231088/25591183_VEC_SAV_304-01_dbi08v.svg"
                width="140"
                height="140"
              />
            </View>

            <Text style={styles.title}>Welcome to{'\n'}Chhattisgarh Shaadi</Text>
            <Text style={styles.subtitle}>
              Sign in to find your perfect match
            </Text>

            {error ? (
              <View style={styles.errorContainer}>
                <Icon name="error-outline" size={20} color={Theme.colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Agent Code Input */}
            <View style={styles.inputContainer}>
              <Icon name="person-add" size={20} color={Theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Agent Code (Optional)"
                placeholderTextColor={Theme.colors.textSecondary}
                value={agentCode}
                onChangeText={setAgentCode}
                autoCapitalize="characters"
                maxLength={20}
              />
            </View>

            {/* Google Sign In Button */}
            <TouchableOpacity
              style={[styles.googleButton, isLoading && styles.buttonDisabled]}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#4285F4" />
              ) : (
                <>
                  <View style={styles.googleLogoContainer}>
                    <GoogleLogo />
                  </View>
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Icon name="info-outline" size={20} color={Theme.colors.textSecondary} />
              <Text style={styles.infoText}>
                We use Google Sign-In for secure authentication. Your Google password is never shared with us.
              </Text>
            </View>
          </View>

          {/* Footer */}
          <Text style={styles.termsText}>
            By signing in, you agree to our{'\n'}
            Terms of Service and Privacy Policy
          </Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: Theme.borderRadius.md,
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
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 3,
    borderColor: Theme.colors.secondary,
    ...Theme.shadows.md,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Theme.colors.text,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '400',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borderRadius.round,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.sm,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: Theme.colors.text,
    fontSize: 16,
    height: '100%',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 4,
    width: '100%',
    borderWidth: 1,
    borderColor: '#dadce0',
    ...Theme.shadows.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  googleLogoContainer: {
    marginRight: 12,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3c4043',
    letterSpacing: 0.25,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
  termsText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    paddingBottom: 20,
    lineHeight: 18,
  },
});

export default GoogleSignInScreen;

