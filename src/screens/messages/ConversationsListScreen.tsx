import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Image, RefreshControl } from 'react-native';
import {
  Text,
  Searchbar,
  List,
  Badge,
  Surface,
  ActivityIndicator,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MessagesStackParamList } from '../../navigation/types';
import { Conversation, Message } from '../../types';
import { Theme } from '../../constants/theme';
import messageService from '../../services/message.service';
import matchService from '../../services/match.service';
import socketService from '../../services/socket.service';
import { SOCKET_EVENTS } from '../../constants/socket.constants';
import { useFocusEffect } from '@react-navigation/native';

// Unified type for list items (conversations or accepted matches)
type ListItem = {
  type: 'conversation' | 'match';
  userId: number;
  conversation?: Conversation;
  match?: any; // Match object from accepted matches
};

type ConversationsListScreenNavigationProp = NativeStackNavigationProp<
  MessagesStackParamList,
  'ConversationsList'
>;

type Props = {
  navigation: ConversationsListScreenNavigationProp;
};

const formatTimestamp = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
};

const ConversationItem = React.memo(({ item, isOnline, onPress }: { item: Conversation; isOnline: boolean; onPress: () => void }) => {
  const profile = item.user.profile;
  const userName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : 'Unknown User';
  const profilePic = profile?.media?.[0]?.url;

  return (
    <List.Item
      title={userName}
      description={item.lastMessage.content}
      descriptionNumberOfLines={1}
      left={() => (
        <View style={styles.avatarContainer}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="account" size={32} color="#999" />
            </View>
          )}
          {isOnline && (
            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />
            </View>
          )}
        </View>
      )}
      right={() => (
        <View style={styles.rightContent}>
          <Text variant="bodySmall" style={styles.timestamp}>
            {formatTimestamp(item.lastMessage.createdAt)}
          </Text>
          {item.unreadCount > 0 && (
            <Badge size={20} style={styles.badge}>
              {item.unreadCount > 9 ? '9+' : item.unreadCount}
            </Badge>
          )}
        </View>
      )}
      onPress={onPress}
      style={[
        styles.listItem,
        item.unreadCount > 0 && styles.listItemUnread,
      ]}
    />
  );
});

const MatchItem = React.memo(({ item, isOnline, onPress }: { item: any; isOnline: boolean; onPress: () => void }) => {
  // The user object contains profile directly
  const user = item.sender || item.receiver;
  const profile = user?.profile;
  const userName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : 'Unknown User';
  // For accepted matches, use user's profilePicture or profile media
  const profilePic = user?.profilePicture || profile?.media?.[0]?.url;

  return (
    <List.Item
      title={userName}
      description="Start chatting with your match!"
      descriptionStyle={styles.matchDescription}
      left={() => (
        <View style={styles.avatarContainer}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="account" size={32} color="#999" />
            </View>
          )}
          {isOnline && (
            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />
            </View>
          )}
        </View>
      )}
      right={() => (
        <View style={styles.rightContent}>
          <Icon name="chat-plus" size={24} color={Theme.colors.primary} />
        </View>
      )}
      onPress={onPress}
      style={styles.listItem}
    />
  );
});

