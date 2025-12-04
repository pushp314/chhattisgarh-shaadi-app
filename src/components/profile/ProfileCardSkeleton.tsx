import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import LoadingSkeleton from '../common/LoadingSkeleton';

const ProfileCardSkeleton: React.FC = () => {
    return (
        <Surface style={styles.card} elevation={2}>
            {/* Profile Image Skeleton - Aspect Ratio 4:5 */}
            <View style={styles.imageContainer}>
                <LoadingSkeleton width="100%" height="100%" borderRadius={0} />
            </View>

            <View style={styles.content}>
                {/* Name Skeleton */}
                <LoadingSkeleton width="60%" height={24} style={styles.nameSkeleton} />

                {/* Details Row 1 */}
                <View style={styles.detailsRow}>
                    <LoadingSkeleton width="30%" height={24} borderRadius={8} />
                    <LoadingSkeleton width="40%" height={24} borderRadius={8} />
                </View>

                {/* Details Row 2 */}
                <View style={styles.detailsRow}>
                    <LoadingSkeleton width="35%" height={24} borderRadius={8} />
                    <LoadingSkeleton width="25%" height={24} borderRadius={8} />
                </View>

                {/* Tags Skeleton */}
                <View style={styles.tagsContainer}>
                    <LoadingSkeleton width={60} height={28} borderRadius={8} />
                    <LoadingSkeleton width={80} height={28} borderRadius={8} />
                    <LoadingSkeleton width={70} height={28} borderRadius={8} />
                </View>
            </View>
        </Surface>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#fff',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 4 / 5,
        backgroundColor: '#f0f0f0',
    },
    content: {
        padding: 16,
    },
    nameSkeleton: {
        marginBottom: 12,
    },
    detailsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
});

export default ProfileCardSkeleton;
