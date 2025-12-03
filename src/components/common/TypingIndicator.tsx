/**
 * Typing Indicator Component
 * Animated typing indicator for chat screens
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Surface } from 'react-native-paper';
import { Theme } from '../../constants/theme';

const TypingIndicator: React.FC = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const createAnimation = (animatedValue: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(animatedValue, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animatedValue, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        const animation1 = createAnimation(dot1, 0);
        const animation2 = createAnimation(dot2, 150);
        const animation3 = createAnimation(dot3, 300);

        animation1.start();
        animation2.start();
        animation3.start();

        return () => {
            animation1.stop();
            animation2.stop();
            animation3.stop();
        };
    }, []);

    const animatedStyle = (animatedValue: Animated.Value) => ({
        opacity: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 1],
        }),
        transform: [
            {
                translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -4],
                }),
            },
        ],
    });

    return (
        <View style={styles.container}>
            <Surface style={styles.bubble} elevation={1}>
                <View style={styles.dotsContainer}>
                    <Animated.View style={[styles.dot, animatedStyle(dot1)]} />
                    <Animated.View style={[styles.dot, animatedStyle(dot2)]} />
                    <Animated.View style={[styles.dot, animatedStyle(dot3)]} />
                </View>
            </Surface>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignItems: 'flex-start',
    },
    bubble: {
        backgroundColor: Theme.colors.surfaceCard,
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Theme.colors.textSecondary,
    },
});

export default TypingIndicator;
