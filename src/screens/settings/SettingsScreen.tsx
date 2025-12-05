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
import LinearGradient from 'react-native-linear-gradient';

type SettingsScreenNavigationProp = NativeStackNavigationProp<any>;

type Props = {
    navigation: SettingsScreenNavigationProp;
};

// Reusable Icon Components to prevent re-renders
const EyeIcon = (props: any) => <List.Icon {...props} icon="eye" color={Theme.colors.textSecondary} />;
const ChevronRightIcon = (props: any) => <List.Icon {...props} icon="chevron-right" />;
const AccountDetailsIcon = (props: any) => <List.Icon {...props} icon="account-details" color={Theme.colors.textSecondary} />;
const MagnifyIcon = (props: any) => <List.Icon {...props} icon="magnify" color={Theme.colors.textSecondary} />;
const LightbulbIcon = (props: any) => <List.Icon {...props} icon="lightbulb" color={Theme.colors.textSecondary} />;
const HeartIcon = (props: any) => <List.Icon {...props} icon="heart" color={Theme.colors.textSecondary} />;
const MessageIcon = (props: any) => <List.Icon {...props} icon="message" color={Theme.colors.textSecondary} />;
const EmailIcon = (props: any) => <List.Icon {...props} icon="email" color={Theme.colors.textSecondary} />;
const CellphoneIcon = (props: any) => <List.Icon {...props} icon="cellphone" color={Theme.colors.textSecondary} />;
const AccountEditIcon = (props: any) => <List.Icon {...props} icon="account-edit" color={Theme.colors.textSecondary} />;
const HeartSettingsIcon = (props: any) => <List.Icon {...props} icon="heart-settings" color={Theme.colors.textSecondary} />;
const SchoolIcon = (props: any) => <List.Icon {...props} icon="school" color={Theme.colors.textSecondary} />;
const BriefcaseIcon = (props: any) => <List.Icon {...props} icon="briefcase" color={Theme.colors.textSecondary} />;
const ImageLockIcon = (props: any) => <List.Icon {...props} icon="image-lock" color={Theme.colors.textSecondary} />;
const ImageMultipleIcon = (props: any) => <List.Icon {...props} icon="image-multiple" color={Theme.colors.textSecondary} />;
const AccountCancelIcon = (props: any) => <List.Icon {...props} icon="account-cancel" color={Theme.colors.textSecondary} />;
const AccountMultipleIcon = (props: any) => <List.Icon {...props} icon="account-multiple" color={Theme.colors.textSecondary} />;
const HeartMultipleIcon = (props: any) => <List.Icon {...props} icon="heart-multiple" color={Theme.colors.textSecondary} />;
const HelpCircleIcon = (props: any) => <List.Icon {...props} icon="help-circle" color={Theme.colors.textSecondary} />;
const InformationIcon = (props: any) => <List.Icon {...props} icon="information" color={Theme.colors.textSecondary} />;

type SettingsSwitchItemProps = {
    title: string;
    description: string;
    left: (props: any) => React.ReactNode;
    value: boolean;
    onValueChange: (value: boolean) => void;
};

