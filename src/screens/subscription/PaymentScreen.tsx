/**
 * Payment Screen
 * Handles Razorpay payment integration for subscription plans
 */

import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import {
    Text,
    Surface,
    Button,
    Divider,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RazorpayCheckout from 'react-native-razorpay';
import { Theme } from '../../constants/theme';
import paymentService from '../../services/payment.service';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import toastService from '../../services/toast.service';

type PaymentScreenNavigationProp = NativeStackNavigationProp<any>;
type PaymentScreenRouteProp = RouteProp<any, 'Payment'>;

type Props = {
    navigation: PaymentScreenNavigationProp;
    route: PaymentScreenRouteProp;
};

const PaymentScreen: React.FC<Props> = ({ navigation, route }) => {
    const { planId, planName, amount, duration } = route.params as {
        planId: number;
        planName: string;
        amount: number;
        duration: number;
    };

    const { isAuthenticated } = useAuthStore();
    const { profile } = useProfileStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);

    const handlePayment = async () => {
        if (!isAuthenticated) {
            Alert.alert('Error', 'Please login to continue');
            return;
        }

        setIsCreatingOrder(true);

        try {
            // Step 1: Create order on backend
            const orderData = await paymentService.createOrder(planId);

            setIsCreatingOrder(false);
            setIsProcessing(true);

            // Step 2: Open Razorpay checkout
            const options = {
                description: `${planName} Subscription`,
                image: 'https://your-logo-url.com/logo.png', // Replace with your logo
                currency: orderData.currency,
                key: orderData.razorpayKey,
                amount: orderData.amount,
                order_id: orderData.orderId,
                name: 'Chhattisgarh Shaadi',
                prefill: {
                    email: '', // Email not stored in profile
                    contact: '', // Phone not stored in profile
                    name: profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}`.trim() : '',
                },
                theme: {
                    color: Theme.colors.primary,
                },
            };

            RazorpayCheckout.open(options)
                .then(async (data: any) => {
                    // Payment successful
                    console.log('Payment success:', data);

                    try {
                        // Step 3: Verify payment on backend
                        const verification = await paymentService.verifyPayment({
                            razorpay_order_id: data.razorpay_order_id,
                            razorpay_payment_id: data.razorpay_payment_id,
                            razorpay_signature: data.razorpay_signature,
                        });

                        setIsProcessing(false);

                        if (verification.success) {
                            toastService.success('Payment successful! Subscription activated.');

                            // Navigate to subscription screen
                            navigation.reset({
                                index: 0,
                                routes: [
                                    { name: 'Main' },
                                    { name: 'Subscription' },
                                ],
                            });
                        } else {
                            Alert.alert('Error', verification.message || 'Payment verification failed');
                        }
                    } catch (error: any) {
                        setIsProcessing(false);
                        console.error('Verification error:', error);
                        Alert.alert(
                            'Verification Failed',
                            error.response?.data?.message || 'Failed to verify payment. Please contact support.'
                        );
                    }
                })
                .catch((error: any) => {
                    // Payment cancelled or failed
                    setIsProcessing(false);
                    console.log('Payment error:', error);

                    if (error.code === 2) {
                        // User cancelled
                        toastService.info('Payment cancelled');
                    } else {
                        Alert.alert('Payment Failed', error.description || 'Something went wrong');
                    }
                });
        } catch (error: any) {
            setIsCreatingOrder(false);
            setIsProcessing(false);
            console.error('Order creation error:', error);
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to create payment order'
            );
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Plan Details Card */}
                <Surface style={styles.card} elevation={2}>
                    <View style={styles.cardHeader}>
                        <Icon name="crown" size={32} color={Theme.colors.secondary} />
                        <Text variant="headlineSmall" style={styles.planName}>
                            {planName}
                        </Text>
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.detailRow}>
                        <Text variant="bodyLarge" style={styles.label}>
                            Duration
                        </Text>
                        <Text variant="bodyLarge" style={styles.value}>
                            {duration} days
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text variant="bodyLarge" style={styles.label}>
                            Amount
                        </Text>
                        <Text variant="headlineSmall" style={styles.amount}>
                            {formatCurrency(amount)}
                        </Text>
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.totalRow}>
                        <Text variant="titleLarge" style={styles.totalLabel}>
                            Total Payable
                        </Text>
                        <Text variant="headlineMedium" style={styles.totalAmount}>
                            {formatCurrency(amount)}
                        </Text>
                    </View>
                </Surface>

                {/* Payment Info */}
                <Surface style={styles.infoCard} elevation={1}>
                    <View style={styles.infoRow}>
                        <Icon name="shield-check" size={20} color={Theme.colors.success} />
                        <Text variant="bodyMedium" style={styles.infoText}>
                            100% Secure Payment
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon name="lock" size={20} color={Theme.colors.success} />
                        <Text variant="bodyMedium" style={styles.infoText}>
                            SSL Encrypted
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon name="cash-refund" size={20} color={Theme.colors.success} />
                        <Text variant="bodyMedium" style={styles.infoText}>
                            Money-Back Guarantee
                        </Text>
                    </View>
                </Surface>

                {/* Payment Methods */}
                <Surface style={styles.methodsCard} elevation={1}>
                    <Text variant="titleMedium" style={styles.methodsTitle}>
                        Accepted Payment Methods
                    </Text>
                    <View style={styles.methodsRow}>
                        <Icon name="credit-card" size={24} color={Theme.colors.textSecondary} />
                        <Icon name="bank" size={24} color={Theme.colors.textSecondary} />
                        <Icon name="wallet" size={24} color={Theme.colors.textSecondary} />
                        <Icon name="cellphone" size={24} color={Theme.colors.textSecondary} />
                    </View>
                    <Text variant="bodySmall" style={styles.methodsSubtext}>
                        Cards, Net Banking, UPI, Wallets & More
                    </Text>
                </Surface>
            </ScrollView>

            {/* Payment Button */}
            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={handlePayment}
                    loading={isCreatingOrder || isProcessing}
                    disabled={isCreatingOrder || isProcessing}
                    style={styles.payButton}
                    buttonColor={Theme.colors.secondary}
                    textColor={Theme.colors.primaryDark}
                    icon="lock">
                    {isCreatingOrder
                        ? 'Creating Order...'
                        : isProcessing
                            ? 'Processing Payment...'
                            : `Pay ${formatCurrency(amount)}`}
                </Button>
                <Text variant="bodySmall" style={styles.footerText}>
                    By proceeding, you agree to our Terms & Conditions
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    card: {
        padding: 20,
        borderRadius: 16,
        backgroundColor: Theme.colors.white,
        marginBottom: 16,
    },
    cardHeader: {
        alignItems: 'center',
        marginBottom: 16,
    },
    planName: {
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginTop: 8,
    },
    divider: {
        marginVertical: 16,
        backgroundColor: Theme.colors.surfaceCard,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    label: {
        color: Theme.colors.textSecondary,
    },
    value: {
        color: Theme.colors.text,
        fontWeight: '600',
    },
    amount: {
        color: Theme.colors.secondary,
        fontWeight: 'bold',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    totalLabel: {
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    totalAmount: {
        fontWeight: 'bold',
        color: Theme.colors.primary,
    },
    infoCard: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: Theme.colors.white,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    infoText: {
        color: Theme.colors.text,
    },
    methodsCard: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: Theme.colors.white,
    },
    methodsTitle: {
        fontWeight: '600',
        color: Theme.colors.text,
        marginBottom: 12,
    },
    methodsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 8,
    },
    methodsSubtext: {
        textAlign: 'center',
        color: Theme.colors.textSecondary,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: Theme.colors.white,
        borderTopWidth: 1,
        borderTopColor: Theme.colors.surfaceCard,
        ...Theme.shadows.lg,
    },
    payButton: {
        borderRadius: 12,
        paddingVertical: 8,
    },
    footerText: {
        textAlign: 'center',
        color: Theme.colors.textSecondary,
        marginTop: 8,
    },
});

export default PaymentScreen;
