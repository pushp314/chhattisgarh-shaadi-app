/**
 * Contact Requests Screen
 * Manage sent and received contact requests
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
    RefreshControl,
    Alert,
} from 'react-native';
import {
    Text,
    Surface,
    Button,
    ActivityIndicator,
    Chip,
    SegmentedButtons,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';
import { ContactRequest, ContactRequestStatus } from '../../types';
import contactRequestService from '../../services/contactRequest.service';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

type ContactRequestsScreenNavigationProp = NativeStackNavigationProp<any>;

type Props = {
    navigation: ContactRequestsScreenNavigationProp;
};

const ContactRequestsScreen: React.FC<Props> = ({ navigation }) => {
    const [tab, setTab] = useState<'received' | 'sent'>('received');
    const [requests, setRequests] = useState<ContactRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [responding, setResponding] = useState<number | null>(null);

    useFocusEffect(
        useCallback(() => {
            loadRequests();
        }, [tab])
    );

    const loadRequests = async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setIsLoading(true);
        }
        setError(null);

        try {
            const { results } =
                tab === 'received'
                    ? await contactRequestService.getReceivedRequests({ page: 1, limit: 50 })
                    : await contactRequestService.getSentRequests({ page: 1, limit: 50 });
            setRequests(results);
        } catch (err: any) {
            console.error('Error loading contact requests:', err);
            setError(err.response?.data?.message || 'Failed to load contact requests');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const handleRespond = async (requestId: number, status: ContactRequestStatus) => {
        setResponding(requestId);
        try {
            await contactRequestService.respondToRequest(requestId, status);
            // Update local state
            setRequests(prev =>
                prev.map(req => (req.id === requestId ? { ...req, status } : req))
            );
            Alert.alert('Success', `Request ${status.toLowerCase()}`);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to respond to request');
        } finally {
            setResponding(null);
        }
    };

    const getStatusColor = (status: ContactRequestStatus) => {
        switch (status) {
            case ContactRequestStatus.APPROVED:
                return Theme.colors.success;
            case ContactRequestStatus.REJECTED: // Changed enum value
                return Theme.colors.primary;
            default:
                return Theme.colors.secondary;
        }
    };

    const getStatusIcon = (status: ContactRequestStatus) => {
        switch (status) {
            case ContactRequestStatus.APPROVED:
                return 'check-circle';
            case ContactRequestStatus.REJECTED: // Changed enum value
                return 'close-circle';
            default:
                return 'clock-outline';
        }
    };

    const renderRequest = ({ item }: { item: ContactRequest }) => {
        // Changed field names from requester/receiver to sender/receiver
        const profile = tab === 'received' ? item.sender?.profile : item.receiver?.profile;
        if (!profile) return null;

        const fullName = `${profile.firstName} ${profile.lastName}`.trim();
        const profilePic = profile.media?.[0]?.url;
        const isPending = item.status === ContactRequestStatus.PENDING; // Changed enum value
        const isResponding = responding === item.id;

        return (
            <TouchableOpacity
                onPress={() => {
                    // Changed userId logic to use senderId for navigation
                    const userId = tab === 'received' ? item.senderId : item.receiverId;
                    navigation.navigate('ProfileDetails', { userId });
                }}>
                <Surface style={styles.requestCard} elevation={1}>
                    <View style={styles.cardContent}>
                        {/* Profile Picture */}
                        {profilePic ? (
                            <Image source={{ uri: profilePic }} style={styles.profilePic} />
                        ) : (
                            <View style={styles.profilePicPlaceholder}>
                                <Icon name="account" size={40} color={Theme.colors.textSecondary} />
                            </View>
                        )}

                        {/* Request Info */}
                        <View style={styles.infoContainer}>
                            <View style={styles.nameRow}>
                                <Text variant="titleMedium" style={styles.name}>
                                    {fullName}
                                </Text>
                                {profile.isVerified && (
                                    <Icon name="check-decagram" size={18} color={Theme.colors.success} />
                                )}
                            </View>

                            {profile.city && profile.state && (
                                <View style={styles.locationRow}>
                                    <Icon name="map-marker" size={14} color={Theme.colors.textSecondary} />
                                    <Text style={styles.locationText}>
                                        {profile.city}, {profile.state}
                                    </Text>
                                </View>
                            )}

                            {item.message && (
                                <Text variant="bodySmall" style={styles.message} numberOfLines={2}>
                                    "{item.message}"
                                </Text>
                            )}

                            <View style={styles.metaRow}>
                                <Chip
                                    icon={getStatusIcon(item.status)}
                                    style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) + '20' }]}
                                    textStyle={{ color: getStatusColor(item.status), fontSize: 12 }}>
                                    {item.status}
                                </Chip>
                                <Text variant="bodySmall" style={styles.date}>
                                    {new Date(item.createdAt).toLocaleDateString('en-IN')}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons (only for received pending requests) */}
                    {tab === 'received' && isPending && (
                        <View style={styles.actionButtons}>
                            <Button
                                mode="contained"
                                onPress={() => handleRespond(item.id, ContactRequestStatus.APPROVED)}
                                loading={isResponding}
                                disabled={isResponding}
                                style={styles.approveButton}
                                buttonColor={Theme.colors.success}
                                textColor={Theme.colors.white}
                                icon="check">
                                Approve
                            </Button>
                            <Button
                                mode="outlined"
                                onPress={() => handleRespond(item.id, ContactRequestStatus.REJECTED)}
                                loading={isResponding}
                                disabled={isResponding}
                                style={styles.rejectButton}
                                textColor={Theme.colors.primary}
                                icon="close">
                                Reject
                            </Button>
                        </View>
                    )}
                </Surface>
            </TouchableOpacity>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Theme.colors.primary} />
                <Text style={styles.loadingText}>Loading contact requests...</Text>
            </View>
        );
    }

    if (error) {
        return <ErrorState message={error} onRetry={() => loadRequests()} />;
    }

    const pendingCount = requests.filter(r => r.status === 'PENDING').length;

    return (
        <View style={styles.container}>
            {/* Tab Switcher */}
            <Surface style={styles.tabContainer} elevation={2}>
                <SegmentedButtons
                    value={tab}
                    onValueChange={(value) => setTab(value as 'received' | 'sent')}
                    buttons={[
                        {
                            value: 'received',
                            label: `Received${tab === 'received' && pendingCount > 0 ? ` (${pendingCount})` : ''}`,
                            icon: 'inbox',
                        },
                        {
                            value: 'sent',
                            label: 'Sent',
                            icon: 'send',
                        },
                    ]}
                    style={styles.segmentedButtons}
                />
            </Surface>

            {/* Requests List */}
            <FlatList
                data={requests}
                renderItem={renderRequest}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <EmptyState
                        icon={tab === 'received' ? 'inbox' : 'send'}
                        title={`No ${tab === 'received' ? 'Received' : 'Sent'} Requests`}
                        message={
                            tab === 'received'
                                ? "You haven't received any contact requests yet."
                                : "You haven't sent any contact requests yet."
                        }
                    />
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => loadRequests(true)}
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
    tabContainer: {
        backgroundColor: Theme.colors.white,
        padding: 16,
    },
    segmentedButtons: {
        backgroundColor: Theme.colors.background,
    },
    listContent: {
        padding: 16,
        flexGrow: 1,
    },
    requestCard: {
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: Theme.colors.white,
        ...Theme.shadows.md,
    },
    cardContent: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    profilePic: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    profilePicPlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Theme.colors.surfaceCard,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    name: {
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 6,
    },
    locationText: {
        fontSize: 13,
        color: Theme.colors.textSecondary,
    },
    message: {
        color: Theme.colors.textSecondary,
        fontStyle: 'italic',
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statusChip: {
        height: 28,
    },
    date: {
        color: Theme.colors.textSecondary,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    approveButton: {
        flex: 1,
        borderRadius: 8,
    },
    rejectButton: {
        flex: 1,
        borderRadius: 8,
        borderColor: Theme.colors.primary,
    },
});

export default ContactRequestsScreen;
