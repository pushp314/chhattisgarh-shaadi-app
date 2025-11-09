import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import SettingItem from '../../components/settings/SettingItem';
import { Avatar, Divider } from '../../components/common'; // Assuming you have Divider
import { currentUser } from '../../data/mockData';

// Define the navigation prop type
type SettingsNavigationProp = NativeStackNavigationProp<MainStackParamList>;

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsNavigationProp>();
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            // Add your Redux/Auth logout logic here
            console.log('User logged out');
            // This would navigate back to the AuthNavigator
          },
        },
      ],
    );
  };

  const handleEditProfile = () => {
    // Navigate to the *existing* CreateProfileScreen
    // This screen can be used for both creation and editing
    navigation.navigate('CreateProfile'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.neutral.white} barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Avatar
            // source={{ uri: 'user_photo_url' }}
            name={`${currentUser.firstName} ${currentUser.lastName}`}
            size={70}
            verified={currentUser.verified}
            premium={currentUser.premium}
          />
          <View style={styles.profileText}>
            <Text style={styles.profileName}>
              {currentUser.firstName} {currentUser.lastName}
            </Text>
            <Text style={styles.profileHandle}>Show My Profile</Text>
          </View>
          <Text style={styles.profileArrow}>›</Text>
        </View>

        {/* --- Account Settings --- */}
        <Text style={styles.sectionTitle}>Account</Text>
        <SettingItem
          icon="👤"
          title="Edit Profile"
          subtitle="Manage your photos and details"
          type="navigate"
          onPress={handleEditProfile}
        />
        <SettingItem
          icon="🔑"
          title="Account Settings"
          subtitle="Manage phone number, email"
          type="navigate"
          onPress={() => {}}
        />

        {/* --- Preferences --- */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <SettingItem
          icon="🔔"
          title="Notifications"
          subtitle="Manage push notifications"
          type="toggle"
          toggleValue={notifications}
          onToggleChange={setNotifications}
        />
        <SettingItem
          icon="🌎"
          title="Language"
          subtitle="English, हिंदी, Cg"
          type="navigate"
          onPress={() => {}}
        />
        <SettingItem
          icon="⭐️"
          title="Upgrade to Premium"
          subtitle="Get unlimited access"
          type="navigate"
          onPress={() => {}}
        />
        
        {/* --- About & Support --- */}
        <Text style={styles.sectionTitle}>Support</Text>
        <SettingItem
          icon="🛡️"
          title="Privacy Policy"
          type="navigate"
          onPress={() => {}}
        />
        <SettingItem
          icon="📄"
          title="Terms & Conditions"
          type="navigate"
          onPress={() => {}}
        />
        <SettingItem
          icon="❓"
          title="Help & Support"
          type="navigate"
          onPress={() => {}}
        />
        
        {/* --- Logout --- */}
        <View style={{ marginVertical: 20 }}>
          <SettingItem
            icon="👋"
            title="Log Out"
            type="danger"
            onPress={handleLogout}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray200,
  },
  profileText: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  profileHandle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  profileArrow: {
    fontSize: 24,
    color: colors.neutral.gray500,
    fontWeight: '300',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
});

export default SettingsScreen;