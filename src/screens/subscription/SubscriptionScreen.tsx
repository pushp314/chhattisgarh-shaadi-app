/**
 * Subscription Screen - Unified Premium Subscription Experience
 * Displays available premium plans with Razorpay integration
 * Shows PremiumDashboard if user already has active subscription
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Alert,
    TouchableOpacity,
} from 'react-native';
import {
    Text,
    Surface,
    Button,
    ActivityIndicator,
    Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import RazorpayCheckout from 'react-native-razorpay';
import { Theme } from '../../constants/theme';
import subscriptionService from '../../services/subscription.service';
import paymentService from '../../services/payment.service';
import { SubscriptionPlan } from '../../types';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import PremiumDashboardScreen from './PremiumDashboardScreen';

type NavigationProp = NativeStackNavigationProp<any>;

const SubscriptionScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingPlanId, setProcessingPlanId] = useState<number | null>(null);

    // Subscription and user state
    const { isPremium, subscription, fetchSubscription, refreshAfterPayment } = useSubscriptionStore();
    const { user } = useAuthStore();
    const { profile } = useProfileStore();

    // Check subscription status on screen focus
    useFocusEffect(
        useCallback(() => {
            fetchSubscription();
        }, [])
    );

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        setIsLoading(true);
        try {
            const response = await subscriptionService.getPlans();
            if (response && response.results && Array.isArray(response.results)) {
                // Sort by display order and filter active plans
                const activePlans = response.results
                    .filter((plan: SubscriptionPlan) => plan.isActive !== false)
                    .sort((a: SubscriptionPlan, b: SubscriptionPlan) =>
                        (a.displayOrder || 0) - (b.displayOrder || 0)
                    );
                setPlans(activePlans);
            } else {
                setPlans([]);
            }
        } catch (error) {
            console.error('Error loading plans:', error);
            setPlans([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubscribe = async (plan: SubscriptionPlan) => {
        const planPrice = typeof plan.price === 'string' ? parseFloat(plan.price) : plan.price;

        if (planPrice === 0) {
            Alert.alert('Free Plan', 'This is a free plan.');
            return;
        }

        setProcessingPlanId(plan.id);

        try {
            // Validate Razorpay module
            if (!RazorpayCheckout || typeof RazorpayCheckout.open !== 'function') {
                throw new Error('Razorpay module not properly initialized. Please restart the app.');
            }

            // 1. Create Order
            console.log('Creating order for plan:', plan.id);
            const order = await paymentService.createOrder(plan.id);
            console.log('Order created:', order);

            // Validate order response
            if (!order || !order.orderId || !order.razorpayKey) {
                console.error('Invalid order response:', order);
                throw new Error('Invalid order response from server. Missing Key or ID.');
            }

            if (order.razorpayKey === 'rzp_test_...' || order.razorpayKey.includes('***')) {
                console.warn('Warning: It looks like a placeholder Razorpay key is being used.');
            }

            // Get user prefill data
            const userEmail = user?.email || 'user@example.com';
            const userPhone = user?.phone || '9999999999';
            const userName = profile
                ? `${profile.firstName} ${profile.lastName || ''}`.trim()
                : (user?.email?.split('@')[0] || 'User');

            // 2. Open Razorpay Checkout
            const options = {
                description: `${plan.name} Subscription`,
                image: 'https://chhattisgarhshaadi.com/logo.png',
                currency: order.currency,
                key: order.razorpayKey,
                amount: order.amount,
                name: 'Chhattisgarh Shaadi',
                order_id: order.orderId,
                prefill: {
                    email: userEmail,
                    contact: userPhone,
                    name: userName,
                },
                theme: { color: Theme.colors.primary },
            };

            console.log('Opening Razorpay with options:', { ...options, key: '***' });

            // DEBUG: Alert to confirm we are reaching this point and check values
            Alert.alert(
                'Debug: Opening Razorpay',
                `Key: ${order.razorpayKey?.substring(0, 8)}...\nAmount: ${options.amount}\nOrder ID: ${options.order_id}`,
                [
                    {
                        text: 'Open SDK',
                        onPress: () => {
                            RazorpayCheckout.open(options)
                                .then(async (data: any) => {
                                    console.log('Payment successful:', data);
                                    try {
                                        await paymentService.verifyPayment({
                                            razorpay_order_id: data.razorpay_order_id,
                                            razorpay_payment_id: data.razorpay_payment_id,
                                            razorpay_signature: data.razorpay_signature,
                                        });

                                        // Refresh subscription status
                                        await refreshAfterPayment();

                                        Alert.alert(
                                            '🎉 Welcome to Premium!',
                                            'Your subscription has been activated successfully. Enjoy exclusive features!',
                                            [{ text: 'OK' }]
                                        );
                                    } catch (verifyError: any) {
                                        console.error('Payment verification error:', verifyError);
                                        Alert.alert('Payment Verification Failed', verifyError.message || 'Please contact support.');
                                    }
                                })
                                .catch((error: any) => {
                                    console.error('Razorpay Error Catch:', error);
                                    const errorDesc = typeof error === 'object' ? JSON.stringify(error) : String(error);
                                    Alert.alert('Razorpay Failed', `The Payment SDK failed to open or returned an error:\n${errorDesc}`);
                                })
                                .finally(() => {
                                    setProcessingPlanId(null);
                                });
                        }
                    }
                ]
            );

        } catch (error: any) {
            console.error('Order creation error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create order. Please try again.';
            Alert.alert('Error', errorMessage);
            setProcessingPlanId(null);
        }
    };

    const parseFeatures = (features: any): string[] => {
        if (!features) return [];
        try {
            if (typeof features === 'string') {
                try {
                    return JSON.parse(features);
                } catch {
                    return features.split(',').map((f: string) => f.trim()).filter((f: string) => f);
                }
            }
            if (Array.isArray(features)) return features;
        } catch (e) {
            console.error('Failed to parse features:', e);
        }
        return [];
    };

    const renderPlanCard = (plan: SubscriptionPlan) => {
        const isProcessing = processingPlanId === plan.id;
        const planPrice = typeof plan.price === 'string' ? parseFloat(plan.price) : plan.price;
        const isFree = planPrice === 0;
        const parsedFeatures = parseFeatures(plan.features);

        // Calculate duration text
        const durationMonths = Math.round(plan.duration / 30);
        const perMonthPrice = durationMonths > 0 ? Math.round(planPrice / durationMonths) : planPrice;

        return (
            <Surface
                key={plan.id}
                style={[
                    styles.planCard,
                    plan.isPopular && styles.popularCard,
                ]}
                elevation={plan.isPopular ? 4 : 2}
            >
                {plan.isPopular && (
                    <LinearGradient
                        colors={[Theme.colors.primary, '#D81B60']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.popularBadge}
                    >
                        <Icon name="star" size={12} color="#fff" />
                        <Text style={styles.popularText}>MOST POPULAR</Text>
                    </LinearGradient>
                )}

                <View style={styles.planHeader}>
                    <View style={styles.planIconContainer}>
                        <Icon
                            name="crown"
                            size={24}
                            color={plan.isPopular ? Theme.colors.primary : Theme.colors.secondary}
                        />
                    </View>
                    <Text style={styles.planName}>{plan.name}</Text>
                </View>

                <View style={styles.priceContainer}>
                    <Text style={styles.currencySymbol}>₹</Text>
                    <Text style={styles.priceValue}>{planPrice.toLocaleString('en-IN')}</Text>
                    <Text style={styles.priceDuration}>/{plan.duration} days</Text>
                </View>

                {!isFree && durationMonths > 0 && (
                    <Text style={styles.perMonthText}>
                        ₹{perMonthPrice.toLocaleString('en-IN')}/month
                    </Text>
                )}

                <Divider style={styles.divider} />

                <View style={styles.featuresContainer}>
                    {parsedFeatures.slice(0, 5).map((feature: string, index: number) => (
                        <View key={index} style={styles.featureRow}>
                            <Icon
                                name="check-circle"
                                size={18}
                                color={plan.isPopular ? Theme.colors.primary : Theme.colors.success}
                            />
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.subscribeButtonContainer}
                    onPress={() => handleSubscribe(plan)}
                    disabled={isProcessing || isFree}
                    activeOpacity={0.8}
                >
                    {plan.isPopular ? (
                        <LinearGradient
                            colors={[Theme.colors.primary, '#D81B60']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.subscribeGradient}
                        >
                            {isProcessing ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.subscribeTextWhite}>
                                    {isFree ? 'Free Plan' : 'Subscribe Now'}
                                </Text>
                            )}
                        </LinearGradient>
                    ) : (
                        <View style={styles.subscribeOutlined}>
                            {isProcessing ? (
                                <ActivityIndicator size="small" color={Theme.colors.primary} />
                            ) : (
                                <Text style={styles.subscribeTextPrimary}>
                                    {isFree ? 'Free Plan' : 'Choose Plan'}
                                </Text>
                            )}
                        </View>
                    )}
                </TouchableOpacity>
            </Surface>
        );
    };

    // Show loading state
    if (isLoading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Theme.colors.primary} />
                    <Text style={styles.loadingText}>Loading plans...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // If user is premium, show the Premium Dashboard
    if (isPremium && subscription) {
        return <PremiumDashboardScreen />;
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color={Theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Premium Plans</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('TransactionHistory')}
                    style={styles.historyButton}
                >
                    <Icon name="receipt" size={22} color={Theme.colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <LinearGradient
                        colors={[Theme.colors.primary, '#D81B60']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.heroGradient}
                    >
                        <Icon name="crown" size={48} color="#FFD700" />
                        <Text style={styles.heroTitle}>Upgrade to Premium</Text>
                        <Text style={styles.heroSubtitle}>
                            Find your perfect match faster with exclusive features
                        </Text>
                    </LinearGradient>
                </View>

                {/* Plan Cards */}
                <View style={styles.plansContainer}>
                    {plans.map(plan => renderPlanCard(plan))}
                </View>

                {/* Trust Badges */}
                <View style={styles.trustSection}>
                    <View style={styles.trustBadge}>
                        <Icon name="shield-check" size={20} color={Theme.colors.success} />
                        <Text style={styles.trustText}>Secure Payments</Text>
                    </View>
                    <View style={styles.trustBadge}>
                        <Icon name="cash-refund" size={20} color={Theme.colors.primary} />
                        <Text style={styles.trustText}>7-Day Refund</Text>
                    </View>
                    <View style={styles.trustBadge}>
                        <Icon name="lock" size={20} color={Theme.colors.secondary} />
                        <Text style={styles.trustText}>Encrypted</Text>
                    </View>
                </View>

                <View style={styles.bottomPadding} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: Theme.colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.surfaceCard,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Theme.colors.text,
    },
    historyButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: Theme.colors.textSecondary,
    },
    scrollContent: {
        padding: 16,
    },
    heroSection: {
        marginBottom: 24,
        borderRadius: 16,
        overflow: 'hidden',
    },
    heroGradient: {
        padding: 24,
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: Theme.colors.white,
        marginTop: 12,
    },
    heroSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginTop: 8,
    },
    plansContainer: {
        gap: 16,
        marginBottom: 24,
    },
    planCard: {
        padding: 20,
        borderRadius: 16,
        backgroundColor: Theme.colors.white,
        position: 'relative',
        overflow: 'hidden',
    },
    popularCard: {
        borderWidth: 2,
        borderColor: Theme.colors.primary,
    },
    popularBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderBottomLeftRadius: 12,
    },
    popularText: {
        fontSize: 10,
        fontWeight: '700',
        color: Theme.colors.white,
    },
    planHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    planIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF0F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    planName: {
        fontSize: 20,
        fontWeight: '700',
        color: Theme.colors.text,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 4,
    },
    currencySymbol: {
        fontSize: 20,
        fontWeight: '700',
        color: Theme.colors.primary,
    },
    priceValue: {
        fontSize: 32,
        fontWeight: '800',
        color: Theme.colors.primary,
    },
    priceDuration: {
        fontSize: 14,
        color: Theme.colors.textSecondary,
        marginLeft: 4,
    },
    perMonthText: {
        fontSize: 13,
        color: Theme.colors.textSecondary,
        marginBottom: 16,
    },
    divider: {
        marginVertical: 16,
        backgroundColor: Theme.colors.surfaceCard,
    },
    featuresContainer: {
        gap: 10,
        marginBottom: 20,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    featureText: {
        flex: 1,
        fontSize: 14,
        color: Theme.colors.text,
    },
    subscribeButtonContainer: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    subscribeGradient: {
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 12,
    },
    subscribeOutlined: {
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Theme.colors.primary,
        backgroundColor: 'transparent',
    },
    subscribeTextWhite: {
        fontSize: 16,
        fontWeight: '700',
        color: Theme.colors.white,
    },
    subscribeTextPrimary: {
        fontSize: 16,
        fontWeight: '700',
        color: Theme.colors.primary,
    },
    trustSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        backgroundColor: Theme.colors.white,
        borderRadius: 12,
    },
    trustBadge: {
        alignItems: 'center',
        gap: 6,
    },
    trustText: {
        fontSize: 11,
        color: Theme.colors.textSecondary,
        fontWeight: '500',
    },
    bottomPadding: {
        height: 32,
    },
});

export default SubscriptionScreen;