const ConversationsListScreen: React.FC<Props> = ({ navigation }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [acceptedMatches, setAcceptedMatches] = useState<any[]>([]);
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());

  useFocusEffect(
    React.useCallback(() => {
      loadConversations();

      // Set up Socket.io listener for new messages
      const handleNewMessage = (message: Message) => {
        console.log('ConversationsList: New message received', message);
        // Reload conversations to update list
        loadConversations();
      };

      const handleUserOnline = (data: { userId: number }) => {
        setOnlineUsers(prev => new Set(prev).add(data.userId));
      };

      const handleUserOffline = (data: { userId: number }) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      };

      socketService.on(SOCKET_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
      socketService.on(SOCKET_EVENTS.USER_ONLINE, handleUserOnline);
      socketService.on(SOCKET_EVENTS.USER_OFFLINE, handleUserOffline);

      return () => {
        socketService.off(SOCKET_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
        socketService.off(SOCKET_EVENTS.USER_ONLINE, handleUserOnline);
        socketService.off(SOCKET_EVENTS.USER_OFFLINE, handleUserOffline);
      };
    }, [])
  );

  useEffect(() => {
    // Add defensive checks to prevent errors
    if (!conversations || !acceptedMatches) {
      setListItems([]);
      return;
    }

    // Combine conversations and accepted matches into a unified list
    const conversationUserIds = new Set(conversations.map(c => c.userId));

    // Create list items from conversations
    const conversationItems: ListItem[] = conversations.map(conv => ({
      type: 'conversation' as const,
      userId: conv.userId,
      conversation: conv,
    }));

    // Create list items from accepted matches (exclude those with existing conversations)
    const matchItems: ListItem[] = acceptedMatches
      .filter(match => {
        const otherUserId = match.sender?.id || match.receiver?.id;
        return otherUserId && !conversationUserIds.has(otherUserId);
      })
      .map(match => ({
        type: 'match' as const,
        userId: match.sender?.id || match.receiver?.id,
        match,
      }));

    // Combine and sort: conversations first (by last message time), then matches
    const combined = [...conversationItems, ...matchItems];
    setListItems(combined);
  }, [conversations, acceptedMatches]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems(listItems);
    } else {
      const filtered = listItems.filter(item => {
        let userName = '';
        if (item.type === 'conversation') {
          userName = `${item.conversation?.user.profile?.firstName} ${item.conversation?.user.profile?.lastName}`.toLowerCase();
        } else if (item.type === 'match') {
          const profile = item.match?.sender?.profile || item.match?.receiver?.profile;
          userName = `${profile?.firstName} ${profile?.lastName}`.toLowerCase();
        }
        return userName.includes(searchQuery.toLowerCase());
      });
      setFilteredItems(filtered);
    }
  }, [searchQuery, listItems]);

  const loadConversations = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      console.log('Loading conversations and accepted matches');

      // Fetch both conversations and accepted matches in parallel
      const [conversationsData, matchesData] = await Promise.all([
        messageService.getConversations(),
        matchService.getAcceptedMatches(),
      ]);

      setConversations(conversationsData);
      setAcceptedMatches(matchesData?.matches || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === 'conversation' && item.conversation) {
      return (
        <ConversationItem
          item={item.conversation}
          isOnline={onlineUsers.has(item.userId)}
          onPress={() =>
            navigation.navigate('ChatScreen', {
              userId: item.userId,
              userName: item.conversation?.user.profile
                ? `${item.conversation.user.profile.firstName} ${item.conversation.user.profile.lastName}`
                : 'Unknown User',
            })
          }
        />
      );
    } else if (item.type === 'match' && item.match) {
      const user = item.match.sender || item.match.receiver;
      const profile = user?.profile;
      return (
        <MatchItem
          item={item.match}
          isOnline={onlineUsers.has(item.userId)}
          onPress={() =>
            navigation.navigate('ChatScreen', {
              userId: item.userId,
              userName: profile
                ? `${profile.firstName} ${profile.lastName}`
                : 'Unknown User',
            })
          }
        />
      );
    }
    return null;
  };

  const renderEmpty = () => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Icon name="message-outline" size={64} color="#ccc" />
        <Text variant="titleLarge" style={styles.emptyTitle}>
          No Conversations Yet
        </Text>
        <Text variant="bodyMedium" style={styles.emptyText}>
          Start connecting with matches to begin conversations
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Surface style={styles.searchContainer} elevation={2}>
        <Searchbar
          placeholder="Search conversations"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchbar}
        />
      </Surface>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.userId.toString()}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadConversations(true)}
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
  },
  searchContainer: {
    backgroundColor: Theme.colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchbar: {
    elevation: 0,
    backgroundColor: Theme.colors.background,
    borderRadius: 12,
  },
  listItem: {
    backgroundColor: Theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.surfaceCard,
  },
  listItemUnread: {
    backgroundColor: Theme.colors.surfaceCard,
  },
  matchDescription: {
    color: Theme.colors.primary,
    fontStyle: 'italic',
  },
  avatarContainer: {
    position: 'relative',
    marginLeft: 8,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Theme.colors.surfaceCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.white,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Theme.colors.success,
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 8,
  },
  timestamp: {
    color: Theme.colors.textSecondary,
    marginBottom: 4,
  },
  badge: {
    backgroundColor: Theme.colors.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 16,
    color: Theme.colors.textSecondary,
  },
});

export default ConversationsListScreen;
