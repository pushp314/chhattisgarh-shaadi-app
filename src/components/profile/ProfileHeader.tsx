import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { colors } from '../../theme/colors';
import { UserProfile } from '../../data/mockData';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = width * 0.9;

interface ProfileHeaderProps {
  profile: UserProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  return (
    <ImageBackground
      source={{ uri: profile.photos[0] }}
      style={styles.headerImage}>
      <View style={styles.overlay}>
        <Text style={styles.name}>
          {profile.firstName} {profile.lastName}, {profile.age}
        </Text>
        <Text style={styles.location}>
          📍 {profile.location} • {profile.profession}
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    width: width,
    height: HEADER_HEIGHT,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.neutral.white,
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: colors.neutral.white,
  },
});

export default ProfileHeader;