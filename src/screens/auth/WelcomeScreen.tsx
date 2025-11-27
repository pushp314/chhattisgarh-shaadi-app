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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import LinearGradient from 'react-native-linear-gradient';
import { SvgUri } from 'react-native-svg';

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
        colors={['#D81B60', '#F06292']}
        style={styles.gradient}
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
              icon="👰"
              title="Verified Profiles"
              description="Connect with genuine people"
            />
            <FeatureItem
              icon="🗣️"
              title="Chhattisgarhi Community"
              description="Find matches who speak your language"
            />
            <FeatureItem
              icon="🔒"
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  headerSection: {
    marginTop: 60,
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  featuresSection: {
    marginTop: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 12,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D81B60',
  },
  termsText: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
    marginTop: 16,
  },
});

export default WelcomeScreen;
