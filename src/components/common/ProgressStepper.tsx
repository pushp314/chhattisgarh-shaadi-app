import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';

interface ProgressStepperProps {
    steps: string[];
    currentStep: number;
    onStepPress?: (step: number) => void;
}

const { width } = Dimensions.get('window');

const ProgressStepper: React.FC<ProgressStepperProps> = ({
    steps,
    currentStep,
    onStepPress,
}) => {
    const theme = useTheme();
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        // Scroll to active step
        if (scrollViewRef.current) {
            const x = (currentStep - 1) * 100 - (width / 2) + 50;
            scrollViewRef.current.scrollTo({ x: Math.max(0, x), animated: true });
        }
    }, [currentStep]);

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;

                    return (
                        <View key={index} style={styles.stepContainer}>
                            {/* Connector Line */}
                            {index > 0 && (
                                <View
                                    style={[
                                        styles.connector,
                                        {
                                            backgroundColor: isCompleted || isActive
                                                ? Theme.colors.primary
                                                : Theme.colors.border,
                                        },
                                    ]}
                                />
                            )}

                            <TouchableOpacity
                                style={styles.stepWrapper}
                                onPress={() => onStepPress && isCompleted && onStepPress(stepNumber)}
                                disabled={!onStepPress || !isCompleted}
                            >
                                {/* Circle */}
                                <View
                                    style={[
                                        styles.circle,
                                        isActive && styles.activeCircle,
                                        isCompleted && styles.completedCircle,
                                        !isActive && !isCompleted && styles.inactiveCircle,
                                    ]}
                                >
                                    {isCompleted ? (
                                        <Icon name="check" size={16} color="#fff" />
                                    ) : (
                                        <Text
                                            style={[
                                                styles.stepNumber,
                                                isActive && styles.activeStepNumber,
                                                !isActive && !isCompleted && styles.inactiveStepNumber,
                                            ]}
                                        >
                                            {stepNumber}
                                        </Text>
                                    )}
                                </View>

                                {/* Label */}
                                <Text
                                    style={[
                                        styles.label,
                                        isActive && styles.activeLabel,
                                        isCompleted && styles.completedLabel,
                                    ]}
                                    numberOfLines={1}
                                >
                                    {step}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.colors.surfaceCardAlt,
        paddingVertical: 12,
    },
    scrollContent: {
        paddingHorizontal: 16,
        alignItems: 'flex-start',
    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    connector: {
        width: 40,
        height: 2,
        marginHorizontal: 4,
        marginBottom: 20, // Align with circle center
    },
    stepWrapper: {
        alignItems: 'center',
        width: 80,
    },
    circle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
        borderWidth: 2,
    },
    activeCircle: {
        backgroundColor: Theme.colors.primary,
        borderColor: Theme.colors.primary,
        elevation: 4,
    },
    completedCircle: {
        backgroundColor: Theme.colors.success,
        borderColor: Theme.colors.success,
    },
    inactiveCircle: {
        backgroundColor: Theme.colors.surface,
        borderColor: Theme.colors.border,
    },
    stepNumber: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    activeStepNumber: {
        color: '#fff',
    },
    inactiveStepNumber: {
        color: Theme.colors.textSecondary,
    },
    label: {
        fontSize: 12,
        textAlign: 'center',
        color: Theme.colors.textSecondary,
    },
    activeLabel: {
        color: Theme.colors.primary,
        fontWeight: 'bold',
    },
    completedLabel: {
        color: Theme.colors.success,
    },
});

export default ProgressStepper;
