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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

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

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      await signInWithGoogle();
      
      // Get updated state after sign in
      const { user, isNewUser } = useAuthStore.getState();
      
      // Check if this is a new user who needs to complete profile
      if (isNewUser) {
        // Navigate to CreateProfile screen
        // Note: We need to navigate to Main stack first, then to CreateProfile
        // The AppNavigator will handle the navigation based on authentication state
        // For now, we'll use a navigation reset or navigate through the main navigator
        // Since we're in Auth stack, we need to wait for AppNavigator to switch to Main stack
        // The profile check will happen in AppNavigator or MainNavigator
        return;
      }
      
      // Existing user - check if phone verification is needed
      if (!user?.isPhoneVerified) {
        navigation.navigate('PhoneVerification');
      }
      // Otherwise, navigation will handle redirect to main app
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
            <Text style={styles.headerTitle}>Sign In</Text>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <View style={styles.iconContainer}>
              <Icon name="favorite" size={80} color="#FFFFFF" />
            </View>

            <Text style={styles.title}>Welcome to{'\n'}Chhattisgarh Shaadi</Text>
            <Text style={styles.subtitle}>
              Sign in to find your perfect match
            </Text>

            {error ? (
              <View style={styles.errorContainer}>
                <Icon name="error-outline" size={20} color="#FF5252" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Google Sign In Button */}
            <TouchableOpacity
              style={[styles.googleButton, isLoading && styles.buttonDisabled]}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#D81B60" />
              ) : (
                <>
                  <Icon name="g-mobiledata" size={24} color="#D81B60" />
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Icon name="info-outline" size={20} color="#FFFFFF" />
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
    fontSize: 32,
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
    marginBottom: 40,
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
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D81B60',
    marginLeft: 12,
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
  termsText: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
    paddingBottom: 20,
  },
});

export default GoogleSignInScreen;
