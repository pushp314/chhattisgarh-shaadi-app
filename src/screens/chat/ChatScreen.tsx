import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { MainStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import Avatar from '../../components/common/Avatar';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// Message Interface
interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

// Mock messages
const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Hey! How are you doing? 😊',
    sender: 'other',
    timestamp: '10:15 AM',
    status: 'read',
  },
  {
    id: '2',
    text: 'Hi! I am doing great, thanks for asking! How about you?',
    sender: 'me',
    timestamp: '10:16 AM',
    status: 'read',
  },
  {
    id: '3',
    text: "I'm good too! Just exploring the app. Your profile looks interesting!",
    sender: 'other',
    timestamp: '10:17 AM',
    status: 'read',
  },
  {
    id: '4',
    text: 'Thank you! I loved your profile too. Would love to know more about you.',
    sender: 'me',
    timestamp: '10:18 AM',
    status: 'delivered',
  },
  {
    id: '5',
    text: "That's great! I'd love to connect. What do you like to do in your free time?",
    sender: 'other',
    timestamp: '10:20 AM',
    status: 'sent',
  },
];

type ChatScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'ChatScreen'
>;
type ChatScreenRouteProp = RouteProp<MainStackParamList, 'ChatScreen'>;

const ChatScreen = () => {
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const route = useRoute<ChatScreenRouteProp>();

  const { profileName, profilePhoto } = route.params;
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Auto scroll on mount and when messages change
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, []);

  const handleSend = () => {
    if (inputText.trim().length === 0) return;

    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'me',
      timestamp,
      status: 'sent',
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isMe = item.sender === 'me';
    const showTimestamp = index === 0 || 
      messages[index - 1].sender !== item.sender;

    return (
      <Animated.View
        entering={SlideInRight.delay(index * 50).duration(300)}
        style={[styles.messageRow, isMe ? styles.myMessageRow : styles.theirMessageRow]}>
        <View style={styles.messageContainer}>
          {!isMe && showTimestamp && (
            <Avatar
              source={{ uri: profilePhoto }}
              name={profileName}
              size={32}
              style={styles.messageAvatar}
            />
          )}
          <View style={[styles.messageBubbleWrapper, !isMe && !showTimestamp && styles.messageBubbleWrapperIndent]}>
            {isMe ? (
              <LinearGradient
                colors={[colors.primary.main, colors.secondary.main]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.messageBubble, styles.myMessageBubble]}>
                <Text style={styles.myMessageText}>{item.text}</Text>
                <View style={styles.messageFooter}>
                  <Text style={styles.myMessageTime}>{item.timestamp}</Text>
                  {item.status === 'read' && (
                    <Text style={styles.statusIcon}>✓✓</Text>
                  )}
                  {item.status === 'delivered' && (
                    <Text style={styles.statusIcon}>✓✓</Text>
                  )}
                  {item.status === 'sent' && (
                    <Text style={styles.statusIcon}>✓</Text>
                  )}
                </View>
              </LinearGradient>
            ) : (
              <View style={[styles.messageBubble, styles.theirMessageBubble]}>
                <Text style={styles.theirMessageText}>{item.text}</Text>
                <Text style={styles.theirMessageTime}>{item.timestamp}</Text>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar backgroundColor={colors.neutral.white} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={[colors.neutral.white, colors.background.default]}
          style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileSection}
            activeOpacity={0.8}
            onPress={() => {
              // Navigate to profile detail
            }}>
            <Avatar source={{ uri: profilePhoto }} name={profileName} size={42} />
            <View style={styles.profileInfo}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {profileName}
              </Text>
              {isTyping ? (
                <Text style={styles.typingIndicator}>typing...</Text>
              ) : (
                <Text style={styles.onlineStatus}>Online</Text>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionsButton} activeOpacity={0.7}>
            <Text style={styles.optionsIcon}>⋮</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Chat Background Pattern */}
      <View style={styles.chatBackground}>
        <KeyboardAvoidingView
          style={styles.flexOne}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
          
          {/* Message List */}
          <FlatList
            ref={flatListRef}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderMessage}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
            onLayout={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
          />

          {/* Input Bar */}
          <View style={styles.inputBar}>
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.attachButton} activeOpacity={0.7}>
                <Text style={styles.attachIcon}>📎</Text>
              </TouchableOpacity>

              <View style={styles.textInputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Type a message..."
                  placeholderTextColor={colors.text.disabled}
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  maxLength={500}
                />
              </View>

              {inputText.trim().length > 0 ? (
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSend}
                  activeOpacity={0.8}>
                  <LinearGradient
                    colors={[colors.primary.main, colors.secondary.main]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.sendGradient}>
                    <Text style={styles.sendIcon}>➤</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.emojiButton} activeOpacity={0.7}>
                  <Text style={styles.emojiIcon}>😊</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  flexOne: {
    flex: 1,
  },

  // Header
  headerContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
    marginRight: 4,
  },
  backIcon: {
    fontSize: 26,
    color: colors.text.primary,
  },
  profileSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  typingIndicator: {
    fontSize: 13,
    color: colors.primary.main,
    fontStyle: 'italic',
    marginTop: 2,
  },
  onlineStatus: {
    fontSize: 13,
    color: colors.success,
    marginTop: 2,
  },
  optionsButton: {
    padding: 8,
    marginLeft: 8,
  },
  optionsIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },

  // Chat Background
  chatBackground: {
    flex: 1,
    backgroundColor: colors.neutral.gray50,
  },

  // Message List
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    paddingBottom: 8,
  },
  messageRow: {
    marginVertical: 3,
  },
  myMessageRow: {
    alignItems: 'flex-end',
  },
  theirMessageRow: {
    alignItems: 'flex-start',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: width * 0.8,
  },
  messageAvatar: {
    marginRight: 8,
    marginBottom: 2,
  },
  messageBubbleWrapper: {
    flex: 1,
  },
  messageBubbleWrapperIndent: {
    marginLeft: 40, // Space for avatar
  },

  // Message Bubbles
  messageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  myMessageBubble: {
    borderBottomRightRadius: 4,
    alignSelf: 'flex-end',
  },
  theirMessageBubble: {
    backgroundColor: colors.neutral.white,
    borderBottomLeftRadius: 4,
    alignSelf: 'flex-start',
  },
  myMessageText: {
    fontSize: 16,
    color: colors.neutral.white,
    lineHeight: 22,
  },
  theirMessageText: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 22,
    marginBottom: 4,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  myMessageTime: {
    fontSize: 11,
    color: colors.neutral.white,
    opacity: 0.8,
  },
  theirMessageTime: {
    fontSize: 11,
    color: colors.text.secondary,
  },
  statusIcon: {
    fontSize: 14,
    color: colors.neutral.white,
    opacity: 0.9,
  },

  // Input Bar
  inputBar: {
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray200,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  attachButton: {
    padding: 10,
    marginBottom: 2,
  },
  attachIcon: {
    fontSize: 22,
  },
  textInputWrapper: {
    flex: 1,
    backgroundColor: colors.neutral.gray100,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 2,
    minHeight: 44,
    maxHeight: 120,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 16,
    color: colors.text.primary,
    paddingVertical: 10,
  },
  sendButton: {
    marginBottom: 2,
  },
  sendGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sendIcon: {
    fontSize: 20,
    color: colors.neutral.white,
    transform: [{ translateX: 1 }],
  },
  emojiButton: {
    padding: 10,
    marginBottom: 2,
  },
  emojiIcon: {
    fontSize: 24,
  },
});

export default ChatScreen;