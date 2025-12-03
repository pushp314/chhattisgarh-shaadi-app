import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  SegmentedButtons,
  Surface,
  Button,
  ActivityIndicator,
  Chip,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MatchesStackParamList } from '../../navigation/types';
import { MatchRequest } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { Theme } from '../../constants/theme';
import matchService from '../../services/match.service';
import ProfileCardSkeleton from '../../components/profile/ProfileCardSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import SuccessAnimation from '../../components/common/SuccessAnimation';

type MatchesScreenNavigationProp = NativeStackNavigationProp<
  MatchesStackParamList,
  'MatchesScreen'
>;

type Props = {
  navigation: MatchesScreenNavigationProp;
};

type TabType = 'received' | 'sent' | 'accepted';

const MatchesScreen: React.FC<Props> = ({ navigation }) => {
  const currentUser = useAuthStore(state => state.user);
  const [activeTab, setActiveTab] = useState<TabType>('received');
  const [matches, setMatches] = useState<MatchRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadMatches();
  }, [activeTab]);

  const loadMatches = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      console.log('Loading matches:', activeTab);
      setError(null);
      let response;

      if (activeTab === 'received') {
        response = await matchService.getReceivedMatches();
      } else if (activeTab === 'sent') {
        response = await matchService.getSentMatches();
      } else {
        response = await matchService.getAcceptedMatches();
      }

      setMatches(response.matches);
    } catch (err: any) {
      console.error('Error loading matches:', err);
      setError(err.response?.data?.message || 'Failed to load matches');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleAccept = async (requestId: number) => {
    setProcessingIds(prev => new Set(prev).add(requestId));
    try {
      console.log('Accepting match request:', requestId);
      await matchService.acceptMatch(requestId);
      setShowSuccess(true);
      loadMatches();
    } catch (error) {
      console.error('Error accepting match:', error);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const handleReject = async (requestId: number) => {
    setProcessingIds(prev => new Set(prev).add(requestId));
    try {
      console.log('Rejecting match request:', requestId);
      await matchService.rejectMatch(requestId);
      loadMatches();
    } catch (error) {
      console.error('Error rejecting match:', error);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const handleCancel = async (requestId: number) => {
    setProcessingIds(prev => new Set(prev).add(requestId));
    try {
      console.log('Cancelling match request:', requestId);
      await matchService.deleteMatch(requestId);
      loadMatches();
    } catch (error) {
      console.error('Error cancelling match:', error);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const handleViewProfile = (userId: number) => {
    navigation.navigate('ProfileDetails', { userId });
  };

  const handleStartChat = (userId: number, userName: string) => {
    // Navigate to Messages tab then to ChatScreen
    // @ts-ignore - Cross-navigation between tabs
    navigation.navigate('Messages', {
      screen: 'ChatScreen',
      params: { userId, userName },
    });
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      PENDING: { label: 'Pending', color: '#FF9800' },
      ACCEPTED: { label: 'Accepted', color: '#4CAF50' },
      REJECTED: { label: 'Rejected', color: '#F44336' },
      CANCELLED: { label: 'Cancelled', color: '#9E9E9E' },
      EXPIRED: { label: 'Expired', color: '#9E9E9E' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

    return (
      <Chip
        mode="flat"
        textStyle={{ fontSize: 12 }}
        style={{ backgroundColor: config.color + '20' }}>
        <Text style={{ color: config.color, fontWeight: 'bold' }}>
          {config.label}
        </Text>
      </Chip>
    );
  };

  const renderReceivedRequest = ({ item }: { item: MatchRequest }) => {
    const profile = item.sender?.profile;
    const userName = profile
      ? `${profile.firstName} ${profile.lastName}`
      : 'Unknown User';
    const profilePic = profile?.media?.[0]?.url;
    const age = profile?.dateOfBirth
      ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear()
      : null;
    const isProcessing = processingIds.has(item.id);

    return (
      <Surface style={styles.card} elevation={1}>
        <TouchableOpacity
          onPress={() => handleViewProfile(item.senderId)}
          style={styles.cardContent}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.profilePic} />
          ) : (
            <View style={styles.profilePicPlaceholder}>
              <Icon name="account" size={40} color="#999" />
            </View>
          )}

          <View style={styles.infoContainer}>
            <Text variant="titleMedium" style={styles.userName}>
              {userName}
            </Text>
            {profile && (
              <Text variant="bodyMedium" style={styles.details}>
                {age} years • {profile.height} cm
              </Text>
            )}
            {profile?.city && (
              <Text variant="bodySmall" style={styles.location}>
                <Icon name="map-marker" size={14} />
                {' '}{profile.city}
              </Text>
            )}
            {item.message && (
              <Text variant="bodySmall" style={styles.message} numberOfLines={2}>
                "{item.message}"
              </Text>
            )}
            <Text variant="bodySmall" style={styles.timestamp}>
              {formatTimestamp(item.createdAt)}
            </Text>
          </View>
        </TouchableOpacity>

        {item.status === 'PENDING' && (
          <View style={styles.actions}>
            <Button
              mode="outlined"
              onPress={() => handleReject(item.id)}
              disabled={isProcessing}
              loading={isProcessing}
              style={styles.actionButton}
              textColor="#F44336">
              Reject
            </Button>
            <Button
              mode="contained"
              onPress={() => handleAccept(item.id)}
              disabled={isProcessing}
              loading={isProcessing}
              style={styles.actionButton}
              buttonColor={Theme.colors.success}>
              Accept
            </Button>
          </View>
        )}

        {item.status !== 'PENDING' && (
          <View style={styles.statusContainer}>
            {getStatusChip(item.status)}
          </View>
        )}
      </Surface>
    );
  };

  const renderSentRequest = ({ item }: { item: MatchRequest }) => {
    const profile = item.receiver?.profile;
    const userName = profile
      ? `${profile.firstName} ${profile.lastName}`
      : 'Unknown User';
    const profilePic = profile?.media?.[0]?.url;
    const age = profile?.dateOfBirth
      ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear()
      : null;
    const isProcessing = processingIds.has(item.id);

    return (
      <Surface style={styles.card} elevation={1}>
        <TouchableOpacity
          onPress={() => handleViewProfile(item.receiverId)}
          style={styles.cardContent}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.profilePic} />
          ) : (
            <View style={styles.profilePicPlaceholder}>
              <Icon name="account" size={40} color="#999" />
            </View>
          )}

          <View style={styles.infoContainer}>
            <Text variant="titleMedium" style={styles.userName}>
              {userName}
            </Text>
            {profile && (
              <Text variant="bodyMedium" style={styles.details}>
                {age} years • {profile.height} cm
              </Text>
            )}
            {profile?.city && (
              <Text variant="bodySmall" style={styles.location}>
                <Icon name="map-marker" size={14} />
                {' '}{profile.city}
              </Text>
            )}
            <View style={styles.statusRow}>
              {getStatusChip(item.status)}
              <Text variant="bodySmall" style={styles.timestamp}>
                {formatTimestamp(item.createdAt)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {item.status === 'PENDING' && (
          <View style={styles.actions}>
            <Button
              mode="outlined"
              onPress={() => handleCancel(item.id)}
              disabled={isProcessing}
              loading={isProcessing}
              style={styles.cancelButton}>
              Cancel Request
            </Button>
          </View>
        )}
      </Surface>
    );
  };

  const renderAcceptedMatch = ({ item }: { item: MatchRequest }) => {
    const isSender = item.senderId === currentUser?.id;
    const otherUser = isSender ? item.receiver : item.sender;
    const profile = otherUser?.profile;
    const userName = profile
      ? `${profile.firstName} ${profile.lastName}`
      : 'Unknown User';
    const profilePic = profile?.media?.[0]?.url;
    const age = profile?.dateOfBirth
      ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear()
      : null;
    const otherUserId = isSender ? item.receiverId : item.senderId;

    return (
      <Surface style={styles.card} elevation={1}>
        <TouchableOpacity
          onPress={() => handleViewProfile(otherUserId)}
          style={styles.cardContent}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.profilePic} />
          ) : (
            <View style={styles.profilePicPlaceholder}>
              <Icon name="account" size={40} color="#999" />
            </View>
          )}

          <View style={styles.infoContainer}>
            <View style={styles.matchedHeader}>
              <Text variant="titleMedium" style={styles.userName}>
                {userName}
              </Text>
              <Icon name="heart" size={20} color={Theme.colors.success} />
            </View>
            {profile && (
              <Text variant="bodyMedium" style={styles.details}>
                {age} years • {profile.height} cm
              </Text>
            )}
            {profile?.city && (
              <Text variant="bodySmall" style={styles.location}>
                <Icon name="map-marker" size={14} />
                {' '}{profile.city}
              </Text>
            )}
            <Text variant="bodySmall" style={styles.matchedDate}>
              Matched on {formatTimestamp(item.updatedAt)}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={() => handleViewProfile(otherUserId)}
            icon="account"
            style={styles.actionButton}>
            View Profile
          </Button>
          <Button
            mode="contained"
            onPress={() => handleStartChat(otherUserId, userName)}
            icon="message"
            style={styles.actionButton}>
            Chat
          </Button>
        </View>
      </Surface>
    );
  };

  const renderItem = ({ item }: { item: MatchRequest }) => {
    if (activeTab === 'received') return renderReceivedRequest({ item });
    if (activeTab === 'sent') return renderSentRequest({ item });
    return renderAcceptedMatch({ item });
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.skeletonContainer}>
          <ProfileCardSkeleton />
          <ProfileCardSkeleton />
        </View>
      );
    }

    if (error) {
      return <ErrorState message={error} onRetry={() => loadMatches()} />;
    }

    const emptyMessages = {
      received: {
        icon: 'inbox',
        title: 'No Received Requests',
        message:
          "You haven't received any match requests yet. Keep your profile updated to attract more matches!",
      },
      sent: {
        icon: 'send',
        title: 'No Sent Requests',
        message:
          'Start sending match requests to connect with profiles you like. Browse the Home screen to find matches!',
        actionLabel: 'Browse Profiles',
      },
      accepted: {
        icon: 'heart-multiple',
        title: 'No Matches Yet',
        message:
          'Accept match requests to build connections. Your accepted matches will appear here.',
      },
    };

    const config = emptyMessages[activeTab];

    return (
      <EmptyState
        icon={config.icon}
        title={config.title}
        message={config.message}
        actionLabel={'actionLabel' in config ? config.actionLabel : undefined}
        onAction={
          'actionLabel' in config
            ? () => navigation.getParent()?.navigate('Home')
            : undefined
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.tabContainer} elevation={2}>
        <SegmentedButtons
          value={activeTab}
          onValueChange={value => setActiveTab(value as TabType)}
          buttons={[
            { value: 'received', label: 'Received' },
            { value: 'sent', label: 'Sent' },
            { value: 'accepted', label: 'Matches' },
          ]}
          style={styles.segmentedButtons}
        />
      </Surface>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={matches}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadMatches(true)}
            />
          }
        />
      )}

      <SuccessAnimation
        visible={showSuccess}
        onComplete={() => setShowSuccess(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  tabContainer: {
    backgroundColor: Theme.colors.white,
    padding: 16,
  },
  segmentedButtons: {
    backgroundColor: Theme.colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  skeletonContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: Theme.colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    ...Theme.shadows.md,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
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
    marginLeft: 16,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: Theme.colors.text,
  },
  details: {
    color: Theme.colors.textSecondary,
    marginBottom: 2,
  },
  location: {
    color: Theme.colors.textSecondary,
    marginBottom: 4,
  },
  message: {
    fontStyle: 'italic',
    color: Theme.colors.textSecondary,
    marginTop: 4,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: Theme.colors.primary,
  },
  timestamp: {
    color: Theme.colors.textSecondary,
    marginTop: 4,
    fontSize: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statusContainer: {
    padding: 16,
    paddingTop: 0,
  },
  matchedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  matchedDate: {
    color: Theme.colors.success,
    marginTop: 4,
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default MatchesScreen;
