/**
 * Subscription Screen - Choose Your Plan
 * Premium, Gold, and Silver subscription plans
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Theme } from '../../constants/theme';
import subscriptionService from '../../services/subscription.service';
import paymentService from '../../services/payment.service';
import RazorpayCheckout from 'react-native-razorpay';

type SubscriptionScreenNavigationProp = NativeStackNavigationProp<any>;

const SubscriptionScreen: React.FC = () => {
    const navigation = useNavigation<SubscriptionScreenNavigationProp>();
    const [plans, setPlans] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingPlanId, setProcessingPlanId] = useState<number | null>(null);

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        try {
            const response = await subscriptionService.getPlans();
            setPlans(response.results || []);
        } catch (error) {
            console.error('Error loading plans:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubscribe = async (planId: number) => {
        setProcessingPlanId(planId);
        try {
            // 1. Create Order
            const order = await paymentService.createOrder(planId);

            // 2. Open Razorpay Checkout
            const options = {
                description: 'Premium Subscription',
                image: 'https://chhattisgarhshaadi.com/logo.png', // Replace with your app logo URL
                currency: order.currency,
                key: order.razorpayKey, // Your api key
                amount: order.amount,
                name: 'Chhattisgarh Shaadi',
                order_id: order.orderId,
                prefill: {
                    email: 'user@example.com', // You can fetch this from user store
                    contact: '919999999999', // You can fetch this from user store
                    name: 'User Name' // You can fetch this from user store
                },
                theme: { color: Theme.colors.primary }
            };

            RazorpayCheckout.open(options).then(async (data: any) => {
                // handle success
                try {
                    await paymentService.verifyPayment({
                        razorpay_order_id: data.razorpay_order_id,
                        razorpay_payment_id: data.razorpay_payment_id,
                        razorpay_signature: data.razorpay_signature
                    });
                    Alert.alert('Success', 'Subscription activated successfully!');
                    navigation.goBack();
                } catch (verifyError: any) {
                    Alert.alert('Payment Verification Failed', verifyError.message);
                }
            }).catch((error: any) => {
                // handle failure
                if (error.code === 0) {
                    // Payment cancelled by user, do nothing or show toast
                    console.log('Payment cancelled');
                } else {
                    Alert.alert('Payment Failed', error.description || 'Something went wrong');
                }
            });

        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to create order');
        } finally {
            setProcessingPlanId(null);
        }
    };

    const features = [
        { icon: 'shield-check', title: 'Verified Profiles', subtitle: 'Connect with genuine members' },
        { icon: 'chat', title: 'Unlimited Chats', subtitle: 'Talk without limits' },
        { icon: 'phone', title: 'View Contacts', subtitle: 'Access phone numbers' },
        { icon: 'headset', title: 'Priority Support', subtitle: 'Get help when you need it' },
    ];

    const renderFeatureCard = (feature: any, index: number) => (
        <View key={index} style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
                <Icon name={feature.icon} size={24} color={Theme.colors.primary} />
            </View>
            <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
            </View>
        </View>
    );

    const renderPlanCard = (plan: any, isPopular: boolean = false) => {
        const isProcessing = processingPlanId === plan.id;
        const isPremium = plan.name.toLowerCase().includes('premium');
        const isGold = plan.name.toLowerCase().includes('gold');
        const isSilver = plan.name.toLowerCase().includes('silver');

        // Parse features from JSON string
        let planFeatures: string[] = [];
        try {
            planFeatures = typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features || [];
        } catch (e) {
            planFeatures = [];
        }

        return (
            <View
                key={plan.id}
                style={[
                    styles.planCard,
                    isGold && styles.goldPlanCard,
                ]}
            >
                {isPopular && (
                    <View style={styles.popularBadge}>
                        <Text style={styles.popularText}>Most Popular</Text>
                    </View>
                )}

                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.currency}>₹</Text>
                    <Text style={styles.price}>{Math.floor(plan.price)}</Text>
                    <Text style={styles.duration}>/3 months</Text>
                </View>

                <View style={styles.featuresContainer}>
                    {planFeatures.slice(0, 4).map((feature, index) => (
                        <View key={index} style={styles.featureRow}>
                            <Icon name="check-circle" size={18} color={Theme.colors.primary} />
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.subscribeButton}
                    onPress={() => handleSubscribe(plan.id)}
                    disabled={isProcessing}
                >
                    {isPremium || isGold ? (
                        <LinearGradient
                            colors={['#E91E63', '#D81B60']}
                            style={styles.subscribeGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            {isProcessing ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.subscribeTextWhite}>
                                    {isPremium ? 'Upgrade Now' : 'Subscribe Now'}
                                </Text>
                            )}
                        </LinearGradient>
                    ) : (
                        <View style={styles.subscribeLightButton}>
                            {isProcessing ? (
                                <ActivityIndicator size="small" color={Theme.colors.primary} />
                            ) : (
                                <Text style={styles.subscribeTextPink}>Choose Plan</Text>
                            )}
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Theme.colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    // Sort plans: Premium, Gold, Silver
    const sortedPlans = [...plans].sort((a, b) => {
        const order: any = { premium: 0, gold: 1, silver: 2 };
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aOrder = Object.keys(order).find(key => aName.includes(key)) || 'silver';
        const bOrder = Object.keys(order).find(key => bName.includes(key)) || 'silver';
        return order[aOrder] - order[bOrder];
    });

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Choose Your Plan</Text>
                <View style={styles.backButton} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Feature Cards */}
                <View style={styles.featuresGrid}>
                    {features.map((feature, index) => renderFeatureCard(feature, index))}
                </View>

                {/* Plan Cards */}
                <View style={styles.plansContainer}>
                    {sortedPlans.map(plan => {
                        const isGold = plan.name.toLowerCase().includes('gold');
                        return renderPlanCard(plan, isGold);
                    })}
                </View>

                {/* Secure Payments Footer */}
                <View style={styles.secureFooter}>
                    <Icon name="lock" size={16} color="#666" />
                    <Text style={styles.secureText}>100% Secure Payments</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 16,
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    featureCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'column',
        gap: 8,
    },
    featureIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF0F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureTextContainer: {
        gap: 2,
    },
    featureTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    featureSubtitle: {
        fontSize: 11,
        color: '#666',
    },
    plansContainer: {
        gap: 16,
    },
    planCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    goldPlanCard: {
        borderWidth: 2,
        borderColor: Theme.colors.primary,
    },
    popularBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: Theme.colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    popularText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#fff',
    },
    planName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 20,
    },
    currency: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
    },
    price: {
        fontSize: 36,
        fontWeight: '800',
        color: '#333',
    },
    duration: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
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
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    subscribeButton: {
        borderRadius: 24,
        overflow: 'hidden',
    },
    subscribeGradient: {
        paddingVertical: 14,
        alignItems: 'center',
    },
    subscribeLightButton: {
        backgroundColor: '#FFF0F5',
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 24,
    },
    subscribeTextWhite: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    subscribeTextPink: {
        fontSize: 16,
        fontWeight: '700',
        color: Theme.colors.primary,
    },
    secureFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 24,
        paddingVertical: 16,
    },
    secureText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
});

export default SubscriptionScreen;
