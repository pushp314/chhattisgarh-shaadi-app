/**
 * Premium Dashboard Screen
 * Shows premium user benefits and subscription details
 * Matches the subscription screen's design language
 */

import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { Text, Surface, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Theme } from '../../constants/theme';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { useProfileStore } from '../../store/profileStore';
import subscriptionService from '../../services/subscription.service';

type NavigationProp = NativeStackNavigationProp<any>;

const PremiumDashboardScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { subscription, daysRemaining, fetchSubscription } = useSubscriptionStore();
    const { profile } = useProfileStore();
    const [planDetails, setPlanDetails] = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadPlanDetails();
    }, [subscription]);

    const loadPlanDetails = async () => {
        if (subscription?.planId) {
            try {
                const response = await subscriptionService.getPlans();
                const plan = response.results.find((p: any) => p.id === subscription.planId);
                setPlanDetails(plan);
            } catch (error) {
                console.error('Error loading plan details:', error);
            }
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchSubscription();
        await loadPlanDetails();
        setRefreshing(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getValidityStatus = () => {
        if (daysRemaining > 30) return { color: Theme.colors.success, text: 'Active' };
        if (daysRemaining > 7) return { color: '#FFA000', text: 'Expiring Soon' };
        return { color: Theme.colors.error, text: 'Expiring' };
    };

    const premiumFeatures = [
        {
            icon: 'message-text',
            title: 'Unlimited Messaging',
            description: 'Chat with matches without restrictions',
        },
        {
            icon: 'phone',
            title: 'View Contact Details',
            description: 'Access phone numbers directly',
        },
        {
            icon: 'eye',
            title: 'Profile Visitors',
            description: 'See who viewed your profile',
        },
        {
            icon: 'shield-star',
            title: 'Premium Badge',
            description: 'Stand out with verified badge',
        },
        {
            icon: 'sort-ascending',
            title: 'Priority Listing',
            description: 'Appear higher in search results',
        },
        {
            icon: 'headset',
            title: 'Priority Support',
            description: 'Get dedicated customer support',
        },
    ];

    const validityStatus = getValidityStatus();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color={Theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Subscription</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('TransactionHistory')}
                    style={styles.historyButton}
                >
                    <Icon name="receipt" size={22} color={Theme.colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[Theme.colors.primary]}
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Premium Status Card */}
                <LinearGradient
                    colors={[Theme.colors.primary, '#D81B60']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.premiumCard}
                >
                    <View style={styles.premiumHeader}>
                        <View style={styles.crownContainer}>
                            <Icon name="crown" size={36} color="#FFD700" />
                        </View>
                        <View style={styles.premiumInfo}>
                            <Text style={styles.premiumTitle}>Premium Member</Text>
                            <Text style={styles.planName}>
                                {planDetails?.name || 'Premium Plan'}
                            </Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: validityStatus.color }]}>
                            <Text style={styles.statusText}>{validityStatus.text}</Text>
                        </View>
                    </View>

                    <View style={styles.dividerWhite} />

                    <View style={styles.validityContainer}>
                        <View style={styles.validityItem}>
                            <Icon name="calendar-check" size={18} color="rgba(255,255,255,0.8)" />
                            <Text style={styles.validityLabel}>Started</Text>
                            <Text style={styles.validityValue}>
                                {subscription?.startDate ? formatDate(subscription.startDate) : '-'}
                            </Text>
                        </View>
                        <View style={styles.validityDivider} />
                        <View style={styles.validityItem}>
                            <Icon name="calendar-clock" size={18} color="rgba(255,255,255,0.8)" />
                            <Text style={styles.validityLabel}>Expires</Text>
                            <Text style={styles.validityValue}>
                                {subscription?.endDate ? formatDate(subscription.endDate) : '-'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.daysContainer}>
                        <Icon name="clock-outline" size={16} color="#fff" />
                        <Text style={styles.daysText}>
                            {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
                        </Text>
                    </View>
                </LinearGradient>

                {/* User Info Card */}
                {profile && (
                    <Surface style={styles.userCard} elevation={2}>
                        <View style={styles.userInfo}>
                            <View style={styles.userAvatar}>
                                <Icon name="account" size={28} color={Theme.colors.primary} />
                            </View>
                            <View style={styles.userDetails}>
                                <Text style={styles.userName}>
                                    {profile.firstName} {profile.lastName}
                                </Text>
                                <Text style={styles.userId}>ID: {profile.profileId}</Text>
                            </View>
                            <Icon name="check-decagram" size={24} color={Theme.colors.primary} />
                        </View>
                    </Surface>
                )}

                {/* Benefits Section */}
                <View style={styles.sectionHeader}>
                    <Icon name="gift" size={22} color={Theme.colors.primary} />
                    <Text style={styles.sectionTitle}>Your Premium Benefits</Text>
                </View>

                <Surface style={styles.benefitsCard} elevation={2}>
                    {premiumFeatures.map((feature, index) => (
                        <View key={index}>
                            <View style={styles.benefitRow}>
                                <View style={styles.benefitIcon}>
                                    <Icon name={feature.icon} size={22} color={Theme.colors.primary} />
                                </View>
                                <View style={styles.benefitText}>
                                    <Text style={styles.benefitTitle}>{feature.title}</Text>
                                    <Text style={styles.benefitDesc}>{feature.description}</Text>
                                </View>
                                <Icon name="check-circle" size={20} color={Theme.colors.success} />
                            </View>
                            {index < premiumFeatures.length - 1 && (
                                <Divider style={styles.benefitDivider} />
                            )}
                        </View>
                    ))}
                </Surface>

                {/* Quick Actions */}
                <View style={styles.sectionHeader}>
                    <Icon name="lightning-bolt" size={22} color={Theme.colors.primary} />
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                </View>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => navigation.navigate('TransactionHistory')}
                    >
                        <Icon name="history" size={24} color={Theme.colors.primary} />
                        <Text style={styles.actionText}>Transactions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => navigation.navigate('HelpSupport')}
                    >
                        <Icon name="help-circle" size={24} color={Theme.colors.primary} />
                        <Text style={styles.actionText}>Get Help</Text>
                    </TouchableOpacity>
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
    scrollContent: {
        padding: 16,
    },
    premiumCard: {
        borderRadius: 20,
        padding: 24,
        marginBottom: 16,
    },
    premiumHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    crownContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    premiumInfo: {
        marginLeft: 14,
        flex: 1,
    },
    premiumTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: Theme.colors.white,
    },
    planName: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.85)',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
        color: Theme.colors.white,
    },
    dividerWhite: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginVertical: 18,
    },
    validityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    validityItem: {
        alignItems: 'center',
        gap: 4,
    },
    validityLabel: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.7)',
    },
    validityValue: {
        fontSize: 14,
        fontWeight: '600',
        color: Theme.colors.white,
    },
    validityDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    daysContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 18,
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignSelf: 'center',
        gap: 6,
    },
    daysText: {
        fontSize: 13,
        fontWeight: '600',
        color: Theme.colors.white,
    },
    userCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        backgroundColor: Theme.colors.white,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF0F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userDetails: {
        flex: 1,
        marginLeft: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: Theme.colors.text,
    },
    userId: {
        fontSize: 12,
        color: Theme.colors.textSecondary,
        marginTop: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: Theme.colors.text,
    },
    benefitsCard: {
        borderRadius: 16,
        padding: 12,
        marginBottom: 20,
        backgroundColor: Theme.colors.white,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 4,
    },
    benefitIcon: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#FFF0F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    benefitText: {
        flex: 1,
        marginLeft: 12,
    },
    benefitTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Theme.colors.text,
    },
    benefitDesc: {
        fontSize: 12,
        color: Theme.colors.textSecondary,
        marginTop: 1,
    },
    benefitDivider: {
        marginLeft: 54,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    actionCard: {
        flex: 1,
        backgroundColor: Theme.colors.white,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: Theme.colors.surfaceCard,
    },
    actionText: {
        fontSize: 13,
        fontWeight: '600',
        color: Theme.colors.text,
    },
    bottomPadding: {
        height: 32,
    },
});

export default PremiumDashboardScreen;
