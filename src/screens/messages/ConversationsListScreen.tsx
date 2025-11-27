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
import messageService from '../../services/message.service';
import socketService from '../../services/socket.service';
import { SOCKET_EVENTS } from '../../constants/socket.constants';
import { useFocusEffect } from '@react-navigation/native';

type ConversationsListScreenNavigationProp = NativeStackNavigationProp<
  MessagesStackParamList,
  'ConversationsList'
>;

type Props = {
  navigation: ConversationsListScreenNavigationProp;
};

const ConversationsListScreen: React.FC<Props> = ({ navigation }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<
    Conversation[]
  >([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadConversations();

      // Set up Socket.io listener for new messages
      const handleNewMessage = (message: Message) => {
        console.log('ConversationsList: New message received', message);
        // Reload conversations to update list
        loadConversations();
      };

      socketService.on(SOCKET_EVENTS.MESSAGE_RECEIVED, handleNewMessage);

      return () => {
        socketService.off(SOCKET_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
      };
    }, [])
  );

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter(conv => {
        const userName = `${conv.user.profile?.firstName} ${conv.user.profile?.lastName}`.toLowerCase();
        return userName.includes(searchQuery.toLowerCase());
      });
      setFilteredConversations(filtered);
    }
  }, [searchQuery, conversations]);

  const loadConversations = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      console.log('Loading conversations');
      const conversationsData = await messageService.getConversations();
      setConversations(conversationsData);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
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

  const renderItem = ({ item }: { item: Conversation }) => {
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
        left={() =>
          profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="account" size={32} color="#999" />
            </View>
          )
        }
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
        onPress={() =>
          navigation.navigate('ChatScreen', {
            userId: item.userId,
            userName,
          })
        }
        style={[
          styles.listItem,
          item.unreadCount > 0 && styles.listItemUnread,
        ]}
      />
    );
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
        <ActivityIndicator size="large" color="#D81B60" />
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
        data={filteredConversations}
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
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchbar: {
    elevation: 0,
  },
  listItem: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemUnread: {
    backgroundColor: '#f8f9ff',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginLeft: 8,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 8,
  },
  timestamp: {
    color: '#666',
    marginBottom: 4,
  },
  badge: {
    backgroundColor: '#D81B60',
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
    color: '#666',
    textAlign: 'center',
  },
});

export default ConversationsListScreen;
