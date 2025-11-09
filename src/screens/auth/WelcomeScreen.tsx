import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
// ADDED navigation imports
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Assuming the path to your navigation types is correct:
import { AuthStackParamList } from '../../navigation/types'; 

import { colors } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

// ADDED type for navigation prop
type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Welcome'
>;

// REMOVED old interface WelcomeScreenProps
// UPDATED component to use navigation hook
const WelcomeScreen = () => {
    // ADDED navigation hook
    const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={colors.primary.main}
        barStyle="light-content"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Top Section - Gradient Background */}
        <View style={styles.topSection}>
          {/* Heart Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.heartCircle}>
              <Text style={styles.heartEmoji}>💕</Text>
            </View>
          </View>

          {/* App Name */}
          <Text style={styles.appName}>ChhattisgarhShadi</Text>
          <Text style={styles.appNameHindi}>छत्तीसगढ़ शादी</Text>

          {/* Tagline */}
          <Text style={styles.tagline}>Find Your Perfect Life Partner</Text>
          <Text style={styles.taglineHindi}>अपना आदर्श जीवनसाथी खोजें</Text>
          <Text style={styles.taglineCg}>अपन बढ़िया जीवनसाथी खोजव</Text>
        </View>

        {/* Bottom Section - White Background */}
        <View style={styles.bottomSection}>
          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50K+</Text>
              <Text style={styles.statLabel}>Active Users</Text>
              <Text style={styles.statLabelHindi}>सक्रिय उपयोगकर्ता</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10K+</Text>
              <Text style={styles.statLabel}>Matches Made</Text>
              <Text style={styles.statLabelHindi}>मैच बने</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5K+</Text>
              <Text style={styles.statLabel}>Success Stories</Text>
              <Text style={styles.statLabelHindi}>सफल कहानियां</Text>
            </View>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>100% Verified Profiles</Text>
                <Text style={styles.featureTitleHindi}>100% सत्यापित प्रोफाइल</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Chhattisgarh Community Focus</Text>
                <Text style={styles.featureTitleHindi}>छत्तीसगढ़ समुदाय केंद्रित</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Safe & Secure Platform</Text>
                <Text style={styles.featureTitleHindi}>सुरक्षित मंच</Text>
              </View>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            {/* Create Account Button (Primary) */}
            <TouchableOpacity
              style={styles.primaryButton}
              // UPDATED onPress to use navigation
              onPress={() => navigation.navigate('GoogleAuth')}
              activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>Create Account</Text>
              <Text style={styles.primaryButtonTextHindi}>खाता बनाएं</Text>
            </TouchableOpacity>

            {/* Sign In Button (Outline) */}
            <TouchableOpacity
              style={styles.outlineButton}
              // UPDATED onPress to use navigation
              onPress={() => navigation.navigate('GoogleAuth')} // Assuming 'GoogleAuth' is the sign-in/auth screen
              activeOpacity={0.8}>
              <Text style={styles.outlineButtonText}>Sign In</Text>
              <Text style={styles.outlineButtonTextHindi}>साइन इन करें</Text>
            </TouchableOpacity>
          </View>

          {/* Terms & Privacy */}
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topSection: {
    backgroundColor: colors.primary.main,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoContainer: {
    marginBottom: 20,
  },
  heartCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  heartEmoji: {
    fontSize: 50,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.neutral.white,
    marginTop: 10,
    letterSpacing: 0.5,
  },
  appNameHindi: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.neutral.white,
    marginTop: 6,
    opacity: 0.95,
  },
  tagline: {
    fontSize: 16,
    color: colors.neutral.white,
    marginTop: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
  taglineHindi: {
    fontSize: 14,
    color: colors.neutral.white,
    marginTop: 4,
    textAlign: 'center',
    opacity: 0.85,
  },
  taglineCg: {
    fontSize: 13,
    color: colors.neutral.white,
    marginTop: 4,
    textAlign: 'center',
    opacity: 0.8,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: colors.neutral.white,
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.neutral.gray50,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary.main,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  statLabelHindi: {
    fontSize: 10,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.neutral.gray300,
    marginHorizontal: 10,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIcon: {
    fontSize: 24,
    color: colors.success,
    marginRight: 15,
    width: 30,
    textAlign: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  featureTitleHindi: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  buttonsContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.primary.main,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.neutral.white,
    marginBottom: 2,
  },
  primaryButtonTextHindi: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.white,
    opacity: 0.95,
  },
  outlineButton: {
    backgroundColor: colors.neutral.white,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary.main,
    alignItems: 'center',
  },
  outlineButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary.main,
    marginBottom: 2,
  },
  outlineButtonTextHindi: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary.main,
    opacity: 0.9,
  },
  termsText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  termsLink: {
    color: colors.primary.main,
    fontWeight: '600',
  },
});

export default WelcomeScreen;