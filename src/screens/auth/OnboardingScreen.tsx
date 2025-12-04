/**
 * Onboarding Screen
 * Swipeable carousel introducing app features
 */

import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    FlatList,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

type OnboardingScreenNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    'Onboarding'
>;

interface Props {
    navigation: OnboardingScreenNavigationProp;
}

interface OnboardingSlide {
    id: string;
    icon: string;
    title: string;
    description: string;
    gradient: string[];
}

const slides: OnboardingSlide[] = [
    {
        id: '1',
        icon: 'account-heart',
        title: 'Find Your Perfect Match',
        description: 'Connect with verified profiles from the Chhattisgarhi community',
        gradient: ['#FF6B9D', '#C06C84'],
    },
    {
        id: '2',
        icon: 'shield-check',
        title: 'Safe & Secure',
        description: 'Your privacy is our priority. All profiles are verified for authenticity',
        gradient: ['#4FACFE', '#00F2FE'],
    },
    {
        id: '3',
        icon: 'chat-processing',
        title: 'Connect Instantly',
        description: 'Chat with matches, send interests, and find your life partner',
        gradient: ['#43E97B', '#38F9D7'],
    },
    {
        id: '4',
        icon: 'star-circle',
        title: 'Premium Features',
        description: 'Get priority listing, unlimited contacts, and advanced matching',
        gradient: ['#FA709A', '#FEE140'],
    },
];

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef<FlatList>(null);

    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems[0]) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollTo = () => {
        if (currentIndex < slides.length - 1) {
            slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            navigation.navigate('Welcome');
        }
    };

    const skip = () => {
        navigation.navigate('Welcome');
    };

    const renderItem = ({ item }: { item: OnboardingSlide }) => (
        <View style={styles.slide}>
            <LinearGradient
                colors={item.gradient}
                style={styles.iconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Icon name={item.icon} size={100} color="#fff" />
            </LinearGradient>

            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#FFF5F7', '#FFFFFF']}
                style={styles.gradient}
            >
                {/* Skip Button */}
                <TouchableOpacity style={styles.skipButton} onPress={skip}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>

                {/* Slides */}
                <FlatList
                    ref={slidesRef}
                    data={slides}
                    renderItem={renderItem}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    scrollEventThrottle={32}
                />

                {/* Pagination Dots */}
                <View style={styles.paginationContainer}>
                    {slides.map((_, index) => {
                        const inputRange = [
                            (index - 1) * width,
                            index * width,
                            (index + 1) * width,
                        ];

                        const dotWidth = scrollX.interpolate({
                            inputRange,
                            outputRange: [8, 24, 8],
                            extrapolate: 'clamp',
                        });

                        const opacity = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: 'clamp',
                        });

                        return (
                            <Animated.View
                                key={index}
                                style={[
                                    styles.dot,
                                    {
                                        width: dotWidth,
                                        opacity,
                                    },
                                ]}
                            />
                        );
                    })}
                </View>

                {/* Next/Get Started Button */}
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={scrollTo}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={[Theme.colors.primary, '#FF1744']}
                        style={styles.nextButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.nextButtonText}>
                            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                        </Text>
                        <Icon
                            name={currentIndex === slides.length - 1 ? 'arrow-right' : 'chevron-right'}
                            size={24}
                            color="#fff"
                        />
                    </LinearGradient>
                </TouchableOpacity>
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
    },
    skipButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    skipText: {
        fontSize: 16,
        color: Theme.colors.primary,
        fontWeight: '600',
    },
    slide: {
        width,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    iconContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 60,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Theme.colors.text,
        textAlign: 'center',
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    description: {
        fontSize: 16,
        color: Theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        backgroundColor: Theme.colors.primary,
        marginHorizontal: 4,
    },
    nextButton: {
        marginHorizontal: 40,
        marginBottom: 40,
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: Theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    nextButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
    },
    nextButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginRight: 8,
        letterSpacing: 0.5,
    },
});

export default OnboardingScreen;
