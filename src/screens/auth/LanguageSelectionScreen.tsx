import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import { colors } from '../../theme/colors';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  description: string;
}

const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    description: 'International language',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    description: 'राष्ट्रीय भाषा',
  },
  {
    code: 'cg',
    name: 'Chhattisgarhi',
    nativeName: 'छत्तीसगढ़ी',
    flag: '🏠',
    description: 'हमर मातृभाषा',
  },
];

interface LanguageSelectionScreenProps {
  onComplete: () => void;
}

const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({
  onComplete,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [scaleAnims] = useState(
    languages.map(() => new Animated.Value(1))
  );

  const handleLanguagePress = (langCode: string, index: number) => {
    setSelectedLanguage(langCode);

    // Animation on press
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleContinue = () => {
    // Save language preference (in real app, save to AsyncStorage/Redux)
    console.log('Language Selected:', selectedLanguage);
    
    // Call the onComplete callback to navigate to Profile
    onComplete();
  };

  const handleSkip = () => {
    // Default to English and navigate to Profile Creation
    console.log('Language Selection Skipped - Default: en');
    
    // Call the onComplete callback to navigate to Profile
    onComplete();
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={colors.neutral.white}
        barStyle="dark-content"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.languageIcon}>🌐</Text>
          </View>

          <Text style={styles.title}>Choose Your Language</Text>
          <Text style={styles.titleHindi}>अपनी भाषा चुनें</Text>
          <Text style={styles.titleCg}>अपन भाषा चुनव</Text>

          <Text style={styles.subtitle}>
            Select your preferred language for the app
          </Text>
          <Text style={styles.subtitleHindi}>
            ऐप के लिए अपनी पसंदीदा भाषा चुनें
          </Text>
          <Text style={styles.subtitleCg}>
            ऐप बर अपन पसंद के भाषा चुनव
          </Text>
        </View>

        {/* Language Options */}
        <View style={styles.languagesContainer}>
          {languages.map((lang, index) => {
            const isSelected = selectedLanguage === lang.code;

            return (
              <Animated.View
                key={lang.code}
                style={[
                  styles.languageCardWrapper,
                  { transform: [{ scale: scaleAnims[index] }] },
                ]}>
                <TouchableOpacity
                  style={[
                    styles.languageCard,
                    isSelected && styles.languageCardSelected,
                  ]}
                  onPress={() => handleLanguagePress(lang.code, index)}
                  activeOpacity={0.7}>
                  {/* Flag/Icon */}
                  <View
                    style={[
                      styles.flagContainer,
                      isSelected && styles.flagContainerSelected,
                    ]}>
                    <Text style={styles.flag}>{lang.flag}</Text>
                  </View>

                  {/* Language Info */}
                  <View style={styles.languageInfo}>
                    <Text
                      style={[
                        styles.languageName,
                        isSelected && styles.languageNameSelected,
                      ]}>
                      {lang.name}
                    </Text>
                    <Text
                      style={[
                        styles.languageNativeName,
                        isSelected && styles.languageNativeNameSelected,
                      ]}>
                      {lang.nativeName}
                    </Text>
                    <Text
                      style={[
                        styles.languageDescription,
                        isSelected && styles.languageDescriptionSelected,
                      ]}>
                      {lang.description}
                    </Text>
                  </View>

                  {/* Check Mark */}
                  {isSelected && (
                    <View style={styles.checkmarkContainer}>
                      <Text style={styles.checkmark}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            You can change the language anytime from Settings
          </Text>
        </View>

        {/* Why Choose Section */}
        <View style={styles.whyChooseSection}>
          <Text style={styles.whyChooseTitle}>Why choose Chhattisgarhi?</Text>
          <Text style={styles.whyChooseTitleHindi}>
            छत्तीसगढ़ी क्यों चुनें?
          </Text>

          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>❤️</Text>
              <Text style={styles.benefitText}>
                Connect in your mother tongue
              </Text>
            </View>

            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🏡</Text>
              <Text style={styles.benefitText}>
                Feel at home with local language
              </Text>
            </View>

            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🤝</Text>
              <Text style={styles.benefitText}>
                Better understanding with matches
              </Text>
            </View>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}>
          <Text style={styles.continueButtonText}>Continue</Text>
          {selectedLanguage === 'hi' && (
            <Text style={styles.continueButtonTextAlt}>जारी रखें</Text>
          )}
          {selectedLanguage === 'cg' && (
            <Text style={styles.continueButtonTextAlt}>आगू बढ़व</Text>
          )}
          {selectedLanguage === 'en' && (
            <Text style={styles.continueButtonTextAlt}>Let's Go!</Text>
          )}
        </TouchableOpacity>
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
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 30,
  },
  skipButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent.lighter,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  languageIcon: {
    fontSize: 40,
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
    marginBottom: 4,
  },
  subtitleCg: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  languagesContainer: {
    marginBottom: 30,
  },
  languageCardWrapper: {
    marginBottom: 16,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderWidth: 2,
    borderColor: colors.neutral.gray300,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  languageCardSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.lighter,
    shadowColor: colors.primary.main,
    shadowOpacity: 0.3,
    elevation: 6,
  },
  flagContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.neutral.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  flagContainerSelected: {
    backgroundColor: colors.neutral.white,
  },
  flag: {
    fontSize: 32,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  languageNameSelected: {
    color: colors.primary.dark,
  },
  languageNativeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 4,
  },
  languageNativeNameSelected: {
    color: colors.primary.main,
  },
  languageDescription: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  languageDescriptionSelected: {
    color: colors.text.primary,
  },
  checkmarkContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.neutral.white,
  },
  infoBox: {
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
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  whyChooseSection: {
    backgroundColor: colors.accent.lighter,
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
  },
  whyChooseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  whyChooseTitleHindi: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 16,
  },
  benefitsList: {
    marginTop: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.primary.main,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.neutral.white,
    marginBottom: 2,
  },
  continueButtonTextAlt: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.white,
    opacity: 0.95,
  },
});

export default LanguageSelectionScreen;