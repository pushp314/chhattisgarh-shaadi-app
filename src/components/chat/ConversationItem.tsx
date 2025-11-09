import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../theme/colors';
import { UserProfile } from '../../data/mockData';
import Avatar from '../common/Avatar';

interface ConversationItemProps {
  profile: UserProfile;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isTyping?: boolean;
  onPress: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  profile,
  lastMessage,
  timestamp,
  unreadCount,
  isTyping = false,
  onPress,
}) => {
  const hasUnread = unreadCount > 0;

  return (
    <TouchableOpacity
      style={[styles.container, hasUnread && styles.containerUnread]}
      onPress={onPress}
      activeOpacity={0.7}>
      {/* Profile Avatar */}
      <View style={styles.avatarContainer}>
        <Avatar
          source={{ uri: profile.photos[0] }}
          name={`${profile.firstName} ${profile.lastName}`}
          size={60}
          online={profile.online}
          verified={profile.verified}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Top Row: Name and Timestamp */}
        <View style={styles.topRow}>
          <View style={styles.nameContainer}>
            <Text
              style={[styles.name, hasUnread && styles.nameUnread]}
              numberOfLines={1}>
              {profile.firstName} {profile.lastName}
            </Text>
            {profile.premium && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumIcon}>👑</Text>
              </View>
            )}
          </View>
          <Text style={[styles.timestamp, hasUnread && styles.timestampUnread]}>
            {timestamp}
          </Text>
        </View>

        {/* Bottom Row: Last Message and Unread Badge */}
        <View style={styles.bottomRow}>
          {isTyping ? (
            <View style={styles.typingContainer}>
              <Text style={styles.typingText}>typing</Text>
              <View style={styles.typingDots}>
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
              </View>
            </View>
          ) : (
            <Text
              style={[styles.lastMessage, hasUnread && styles.lastMessageUnread]}
              numberOfLines={1}>
              {lastMessage}
            </Text>
          )}
          {hasUnread && (
            <View style={styles.unreadBadge}>
              <LinearGradient
                colors={[colors.primary.main, colors.secondary.main]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.unreadGradient}>
                <Text style={styles.unreadCount}>{unreadCount}</Text>
              </LinearGradient>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
  },
  containerUnread: {
    backgroundColor: colors.primary.lighter + '30',
  },
  avatarContainer: {
    marginRight: 14,
  },
  content: {
    flex: 1,
    gap: 6,
  },

  // Top Row
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  nameUnread: {
    fontWeight: '700',
    color: colors.text.primary,
  },
  premiumBadge: {
    marginLeft: 6,
  },
  premiumIcon: {
    fontSize: 14,
  },
  timestamp: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: '400',
  },
  timestampUnread: {
    color: colors.primary.main,
    fontWeight: '600',
  },

  // Bottom Row
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 15,
    color: colors.text.secondary,
    flex: 1,
    marginRight: 8,
  },
  lastMessageUnread: {
    color: colors.text.primary,
    fontWeight: '500',
  },

  // Typing Indicator
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typingText: {
    fontSize: 15,
    color: colors.primary.main,
    fontStyle: 'italic',
    marginRight: 6,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 3,
  },
  typingDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary.main,
  },

  // Unread Badge
  unreadBadge: {
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  unreadGradient: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.neutral.white,
  },
});

export default ConversationItem;