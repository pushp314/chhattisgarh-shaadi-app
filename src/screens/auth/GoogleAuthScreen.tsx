import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
// ADDED navigation imports
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Assuming the path to your navigation types is correct:
import { AuthStackParamList } from '../../navigation/types';

import { colors } from '../../theme/colors';

// ADDED type for navigation prop
type GoogleAuthScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'GoogleAuth'
>;

// REMOVED old interface GoogleAuthScreenProps
// UPDATED component to use navigation hook
const GoogleAuthScreen = () => {
  // ADDED navigation hook
  const navigation = useNavigation<GoogleAuthScreenNavigationProp>();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = () => {
    setLoading(true);

    // Mock authentication - simulate 2 seconds delay
    setTimeout(() => {
      setLoading(false);
      // UPDATED to use navigation.navigate
      navigation.navigate('PhoneVerification'); 
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={colors.neutral.white}
        barStyle="dark-content"
      />

      {/* Back Button */}
      {/* UPDATED onPress to use navigation.goBack() */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.heartCircle}>
            <Text style={styles.heartEmoji}>💕</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Welcome to ChhattisgarhShadi</Text>
        <Text style={styles.titleHindi}>छत्तीसगढ़शादी में आपका स्वागत है</Text>
        <Text style={styles.titleCg}>छत्तीसगढ़शादी म सुआगत हे</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Sign in to find your perfect life partner
        </Text>
        <Text style={styles.subtitleHindi}>
          अपना आदर्श जीवनसाथी खोजने के लिए साइन इन करें
        </Text>

        {/* Google Sign In Button */}
        <TouchableOpacity
          style={[styles.googleButton, loading && styles.googleButtonDisabled]}
          onPress={handleGoogleSignIn}
          disabled={loading}
          activeOpacity={0.8}>
          {loading ? (
            <ActivityIndicator color={colors.text.primary} size="small" />
          ) : (
            <>
              {/* Google Icon (Using emoji as placeholder) */}
              <View style={styles.googleIcon}>
                <Text style={styles.googleIconText}>G</Text>
              </View>
              <View style={styles.googleButtonTextContainer}>
                <Text style={styles.googleButtonText}>Continue with Google</Text>
                <Text style={styles.googleButtonTextHindi}>Google से जारी रखें</Text>
              </View>
            </>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>

        {/* Phone Sign In Button */}
        <TouchableOpacity
          style={styles.phoneButton}
          // UPDATED onPress to use navigation.navigate
          onPress={() => navigation.navigate('PhoneVerification')}
          activeOpacity={0.8}>
          <Text style={styles.phoneIcon}>📱</Text>
          <View style={styles.phoneButtonTextContainer}>
            <Text style={styles.phoneButtonText}>Continue with Phone</Text>
            <Text style={styles.phoneButtonTextHindi}>फोन से जारी रखें</Text>
          </View>
        </TouchableOpacity>

        {/* Info Text */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoIcon}>🔒</Text>
          <Text style={styles.infoText}>
            Your privacy is protected. We never post anything without your permission.
          </Text>
        </View>
      </View>

      {/* Terms */}
      <Text style={styles.termsText}>
        By continuing, you agree to our{'\n'}
        <Text style={styles.termsLink}>Terms of Service</Text>
        {' & '}
        <Text style={styles.termsLink}>Privacy Policy</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.neutral.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 100,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
  heartCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary.lighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartEmoji: {
    fontSize: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 6,
  },
  titleHindi: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  titleCg: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitleHindi: {
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  googleButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral.white,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral.gray300,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  googleIconText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.neutral.white,
  },
  googleButtonTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  googleButtonTextHindi: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.neutral.gray300,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  phoneButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.main,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: colors.primary.main,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  phoneIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  phoneButtonTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  phoneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral.white,
    marginBottom: 2,
  },
  phoneButtonTextHindi: {
    fontSize: 12,
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
    marginTop: 10,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  termsText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: 30,
    paddingBottom: 30,
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary.main,
    fontWeight: '600',
  },
});

export default GoogleAuthScreen;