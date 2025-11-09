import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { UserProfile } from '../../data/mockData';

interface MatchItemProps {
  profile: UserProfile;
  onPress: () => void;
}

const MatchItem: React.FC<MatchItemProps> = ({ profile, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <ImageBackground
        source={{ uri: profile.photos[0] }}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlay}>
          <Text style={styles.name} numberOfLines={1}>
            {profile.firstName}
          </Text>
          {profile.online && <View style={styles.onlineDot} />}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1, // Make it square
    margin: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    // borderRadius is handled by container
  },
  overlay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  name: {
    flex: 1, // Take available space
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.white,
    marginRight: 6,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
});

export default MatchItem;