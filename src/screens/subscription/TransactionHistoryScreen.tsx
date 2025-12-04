/**
 * Transaction History Screen
 * Display user's payment transaction history
 */

import React, { useState, useCallback } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    RefreshControl,
} from 'react-native';
import {
    Text,
    Surface,
    ActivityIndicator,
    Chip,
    Divider,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';
import paymentService, { Payment } from '../../services/payment.service';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

type TransactionHistoryScreenNavigationProp = NativeStackNavigationProp<any>;

type Props = {
    navigation: TransactionHistoryScreenNavigationProp;
};

const TransactionHistoryScreen: React.FC<Props> = () => {
    const [transactions, setTransactions] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            loadTransactions();
        }, [])
    );

    const loadTransactions = async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setIsLoading(true);
        }
        setError(null);

        try {
            const { results } = await paymentService.getMyPayments({
                page: 1,
                limit: 50,
            });
            setTransactions(results || []);
        } catch (err: any) {
            console.error('Error loading transactions:', err);
            setError(err.response?.data?.message || 'Failed to load transaction history');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const getStatusColor = (status: Payment['status']) => {
        switch (status) {
            case 'SUCCESS':
                return Theme.colors.success;
            case 'FAILED':
                return Theme.colors.primary;
            case 'PENDING':
                return Theme.colors.secondary;
            default:
                return Theme.colors.textSecondary;
        }
    };

    const getStatusIcon = (status: Payment['status']) => {
        switch (status) {
            case 'SUCCESS':
                return 'check-circle';
            case 'FAILED':
                return 'close-circle';
            case 'PENDING':
                return 'clock-outline';
            default:
                return 'help-circle';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const renderTransaction = ({ item }: { item: Payment }) => {
        return (
            <Surface style={styles.transactionCard} elevation={1}>
                <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                        <Icon
                            name={getStatusIcon(item.status)}
                            size={24}
                            color={getStatusColor(item.status)}
                        />
                    </View>
                    <View style={styles.headerInfo}>
                        <Text variant="titleMedium" style={styles.planName}>
                            {item.subscription?.plan?.name || 'Subscription Payment'}
                        </Text>
                        <Text variant="bodySmall" style={styles.transactionId}>
                            ID: {item.razorpayPaymentId || item.id}
                        </Text>
                    </View>
                    <Chip
                        icon={getStatusIcon(item.status)}
                        style={[
                            styles.statusChip,
                            { backgroundColor: getStatusColor(item.status) + '20' },
                        ]}
                        textStyle={[
                            styles.chipText,
                            { color: getStatusColor(item.status) },
                        ]}>
                        {item.status}
                    </Chip>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.cardBody}>
                    <View style={styles.detailRow}>
                        <Icon name="calendar" size={16} color={Theme.colors.textSecondary} />
                        <Text variant="bodyMedium" style={styles.detailText}>
                            {formatDate(item.createdAt)}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Icon name="clock-outline" size={16} color={Theme.colors.textSecondary} />
                        <Text variant="bodyMedium" style={styles.detailText}>
                            {formatTime(item.createdAt)}
                        </Text>
                    </View>

                    {item.paymentMethod && (
                        <View style={styles.detailRow}>
                            <Icon name="credit-card" size={16} color={Theme.colors.textSecondary} />
                            <Text variant="bodyMedium" style={styles.detailText}>
                                {item.paymentMethod}
                            </Text>
                        </View>
                    )}
                </View>

                <Divider style={styles.divider} />

                <View style={styles.cardFooter}>
                    <Text variant="bodyMedium" style={styles.amountLabel}>
                        Amount Paid
                    </Text>
                    <Text variant="titleLarge" style={styles.amount}>
                        {formatCurrency(item.amount)}
                    </Text>
                </View>
            </Surface>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Theme.colors.primary} />
                <Text style={styles.loadingText}>Loading transactions...</Text>
            </View>
        );
    }

    if (error) {
        return <ErrorState message={error} onRetry={() => loadTransactions()} />;
    }

    return (
        <View style={styles.container}>
            {/* Header Stats */}
            {transactions.length > 0 && (
                <Surface style={styles.statsCard} elevation={2}>
                    <View style={styles.statItem}>
                        <Text variant="bodySmall" style={styles.statLabel}>
                            Total Transactions
                        </Text>
                        <Text variant="titleLarge" style={styles.statValue}>
                            {transactions.length}
                        </Text>
                    </View>
                    <Divider style={styles.verticalDivider} />
                    <View style={styles.statItem}>
                        <Text variant="bodySmall" style={styles.statLabel}>
                            Successful
                        </Text>
                        <Text variant="titleLarge" style={[styles.statValue, { color: Theme.colors.success }]}>
                            {transactions.filter(t => t.status === 'SUCCESS').length}
                        </Text>
                    </View>
                    <Divider style={styles.verticalDivider} />
                    <View style={styles.statItem}>
                        <Text variant="bodySmall" style={styles.statLabel}>
                            Total Spent
                        </Text>
                        <Text variant="titleMedium" style={styles.statValue}>
                            {formatCurrency(
                                transactions
                                    .filter(t => t.status === 'SUCCESS')
                                    .reduce((sum, t) => sum + t.amount, 0)
                            )}
                        </Text>
                    </View>
                </Surface>
            )}

            {/* Transactions List */}
            <FlatList
                data={transactions}
                renderItem={renderTransaction}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <EmptyState
                        icon="receipt"
                        title="No Transactions"
                        message="You haven't made any payments yet"
                    />
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => loadTransactions(true)}
                        colors={[Theme.colors.primary]}
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
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
    statsCard: {
        flexDirection: 'row',
        padding: 16,
        margin: 16,
        borderRadius: 12,
        backgroundColor: Theme.colors.white,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statLabel: {
        color: Theme.colors.textSecondary,
        marginBottom: 4,
    },
    statValue: {
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    verticalDivider: {
        width: 1,
        backgroundColor: Theme.colors.surfaceCard,
    },
    listContent: {
        padding: 16,
        flexGrow: 1,
    },
    transactionCard: {
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: Theme.colors.white,
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Theme.colors.surfaceCard,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerInfo: {
        flex: 1,
    },
    planName: {
        fontWeight: '600',
        color: Theme.colors.text,
        marginBottom: 2,
    },
    transactionId: {
        color: Theme.colors.textSecondary,
    },
    statusChip: {
        height: 28,
    },
    divider: {
        marginVertical: 12,
        backgroundColor: Theme.colors.surfaceCard,
    },
    cardBody: {
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        color: Theme.colors.textSecondary,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    amountLabel: {
        color: Theme.colors.textSecondary,
    },
    amount: {
        fontWeight: 'bold',
        color: Theme.colors.primary,
    },
    chipText: {
        fontSize: 12,
        fontWeight: '600',
    },
});

export default TransactionHistoryScreen;
