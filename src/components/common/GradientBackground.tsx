import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Theme } from '../../constants/theme';

interface GradientBackgroundProps {
    children: React.ReactNode;
    style?: ViewStyle;
    variant?: 'primary' | 'romantic' | 'gold' | 'header' | 'card';
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
    children,
    style,
    variant = 'romantic',
}) => {
    const colors = Theme.gradients[variant] || Theme.gradients.romantic;

    return (
        <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.container, style]}
        >
            {children}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default GradientBackground;
