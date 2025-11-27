import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
    visible: boolean;
    onComplete?: () => void;
};

const SuccessAnimation: React.FC<Props> = ({ visible, onComplete }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const checkmarkScale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.sequence([
                // Circle appears
                Animated.parallel([
                    Animated.spring(scaleAnim, {
                        toValue: 1,
                        friction: 5,
                        tension: 40,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityAnim, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                ]),
                // Checkmark appears
                Animated.spring(checkmarkScale, {
                    toValue: 1,
                    friction: 4,
                    tension: 40,
                    useNativeDriver: true,
                }),
                // Hold for a moment
                Animated.delay(800),
                // Fade out
                Animated.parallel([
                    Animated.timing(scaleAnim, {
                        toValue: 0.8,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityAnim, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start(() => {
                // Reset animations
                scaleAnim.setValue(0);
                opacityAnim.setValue(0);
                checkmarkScale.setValue(0);
                onComplete?.();
            });
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.circle,
                    {
                        transform: [{ scale: scaleAnim }],
                        opacity: opacityAnim,
                    },
                ]}>
                <Animated.View
                    style={{
                        transform: [{ scale: checkmarkScale }],
                    }}>
                    <Icon name="check" size={60} color="#fff" />
                </Animated.View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 9999,
    },
    circle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
});

export default SuccessAnimation;
