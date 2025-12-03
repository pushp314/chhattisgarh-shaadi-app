/**
 * Subscription Plans Screen
 * Display available premium plans from backend API
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Alert,
} from 'react-native';
import {
    Text,
    Surface,
    Button,
    ActivityIndicator,
    Chip,
    Divider,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';
import subscriptionService from '../../services/subscription.service';
import { SubscriptionPlan } from '../../types';

type SubscriptionPlansScreenNavigationProp = NativeStackNavigationProp<any>;

type Props = {
    navigation: SubscriptionPlansScreenNavigationProp;
};

const SubscriptionPlansScreen: React.FC<Props> = ({ navigation }) => {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPlanId, setCurrentPlanId] = useState<number | null>(null);

    useEffect(() => {
        loadPlans();
        loadCurrentSubscription();
    }, []);

    const loadPlans = async () => {
        setIsLoading(true);
        try {
            const response = await subscriptionService.getPlans();
            // Handle response - check if results exist
            if (response && response.results && Array.isArray(response.results)) {
                // Sort by display order and filter active plans
                const activePlans = response.results
                    .filter((plan: SubscriptionPlan) => plan.isActive)
                    .sort((a: SubscriptionPlan, b: SubscriptionPlan) => a.displayOrder - b.displayOrder);
                setPlans(activePlans);
            } else {
                console.warn('No subscription plans found in response:', response);
                setPlans([]);
            }
        } catch (error) {
            console.error('Error loading plans:', error);
            Alert.alert('Error', 'Failed to load subscription plans');
            setPlans([]);
        } finally {
            setIsLoading(false);
        }
    };

    const loadCurrentSubscription = async () => {
        try {
            const subscription = await subscriptionService.getCurrentSubscription();
            if (subscription) {
                setCurrentPlanId(subscription.planId);
            }
        } catch (error) {
            console.error('Error loading subscription:', error);
        }
    };

    const handleSelectPlan = (plan: SubscriptionPlan) => {
        if (parseFloat(plan.price) === 0) {
            Alert.alert('Free Plan', 'This is a free plan.');
            return;
        }

        if (plan.id === currentPlanId) {
            Alert.alert('Current Plan', 'This is your current subscription plan.');
            return;
        }

        // Navigate to payment screen
        navigation.navigate('Payment', {
            planId: plan.id,
            planName: plan.name,
            amount: parseFloat(plan.price),
            duration: plan.duration,
        });
    };

    const renderPlanCard = (plan: SubscriptionPlan) => {
        const isCurrentPlan = plan.id === currentPlanId;
        const isFree = parseFloat(plan.price) === 0;

        let parsedFeatures: string[] = [];
        try {
            // Handle different formats: JSON string, plain string, or already an array
            if (typeof plan.features === 'string') {
                // Try to parse as JSON first
                try {
                    parsedFeatures = JSON.parse(plan.features);
                } catch {
                    // If JSON parse fails, treat as comma-separated string
                    parsedFeatures = plan.features.split(',').map(f => f.trim()).filter(f => f);
                }
            } else if (Array.isArray(plan.features)) {
                // Already an array
                parsedFeatures = plan.features;
            }
        } catch (e) {
            console.error('Failed to parse features:', e);
            parsedFeatures = [];
        }

        return (
            <Surface
                key={plan.id}
                style={[
                    styles.planCard,
                    plan.isPopular && styles.popularCard,
                    isCurrentPlan && styles.currentPlanCard,
                ]}
                elevation={plan.isPopular ? 4 : 2}>
                {plan.isPopular && (
                    <View style={styles.popularBadge}>
                        <Text style={styles.popularText}>⭐ MOST POPULAR</Text>
                    </View>
                )}

                {isCurrentPlan && (
                    <View style={styles.currentBadge}>
                        <Icon name="check-circle" size={16} color={Theme.colors.white} />
                        <Text style={styles.currentText}>Current Plan</Text>
                    </View>
                )}

                <View style={styles.planHeader}>
                    <Text variant="headlineSmall" style={styles.planName}>
                        {plan.name}
                    </Text>
                </View>

                <View style={styles.priceContainer}>
                    <Text variant="displaySmall" style={styles.price}>
                        ₹{parseFloat(plan.price).toLocaleString('en-IN')}
                    </Text>
                    <Text variant="bodyMedium" style={styles.duration}>
                        /{plan.duration} days
                    </Text>
                </View>

                {!isFree && (
                    <Text variant="bodySmall" style={styles.perMonth}>
                        ₹{Math.round(parseFloat(plan.price) / (plan.duration / 30))}/month
                    </Text>
                )}

                <Divider style={styles.divider} />

                <View style={styles.featuresContainer}>
                    {parsedFeatures.map((feature: string, index: number) => (
                        <View key={index} style={styles.featureRow}>
                            <Icon
                                name="check-circle"
                                size={20}
                                color={plan.isPopular ? Theme.colors.secondary : Theme.colors.success}
                            />
                            <Text variant="bodyMedium" style={styles.featureText}>
                                {feature}
                            </Text>
                        </View>
                    ))}
                </View>

                <Button
                    mode={plan.isPopular ? 'contained' : 'outlined'}
                    onPress={() => handleSelectPlan(plan)}
                    style={styles.selectButton}
                    buttonColor={plan.isPopular ? Theme.colors.secondary : undefined}
                    textColor={plan.isPopular ? Theme.colors.primaryDark : Theme.colors.secondary}
                    disabled={isCurrentPlan || isFree}>
                    {isCurrentPlan ? 'Current Plan' : isFree ? 'Free Plan' : 'Choose Plan'}
                </Button>
            </Surface>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Theme.colors.primary} />
                <Text style={styles.loadingText}>Loading plans...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Surface style={styles.headerCard} elevation={1}>
                <Icon name="crown" size={48} color={Theme.colors.secondary} />
                <Text variant="headlineMedium" style={styles.headerTitle}>
                    Choose Your Plan
                </Text>
                <Text variant="bodyMedium" style={styles.headerSubtitle}>
                    Unlock premium features and find your perfect match faster
                </Text>
                <Button
                    mode="outlined"
                    icon="receipt"
                    onPress={() => navigation.navigate('TransactionHistory')}
                    style={styles.historyButton}
                    textColor={Theme.colors.secondary}>
                    View Transaction History
                </Button>
            </Surface>

            <View style={styles.plansContainer}>
                {plans.map(plan => renderPlanCard(plan))}
            </View>

            <Surface style={styles.infoCard} elevation={1}>
                <Icon name="information" size={24} color={Theme.colors.secondary} />
                <View style={styles.infoContent}>
                    <Text variant="titleSmall" style={styles.infoTitle}>
                        Money-Back Guarantee
                    </Text>
                    <Text variant="bodySmall" style={styles.infoText}>
                        Not satisfied? Get a full refund within 7 days of purchase. No questions asked.
                    </Text>
                </View>
            </Surface>

            <Surface style={styles.infoCard} elevation={1}>
                <Icon name="shield-check" size={24} color={Theme.colors.success} />
                <View style={styles.infoContent}>
                    <Text variant="titleSmall" style={styles.infoTitle}>
                        Secure Payments
                    </Text>
                    <Text variant="bodySmall" style={styles.infoText}>
                        All payments are processed securely through Razorpay. Your financial information
                        is encrypted and protected.
                    </Text>
                </View>
            </Surface>

            <View style={styles.bottomPadding} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    content: {
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Theme.colors.background,
    },
    loadingText: {
        marginTop: 16,
        color: Theme.colors.textSecondary,
    },
    headerCard: {
        padding: 24,
        borderRadius: 12,
        backgroundColor: Theme.colors.white,
        alignItems: 'center',
        marginBottom: 24,
        ...Theme.shadows.md,
    },
    headerTitle: {
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginTop: 16,
        marginBottom: 8,
    },
    headerSubtitle: {
        color: Theme.colors.textSecondary,
        textAlign: 'center',
    },
    historyButton: {
        marginTop: 12,
        borderRadius: 8,
        borderColor: Theme.colors.secondary,
    },
    plansContainer: {
        gap: 16,
        marginBottom: 24,
    },
    planCard: {
        padding: 20,
        borderRadius: 12,
        backgroundColor: Theme.colors.white,
        position: 'relative',
        ...Theme.shadows.md,
    },
    popularCard: {
        borderWidth: 2,
        borderColor: Theme.colors.secondary,
        ...Theme.shadows.lg,
    },
    currentPlanCard: {
        borderWidth: 2,
        borderColor: Theme.colors.success,
    },
    popularBadge: {
        position: 'absolute',
        top: -12,
        right: 20,
        backgroundColor: Theme.colors.secondary,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
    },
    popularText: {
        color: Theme.colors.primaryDark,
        fontSize: 12,
        fontWeight: 'bold',
    },
    currentBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Theme.colors.success,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    currentText: {
        color: Theme.colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    planName: {
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 4,
    },
    price: {
        fontWeight: 'bold',
        color: Theme.colors.secondary,
    },
    duration: {
        color: Theme.colors.textSecondary,
        marginLeft: 4,
    },
    perMonth: {
        color: Theme.colors.textSecondary,
        marginBottom: 16,
    },
    divider: {
        marginVertical: 16,
        backgroundColor: Theme.colors.surfaceCard,
    },
    featuresContainer: {
        gap: 12,
        marginBottom: 20,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    featureText: {
        flex: 1,
        color: Theme.colors.text,
    },
    selectButton: {
        borderRadius: 8,
    },
    infoCard: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        backgroundColor: Theme.colors.white,
        marginBottom: 12,
        gap: 12,
        ...Theme.shadows.sm,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginBottom: 4,
    },
    infoText: {
        color: Theme.colors.textSecondary,
        lineHeight: 20,
    },
    bottomPadding: {
        height: 32,
    },
});

export default SubscriptionPlansScreen;
