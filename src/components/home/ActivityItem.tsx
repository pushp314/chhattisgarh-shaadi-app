import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';

interface ActivityItemProps {
  activity: {
    id: number;
    type: 'view' | 'like' | 'match' | 'message' | 'shortlist';
    user: {
      id: number;
      name: string;
      photo: string;
    };
    timestamp: Date;
    message?: string;
  };
  onPress: () => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, onPress }) => {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'match':
        return '💕';
      case 'like':
        return '❤️';
      case 'view':
        return '👀';
      case 'message':
        return '💬';
      case 'shortlist':
        return '⭐';
      default:
        return '👤';
    }
  };

  const getActivityColor = () => {
    switch (activity.type) {
      case 'match':
        return colors.primary.main;
      case 'like':
        return colors.error;
      case 'view':
        return colors.info;
      case 'message':
        return colors.secondary.main;
      case 'shortlist':
        return colors.warning;
      default:
        return colors.text.secondary;
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - timestamp.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 60) {
      return `${diffInMins}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${diffInDays}d ago`;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: activity.user.photo }} style={styles.avatar} />
        <View style={[styles.activityBadge, { backgroundColor: getActivityColor() }]}>
          <Text style={styles.activityIcon}>{getActivityIcon()}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.userName} numberOfLines={1}>
          {activity.user.name}
        </Text>
        <Text style={styles.message} numberOfLines={1}>
          {activity.message}
        </Text>
      </View>

      <Text style={styles.timestamp}>{getTimeAgo(activity.timestamp)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  activityBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.neutral.white,
  },
  activityIcon: {
    fontSize: 12,
  },
  contentContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  timestamp: {
    fontSize: 12,
    color: colors.text.disabled,
    marginLeft: 8,
  },
});

export default ActivityItem;