const SettingsSwitchItem = React.memo(({ title, description, left, value, onValueChange }: SettingsSwitchItemProps) => (
    <List.Item
        title={title}
        description={description}
        left={left}
        // eslint-disable-next-line react/no-unstable-nested-components
        right={() => (
            <Switch
                value={value}
                onValueChange={onValueChange}
                color={Theme.colors.primary}
                trackColor={{ false: Theme.colors.border, true: Theme.colors.primaryLight }}
            />
        )}
    />
));

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
    const { logout } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    // Accordion expanded states
    const [privacyExpanded, setPrivacyExpanded] = useState(false); // Start collapsed
    const [notificationExpanded, setNotificationExpanded] = useState(false);
    const [accountExpanded, setAccountExpanded] = useState(false);

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
            {/* Privacy Settings Accordion */}
            <List.Accordion
                title="Privacy Settings"
                description="Control who can see your profile"
                left={props => <List.Icon {...props} icon="shield-account" color={Theme.colors.primary} />}
                expanded={privacyExpanded}
                onPress={() => setPrivacyExpanded(!privacyExpanded)}
                style={styles.accordion}
                titleStyle={styles.accordionTitle}
                descriptionStyle={styles.accordionDescription}
            >
                <View style={styles.accordionContent}>
                    <List.Item
                        title="Profile Visibility"
                        description={profileVisibility}
                        left={EyeIcon}
                        right={ChevronRightIcon}
                        onPress={() => {
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

                    <SettingsSwitchItem
                        title="Show Last Name"
                        description="Display your last name on profile"
                        left={AccountDetailsIcon}
                        value={showLastName}
                        onValueChange={setShowLastName}
                    />

                    <SettingsSwitchItem
                        title="Show in Search"
                        description="Appear in search results"
                        left={MagnifyIcon}
                        value={showInSearch}
                        onValueChange={setShowInSearch}
                    />

                    <SettingsSwitchItem
                        title="Show in Suggestions"
                        description="Appear in match suggestions"
                        left={LightbulbIcon}
                        value={showInSuggestions}
                        onValueChange={setShowInSuggestions}
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
                </View>
            </List.Accordion>

            {/* Notification Settings Accordion */}
            <List.Accordion
                title="Notification Settings"
                description="Manage your notification preferences"
                left={props => <List.Icon {...props} icon="bell" color={Theme.colors.primary} />}
                expanded={notificationExpanded}
                onPress={() => setNotificationExpanded(!notificationExpanded)}
                style={styles.accordion}
                titleStyle={styles.accordionTitle}
                descriptionStyle={styles.accordionDescription}
            >
                <View style={styles.accordionContent}>
                    <SettingsSwitchItem
                        title="Match Requests"
                        description="Get notified about new match requests"
                        left={HeartIcon}
                        value={matchRequestNotif}
                        onValueChange={setMatchRequestNotif}
                    />

                    <SettingsSwitchItem
                        title="Messages"
                        description="Get notified about new messages"
                        left={MessageIcon}
                        value={messageNotif}
                        onValueChange={setMessageNotif}
                    />

                    <SettingsSwitchItem
                        title="Profile Views"
                        description="Get notified when someone views your profile"
                        left={EyeIcon}
                        value={profileViewNotif}
                        onValueChange={setProfileViewNotif}
                    />

                    <SettingsSwitchItem
                        title="Email Notifications"
                        description="Receive notifications via email"
                        left={EmailIcon}
                        value={emailNotif}
                        onValueChange={setEmailNotif}
                    />

                    <SettingsSwitchItem
                        title="Push Notifications"
                        description="Receive push notifications"
                        left={CellphoneIcon}
                        value={pushNotif}
                        onValueChange={setPushNotif}
                    />

                    <Button
                        mode="contained"
                        onPress={saveNotificationSettings}
                        loading={isSaving}
                        disabled={isSaving}
                        style={styles.saveButton}
                        buttonColor={Theme.colors.primary}
                        textColor={Theme.colors.white}>
                        Save Notification Settings
                    </Button>
                </View>
            </List.Accordion>

            {/* Account Settings Accordion */}
            <List.Accordion
                title="Account Settings"
                description="Manage your account and profile"
                left={props => <List.Icon {...props} icon="account-cog" color={Theme.colors.primary} />}
                expanded={accountExpanded}
                onPress={() => setAccountExpanded(!accountExpanded)}
                style={styles.accordion}
                titleStyle={styles.accordionTitle}
                descriptionStyle={styles.accordionDescription}
            >
                <View style={styles.accordionContent}>
                    <List.Item
                        title="Verify Phone Number"
                        description="Verify your phone for better security"
                        left={(props: any) => <List.Icon {...props} icon="cellphone-check" color={Theme.colors.textSecondary} />}
                        right={ChevronRightIcon}
                        onPress={() => navigation.navigate('PhoneVerification')}
                    />

                    <List.Item
                        title="Preview My Profile"
                        description="See how your profile looks to others"
                        left={(props: any) => <List.Icon {...props} icon="eye-outline" color={Theme.colors.textSecondary} />}
                        right={ChevronRightIcon}
                        onPress={() => {
                            const { user } = useAuthStore.getState();
                            if (user?.id) {
                                navigation.navigate('ProfileDetails', { userId: user.id });
                            } else {
                                Alert.alert('Error', 'Unable to load profile');
                            }
                        }}
                    />

                    <List.Item
                        title="Edit Profile"
                        description="Update your profile information"
                        left={AccountEditIcon}
                        right={ChevronRightIcon}
                        onPress={() => navigation.navigate('EditProfile')}
                    />

                    <List.Item
                        title="Partner Preferences"
                        description="Set your match preferences"
                        left={HeartSettingsIcon}
                        right={ChevronRightIcon}
                        onPress={() => navigation.navigate('PartnerPreferences')}
                    />

                    <List.Item
                        title="Education Management"
                        description="Manage your education records"
                        left={SchoolIcon}
                        right={ChevronRightIcon}
                        onPress={() => navigation.navigate('EducationManagement')}
                    />

                    <List.Item
                        title="Occupation Management"
                        description="Manage your professional details"
                        left={BriefcaseIcon}
                        right={ChevronRightIcon}
                        onPress={() => navigation.navigate('OccupationManagement')}
                    />

                    <List.Item
                        title="Photo Privacy"
                        description="Manage photo privacy settings"
                        left={ImageLockIcon}
                        right={ChevronRightIcon}
                        onPress={() => navigation.navigate('PhotoPrivacy')}
                    />

                    <List.Item
                        title="Photo Requests"
                        description="Manage photo view requests"
                        left={ImageMultipleIcon}
                        right={ChevronRightIcon}
                        onPress={() => navigation.navigate('PhotoRequests')}
                    />

                    <List.Item
                        title="Blocked Users"
                        description="Manage blocked profiles"
                        left={AccountCancelIcon}
                        right={ChevronRightIcon}
                        onPress={() => navigation.navigate('BlockedUsers')}
                    />

                    <List.Item
                        title="Contact Requests"
                        description="Manage contact requests"
                        left={AccountMultipleIcon}
                        right={ChevronRightIcon}
                        onPress={() => navigation.navigate('ContactRequests')}
                    />

                    <List.Item
                        title="Match Requests"
                        description="Manage match requests"
                        left={HeartMultipleIcon}
                        right={ChevronRightIcon}
                        onPress={() => navigation.navigate('MatchRequests')}
                    />

                    <List.Item
                        title="Help & Support"
                        description="Get help or contact support"
                        left={HelpCircleIcon}
                        right={ChevronRightIcon}
                        onPress={() => {
                            Alert.alert('Help & Support', 'For support, please email: support@chhattisgarhshaadi.com');
                        }}
                    />

                    <List.Item
                        title="About"
                        description="App version and information"
                        left={InformationIcon}
                        right={ChevronRightIcon}
                        onPress={() => {
                            Alert.alert('About', 'Chhattisgarh Shaadi\nVersion 1.0.0\n\nA premium matrimonial platform for Chhattisgarh community.');
                        }}
                    />
                </View>
            </List.Accordion>

            {/* Danger Zone - Always visible at bottom */}
            <View style={styles.dangerZone}>
                <Text style={styles.dangerZoneTitle}>Danger Zone</Text>

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
            </View>

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
                    <Dialog.Title style={styles.dialogTitle}>⚠️ Delete Account</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium" style={styles.warningText}>
                            This action is <Text style={styles.permanentText}>permanent and cannot be undone</Text>.
                        </Text>
                        <Text variant="bodyMedium" style={styles.listHeader}>
                            You will lose:
                        </Text>
                        <Text variant="bodySmall" style={styles.listItem}>• All your profile information</Text>
                        <Text variant="bodySmall" style={styles.listItem}>• All your photos and media</Text>
                        <Text variant="bodySmall" style={styles.listItem}>• All your matches and connections</Text>
                        <Text variant="bodySmall" style={styles.listItem}>• All your messages and conversations</Text>
                        <Text variant="bodySmall" style={styles.listItem}>• Your subscription (no refund)</Text>
                        <Text variant="bodySmall" style={styles.lastListItem}>• All other account data</Text>

                        <Text variant="bodyMedium" style={styles.inputLabel}>
                            Type "DELETE" to confirm:
                        </Text>
                        <TextInput
                            value={deleteConfirmText}
                            onChangeText={setDeleteConfirmText}
                            mode="outlined"
                            placeholder="Type DELETE here"
                            style={styles.input}
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
        marginTop: 12,
        color: Theme.colors.textSecondary,
    },
    section: {
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 4,
        borderRadius: 12,
        backgroundColor: Theme.colors.white,
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    sectionTitle: {
        color: Theme.colors.text,
        fontWeight: '600',
    },
    sectionHeaderGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    sectionTitleGradient: {
        color: Theme.colors.white,
        fontWeight: '600',
        fontSize: 18,
    },
    divider: {
        marginBottom: 16,
        backgroundColor: Theme.colors.surfaceCard,
    },
    saveButton: {
        marginTop: 16,
        marginHorizontal: 8,
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
    dialogTitle: {
        color: Theme.colors.primary,
    },
    warningText: {
        marginBottom: 16,
        lineHeight: 24,
    },
    permanentText: {
        fontWeight: 'bold',
        color: Theme.colors.primary,
    },
    listHeader: {
        marginBottom: 8,
        fontWeight: 'bold',
    },
    listItem: {
        marginLeft: 16,
        marginBottom: 4,
    },
    lastListItem: {
        marginLeft: 16,
        marginBottom: 16,
    },
    inputLabel: {
        marginBottom: 8,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 8,
    },
    // Accordion styles
    accordion: {
        backgroundColor: Theme.colors.white,
        marginHorizontal: 12,
        marginTop: 12,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 1,
    },
    accordionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Theme.colors.text,
    },
    accordionDescription: {
        fontSize: 12,
        color: Theme.colors.textSecondary,
    },
    accordionContent: {
        paddingHorizontal: 0,
        paddingBottom: 8,
        backgroundColor: Theme.colors.white,
    },
    // Danger Zone styles
    dangerZone: {
        marginHorizontal: 12,
        marginTop: 24,
        marginBottom: 24,
        padding: 16,
        backgroundColor: Theme.colors.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFE5E5',
    },
    dangerZoneTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Theme.colors.primary,
        marginBottom: 12,
    },
});

export default SettingsScreen;
