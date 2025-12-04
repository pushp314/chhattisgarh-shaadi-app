/**
 * Match Requests Management Screen
 * Enhanced UI for managing sent and received match requests
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
    TextInput as RNTextInput,
} from 'react-native';
import {
    Text,
    Surface,
    Button,
    ActivityIndicator,
    Chip,
    SegmentedButtons,
    Dialog,
    Portal,
    TextInput,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';
import { MatchRequest, MatchStatus } from '../../types';
import matchService from '../../services/match.service';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

import { ProfileStackParamList } from '../../navigation/types';

type MatchRequestsScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'MatchRequests'>;

type Props = {
    navigation: MatchRequestsScreenNavigationProp;
};

const MatchRequestsScreen: React.FC<Props> = ({ navigation }) => {
    const [tab, setTab] = useState<'received' | 'sent' | 'accepted'>('received');
    const [requests, setRequests] = useState<MatchRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [responding, setResponding] = useState<number | null>(null);

    // Response dialog
    const [showResponseDialog, setShowResponseDialog] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<MatchRequest | null>(null);
    const [responseMessage, setResponseMessage] = useState('');
    const [responseType, setResponseType] = useState<'accept' | 'reject'>('accept');

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
            let result;
            if (tab === 'received') {
                result = await matchService.getReceivedMatches({ page: 1, limit: 50 });
            } else if (tab === 'sent') {
                result = await matchService.getSentMatches({ page: 1, limit: 50 });
            } else {
                result = await matchService.getAcceptedMatches({ page: 1, limit: 50 });
            }
            setRequests(result.matches);
        } catch (err: any) {
            console.error('Error loading match requests:', err);
            setError(err.response?.data?.message || 'Failed to load match requests');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const handleOpenResponseDialog = (request: MatchRequest, type: 'accept' | 'reject') => {
        setSelectedRequest(request);
        setResponseType(type);
        setResponseMessage('');
        setShowResponseDialog(true);
    };

    const handleRespond = async () => {
        if (!selectedRequest) return;

        setResponding(selectedRequest.id);
        setShowResponseDialog(false);

        try {
            if (responseType === 'accept') {
                await matchService.acceptMatch(selectedRequest.id, responseMessage);
            } else {
                await matchService.rejectMatch(selectedRequest.id, responseMessage);
            }

            // Update local state
            const newStatus = (responseType === 'accept' ? 'ACCEPTED' : 'REJECTED') as MatchStatus;
            setRequests(prev =>
                prev.map(req =>
                    req.id === selectedRequest.id ? { ...req, status: newStatus } : req
                )
            );

            Alert.alert('Success', `Match request ${responseType}ed successfully`);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to respond to request');
        } finally {
            setResponding(null);
            setSelectedRequest(null);
            setResponseMessage('');
        }
    };

    const getStatusColor = (status: MatchStatus) => {
        switch (status) {
            case 'ACCEPTED':
                return Theme.colors.success;
            case 'REJECTED':
                return Theme.colors.primary;
            case 'CANCELLED':
                return Theme.colors.textSecondary;
            default:
                return Theme.colors.secondary;
        }
    };

    const getStatusIcon = (status: MatchStatus) => {
        switch (status) {
            case 'ACCEPTED':
                return 'heart-multiple';
            case 'REJECTED':
                return 'heart-broken';
            case 'CANCELLED':
                return 'cancel';
            default:
                return 'heart-outline';
        }
    };

    const renderRequest = ({ item }: { item: MatchRequest }) => {
        const profile = tab === 'received' ? item.sender?.profile : item.receiver?.profile;
        if (!profile) return null;

        const fullName = `${profile.firstName} ${profile.lastName}`.trim();
        const profilePic = profile.media?.[0]?.url;
        const isPending = item.status === 'PENDING';
        const isResponding = responding === item.id;

        return (
            <TouchableOpacity
                onPress={() => {
                    const userId = tab === 'received' ? item.senderId : item.receiverId;
                    navigation.navigate('ProfileDetails', { userId });
                }}>
                <Surface style={styles.requestCard} elevation={1}>
                    <View style={styles.cardHeader}>
                        {/* Profile Picture */}
                        {profilePic ? (
                            <Image source={{ uri: profilePic }} style={styles.profilePic} />
                        ) : (
                            <View style={styles.profilePicPlaceholder}>
                                <Icon name="account" size={50} color={Theme.colors.textSecondary} />
                            </View>
                        )}

                        {/* Request Info */}
                        <View style={styles.infoContainer}>
                            <View style={styles.nameRow}>
                                <Text variant="titleLarge" style={styles.name}>
                                    {fullName}
                                </Text>
                                {profile.isVerified && (
                                    <Icon name="check-decagram" size={20} color={Theme.colors.success} />
                                )}
                            </View>

                            {profile.city && profile.state && (
                                <View style={styles.detailRow}>
                                    <Icon name="map-marker" size={16} color={Theme.colors.textSecondary} />
                                    <Text style={styles.detailText}>
                                        {profile.city}, {profile.state}
                                    </Text>
                                </View>
                            )}

                            {profile.occupation && (
                                <View style={styles.detailRow}>
                                    <Icon name="briefcase" size={16} color={Theme.colors.textSecondary} />
                                    <Text style={styles.detailText}>{profile.occupation}</Text>
                                </View>
                            )}

                            <View style={styles.statusRow}>
                                <Chip
                                    icon={getStatusIcon(item.status)}
                                    style={[
                                        styles.statusChip,
                                        { backgroundColor: getStatusColor(item.status) + '20' },
                                    ]}
                                    textStyle={{ color: getStatusColor(item.status), fontSize: 13, fontWeight: '600' }}>
                                    {item.status}
                                </Chip>
                                <Text variant="bodySmall" style={styles.date}>
                                    {new Date(item.createdAt).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                    })}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Message */}
                    {item.message && (
                        <View style={styles.messageContainer}>
                            <Icon name="message-text" size={16} color={Theme.colors.textSecondary} />
                            <Text variant="bodyMedium" style={styles.message} numberOfLines={3}>
                                {item.message}
                            </Text>
                        </View>
                    )}

                    {/* Action Buttons (only for received pending requests) */}
                    {tab === 'received' && isPending && (
                        <View style={styles.actionButtons}>
                            <Button
                                mode="contained"
                                onPress={() => handleOpenResponseDialog(item, 'accept')}
                                loading={isResponding}
                                disabled={isResponding}
                                style={styles.acceptButton}
                                buttonColor={Theme.colors.success}
                                textColor={Theme.colors.white}
                                icon="heart-multiple">
                                Accept
                            </Button>
                            <Button
                                mode="outlined"
                                onPress={() => handleOpenResponseDialog(item, 'reject')}
                                loading={isResponding}
                                disabled={isResponding}
                                style={styles.rejectButton}
                                textColor={Theme.colors.primary}
                                icon="heart-broken">
                                Reject
                            </Button>
                        </View>
                    )}

                    {/* Response Message (if exists) */}
                    {item.responseMessage && (
                        <View style={styles.responseContainer}>
                            <Text variant="bodySmall" style={styles.responseLabel}>
                                Response:
                            </Text>
                            <Text variant="bodyMedium" style={styles.responseMessage}>
                                {item.responseMessage}
                            </Text>
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
                <Text style={styles.loadingText}>Loading match requests...</Text>
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
                    onValueChange={value => setTab(value as 'received' | 'sent' | 'accepted')}
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
                        {
                            value: 'accepted',
                            label: 'Matched',
                            icon: 'heart-multiple',
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
                        icon={tab === 'accepted' ? 'heart-multiple' : tab === 'received' ? 'inbox' : 'send'}
                        title={`No ${tab === 'accepted' ? 'Matches' : tab === 'received' ? 'Received' : 'Sent'} Requests`}
                        message={
                            tab === 'accepted'
                                ? "You don't have any accepted matches yet."
                                : tab === 'received'
                                    ? "You haven't received any match requests yet."
                                    : "You haven't sent any match requests yet."
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

            {/* Response Dialog */}
            <Portal>
                <Dialog visible={showResponseDialog} onDismiss={() => setShowResponseDialog(false)}>
                    <Dialog.Title>
                        {responseType === 'accept' ? 'Accept Match Request' : 'Reject Match Request'}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium" style={styles.dialogText}>
                            {responseType === 'accept'
                                ? 'Add a message to accept this match request (optional)'
                                : 'Add a reason for rejecting (optional)'}
                        </Text>
                        <TextInput
                            mode="outlined"
                            placeholder="Your message..."
                            value={responseMessage}
                            onChangeText={setResponseMessage}
                            multiline
                            numberOfLines={3}
                            style={styles.responseInput}
                            outlineColor={Theme.colors.surfaceCard}
                            activeOutlineColor={Theme.colors.secondary}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setShowResponseDialog(false)}>Cancel</Button>
                        <Button
                            onPress={handleRespond}
                            textColor={responseType === 'accept' ? Theme.colors.success : Theme.colors.primary}>
                            {responseType === 'accept' ? 'Accept' : 'Reject'}
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
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
        marginBottom: 16,
        borderRadius: 16,
        backgroundColor: Theme.colors.white,
        ...Theme.shadows.md,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        padding: 16,
        gap: 16,
    },
    profilePic: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    profilePicPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
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
        gap: 8,
        marginBottom: 6,
    },
    name: {
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    detailText: {
        fontSize: 14,
        color: Theme.colors.textSecondary,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    statusChip: {
        height: 30,
    },
    date: {
        color: Theme.colors.textSecondary,
    },
    messageContainer: {
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 16,
        paddingBottom: 12,
        alignItems: 'flex-start',
    },
    message: {
        flex: 1,
        color: Theme.colors.textSecondary,
        fontStyle: 'italic',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    acceptButton: {
        flex: 1,
        borderRadius: 8,
    },
    rejectButton: {
        flex: 1,
        borderRadius: 8,
        borderColor: Theme.colors.primary,
    },
    responseContainer: {
        backgroundColor: Theme.colors.surfaceCard,
        padding: 12,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 8,
    },
    responseLabel: {
        color: Theme.colors.textSecondary,
        marginBottom: 4,
    },
    responseMessage: {
        color: Theme.colors.text,
    },
    dialogText: {
        marginBottom: 16,
        color: Theme.colors.textSecondary,
    },
    responseInput: {
        backgroundColor: Theme.colors.white,
    },
});

export default MatchRequestsScreen;
