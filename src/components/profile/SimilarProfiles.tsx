/**
 * Similar Profiles Component
 * Shows "You May Also Like" section
 */

import React from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';

interface SimilarProfile {
    id: number;
    userId: number;
    firstName: string;
    lastName?: string;
    age: number;
    city?: string;
    profilePicture?: string;
    isVerified?: boolean;
}

interface SimilarProfilesProps {
    profiles: SimilarProfile[];
    isLoading?: boolean;
    onProfilePress: (userId: number) => void;
    onSeeAll?: () => void;
}

const SimilarProfiles: React.FC<SimilarProfilesProps> = ({
    profiles,
    isLoading = false,
    onProfilePress,
    onSeeAll,
}) => {
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Theme.colors.primary} />
            </View>
        );
    }

    if (profiles.length === 0) {
        return null;
    }

    const renderProfile = ({ item }: { item: SimilarProfile }) => (
        <TouchableOpacity
            style={styles.profileCard}
            onPress={() => onProfilePress(item.userId)}
            activeOpacity={0.8}
        >
            <View style={styles.imageContainer}>
                {item.profilePicture ? (
                    <Image source={{ uri: item.profilePicture }} style={styles.profileImage} />
                ) : (
                    <View style={[styles.profileImage, styles.placeholderImage]}>
                        <Icon name="account" size={32} color="#999" />
                    </View>
                )}
                {item.isVerified && (
                    <View style={styles.verifiedBadge}>
                        <Icon name="check-decagram" size={14} color="#4285F4" />
                    </View>
                )}
            </View>
            <Text style={styles.profileName} numberOfLines={1}>
                {item.firstName} {item.lastName?.charAt(0)}.
            </Text>
            <Text style={styles.profileInfo}>
                {item.age} yrs{item.city ? ` • ${item.city}` : ''}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>You May Also Like</Text>
                <TouchableOpacity onPress={onSeeAll}>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={profiles}
                renderItem={renderProfile}
                keyExtractor={item => `similar-${item.id}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
    },
    loadingContainer: {
        padding: 32,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    seeAll: {
        fontSize: 14,
        fontWeight: '600',
        color: Theme.colors.primary,
    },
    listContent: {
        paddingHorizontal: 16,
    },
    profileCard: {
        width: 120,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 8,
    },
    profileImage: {
        width: 100,
        height: 120,
        borderRadius: 12,
    },
    placeholderImage: {
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 2,
    },
    profileName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    profileInfo: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginTop: 2,
    },
});

export default SimilarProfiles;
