/**
 * Chat Screen - Professional & Clean Design
 * Simple chat with report/block functionality
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal,
  TextInput as RNTextInput,
  Alert,
} from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { MessagesStackParamList } from '../../navigation/types';
import { Message, ReportType } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import messageService from '../../services/message.service';
import blockService from '../../services/block.service';
import reportService from '../../services/report.service';
import socketService from '../../services/socket.service';
import { SOCKET_EVENTS } from '../../constants/socket.constants';
import { Theme } from '../../constants/theme';

type ChatScreenNavigationProp = NativeStackNavigationProp<MessagesStackParamList, 'ChatScreen'>;
type ChatScreenRouteProp = RouteProp<MessagesStackParamList, 'ChatScreen'>;

type Props = {
  navigation: ChatScreenNavigationProp;
  route: ChatScreenRouteProp;
};

const ChatScreen: React.FC<Props> = ({ navigation, route }) => {
  const { userId: otherUserId, userName } = route.params;
  const currentUser = useAuthStore(state => state.user);
  const { profile } = useProfileStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  const isPremium = profile?.isPremium || currentUser?.subscription?.status === 'ACTIVE';

  useEffect(() => {
    loadMessages();
    setupSocketListeners();

    return () => {
      cleanupSocketListeners();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [otherUserId]);

  const setupSocketListeners = () => {
    socketService.on(SOCKET_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
    socketService.on(SOCKET_EVENTS.TYPING_START, handleTypingStarted);
    socketService.on(SOCKET_EVENTS.TYPING_STOP, handleTypingStopped);
    socketService.on(SOCKET_EVENTS.USER_ONLINE, handleUserOnline);
    socketService.on(SOCKET_EVENTS.USER_OFFLINE, handleUserOffline);

    if (socketService.isConnected()) {
      socketService.markMessagesAsRead(otherUserId);
    }
  };

  const cleanupSocketListeners = () => {
    socketService.off(SOCKET_EVENTS.MESSAGE_RECEIVED);
    socketService.off(SOCKET_EVENTS.TYPING_START);
    socketService.off(SOCKET_EVENTS.TYPING_STOP);
    socketService.off(SOCKET_EVENTS.USER_ONLINE);
    socketService.off(SOCKET_EVENTS.USER_OFFLINE);
  };

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const response = await messageService.getConversation(otherUserId);
      setMessages(response.messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewMessage = useCallback((message: Message) => {
    if (message.senderId === otherUserId || message.receiverId === otherUserId) {
      setMessages(prev => [message, ...prev]);
      if (socketService.isConnected()) {
        socketService.markMessagesAsRead(otherUserId);
      }
    }
  }, [otherUserId]);

  const handleTypingStarted = useCallback((data: { userId: number }) => {
    if (data.userId === otherUserId) setIsTyping(true);
  }, [otherUserId]);

  const handleTypingStopped = useCallback((data: { userId: number }) => {
    if (data.userId === otherUserId) setIsTyping(false);
  }, [otherUserId]);

  const handleUserOnline = useCallback((data: { userId: number }) => {
    if (data.userId === otherUserId) setIsOnline(true);
  }, [otherUserId]);

  const handleUserOffline = useCallback((data: { userId: number }) => {
    if (data.userId === otherUserId) setIsOnline(false);
  }, [otherUserId]);

  const handleSendMessage = async () => {
    if (messageText.trim() === '' || isSending) return;

    const tempMessage = messageText;
    setMessageText('');
    setIsSending(true);

    try {
      const newMessage = await messageService.sendMessage(otherUserId, tempMessage);
      setMessages(prev => [newMessage, ...prev]);
    } catch (error: any) {
      setMessageText(tempMessage);
      if (error.response?.status === 403) {
        setShowPremiumModal(true);
      } else {
        Alert.alert('Error', error.response?.data?.message || 'Failed to send message');
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleTextChange = (text: string) => {
    setMessageText(text);
    if (text.trim() !== '' && socketService.isConnected()) {
      socketService.startTyping(otherUserId);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      // @ts-ignore
      typingTimeoutRef.current = setTimeout(() => socketService.stopTyping(otherUserId), 2000);
    }
  };

  const handleBlockUser = async () => {
    setShowMenu(false);
    Alert.alert(
      'Block User',
      `Are you sure you want to block ${userName}? They won't be able to message you.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsBlocking(true);
              await blockService.blockUser(otherUserId, 'Blocked from chat');
              Alert.alert('Blocked', `${userName} has been blocked.`);
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to block user');
            } finally {
              setIsBlocking(false);
            }
          },
        },
      ]
    );
  };

  const handleReportUser = async () => {
    if (!reportReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for reporting');
      return;
    }

    try {
      setIsReporting(true);
      await reportService.reportUser({
        reportedUserId: otherUserId,
        reason: reportReason,
        reportType: ReportType.MESSAGE,
      });
      setShowReportModal(false);
      setReportReason('');
      Alert.alert('Reported', 'Thank you for your report. We will review it shortly.');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to report user');
    } finally {
      setIsReporting(false);
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.senderId === currentUser?.id;

    return (
      <View style={[styles.messageRow, isMine ? styles.myMessageRow : styles.theirMessageRow]}>
        <View style={[styles.messageBubble, isMine ? styles.myBubble : styles.theirBubble]}>
          <Text style={[styles.messageText, isMine ? styles.myMessageText : styles.theirMessageText]}>
            {item.content}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={[styles.timestamp, isMine ? styles.myTimestamp : styles.theirTimestamp]}>
              {formatTimestamp(item.createdAt)}
            </Text>
            {isMine && (
              <Icon
                name={item.isRead ? 'check-all' : 'check'}
                size={14}
                color={item.isRead ? '#4CAF50' : 'rgba(255,255,255,0.6)'}
                style={styles.readIcon}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;
    return (
      <View style={styles.typingContainer}>
        <View style={styles.typingBubble}>
          <Text style={styles.typingText}>{userName} is typing...</Text>
        </View>
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Icon name="message-heart-outline" size={64} color={Theme.colors.primary} />
        <Text style={styles.emptyTitle}>Start the conversation!</Text>
        <Text style={styles.emptySubtext}>Say hi to {userName} 👋</Text>
      </View>
    );
  };

  // Menu Modal
  const renderMenuModal = () => (
    <Modal visible={showMenu} transparent animationType="fade" onRequestClose={() => setShowMenu(false)}>
      <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => setShowMenu(false)}>
        <View style={styles.menuContent}>
          <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); setShowReportModal(true); }}>
            <Icon name="flag-outline" size={22} color="#666" />
            <Text style={styles.menuItemText}>Report User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, styles.menuItemDanger]} onPress={handleBlockUser}>
            <Icon name="block-helper" size={22} color="#FF3B30" />
            <Text style={styles.menuItemTextDanger}>Block User</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Report Modal
  const renderReportModal = () => (
    <Modal visible={showReportModal} transparent animationType="fade" onRequestClose={() => setShowReportModal(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.reportModalContent}>
          <Text style={styles.reportTitle}>Report {userName}</Text>
          <Text style={styles.reportSubtitle}>Please tell us why you're reporting this user</Text>

          <RNTextInput
            style={styles.reportInput}
            placeholder="Describe the issue..."
            placeholderTextColor="#999"
            multiline
            value={reportReason}
            onChangeText={setReportReason}
            maxLength={500}
          />

          <View style={styles.reportActions}>
            <TouchableOpacity style={styles.reportCancelBtn} onPress={() => setShowReportModal(false)}>
              <Text style={styles.reportCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportSubmitBtn} onPress={handleReportUser} disabled={isReporting}>
              {isReporting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.reportSubmitText}>Submit Report</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Premium Modal
  const renderPremiumModal = () => (
    <Modal visible={showPremiumModal} transparent animationType="fade" onRequestClose={() => setShowPremiumModal(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.premiumModalContent}>
          <LinearGradient colors={[Theme.colors.primary, '#FF1744']} style={styles.premiumIcon}>
            <Icon name="crown" size={36} color="#fff" />
          </LinearGradient>
          <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
          <Text style={styles.premiumSubtitle}>Unlock unlimited messaging to connect with your matches!</Text>
          <TouchableOpacity
            style={styles.premiumButton}
            onPress={() => { setShowPremiumModal(false); navigation.navigate('Subscription' as any); }}
          >
            <LinearGradient colors={[Theme.colors.primary, '#FF1744']} style={styles.premiumGradient}>
              <Text style={styles.premiumButtonText}>View Plans</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowPremiumModal(false)}>
            <Text style={styles.premiumLaterText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderMenuModal()}
      {renderReportModal()}
      {renderPremiumModal()}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <View style={styles.headerAvatar}>
            <Icon name="account" size={24} color="#999" />
          </View>
          <View>
            <Text style={styles.headerName}>{userName}</Text>
            {isOnline && <Text style={styles.headerOnline}>Online</Text>}
          </View>
        </View>

        <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.menuButton}>
          <Icon name="dots-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id.toString()}
          inverted
          contentContainerStyle={styles.messagesList}
          ListEmptyComponent={renderEmpty}
          ListHeaderComponent={renderTypingIndicator}
          showsVerticalScrollIndicator={false}
        />

        {/* Simple Input Bar */}
        <View style={styles.inputContainer}>
          <RNTextInput
            style={styles.textInput}
            value={messageText}
            onChangeText={handleTextChange}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!messageText.trim() || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Icon name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: { padding: 8 },
  headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 8, gap: 12 },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerName: { fontSize: 16, fontWeight: '600', color: '#333' },
  headerOnline: { fontSize: 12, color: '#4CAF50', fontWeight: '500' },
  menuButton: { padding: 8 },
  chatContainer: { flex: 1, backgroundColor: '#F5F5F5' },
  messagesList: { paddingHorizontal: 16, paddingVertical: 8 },
  messageRow: { marginVertical: 4, maxWidth: '80%' },
  myMessageRow: { alignSelf: 'flex-end' },
  theirMessageRow: { alignSelf: 'flex-start' },
  messageBubble: { padding: 12, paddingBottom: 8, borderRadius: 18 },
  myBubble: { backgroundColor: Theme.colors.primary, borderBottomRightRadius: 4 },
  theirBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: { fontSize: 15, lineHeight: 21 },
  myMessageText: { color: '#fff' },
  theirMessageText: { color: '#333' },
  messageFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 4 },
  timestamp: { fontSize: 11 },
  myTimestamp: { color: 'rgba(255,255,255,0.7)' },
  theirTimestamp: { color: '#999' },
  readIcon: { marginLeft: 4 },
  typingContainer: { alignSelf: 'flex-start', marginVertical: 4 },
  typingBubble: { backgroundColor: '#fff', padding: 12, borderRadius: 18, borderBottomLeftRadius: 4 },
  typingText: { fontSize: 13, color: '#666', fontStyle: 'italic' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, transform: [{ scaleY: -1 }] },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#666', marginTop: 8 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
    maxHeight: 100,
    minHeight: 44,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: { backgroundColor: '#ccc' },
  // Menu Modal
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: 80, paddingRight: 16 },
  menuContent: { backgroundColor: '#fff', borderRadius: 12, paddingVertical: 8, minWidth: 180, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  menuItemDanger: { borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  menuItemText: { fontSize: 15, color: '#333' },
  menuItemTextDanger: { fontSize: 15, color: '#FF3B30' },
  // Report Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  reportModalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 340 },
  reportTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 8 },
  reportSubtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
  reportInput: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 12, fontSize: 14, color: '#333', minHeight: 100, textAlignVertical: 'top' },
  reportActions: { flexDirection: 'row', marginTop: 16, gap: 12 },
  reportCancelBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8, backgroundColor: '#F5F5F5' },
  reportCancelText: { fontSize: 14, fontWeight: '600', color: '#666' },
  reportSubmitBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8, backgroundColor: Theme.colors.primary },
  reportSubmitText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  // Premium Modal
  premiumModalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 24, width: '100%', maxWidth: 320, alignItems: 'center' },
  premiumIcon: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  premiumTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 8 },
  premiumSubtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  premiumButton: { width: '100%', borderRadius: 24, overflow: 'hidden', marginBottom: 12 },
  premiumGradient: { paddingVertical: 14, alignItems: 'center' },
  premiumButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  premiumLaterText: { fontSize: 14, color: '#999', paddingVertical: 8 },
});

export default ChatScreen;
