import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Text, TextInput, IconButton, Surface } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MessagesStackParamList } from '../../navigation/types';
import { Message } from '../../types';
import { useAuthStore } from '../../store/authStore';
import messageService from '../../services/message.service';
import socketService from '../../services/socket.service';
import { SOCKET_EVENTS } from '../../constants/socket.constants';

type ChatScreenNavigationProp = NativeStackNavigationProp<
  MessagesStackParamList,
  'ChatScreen'
>;

type ChatScreenRouteProp = RouteProp<MessagesStackParamList, 'ChatScreen'>;

type Props = {
  navigation: ChatScreenNavigationProp;
  route: ChatScreenRouteProp;
};

const ChatScreen: React.FC<Props> = ({ navigation, route }) => {
  const { userId: otherUserId, userName } = route.params;
  const currentUser = useAuthStore(state => state.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    navigation.setOptions({ title: userName });
  }, [navigation, userName]);

  useEffect(() => {
    loadMessages();

    // Set up Socket.io listeners
    socketService.on(SOCKET_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
    socketService.on(SOCKET_EVENTS.TYPING_START, handleTypingStarted);
    socketService.on(SOCKET_EVENTS.TYPING_STOP, handleTypingStopped);
    socketService.on(SOCKET_EVENTS.MESSAGE_READ, handleMessageRead);

    // Mark messages as read when entering chat
    if (socketService.isConnected()) {
      socketService.markMessagesAsRead(otherUserId);
    }

    return () => {
      // Clean up Socket.io listeners
      socketService.off(SOCKET_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
      socketService.off(SOCKET_EVENTS.TYPING_START, handleTypingStarted);
      socketService.off(SOCKET_EVENTS.TYPING_STOP, handleTypingStopped);
      socketService.off(SOCKET_EVENTS.MESSAGE_READ, handleMessageRead);

      // Stop typing indicator on unmount
      if (socketService.isConnected()) {
        socketService.stopTyping(otherUserId);
      }
    };
  }, [otherUserId]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      console.log('Loading messages with:', otherUserId);
      const response = await messageService.getConversation(otherUserId);
      setMessages(response.messages.reverse()); // Reverse to show newest at bottom
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewMessage = useCallback((message: Message) => {
    console.log('New message received:', message);
    if (
      message.senderId === otherUserId ||
      message.receiverId === otherUserId
    ) {
      setMessages(prev => {
        // Prevent duplicates
        if (prev.some(m => m.id === message.id)) {
          return prev;
        }
        return [message, ...prev];
      });

      // Mark as read if it's from the other user and we're in the chat
      if (message.senderId === otherUserId && socketService.isConnected()) {
        socketService.markMessagesAsRead(otherUserId);
      }
    }
  }, [otherUserId]);

  const handleTypingStarted = useCallback((data: { userId: number }) => {
    if (data.userId === otherUserId) {
      setIsTyping(true);
    }
  }, [otherUserId]);

  const handleTypingStopped = useCallback((data: { userId: number }) => {
    if (data.userId === otherUserId) {
      setIsTyping(false);
    }
  }, [otherUserId]);

  const handleMessageRead = useCallback((data: { byUser: number }) => {
    // Update read status for messages sent by current user
    if (data.byUser === otherUserId) {
      setMessages(prev =>
        prev.map(msg =>
          msg.senderId === currentUser?.id && msg.receiverId === otherUserId
            ? { ...msg, isRead: true, readAt: new Date().toISOString() }
            : msg
        )
      );
    }
  }, [otherUserId, currentUser]);

  const handleSendMessage = async () => {
    if (messageText.trim() === '' || isSending) return;

    const tempMessage = messageText;
    setMessageText('');
    setIsSending(true);

    try {
      console.log('Sending message:', { to: otherUserId, text: tempMessage });
      const newMessage = await messageService.sendMessage(otherUserId, tempMessage);
      setMessages(prev => [newMessage, ...prev]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessageText(tempMessage);
    } finally {
      setIsSending(false);
    }
  };

  const handleTextChange = (text: string) => {
    setMessageText(text);

    // Emit typing indicator
    if (text.trim() !== '' && socketService.isConnected()) {
      socketService.startTyping(otherUserId);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // @ts-ignore
      typingTimeoutRef.current = setTimeout(() => {
        socketService.stopTyping(otherUserId);
      }, 2000);
    } else if (text.trim() === '' && socketService.isConnected()) {
      socketService.stopTyping(otherUserId);
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.senderId === currentUser?.id;

    return (
      <View
        style={[
          styles.messageBubbleContainer,
          isMine ? styles.myMessageContainer : styles.theirMessageContainer,
        ]}>
        <Surface
          style={[
            styles.messageBubble,
            isMine ? styles.myMessageBubble : styles.theirMessageBubble,
          ]}
          elevation={1}>
          <Text
            style={[
              styles.messageText,
              isMine ? styles.myMessageText : styles.theirMessageText,
            ]}>
            {item.content}
          </Text>
          <View style={styles.messageFooter}>
            <Text
              style={[
                styles.timestamp,
                isMine ? styles.myTimestamp : styles.theirTimestamp,
              ]}>
              {formatTimestamp(item.createdAt)}
            </Text>
            {isMine && (
              <Icon
                name={item.isRead ? 'check-all' : 'check'}
                size={16}
                color={item.isRead ? '#2196F3' : '#999'}
                style={styles.readIcon}
              />
            )}
          </View>
        </Surface>
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Icon name="message-text-outline" size={64} color="#ccc" />
        <Text variant="titleMedium" style={styles.emptyText}>
          No messages yet
        </Text>
        <Text variant="bodyMedium" style={styles.emptySubtext}>
          Start the conversation!
        </Text>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={styles.typingContainer}>
        <Surface style={styles.typingBubble} elevation={1}>
          <View style={styles.typingDots}>
            <View style={styles.typingDot} />
            <View style={styles.typingDot} />
            <View style={styles.typingDot} />
          </View>
        </Surface>
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        inverted
        contentContainerStyle={styles.messagesList}
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={renderTypingIndicator}
      />

      <Surface style={styles.inputContainer} elevation={4}>
        <TextInput
          value={messageText}
          onChangeText={handleTextChange}
          placeholder="Type a message..."
          mode="outlined"
          multiline
          maxLength={1000}
          style={styles.textInput}
          outlineStyle={styles.textInputOutline}
          right={
            <TextInput.Icon
              icon="send"
              onPress={handleSendMessage}
              disabled={messageText.trim() === '' || isSending}
              forceTextInputFocus={false}
            />
          }
        />
      </Surface>
    </KeyboardAvoidingView>
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
  messagesList: {
    padding: 16,
  },
  messageBubbleContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
  },
  theirMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  },
  myMessageBubble: {
    backgroundColor: '#D81B60',
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#fff',
  },
  theirMessageText: {
    color: '#333',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 11,
  },
  myTimestamp: {
    color: 'rgba(255,255,255,0.8)',
  },
  theirTimestamp: {
    color: '#999',
  },
  readIcon: {
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
    transform: [{ scaleY: -1 }],
  },
  emptyText: {
    marginTop: 16,
    color: '#666',
  },
  emptySubtext: {
    marginTop: 4,
    color: '#999',
  },
  typingContainer: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    maxWidth: '80%',
  },
  typingBubble: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#999',
  },
  inputContainer: {
    padding: 8,
    backgroundColor: '#fff',
  },
  textInput: {
    backgroundColor: '#fff',
    maxHeight: 100,
  },
  textInputOutline: {
    borderRadius: 24,
  },
});

export default ChatScreen;
