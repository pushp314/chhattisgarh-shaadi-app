/**
 * Photo Grid Component
 * Photo management grid for profile editing
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';

interface Photo {
    id: string;
    url: string;
}

interface PhotoGridProps {
    photos: Photo[];
    maxPhotos?: number;
    onAddPhoto: () => void;
    onRemovePhoto: (id: string) => void;
    onPhotoPress?: (photo: Photo) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({
    photos,
    maxPhotos = 6,
    onAddPhoto,
    onRemovePhoto,
    onPhotoPress,
}) => {
    const emptySlots = maxPhotos - photos.length;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile Photos</Text>
            <View style={styles.grid}>
                {photos.map((photo) => (
                    <View key={photo.id} style={styles.photoContainer}>
                        <TouchableOpacity
                            onPress={() => onPhotoPress?.(photo)}
                            activeOpacity={0.8}
                        >
                            <Image source={{ uri: photo.url }} style={styles.photo} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => onRemovePhoto(photo.id)}
                        >
                            <Icon name="close-circle" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ))}

                {emptySlots > 0 && (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={onAddPhoto}
                        activeOpacity={0.7}
                    >
                        <Icon name="plus" size={32} color={Theme.colors.primary} />
                        <Text style={styles.addText}>Add Photo</Text>
                    </TouchableOpacity>
                )}

                {Array.from({ length: emptySlots - 1 }).map((_, index) => (
                    <View key={`empty-${index}`} style={styles.emptySlot} />
                ))}
            </View>
            <Text style={styles.hint}>
                Add up to {maxPhotos} photos • {photos.length}/{maxPhotos} added
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    photoContainer: {
        position: 'relative',
        width: '30%',
        aspectRatio: 1,
    },
    photo: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
    },
    removeButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: Theme.colors.primary,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },
    addButton: {
        width: '30%',
        aspectRatio: 1,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Theme.colors.primary,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF5F8',
    },
    addText: {
        fontSize: 12,
        color: Theme.colors.primary,
        marginTop: 4,
        fontWeight: '500',
    },
    emptySlot: {
        width: '30%',
        aspectRatio: 1,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
    },
    hint: {
        fontSize: 12,
        color: '#999',
        marginTop: 12,
        textAlign: 'center',
    },
});

export default PhotoGrid;
