/**
 * Custom Drawer Content Component - Redesigned
 * Clean sidebar matching reference design
 */

import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Theme } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import { useTheme } from '../../context/ThemeContext';

type Props = DrawerContentComponentProps;

const CustomDrawerContent: React.FC<Props> = (props) => {
    const { navigation } = props;
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const user = useAuthStore(state => state.user);
    const { profile } = useProfileStore();
    const logout = useAuthStore(state => state.logout);

    const profilePicture = profile?.media?.[0]?.url || user?.profilePicture;
    const fullName = profile ? `${profile.firstName} ${profile.lastName || ''}`.trim() : 'User';
    const profileId = profile?.profileId || `ID - ${user?.id || 'TXWR8513'}`;

    const handleNavigation = (screen: string) => {
        navigation.closeDrawer();
        if (screen === 'EditProfile') {
            navigation.navigate('ProfileStack', { screen: 'EditProfile' });
        } else if (screen === 'PartnerPreferences') {
            navigation.navigate('ProfileStack', { screen: 'PartnerPreferences' });
        } else if (screen === 'PhotoManagement') {
            navigation.navigate('ProfileStack', { screen: 'PhotoManagement' });
        } else if (screen === 'Settings') {
            navigation.navigate('ProfileStack', { screen: 'Settings' });
        } else if (screen === 'Help') {
            navigation.navigate('ProfileStack', { screen: 'HelpSupport' });
        } else if (screen === 'Privacy') {
            navigation.navigate('ProfileStack', { screen: 'PrivacyPolicy' });
        } else if (screen === 'Subscription') {
            navigation.navigate('ProfileStack', { screen: 'SubscriptionPlans' });
        }
    };

    const handleProfilePreview = () => {
        navigation.closeDrawer();
        if (user?.id) {
            // Navigate to ProfileStack's ProfileDetails screen
            navigation.navigate('ProfileStack', {
                screen: 'ProfileDetails',
                params: { userId: user.id },
            });
        }
    };

    const handleLogout = async () => {
        navigation.closeDrawer();
        await logout();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Profile Section - Tap to preview profile */}
                <TouchableOpacity
                    style={styles.profileSection}
                    onPress={handleProfilePreview}
                    activeOpacity={0.7}
                >
                    <Image
                        source={{ uri: profilePicture || 'https://via.placeholder.com/80' }}
                        style={styles.profileImage}
                    />
                    <Text style={styles.profileName}>{fullName}</Text>
                    <Text style={styles.profileId}>{profileId}</Text>
                    <Text style={styles.viewProfileText}>Tap to view your profile ➔</Text>
                </TouchableOpacity>

                {/* Upgrade Button */}
                <TouchableOpacity
                    style={styles.upgradeButton}
                    onPress={() => handleNavigation('Subscription')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.upgradeButtonText}>Upgrade Membership</Text>
                </TouchableOpacity>



                {/* Menu Items */}
                <View style={styles.menuSection}>
                    <MenuItem
                        styles={styles}
                        icon="account-edit-outline"
                        label="Edit Profile"
                        onPress={() => handleNavigation('EditProfile')}
                    />
                    <MenuItem
                        styles={styles}
                        icon="account-heart-outline"
                        label="Partner Preferences"
                        onPress={() => handleNavigation('PartnerPreferences')}
                    />
                    <MenuItem
                        styles={styles}
                        icon="image-multiple"
                        label="Photo Album"
                        onPress={() => handleNavigation('PhotoManagement')}
                    />
                    <MenuItem
                        styles={styles}
                        icon="cog-outline"
                        label="Account & Settings"
                        onPress={() => handleNavigation('Settings')}
                    />
                    <MenuItem
                        styles={styles}
                        icon="help-circle-outline"
                        label="Help & Support"
                        onPress={() => handleNavigation('Help')}
                    />
                    <MenuItem
                        styles={styles}
                        icon="shield-lock-outline"
                        label="Privacy Policy"
                        onPress={() => handleNavigation('Privacy')}
                    />
                </View>

                {/* Spacer */}
                <View style={styles.spacer} />

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.6}
                >
                    <Icon name="logout" size={24} color={theme.colors.error} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

interface MenuItemProps {
    icon: string;
    label: string;
    onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps & { styles: any }> = ({ icon, label, onPress, styles }) => (
    <TouchableOpacity
        style={styles.menuItem}
        onPress={onPress}
        activeOpacity={0.6}
    >
        <Icon name={icon} size={24} color="#666" />
        <Text style={styles.menuLabel}>{label}</Text>
        <Icon name="chevron-right" size={24} color="#CCC" />
    </TouchableOpacity>
);

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    profileSection: {
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 24,
        paddingHorizontal: 20,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f0f0f0',
        marginBottom: 16,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    profileId: {
        fontSize: 13,
        color: '#888',
    },
    upgradeButton: {
        backgroundColor: theme.colors.primary,
        marginHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 12,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    upgradeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    offerText: {
        fontSize: 11,
        color: '#999',
        textAlign: 'center',
        letterSpacing: 0.5,
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    menuSection: {
        paddingTop: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 28,
        gap: 16,
    },
    menuLabel: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    spacer: {
        flex: 1,
        minHeight: 100,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 28,
        marginBottom: 40,
        gap: 16,
    },
    logoutText: {
        fontSize: 16,
        color: theme.colors.error,
        fontWeight: '600',
    },
    viewProfileText: {
        fontSize: 12,
        color: theme.colors.primary,
        marginTop: 8,
        fontWeight: '500',
    },
});

export default CustomDrawerContent;
