/**
 * Welcome Screen - Minimal & Clean Design
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';

const { height } = Dimensions.get('window');

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Welcome'
>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFF5F7', '#FFFFFF', '#F0F9FF']}
        style={styles.gradient}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={[Theme.colors.primary, '#FF1744']}
              style={styles.logoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name="heart-multiple" size={80} color="#fff" />
            </LinearGradient>
          </View>

          <Text style={styles.appName}>Chhattisgarh Shaadi</Text>
          <Text style={styles.tagline}>
            Find Your Perfect Match
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>10K+</Text>
            <Text style={styles.statLabel}>Happy Couples</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>50K+</Text>
            <Text style={styles.statLabel}>Verified Profiles</Text>
          </View>
        </View>

        {/* CTA Button */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('GoogleSignIn')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Theme.colors.primary, '#FF1744']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Icon name="google" size={24} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.footerLink}>Terms</Text>
            {' & '}
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </Text>
        </View>
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
    justifyContent: 'space-between',
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: height * 0.12,
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 16,
    color: Theme.colors.textSecondary,
    fontWeight: '400',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: Theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  ctaContainer: {
    paddingHorizontal: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  buttonIcon: {
    marginRight: 12,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  footerText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  footerLink: {
    color: Theme.colors.primary,
    fontWeight: '600',
  },
});

export default WelcomeScreen;
