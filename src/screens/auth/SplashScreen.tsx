import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

type SplashScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Splash'
>;

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Start animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after 2.5 seconds
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={colors.primary.main}
        barStyle="light-content"
      />
      
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}>
        
        <View style={styles.heartContainer}>
          <Text style={styles.heartEmoji}>💕</Text>
        </View>

        <Text style={styles.appNameEnglish}>ChhattisgarhShadi</Text>
        <Text style={styles.appNameHindi}>छत्तीसगढ़ शादी</Text>
        
        <Text style={styles.tagline}>Find Your Perfect Match</Text>
        <Text style={styles.taglineHindi}>अपना परफेक्ट साथी खोजें</Text>
      </Animated.View>

      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartContainer: {
    marginBottom: 20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartEmoji: {
    fontSize: 60,
  },
  appNameEnglish: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.neutral.white,
    marginTop: 20,
    letterSpacing: 1,
    textAlign: 'center',
  },
  appNameHindi: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.neutral.white,
    marginTop: 8,
    opacity: 0.95,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: colors.neutral.white,
    marginTop: 20,
    opacity: 0.9,
    textAlign: 'center',
  },
  taglineHindi: {
    fontSize: 14,
    color: colors.neutral.white,
    marginTop: 4,
    opacity: 0.85,
    textAlign: 'center',
  },
  version: {
    position: 'absolute',
    bottom: 30,
    fontSize: 12,
    color: colors.neutral.white,
    opacity: 0.7,
  },
});

export default SplashScreen;