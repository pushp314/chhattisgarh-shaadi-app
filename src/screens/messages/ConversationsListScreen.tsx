/**
 * Conversations List Screen - Redesigned
 * Clean message list with search bar
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MessagesStackParamList } from '../../navigation/types';
import { Conversation } from '../../types';
import { Theme } from '../../constants/theme';
import messageService from '../../services/message.service';
import matchService from '../../services/match.service';
import socketService from '../../services/socket.service';
import { SOCKET_EVENTS } from '../../constants/socket.constants';
import { useFocusEffect } from '@react-navigation/native';
import PremiumBadge from '../../components/common/PremiumBadge';
import LinearGradient from 'react-native-linear-gradient';

type ConversationsListScreenNavigationProp = NativeStackNavigationProp<
  MessagesStackParamList,
  'ConversationsList'
>;

type Props = {
  navigation: ConversationsListScreenNavigationProp;
};

type ListItem = {
  type: 'conversation' | 'match';
  userId: number;
  conversation?: Conversation;
  match?: any;
};

const formatTimestamp = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

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
      loadData();
      setupSocketListeners();
      return () => {
        socketService.off(SOCKET_EVENTS.USER_ONLINE);
        socketService.off(SOCKET_EVENTS.USER_OFFLINE);
        socketService.off(SOCKET_EVENTS.MESSAGE_RECEIVED);
      };
    }, [])
  );

  const setupSocketListeners = () => {
    socketService.on(SOCKET_EVENTS.USER_ONLINE, (data: { userId: number }) => {
      setOnlineUsers(prev => new Set(prev).add(data.userId));
    });

    socketService.on(SOCKET_EVENTS.USER_OFFLINE, (data: { userId: number }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    });

    socketService.on(SOCKET_EVENTS.MESSAGE_RECEIVED, () => {
      loadData();
    });
  };

  const loadData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const [conversationsData, matchesData] = await Promise.all([
        messageService.getConversations(),
        matchService.getAcceptedMatches(),
      ]);

      setConversations(conversationsData || []);
      setAcceptedMatches(matchesData?.matches || []);

      // Combine conversations and matches
      const items: ListItem[] = [];

      // Add conversations
      (conversationsData || []).forEach(conv => {
        items.push({
          type: 'conversation',
          userId: conv.userId,
          conversation: conv,
        });
      });

      // Add accepted matches without conversations
      (matchesData?.matches || []).forEach(match => {
        const user = match.sender || match.receiver;
        if (user && !items.find(item => item.userId === user.id)) {
          items.push({
            type: 'match',
            userId: user.id,
            match,
          });
        }
      });

      setListItems(items);
      setFilteredItems(items);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredItems(listItems);
      return;
    }

    const filtered = listItems.filter(item => {
      if (item.type === 'conversation') {
        const userName = item.conversation?.user?.profile?.firstName || '';
        return userName.toLowerCase().includes(query.toLowerCase());
      } else {
        const user = item.match?.sender || item.match?.receiver;
        const userName = user?.profile?.firstName || '';
        return userName.toLowerCase().includes(query.toLowerCase());
      }
    });
    setFilteredItems(filtered);
  };

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === 'conversation') {
      const conv = item.conversation!;
      const user = conv.user;
      const profile = user?.profile;
      const isOnline = onlineUsers.has(item.userId);

      return (
        <TouchableOpacity
          style={styles.conversationItem}
          onPress={() =>
            navigation.navigate('ChatScreen', {
              userId: item.userId,
              userName: profile?.firstName || 'User',
            })
          }
        >
          <View style={styles.avatarContainer}>
            {user?.profilePicture ? (
              <Image source={{ uri: user.profilePicture }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Icon name="account" size={32} color={Theme.colors.textSecondary} />
              </View>
            )}
            {isOnline && <View style={styles.onlineDot} />}
          </View>

          <View style={styles.messageContent}>
            <View style={styles.messageHeader}>
              <View style={styles.nameContainer}>
                <Text style={styles.userName} numberOfLines={1}>
                  {profile?.firstName} {profile?.lastName}
                </Text>
                {profile?.isPremium && <PremiumBadge variant="inline" size={14} />}
              </View>
              <Text style={styles.timestamp}>
                {conv.lastMessage?.createdAt ? formatTimestamp(conv.lastMessage.createdAt) : ''}
              </Text>
            </View>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {conv.lastMessage?.content || 'No messages yet'}
            </Text>
          </View>

          {conv.unreadCount > 0 && (
            <LinearGradient
              colors={[Theme.colors.primary, Theme.colors.primaryLight]}
              style={styles.unreadBadge}
            >
              <Text style={styles.unreadText}>{conv.unreadCount}</Text>
            </LinearGradient>
          )}
        </TouchableOpacity>
      );
    } else {
      // Match item
      const user = item.match?.sender || item.match?.receiver;
      const profile = user?.profile;
      const isOnline = onlineUsers.has(item.userId);

      return (
        <TouchableOpacity
          style={styles.conversationItem}
          onPress={() =>
            navigation.navigate('ChatScreen', {
              userId: item.userId,
              userName: profile?.firstName || 'User',
            })
          }
        >
          <View style={styles.avatarContainer}>
            {user?.profilePicture ? (
              <Image source={{ uri: user.profilePicture }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Icon name="account" size={32} color={Theme.colors.textSecondary} />
              </View>
            )}
            {isOnline && <View style={styles.onlineDot} />}
          </View>

          <View style={styles.messageContent}>
            <View style={styles.nameContainer}>
              <Text style={styles.userName} numberOfLines={1}>
                {profile?.firstName} {profile?.lastName}
              </Text>
              {profile?.isPremium && <PremiumBadge variant="inline" size={14} />}
            </View>
            <Text style={styles.matchMessage}>Start chatting with your match!</Text>
          </View>

          <Icon name="chat" size={24} color={Theme.colors.primary} />
        </TouchableOpacity>
      );
    }
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="message-outline" size={64} color={Theme.colors.border} />
      <Text style={styles.emptyText}>No messages yet</Text>
      <Text style={styles.emptySubtext}>Start connecting with matches!</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Icon name="dots-vertical" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color={Theme.colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name"
          placeholderTextColor={Theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Messages List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={item => `${item.type}-${item.userId}`}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadData(true)}
              colors={[Theme.colors.primary]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  menuButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surfaceCard,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Theme.colors.text,
    padding: 0,
  },
  listContent: {
    flexGrow: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    backgroundColor: Theme.colors.white,
    ...Theme.shadows.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    backgroundColor: Theme.colors.surfaceCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Theme.colors.success,
    borderWidth: 2,
    borderColor: Theme.colors.white,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text,
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginLeft: 8,
  },
  lastMessage: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  matchMessage: {
    fontSize: 14,
    color: Theme.colors.primary,
    fontStyle: 'italic',
  },
  unreadBadge: {
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  unreadText: {
    color: Theme.colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginTop: 8,
  },
});

export default ConversationsListScreen;
