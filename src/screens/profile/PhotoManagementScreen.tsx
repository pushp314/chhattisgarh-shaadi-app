import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Image,
    Alert,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import {
    Text,
    Button,
    Surface,
    ActivityIndicator,
    IconButton,
    FAB,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProfileStackParamList } from '../../navigation/types';
import { useProfileStore } from '../../store/profileStore';
import profileService from '../../services/profile.service';

type PhotoManagementScreenNavigationProp = NativeStackNavigationProp<
    ProfileStackParamList,
    'PhotoManagement'
>;

type Props = {
    navigation: PhotoManagementScreenNavigationProp;
};

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 48) / 3; // 3 photos per row
const MAX_PHOTOS = 6;

const PhotoManagementScreen: React.FC<Props> = ({ navigation }) => {
    const { profile, fetchProfile } = useProfileStore();
    const [isUploading, setIsUploading] = useState(false);
    const [deletingPhotoId, setDeletingPhotoId] = useState<number | null>(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            await fetchProfile();
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    const handlePickImage = async () => {
        if (!profile) return;

        const currentPhotoCount = profile.media?.length || 0;
        if (currentPhotoCount >= MAX_PHOTOS) {
            Alert.alert(
                'Maximum Photos Reached',
                `You can only upload up to ${MAX_PHOTOS} photos.`,
            );
            return;
        }

        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.8,
                selectionLimit: Math.min(MAX_PHOTOS - currentPhotoCount, 3),
            });

            if (result.didCancel) {
                return;
            }

            if (result.errorCode) {
                Alert.alert('Error', result.errorMessage || 'Failed to pick image');
                return;
            }

            if (result.assets && result.assets.length > 0) {
                await uploadPhotos(result.assets.map((asset: any) => asset.uri!));
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const uploadPhotos = async (photoUris: string[]) => {
        setIsUploading(true);
        try {
            if (photoUris.length === 1) {
                await profileService.uploadProfilePhoto(photoUris[0]);
            } else {
                await profileService.uploadProfilePhotos(photoUris);
            }

            Alert.alert('Success', 'Photos uploaded successfully');
            await loadProfile();
        } catch (error: any) {
            console.error('Error uploading photos:', error);
            Alert.alert(
                'Upload Failed',
                error.response?.data?.message || 'Failed to upload photos',
            );
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeletePhoto = async (mediaId: number) => {
        Alert.alert(
            'Delete Photo',
            'Are you sure you want to delete this photo?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setDeletingPhotoId(mediaId);
                        try {
                            await profileService.deletePhoto(mediaId);
                            Alert.alert('Success', 'Photo deleted successfully');
                            await loadProfile();
                        } catch (error: any) {
                            console.error('Error deleting photo:', error);
                            Alert.alert(
                                'Delete Failed',
                                error.response?.data?.message || 'Failed to delete photo',
                            );
                        } finally {
                            setDeletingPhotoId(null);
                        }
                    },
                },
            ],
        );
    };

    const renderPhotoGrid = () => {
        const photos = profile?.media || [];

        return (
            <View style={styles.photoGrid}>
                {photos.map((photo, index) => (
                    <Surface key={photo.id} style={styles.photoContainer} elevation={2}>
                        <Image source={{ uri: photo.url }} style={styles.photo} />
                        {index === 0 && (
                            <View style={styles.primaryBadge}>
                                <Text style={styles.primaryText}>Primary</Text>
                            </View>
                        )}
                        <IconButton
                            icon="delete"
                            size={20}
                            iconColor="#fff"
                            style={styles.deleteButton}
                            onPress={() => handleDeletePhoto(photo.id)}
                            disabled={deletingPhotoId === photo.id}
                        />
                        {deletingPhotoId === photo.id && (
                            <View style={styles.deletingOverlay}>
                                <ActivityIndicator size="small" color="#fff" />
                            </View>
                        )}
                    </Surface>
                ))}

                {/* Empty slots */}
                {Array.from({ length: MAX_PHOTOS - photos.length }).map((_, index) => (
                    <Surface
                        key={`empty-${index}`}
                        style={[styles.photoContainer, styles.emptyPhoto]}
                        elevation={1}>
                        <Icon name="image-plus" size={40} color="#ccc" />
                    </Surface>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Surface style={styles.infoCard} elevation={1}>
                    <Icon name="information" size={24} color="#D81B60" />
                    <View style={styles.infoContent}>
                        <Text variant="titleSmall" style={styles.infoTitle}>
                            Photo Guidelines
                        </Text>
                        <Text variant="bodySmall" style={styles.infoText}>
                            • Upload up to {MAX_PHOTOS} photos{'\n'}
                            • First photo will be your primary photo{'\n'}
                            • Use clear, recent photos{'\n'}
                            • Avoid group photos
                        </Text>
                    </View>
                </Surface>

                <Text variant="titleMedium" style={styles.sectionTitle}>
                    Your Photos ({profile?.media?.length || 0}/{MAX_PHOTOS})
                </Text>

                {renderPhotoGrid()}

                {isUploading && (
                    <View style={styles.uploadingContainer}>
                        <ActivityIndicator size="large" color="#D81B60" />
                        <Text style={styles.uploadingText}>Uploading photos...</Text>
                    </View>
                )}
            </ScrollView>

            <FAB
                icon="camera"
                label="Add Photos"
                style={styles.fab}
                onPress={handlePickImage}
                disabled={isUploading || (profile?.media?.length || 0) >= MAX_PHOTOS}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 16,
        paddingBottom: 80,
    },
    infoCard: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#FFF3F8',
        marginBottom: 24,
        gap: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontWeight: 'bold',
        color: '#D81B60',
        marginBottom: 8,
    },
    infoText: {
        color: '#666',
        lineHeight: 20,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 16,
    },
    photoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    photoContainer: {
        width: PHOTO_SIZE,
        height: PHOTO_SIZE,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#fff',
        position: 'relative',
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    emptyPhoto: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    primaryBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#4CAF50',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    primaryText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    deleteButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    deletingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadingContainer: {
        marginTop: 24,
        alignItems: 'center',
    },
    uploadingText: {
        marginTop: 8,
        color: '#666',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#D81B60',
    },
});

export default PhotoManagementScreen;
