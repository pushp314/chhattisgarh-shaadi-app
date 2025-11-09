import React from 'react';
import { View, Text, StyleSheet, Image, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface AvatarProps {
  source?: { uri: string };
  name?: string;
  size?: number;
  verified?: boolean;
  premium?: boolean;
  online?: boolean;
  style?: ViewStyle;
}

const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 60,
  verified = false,
  premium = false,
  online = false,
  style,
}) => {
  const getInitials = (fullName?: string): string => {
    if (!fullName) return '?';
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return fullName[0].toUpperCase();
  };

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {source?.uri ? (
        <Image source={source} style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} />
      ) : (
        <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]}>
          <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
            {getInitials(name)}
          </Text>
        </View>
      )}

      {/* Online Indicator */}
      {online && (
        <View
          style={[
            styles.onlineIndicator,
            {
              width: size * 0.25,
              height: size * 0.25,
              borderRadius: size * 0.125,
              borderWidth: size * 0.05,
            },
          ]}
        />
      )}

      {/* Verified Badge */}
      {verified && (
        <View
          style={[
            styles.verifiedBadge,
            {
              width: size * 0.3,
              height: size * 0.3,
              borderRadius: size * 0.15,
              borderWidth: size * 0.04,
            },
          ]}>
          <Text style={[styles.verifiedIcon, { fontSize: size * 0.18 }]}>✓</Text>
        </View>
      )}

      {/* Premium Badge */}
      {premium && (
        <View
          style={[
            styles.premiumBadge,
            {
              width: size * 0.3,
              height: size * 0.3,
              borderRadius: size * 0.15,
              borderWidth: size * 0.04,
              top: verified ? size * 0.3 : 0,
            },
          ]}>
          <Text style={[styles.premiumIcon, { fontSize: size * 0.18 }]}>👑</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    backgroundColor: colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.primary.dark,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.success,
    borderColor: colors.neutral.white,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.success,
    borderColor: colors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedIcon: {
    color: colors.neutral.white,
    fontWeight: 'bold',
  },
  premiumBadge: {
    position: 'absolute',
    right: 0,
    backgroundColor: colors.premium,
    borderColor: colors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumIcon: {
    color: colors.neutral.white,
  },
});

export default Avatar;