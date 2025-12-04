import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Surface } from 'react-native-paper';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { Theme } from '../../constants/theme';

const ProfileDetailsSkeleton: React.FC = () => {
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Skeleton */}
                <View style={styles.header}>
                    <LoadingSkeleton width="100%" height={200} borderRadius={0} />
                </View>

                <View style={styles.content}>
                    {/* Profile Image Area */}
                    <View style={styles.profileImageContainer}>
                        <Surface style={styles.profileImageSurface} elevation={4}>
                            <LoadingSkeleton width={120} height={120} borderRadius={60} />
                        </Surface>
                    </View>

                    {/* Basic Info */}
                    <View style={styles.basicInfo}>
                        <LoadingSkeleton width="60%" height={28} style={styles.centerSkeleton} />
                        <LoadingSkeleton width="40%" height={16} style={styles.centerSkeleton} />
                        <LoadingSkeleton width="50%" height={16} style={styles.centerSkeleton} />
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        <LoadingSkeleton width={60} height={60} borderRadius={30} />
                        <LoadingSkeleton width={60} height={60} borderRadius={30} />
                        <LoadingSkeleton width={60} height={60} borderRadius={30} />
                        <LoadingSkeleton width={60} height={60} borderRadius={30} />
                    </View>

                    {/* Sections */}
                    {[1, 2, 3].map((i) => (
                        <Surface key={i} style={styles.section} elevation={1}>
                            <LoadingSkeleton width="40%" height={20} style={styles.sectionTitle} />
                            <View style={styles.row}>
                                <LoadingSkeleton width="30%" height={16} />
                                <LoadingSkeleton width="60%" height={16} />
                            </View>
                            <View style={styles.row}>
                                <LoadingSkeleton width="30%" height={16} />
                                <LoadingSkeleton width="50%" height={16} />
                            </View>
                            <View style={styles.row}>
                                <LoadingSkeleton width="30%" height={16} />
                                <LoadingSkeleton width="40%" height={16} />
                            </View>
                        </Surface>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    header: {
        height: 200,
        marginBottom: 60, // Space for overlapping image
    },
    content: {
        paddingHorizontal: 16,
    },
    profileImageContainer: {
        alignItems: 'center',
        marginTop: -100, // Overlap header
        marginBottom: 16,
    },
    profileImageSurface: {
        borderRadius: 60,
        padding: 4,
        backgroundColor: Theme.colors.white,
    },
    basicInfo: {
        alignItems: 'center',
        gap: 8,
        marginBottom: 24,
    },
    centerSkeleton: {
        marginBottom: 8,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 24,
    },
    section: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: Theme.colors.white,
        marginBottom: 16,
    },
    sectionTitle: {
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
});

export default ProfileDetailsSkeleton;
