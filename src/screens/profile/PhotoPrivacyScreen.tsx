/**
 * Photo Privacy Screen
 * Manage privacy settings for profile photos
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Image,
    Alert,
    ScrollView,
} from 'react-native';
import {
    Text,
    Surface,
    Button,
    ActivityIndicator,
    RadioButton,
    Switch,
    Divider,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';
import privacyService from '../../services/privacy.service';
import { useProfileStore } from '../../store/profileStore';
import ErrorState from '../../components/common/ErrorState';

type PhotoPrivacyScreenNavigationProp = NativeStackNavigationProp<any>;

type Props = {
    navigation: PhotoPrivacyScreenNavigationProp;
};

type PhotoVisibility = 'REGISTERED' | 'MATCHED' | 'HIDDEN';

const PhotoPrivacyScreen: React.FC<Props> = ({ navigation }) => {
    const { profile } = useProfileStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Photo-specific settings
    const [photoSettings, setPhotoSettings] = useState<{
        [key: number]: {
            visibility: PhotoVisibility;
        };
    }>({});

    // Global settings
    const [defaultVisibility, setDefaultVisibility] = useState<PhotoVisibility>('REGISTERED');
    const [requireVerification, setRequireVerification] = useState(true);
    const [blurForNonMatched, setBlurForNonMatched] = useState(false);

    useEffect(() => {
        loadPhotoSettings();
    }, []);

    const loadPhotoSettings = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Load settings for each photo
            if (profile?.media && profile.media.length > 0) {
                const settings: typeof photoSettings = {};

                for (const media of profile.media) {
                    try {
                        const privacySettings = await privacyService.getPhotoPrivacy(media.id);
                        settings[media.id] = {
                            visibility: (privacySettings.visibility as PhotoVisibility) || 'REGISTERED',
                        };
                    } catch (err) {
                        // If settings don't exist, use defaults
                        settings[media.id] = {
                            visibility: 'REGISTERED',
                        };
                    }
                }

                setPhotoSettings(settings);
            }
        } catch (err: any) {
            console.error('Error loading photo settings:', err);
            setError(err.response?.data?.message || 'Failed to load photo settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSavePhotoSettings = async (mediaId: number) => {
        setIsSaving(true);
        try {
            await privacyService.updatePhotoPrivacy(mediaId, photoSettings[mediaId]);
            Alert.alert('Success', 'Photo privacy settings updated');
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to update settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleApplyToAll = () => {
        Alert.alert(
            'Apply to All Photos',
            'Apply current default settings to all photos?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Apply',
                    onPress: async () => {
                        setIsSaving(true);
                        try {
                            const updates = Object.keys(photoSettings).map(async (mediaId) => {
                                return privacyService.updatePhotoPrivacy(Number(mediaId), {
                                    visibility: defaultVisibility,
                                });
                            });
                            await Promise.all(updates);

                            // Update local state
                            const newSettings = { ...photoSettings };
                            Object.keys(newSettings).forEach(mediaId => {
                                newSettings[Number(mediaId)] = {
                                    visibility: defaultVisibility,
                                };
                            });
                            setPhotoSettings(newSettings);

                            Alert.alert('Success', 'Settings applied to all photos');
                        } catch (error: any) {
                            Alert.alert('Error', error.response?.data?.message || 'Failed to apply settings');
                        } finally {
                            setIsSaving(false);
                        }
                    },
                },
            ]
        );
    };

    const renderPhoto = ({ item }: { item: any }) => {
        const settings = photoSettings[item.id] || {
            visibility: 'REGISTERED',
        };

        return (
            <Surface style={styles.photoCard} elevation={2}>
                <Image source={{ uri: item.url }} style={styles.photo} />

                <View style={styles.photoSettings}>
                    <Text variant="titleSmall" style={styles.photoTitle}>
                        {item.isPrimary ? 'Primary Photo' : `Photo ${item.displayOrder || ''}`}
                    </Text>

                    {/* Visibility Setting */}
                    <View style={styles.settingSection}>
                        <Text variant="bodyMedium" style={styles.settingLabel}>
                            Who can view this photo?
                        </Text>
                        <RadioButton.Group
                            onValueChange={value => {
                                setPhotoSettings(prev => ({
                                    ...prev,
                                    [item.id]: { ...prev[item.id], visibility: value as PhotoVisibility },
                                }));
                            }}
                            value={settings.visibility}>
                            <View style={styles.radioOption}>
                                <RadioButton.Android value="REGISTERED" color={Theme.colors.secondary} />
                                <Text>Registered Users</Text>
                            </View>
                            <View style={styles.radioOption}>
                                <RadioButton.Android value="MATCHED" color={Theme.colors.secondary} />
                                <Text>Matched Users Only</Text>
                            </View>
                            <View style={styles.radioOption}>
                                <RadioButton.Android value="HIDDEN" color={Theme.colors.secondary} />
                                <Text>Hidden</Text>
                            </View>
                        </RadioButton.Group>
                    </View>



                    <Button
                        mode="contained"
                        onPress={() => handleSavePhotoSettings(item.id)}
                        loading={isSaving}
                        disabled={isSaving}
                        style={styles.saveButton}
                        buttonColor={Theme.colors.secondary}
                        textColor={Theme.colors.primaryDark}>
                        Save Settings
                    </Button>
                </View>
            </Surface>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Theme.colors.primary} />
                <Text style={styles.loadingText}>Loading photo settings...</Text>
            </View>
        );
    }

    if (error) {
        return <ErrorState message={error} onRetry={loadPhotoSettings} />;
    }

    if (!profile?.media || profile.media.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Icon name="image-off" size={64} color={Theme.colors.textSecondary} />
                <Text variant="titleLarge" style={styles.emptyTitle}>
                    No Photos
                </Text>
                <Text variant="bodyMedium" style={styles.emptyMessage}>
                    Upload photos to manage their privacy settings
                </Text>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('PhotoManagement')}
                    style={styles.uploadButton}
                    buttonColor={Theme.colors.secondary}
                    textColor={Theme.colors.primaryDark}>
                    Upload Photos
                </Button>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Global Settings */}
            <Surface style={styles.globalSettings} elevation={1}>
                <View style={styles.sectionHeader}>
                    <Icon name="cog" size={24} color={Theme.colors.primary} />
                    <Text variant="titleLarge" style={styles.sectionTitle}>
                        Default Settings
                    </Text>
                </View>
                <Divider style={styles.divider} />

                <Text variant="bodyMedium" style={styles.settingLabel}>
                    Default Visibility for New Photos
                </Text>
                <RadioButton.Group
                    onValueChange={value => setDefaultVisibility(value as PhotoVisibility)}
                    value={defaultVisibility}>
                    <View style={styles.radioOption}>
                        <RadioButton.Android value="REGISTERED" color={Theme.colors.secondary} />
                        <Text>Registered Users</Text>
                    </View>
                    <View style={styles.radioOption}>
                        <RadioButton.Android value="MATCHED" color={Theme.colors.secondary} />
                        <Text>Matched Users Only</Text>
                    </View>
                    <View style={styles.radioOption}>
                        <RadioButton.Android value="HIDDEN" color={Theme.colors.secondary} />
                        <Text>Hidden</Text>
                    </View>
                </RadioButton.Group>

                <View style={styles.switchRow}>
                    <View style={styles.switchLabel}>
                        <Icon name="shield-check" size={20} color={Theme.colors.textSecondary} />
                        <Text variant="bodyMedium">Require Verification to View</Text>
                    </View>
                    <Switch
                        value={requireVerification}
                        onValueChange={setRequireVerification}
                        color={Theme.colors.secondary}
                    />
                </View>

                <View style={styles.switchRow}>
                    <View style={styles.switchLabel}>
                        <Icon name="blur" size={20} color={Theme.colors.textSecondary} />
                        <Text variant="bodyMedium">Blur for Non-Matched Users</Text>
                    </View>
                    <Switch
                        value={blurForNonMatched}
                        onValueChange={setBlurForNonMatched}
                        color={Theme.colors.secondary}
                    />
                </View>

                <Button
                    mode="contained"
                    onPress={handleApplyToAll}
                    loading={isSaving}
                    disabled={isSaving}
                    style={styles.applyAllButton}
                    buttonColor={Theme.colors.secondary}
                    textColor={Theme.colors.primaryDark}
                    icon="check-all">
                    Apply to All Photos
                </Button>
            </Surface>

            {/* Individual Photo Settings */}
            <Text variant="titleMedium" style={styles.photosHeader}>
                Individual Photo Settings
            </Text>
            <FlatList
                data={profile.media}
                renderItem={renderPhoto}
                keyExtractor={item => item.id.toString()}
                scrollEnabled={false}
                contentContainerStyle={styles.photosList}
            />
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        backgroundColor: Theme.colors.background,
    },
    emptyTitle: {
        marginTop: 16,
        marginBottom: 8,
        color: Theme.colors.text,
    },
    emptyMessage: {
        textAlign: 'center',
        color: Theme.colors.textSecondary,
        marginBottom: 24,
    },
    uploadButton: {
        borderRadius: 8,
    },
    globalSettings: {
        margin: 16,
        padding: 16,
        borderRadius: 12,
        backgroundColor: Theme.colors.white,
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
    settingSection: {
        marginBottom: 16,
    },
    settingLabel: {
        marginBottom: 8,
        color: Theme.colors.text,
        fontWeight: '600',
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    switchLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    applyAllButton: {
        marginTop: 8,
        borderRadius: 8,
    },
    photosHeader: {
        marginHorizontal: 16,
        marginBottom: 12,
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    photosList: {
        paddingHorizontal: 16,
        paddingBottom: 32,
    },
    photoCard: {
        marginBottom: 16,
        borderRadius: 12,
        backgroundColor: Theme.colors.white,
        overflow: 'hidden',
    },
    photo: {
        width: '100%',
        height: 200,
        backgroundColor: Theme.colors.surfaceCard,
    },
    photoSettings: {
        padding: 16,
    },
    photoTitle: {
        fontWeight: 'bold',
        marginBottom: 16,
        color: Theme.colors.text,
    },
    saveButton: {
        marginTop: 8,
        borderRadius: 8,
    },
});

export default PhotoPrivacyScreen;
