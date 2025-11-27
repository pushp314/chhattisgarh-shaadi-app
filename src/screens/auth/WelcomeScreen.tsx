/**
 * Welcome Screen
 * First screen users see when opening the app
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import LinearGradient from 'react-native-linear-gradient';
import { SvgUri } from 'react-native-svg';
import { Theme } from '../../constants/theme';

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
        colors={Theme.gradients.romantic}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Logo/Branding */}
            <View style={styles.headerSection}>
              <SvgUri
                uri="https://res.cloudinary.com/dupmez35w/image/upload/v1764231088/25591183_VEC_SAV_304-01_dbi08v.svg"
                width="150"
                height="150"
                style={styles.logo}
              />
              <Text style={styles.title}>Chhattisgarh Shaadi</Text>
              <Text style={styles.subtitle}>
                Find your perfect match in Chhattisgarh
              </Text>
            </View>

            {/* Features */}
            <View style={styles.featuresSection}>
              <FeatureItem
                icon="💑"
                title="Verified Profiles"
                description="Connect with genuine people"
              />
              <FeatureItem
                icon="🗣️"
                title="Chhattisgarhi Community"
                description="Find matches who speak your language"
              />
              <FeatureItem
                icon="✨"
                title="Secure & Private"
                description="Your data is safe with us"
              />
            </View>

            {/* CTA Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('GoogleSignIn')}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>

            <Text style={styles.termsText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <View style={styles.featureText}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  headerSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  logo: {
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 17,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: '400',
  },
  featuresSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 14,
    borderRadius: Theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(250, 192, 53, 0.3)',
    ...Theme.shadows.sm,
  },
  featureIcon: {
    fontSize: 36,
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    fontWeight: '400',
  },
  button: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 16,
    borderRadius: Theme.borderRadius.round,
    alignItems: 'center',
    marginTop: 16,
    ...Theme.shadows.lg,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.textOnPrimary,
    letterSpacing: 0.5,
  },
  termsText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});

export default WelcomeScreen;
