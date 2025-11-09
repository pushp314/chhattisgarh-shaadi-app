import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
// ADDED navigation imports
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Assuming the path to your navigation types is correct:
import { AuthStackParamList } from '../../navigation/types'; 

import { colors } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

// ADDED type for navigation prop
type OnboardingScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Onboarding'
>;

interface OnboardingSlide {
  id: string;
  emoji: string;
  title: string;
  titleHi: string;
  titleCg: string;
  description: string;
  descriptionHi: string;
  descriptionCg: string;
  backgroundColor: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    emoji: '💑',
    title: 'Find Your Perfect Match',
    titleHi: 'अपना परफेक्ट साथी खोजें',
    titleCg: 'अपन बढ़िया जोड़ी खोजव',
    description: 'Connect with verified profiles from Chhattisgarh community',
    descriptionHi: 'छत्तीसगढ़ समुदाय से सत्यापित प्रोफाइल से जुड़ें',
    descriptionCg: 'छत्तीसगढ़ के लोगन ले जुड़व',
    backgroundColor: colors.primary.main,
  },
  {
    id: '2',
    emoji: '🔒',
    title: 'Safe & Secure',
    titleHi: 'सुरक्षित और संरक्षित',
    titleCg: 'सुरक्षित अउ भरोसा के',
    description: 'Your privacy is our priority. All profiles are verified',
    descriptionHi: 'आपकी गोपनीयता हमारी प्राथमिकता है। सभी प्रोफाइल सत्यापित हैं',
    descriptionCg: 'तुंहर गोपनीयता हमर पहिली जिम्मेदारी हे',
    backgroundColor: colors.secondary.main,
  },
  {
    id: '3',
    emoji: '❤️',
    title: 'Start Your Journey',
    titleHi: 'अपनी यात्रा शुरू करें',
    titleCg: 'अपन सफर सुरू करव',
    description: 'Join thousands of happy couples who found love here',
    descriptionHi: 'हजारों खुश जोड़ों में शामिल हों जिन्होंने यहां प्यार पाया',
    descriptionCg: 'हजारों खुस जोड़ी मन ले जुड़व जउन मन ला इहां प्यार मिलिस',
    backgroundColor: colors.accent.main,
  },
];

// REMOVED old interface OnboardingScreenProps
// UPDATED component to use navigation hook
const OnboardingScreen = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>(); // ADDED navigation hook
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  // UPDATED scrollTo to use navigation.replace('Welcome')
  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('Welcome'); // Navigate to 'Welcome' screen
    }
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 20, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index.toString()}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor: slides[currentIndex].backgroundColor === colors.primary.main
                    ? colors.neutral.white
                    : slides[currentIndex].backgroundColor === colors.secondary.main
                    ? colors.neutral.white
                    : colors.neutral.white,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{item.emoji}</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.titleHindi}>{item.titleHi}</Text>
          <Text style={styles.titleChhattisgarhi}>{item.titleCg}</Text>

          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.descriptionHindi}>{item.descriptionHi}</Text>
          <Text style={styles.descriptionChhattisgarhi}>{item.descriptionCg}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={slides[currentIndex].backgroundColor}
        barStyle="light-content"
      />

      {/* Skip Button */}
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.replace('Welcome')}> 
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        ref={slidesRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={item => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={32}
      />

      {/* Footer with Dots and Button */}
      <View style={styles.footer}>
        {renderDots()}

        <TouchableOpacity
          style={[
            styles.nextButton,
            {
              backgroundColor:
                currentIndex === slides.length - 1
                  ? colors.neutral.white
                  : 'rgba(255, 255, 255, 0.3)',
            },
          ]}
          onPress={scrollTo}>
          <Text
            style={[
              styles.nextButtonText,
              {
                color:
                  currentIndex === slides.length - 1
                    ? slides[currentIndex].backgroundColor
                    : colors.neutral.white,
              },
            ]}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emojiContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 80,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.neutral.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  titleHindi: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.neutral.white,
    textAlign: 'center',
    marginBottom: 4,
    opacity: 0.95,
  },
  titleChhattisgarhi: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.neutral.white,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
  },
  description: {
    fontSize: 16,
    color: colors.neutral.white,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
    opacity: 0.9,
  },
  descriptionHindi: {
    fontSize: 14,
    color: colors.neutral.white,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 4,
    opacity: 0.85,
  },
  descriptionChhattisgarhi: {
    fontSize: 13,
    color: colors.neutral.white,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  skipText: {
    color: colors.neutral.white,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;