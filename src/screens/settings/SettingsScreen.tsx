/**
 * Settings Screen
 * Comprehensive settings for Privacy, Notifications, and Account
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Alert,
} from 'react-native';
import {
    Text,
    Surface,
    List,
    Switch,
    Divider,
    Button,
    ActivityIndicator,
    Dialog,
    Portal,
    TextInput,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import privacyService from '../../services/privacy.service';
import notificationService from '../../services/notification.service';

type SettingsScreenNavigationProp = NativeStackNavigationProp<any>;

type Props = {
    navigation: SettingsScreenNavigationProp;
};

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
    const { logout } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    // Privacy Settings
    const [profileVisibility, setProfileVisibility] = useState<'PUBLIC' | 'REGISTERED' | 'MATCHED' | 'HIDDEN'>('REGISTERED');
    const [showLastName, setShowLastName] = useState(true);
    const [showEmail, setShowEmail] = useState<'PUBLIC' | 'REGISTERED' | 'MATCHED' | 'HIDDEN'>('MATCHED');
    const [showPhoneNumber, setShowPhoneNumber] = useState<'PUBLIC' | 'REGISTERED' | 'MATCHED' | 'HIDDEN'>('MATCHED');
    const [showInSearch, setShowInSearch] = useState(true);
    const [showInSuggestions, setShowInSuggestions] = useState(true);

    // Notification Settings
    const [matchRequestNotif, setMatchRequestNotif] = useState(true);
    const [messageNotif, setMessageNotif] = useState(true);
    const [profileViewNotif, setProfileViewNotif] = useState(true);
    const [emailNotif, setEmailNotif] = useState(true);
    const [pushNotif, setPushNotif] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setIsLoading(true);
        try {
            // Load privacy settings
            const profilePrivacy = await privacyService.getProfilePrivacy();
            if (profilePrivacy) {
                setProfileVisibility(profilePrivacy.profileVisibility || 'REGISTERED');
                setShowLastName(profilePrivacy.showLastName ?? true);
                setShowEmail(profilePrivacy.showEmail || 'MATCHED');
                setShowPhoneNumber(profilePrivacy.showPhoneNumber || 'MATCHED');
            }

            const searchSettings = await privacyService.getSearchVisibility();
            if (searchSettings) {
                setShowInSearch(searchSettings.showInSearch ?? true);
                setShowInSuggestions(searchSettings.showInSuggestions ?? true);
            }

            // Load notification settings
            const notifSettings = await notificationService.getSettings();
            if (notifSettings) {
                setMatchRequestNotif(notifSettings.matchRequests ?? true);
                setMessageNotif(notifSettings.messages ?? true);
                setProfileViewNotif(notifSettings.profileViews ?? true);
                setEmailNotif(notifSettings.email ?? true);
                setPushNotif(notifSettings.push ?? true);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const savePrivacySettings = async () => {
        setIsSaving(true);
        try {
            await privacyService.updateProfilePrivacy({
                profileVisibility,
                showLastName,
                showEmail,
                showPhoneNumber,
            });

            await privacyService.updateSearchVisibility({
                showInSearch,
                showInSuggestions,
            });

            Alert.alert('Success', 'Privacy settings saved successfully');
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to save privacy settings');
        } finally {
            setIsSaving(false);
        }
    };

    const saveNotificationSettings = async () => {
        setIsSaving(true);
        try {
            await notificationService.updateSettings({
                matchRequests: matchRequestNotif,
                messages: messageNotif,
                profileViews: profileViewNotif,
                email: emailNotif,
                push: pushNotif,
            });
            Alert.alert('Success', 'Notification settings saved successfully');
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to save notification settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setShowLogoutDialog(false);
            // Navigation will be handled by auth state change
        } catch (error) {
            Alert.alert('Error', 'Failed to logout');
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Theme.colors.primary} />
                <Text style={styles.loadingText}>Loading settings...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Privacy Settings */}
            <Surface style={styles.section} elevation={1}>
                <View style={styles.sectionHeader}>
                    <Icon name="shield-account" size={24} color={Theme.colors.primary} />
                    <Text variant="titleLarge" style={styles.sectionTitle}>
                        Privacy Settings
                    </Text>
                </View>
                <Divider style={styles.divider} />

                <List.Item
                    title="Profile Visibility"
                    description={profileVisibility}
                    left={props => <List.Icon {...props} icon="eye" color={Theme.colors.textSecondary} />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => {
                        // Show visibility picker dialog
                        Alert.alert(
                            'Profile Visibility',
                            'Choose who can see your profile',
                            [
                                { text: 'Public', onPress: () => setProfileVisibility('PUBLIC') },
                                { text: 'Registered Users', onPress: () => setProfileVisibility('REGISTERED') },
                                { text: 'Matched Only', onPress: () => setProfileVisibility('MATCHED') },
                                { text: 'Hidden', onPress: () => setProfileVisibility('HIDDEN') },
                                { text: 'Cancel', style: 'cancel' },
                            ]
                        );
                    }}
                />

                <List.Item
                    title="Show Last Name"
                    description="Display your last name on profile"
                    left={props => <List.Icon {...props} icon="account-details" color={Theme.colors.textSecondary} />}
                    right={() => (
                        <Switch
                            value={showLastName}
                            onValueChange={setShowLastName}
                            color={Theme.colors.secondary}
                        />
                    )}
                />

                <List.Item
                    title="Show in Search"
                    description="Appear in search results"
                    left={props => <List.Icon {...props} icon="magnify" color={Theme.colors.textSecondary} />}
                    right={() => (
                        <Switch
                            value={showInSearch}
                            onValueChange={setShowInSearch}
                            color={Theme.colors.secondary}
                        />
                    )}
                />

                <List.Item
                    title="Show in Suggestions"
                    description="Appear in match suggestions"
                    left={props => <List.Icon {...props} icon="lightbulb" color={Theme.colors.textSecondary} />}
                    right={() => (
                        <Switch
                            value={showInSuggestions}
                            onValueChange={setShowInSuggestions}
                            color={Theme.colors.secondary}
                        />
                    )}
                />

                <Button
                    mode="contained"
                    onPress={savePrivacySettings}
                    loading={isSaving}
                    disabled={isSaving}
                    style={styles.saveButton}
                    buttonColor={Theme.colors.secondary}
                    textColor={Theme.colors.primaryDark}>
                    Save Privacy Settings
                </Button>
            </Surface>

            {/* Notification Settings */}
            <Surface style={styles.section} elevation={1}>
                <View style={styles.sectionHeader}>
                    <Icon name="bell" size={24} color={Theme.colors.secondary} />
                    <Text variant="titleLarge" style={styles.sectionTitle}>
                        Notification Settings
                    </Text>
                </View>
                <Divider style={styles.divider} />

                <List.Item
                    title="Match Requests"
                    description="Get notified about new match requests"
                    left={props => <List.Icon {...props} icon="heart" color={Theme.colors.textSecondary} />}
                    right={() => (
                        <Switch
                            value={matchRequestNotif}
                            onValueChange={setMatchRequestNotif}
                            color={Theme.colors.secondary}
                        />
                    )}
                />

                <List.Item
                    title="Messages"
                    description="Get notified about new messages"
                    left={props => <List.Icon {...props} icon="message" color={Theme.colors.textSecondary} />}
                    right={() => (
                        <Switch
                            value={messageNotif}
                            onValueChange={setMessageNotif}
                            color={Theme.colors.secondary}
                        />
                    )}
                />

                <List.Item
                    title="Profile Views"
                    description="Get notified when someone views your profile"
                    left={props => <List.Icon {...props} icon="eye" color={Theme.colors.textSecondary} />}
                    right={() => (
                        <Switch
                            value={profileViewNotif}
                            onValueChange={setProfileViewNotif}
                            color={Theme.colors.secondary}
                        />
                    )}
                />

                <List.Item
                    title="Email Notifications"
                    description="Receive notifications via email"
                    left={props => <List.Icon {...props} icon="email" color={Theme.colors.textSecondary} />}
                    right={() => (
                        <Switch
                            value={emailNotif}
                            onValueChange={setEmailNotif}
                            color={Theme.colors.secondary}
                        />
                    )}
                />

                <List.Item
                    title="Push Notifications"
                    description="Receive push notifications"
                    left={props => <List.Icon {...props} icon="cellphone" color={Theme.colors.textSecondary} />}
                    right={() => (
                        <Switch
                            value={pushNotif}
                            onValueChange={setPushNotif}
                            color={Theme.colors.secondary}
                        />
                    )}
                />

                <Button
                    mode="contained"
                    onPress={saveNotificationSettings}
                    loading={isSaving}
                    disabled={isSaving}
                    style={styles.saveButton}
                    buttonColor={Theme.colors.secondary}
                    textColor={Theme.colors.primaryDark}>
                    Save Notification Settings
                </Button>
            </Surface>

            {/* Account Settings */}
            <Surface style={styles.section} elevation={1}>
                <View style={styles.sectionHeader}>
                    <Icon name="account-cog" size={24} color={Theme.colors.success} />
                    <Text variant="titleLarge" style={styles.sectionTitle}>
                        Account Settings
                    </Text>
                </View>
                <Divider style={styles.divider} />

                <List.Item
                    title="Edit Profile"
                    description="Update your profile information"
                    left={props => <List.Icon {...props} icon="account-edit" color={Theme.colors.textSecondary} />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => navigation.navigate('EditProfile')}
                />

                <List.Item
                    title="Partner Preferences"
                    description="Set your match preferences"
                    left={props => <List.Icon {...props} icon="heart-settings" color={Theme.colors.textSecondary} />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => navigation.navigate('PartnerPreferences')}
                />

                <List.Item
                    title="Education Management"
                    description="Manage your education records"
                    left={props => <List.Icon {...props} icon="school" color={Theme.colors.textSecondary} />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => navigation.navigate('EducationManagement')}
                />

                <List.Item
                    title="Occupation Management"
                    description="Manage your professional details"
                    left={props => <List.Icon {...props} icon="briefcase" color={Theme.colors.textSecondary} />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => navigation.navigate('OccupationManagement')}
                />

                <List.Item
                    title="Photo Privacy"
                    description="Manage photo privacy settings"
                    left={props => <List.Icon {...props} icon="image-lock" color={Theme.colors.textSecondary} />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => navigation.navigate('PhotoPrivacy')}
                />

                <List.Item
                    title="Photo Requests"
                    description="Manage photo view requests"
                    left={props => <List.Icon {...props} icon="image-multiple" color={Theme.colors.textSecondary} />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => navigation.navigate('PhotoRequests')}
                />

                <List.Item
                    title="Blocked Users"
                    description="Manage blocked profiles"
                    left={props => <List.Icon {...props} icon="account-cancel" color={Theme.colors.textSecondary} />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => navigation.navigate('BlockedUsers')}
                />

                <List.Item
                    title="Contact Requests"
                    description="Manage contact requests"
                    left={props => <List.Icon {...props} icon="account-multiple" color={Theme.colors.textSecondary} />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => navigation.navigate('ContactRequests')}
                />

                <List.Item
                    title="Match Requests"
                    description="Manage match requests"
                    left={props => <List.Icon {...props} icon="heart-multiple" color={Theme.colors.textSecondary} />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => navigation.navigate('MatchRequests')}
                />

                <List.Item
                    title="Help & Support"
                    description="Get help or contact support"
                    left={props => <List.Icon {...props} icon="help-circle" color={Theme.colors.textSecondary} />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => {
                        Alert.alert('Help & Support', 'For support, please email: support@chhattisgarhshaadi.com');
                    }}
                />

                <List.Item
                    title="About"
                    description="App version and information"
                    left={props => <List.Icon {...props} icon="information" color={Theme.colors.textSecondary} />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => {
                        Alert.alert('About', 'Chhattisgarh Shaadi\nVersion 1.0.0\n\nA premium matrimonial platform for Chhattisgarh community.');
                    }}
                />
            </Surface>

            {/* Danger Zone */}
            <Surface style={styles.section} elevation={1}>
                <View style={styles.sectionHeader}>
                    <Icon name="alert" size={24} color={Theme.colors.primary} />
                    <Text variant="titleLarge" style={styles.sectionTitle}>
                        Danger Zone
                    </Text>
                </View>
                <Divider style={styles.divider} />

                <Button
                    mode="outlined"
                    onPress={() => setShowLogoutDialog(true)}
                    style={styles.dangerButton}
                    textColor={Theme.colors.primary}
                    icon="logout">
                    Logout
                </Button>

                <Button
                    mode="outlined"
                    onPress={() => {
                        Alert.alert(
                            'Delete Account',
                            'Are you sure you want to delete your account? This action cannot be undone.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Delete',
                                    style: 'destructive',
                                    onPress: () => {
                                        Alert.alert('Coming Soon', 'Account deletion will be available soon. Please contact support.');
                                    },
                                },
                            ]
                        );
                    }}
                    style={styles.dangerButton}
                    textColor={Theme.colors.primary}
                    icon="delete">
                    Delete Account
                </Button>
            </Surface>

            {/* Logout Confirmation Dialog */}
            <Portal>
                <Dialog visible={showLogoutDialog} onDismiss={() => setShowLogoutDialog(false)}>
                    <Dialog.Title>Logout</Dialog.Title>
                    <Dialog.Content>
                        <Text>Are you sure you want to logout?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setShowLogoutDialog(false)}>Cancel</Button>
                        <Button
                            onPress={handleLogout}
                            textColor={Theme.colors.primary}>
                            Logout
                        </Button>
                    </Dialog.Actions>
                </Dialog>

                {/* Delete Account Confirmation Dialog */}
                <Dialog visible={showDeleteDialog} onDismiss={() => {
                    setShowDeleteDialog(false);
                    setDeleteConfirmText('');
                }}>
                    <Dialog.Title style={{ color: Theme.colors.primary }}>⚠️ Delete Account</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium" style={{ marginBottom: 16, lineHeight: 24 }}>
                            This action is <Text style={{ fontWeight: 'bold', color: Theme.colors.primary }}>permanent and cannot be undone</Text>.
                        </Text>
                        <Text variant="bodyMedium" style={{ marginBottom: 8, fontWeight: 'bold' }}>
                            You will lose:
                        </Text>
                        <Text variant="bodySmall" style={{ marginLeft: 16, marginBottom: 4 }}>• All your profile information</Text>
                        <Text variant="bodySmall" style={{ marginLeft: 16, marginBottom: 4 }}>• All your photos and media</Text>
                        <Text variant="bodySmall" style={{ marginLeft: 16, marginBottom: 4 }}>• All your matches and connections</Text>
                        <Text variant="bodySmall" style={{ marginLeft: 16, marginBottom: 4 }}>• All your messages and conversations</Text>
                        <Text variant="bodySmall" style={{ marginLeft: 16, marginBottom: 4 }}>• Your subscription (no refund)</Text>
                        <Text variant="bodySmall" style={{ marginLeft: 16, marginBottom: 16 }}>• All other account data</Text>

                        <Text variant="bodyMedium" style={{ marginBottom: 8, fontWeight: 'bold' }}>
                            Type "DELETE" to confirm:
                        </Text>
                        <TextInput
                            value={deleteConfirmText}
                            onChangeText={setDeleteConfirmText}
                            mode="outlined"
                            placeholder="Type DELETE here"
                            style={{ marginBottom: 8 }}
                            outlineColor={Theme.colors.border}
                            activeOutlineColor={Theme.colors.primary}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => {
                            setShowDeleteDialog(false);
                            setDeleteConfirmText('');
                        }}>
                            Cancel
                        </Button>
                        <Button
                            onPress={() => {
                                if (deleteConfirmText === 'DELETE') {
                                    Alert.alert(
                                        'Final Confirmation',
                                        'This is your last chance. Are you absolutely sure you want to delete your account?',
                                        [
                                            { text: 'No, Keep My Account', style: 'cancel' },
                                            {
                                                text: 'Yes, Delete Forever',
                                                style: 'destructive',
                                                onPress: () => {
                                                    setShowDeleteDialog(false);
                                                    setDeleteConfirmText('');
                                                    Alert.alert(
                                                        'Account Deletion',
                                                        'Please contact support at support@chhattisgarhshaadi.com to complete account deletion. We will process your request within 48 hours.'
                                                    );
                                                },
                                            },
                                        ]
                                    );
                                } else {
                                    Alert.alert('Confirmation Required', 'Please type "DELETE" to confirm account deletion.');
                                }
                            }}
                            disabled={deleteConfirmText !== 'DELETE'}
                            textColor={Theme.colors.primary}>
                            Delete Forever
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <View style={styles.bottomPadding} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Theme.colors.background,
    },
    loadingText: {
        marginTop: 16,
        color: Theme.colors.textSecondary,
    },
    section: {
        margin: 16,
        marginBottom: 0,
        padding: 16,
        borderRadius: 12,
        backgroundColor: Theme.colors.white,
        ...Theme.shadows.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    sectionTitle: {
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    divider: {
        marginVertical: 12,
        backgroundColor: Theme.colors.surfaceCard,
    },
    saveButton: {
        marginTop: 16,
        borderRadius: 8,
    },
    dangerButton: {
        marginTop: 8,
        borderRadius: 8,
        borderColor: Theme.colors.primary,
    },
    bottomPadding: {
        height: 32,
    },
});

export default SettingsScreen;
