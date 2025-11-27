import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import LoadingSkeleton from '../common/LoadingSkeleton';

const ProfileCardSkeleton: React.FC = () => {
    return (
        <Surface style={styles.card} elevation={2}>
            {/* Profile Image Skeleton */}
            <LoadingSkeleton width="100%" height={200} borderRadius={8} />

            <View style={styles.content}>
                {/* Name Skeleton */}
                <LoadingSkeleton width="60%" height={24} style={styles.nameSkeleton} />

                {/* Age & Location Skeleton */}
                <LoadingSkeleton width="80%" height={16} style={styles.infoSkeleton} />

                {/* Details Skeleton */}
                <View style={styles.detailsContainer}>
                    <LoadingSkeleton width="45%" height={14} style={styles.detailSkeleton} />
                    <LoadingSkeleton width="45%" height={14} style={styles.detailSkeleton} />
                </View>

                {/* Bio Skeleton */}
                <View style={styles.bioContainer}>
                    <LoadingSkeleton width="100%" height={12} style={styles.bioLine} />
                    <LoadingSkeleton width="90%" height={12} style={styles.bioLine} />
                </View>

                {/* Action Buttons Skeleton */}
                <View style={styles.actionsContainer}>
                    <LoadingSkeleton width="48%" height={40} borderRadius={20} />
                    <LoadingSkeleton width="48%" height={40} borderRadius={20} />
                </View>
            </View>
        </Surface>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    content: {
        padding: 16,
    },
    nameSkeleton: {
        marginBottom: 8,
    },
    infoSkeleton: {
        marginBottom: 12,
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    detailSkeleton: {
        marginBottom: 4,
    },
    bioContainer: {
        marginBottom: 16,
    },
    bioLine: {
        marginBottom: 6,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default ProfileCardSkeleton;
