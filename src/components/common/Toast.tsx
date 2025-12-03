/**
 * Custom Toast Component
 * Cross-platform toast notification component with animations
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Platform } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    message: string;
    type: ToastType;
    visible: boolean;
    onHide: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({
    message,
    type,
    visible,
    onHide,
    duration = 3000,
}) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        if (visible) {
            // Show animation
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto hide after duration
            const timer = setTimeout(() => {
                hideToast();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 50,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onHide();
        });
    };

    if (!visible) return null;

    const getToastConfig = () => {
        switch (type) {
            case 'success':
                return {
                    icon: 'check-circle',
                    color: Theme.colors.success,
                    backgroundColor: '#E8F5E9',
                };
            case 'error':
                return {
                    icon: 'alert-circle',
                    color: Theme.colors.primary,
                    backgroundColor: '#FFEBEE',
                };
            case 'warning':
                return {
                    icon: 'alert',
                    color: Theme.colors.secondary,
                    backgroundColor: '#FFF3E0',
                };
            case 'info':
            default:
                return {
                    icon: 'information',
                    color: '#2196F3',
                    backgroundColor: '#E3F2FD',
                };
        }
    };

    const config = getToastConfig();

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity,
                    transform: [{ translateY }],
                },
            ]}>
            <Surface
                style={[
                    styles.toast,
                    { backgroundColor: config.backgroundColor },
                ]}
                elevation={4}>
                <Icon name={config.icon} size={24} color={config.color} />
                <Text style={[styles.message, { color: config.color }]}>
                    {message}
                </Text>
            </Surface>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 100 : 80,
        left: 16,
        right: 16,
        zIndex: 9999,
        alignItems: 'center',
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        gap: 12,
        minWidth: 200,
        maxWidth: '100%',
        ...Theme.shadows.lg,
    },
    message: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
    },
});

export default Toast;
