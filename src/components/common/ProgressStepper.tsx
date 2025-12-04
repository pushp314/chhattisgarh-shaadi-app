/**
 * Progress Stepper Component - Redesigned
 * Premium horizontal stepper with smooth animations
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';

interface ProgressStepperProps {
    steps: string[];
    currentStep: number;
    onStepPress?: (step: number) => void;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({
    steps,
    currentStep,
    onStepPress,
}) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;
                const isClickable = stepNumber < currentStep && onStepPress;

                return (
                    <TouchableOpacity
                        key={index}
                        style={styles.stepContainer}
                        onPress={() => isClickable && onStepPress(stepNumber)}
                        disabled={!isClickable}
                        activeOpacity={0.7}
                    >
                        {/* Step Circle */}
                        <View style={styles.stepCircleContainer}>
                            {isCompleted ? (
                                <LinearGradient
                                    colors={[Theme.colors.primary, '#FF1744']}
                                    style={styles.stepCircle}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Icon name="check" size={16} color="#fff" />
                                </LinearGradient>
                            ) : isActive ? (
                                <LinearGradient
                                    colors={[Theme.colors.primary, '#FF1744']}
                                    style={[styles.stepCircle, styles.activeCircle]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Text style={styles.activeStepNumber}>{stepNumber}</Text>
                                </LinearGradient>
                            ) : (
                                <View style={[styles.stepCircle, styles.inactiveCircle]}>
                                    <Text style={styles.inactiveStepNumber}>{stepNumber}</Text>
                                </View>
                            )}

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <View
                                    style={[
                                        styles.connector,
                                        isCompleted && styles.connectorCompleted,
                                    ]}
                                />
                            )}
                        </View>

                        {/* Step Label */}
                        <Text
                            style={[
                                styles.stepLabel,
                                isActive && styles.activeStepLabel,
                                isCompleted && styles.completedStepLabel,
                            ]}
                            numberOfLines={1}
                        >
                            {step}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        paddingHorizontal: 8,
    },
    stepContainer: {
        alignItems: 'center',
        marginHorizontal: 4,
        minWidth: 70,
    },
    stepCircleContainer: {
        position: 'relative',
        marginBottom: 8,
    },
    stepCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeCircle: {
        shadowColor: Theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    inactiveCircle: {
        backgroundColor: '#F5F5F5',
        borderWidth: 2,
        borderColor: '#E0E0E0',
    },
    activeStepNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    inactiveStepNumber: {
        fontSize: 14,
        fontWeight: '600',
        color: '#999',
    },
    connector: {
        position: 'absolute',
        left: 36,
        top: 17,
        width: 40,
        height: 2,
        backgroundColor: '#E0E0E0',
    },
    connectorCompleted: {
        backgroundColor: Theme.colors.primary,
    },
    stepLabel: {
        fontSize: 11,
        color: '#999',
        textAlign: 'center',
        fontWeight: '500',
    },
    activeStepLabel: {
        color: Theme.colors.primary,
        fontWeight: '700',
    },
    completedStepLabel: {
        color: Theme.colors.text,
        fontWeight: '600',
    },
});

export default ProgressStepper;
