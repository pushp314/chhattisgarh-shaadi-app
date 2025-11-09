import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { MainStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { recommendedProfiles } from '../../data/mockData';
import ConversationItem from '../../components/chat/ConversationItem';
import Animated, { FadeIn } from 'react-native-reanimated';

// Mock chat data
const mockConversations = [
  {
    profile: recommendedProfiles[0],
    lastMessage: 'Hey, how are you? Would love to connect!',
    timestamp: '10:20 AM',
    unreadCount: 2,
    isTyping: false,
  },
  {
    profile: recommendedProfiles[1],
    lastMessage: 'Thanks! I had a great time talking to you.',
    timestamp: 'Yesterday',
    unreadCount: 0,
    isTyping: false,
  },
  {
    profile: recommendedProfiles[2],
    lastMessage: 'Are you free this weekend?',
    timestamp: 'Mon',
    unreadCount: 1,
    isTyping: true,
  },
  {
    profile: recommendedProfiles[3],
    lastMessage: 'Nice to meet you!',
    timestamp: 'Sun',
    unreadCount: 0,
    isTyping: false,
  },
];

type ConversationsNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'MainTabs'
>;

const ConversationsScreen = () => {
  const navigation = useNavigation<ConversationsNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] =
    useState(mockConversations);

  const handlePressConversation = (profile: any) => {
    navigation.navigate('ChatScreen', {
      profileId: profile.id,
      profileName: `${profile.firstName} ${profile.lastName}`,
      profilePhoto: profile.photos[0],
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredConversations(mockConversations);
    } else {
      const filtered = mockConversations.filter(conv =>
        `${conv.profile.firstName} ${conv.profile.lastName}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );
      setFilteredConversations(filtered);
    }
  };

  const totalUnread = mockConversations.reduce(
    (sum, conv) => sum + conv.unreadCount,
    0
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyEmoji}>💬</Text>
      </View>
      <Text style={styles.emptyTitle}>No Conversations Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start connecting with matches to begin conversations
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.neutral.white} barStyle="dark-content" />

      {/* Header with Gradient */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={[colors.neutral.white, colors.background.default]}
          style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>Messages</Text>
              {totalUnread > 0 && (
                <View style={styles.headerBadge}>
                  <LinearGradient
                    colors={[colors.primary.main, colors.secondary.main]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerBadgeGradient}>
                    <Text style={styles.headerBadgeText}>{totalUnread}</Text>
                  </LinearGradient>
                </View>
              )}
            </View>
            <Text style={styles.headerSubtitle}>
              {filteredConversations.length}{' '}
              {filteredConversations.length === 1 ? 'conversation' : 'conversations'}
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor={colors.text.disabled}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => handleSearch('')}
              style={styles.clearButton}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Conversation List */}
      {filteredConversations.length > 0 ? (
        <FlatList
          data={filteredConversations}
          keyExtractor={item => item.profile.id.toString()}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeIn.delay(index * 100).duration(300)}>
              <ConversationItem
                profile={item.profile}
                lastMessage={item.lastMessage}
                timestamp={item.timestamp}
                unreadCount={item.unreadCount}
                isTyping={item.isTyping}
                onPress={() => handlePressConversation(item.profile)}
              />
            </Animated.View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        renderEmptyState()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },

  // Header
  headerContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerContent: {
    gap: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
  headerBadge: {
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  headerBadgeGradient: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.neutral.white,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
  },

  // Search Bar
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.neutral.white,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.gray100,
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearIcon: {
    fontSize: 16,
    color: colors.text.secondary,
  },

  // List
  listContent: {
    paddingBottom: 16,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary.lighter,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyEmoji: {
    fontSize: 50,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ConversationsScreen;