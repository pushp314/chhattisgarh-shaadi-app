/**
 * Enhanced Match Card Component
 * Large, full-width profile card with comprehensive information and action buttons
 */

import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Text, Surface, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';
import { Profile } from '../../types';

const { width } = Dimensions.get('window');
const CARD_HEIGHT = width * 1.3; // Portrait aspect ratio

interface EnhancedMatchCardProps {
    profile: Profile;
    onInterest: () => void;
    onSuperInterest: () => void;
    onShortlist: () => void;
    onChat: () => void;
    onPress: () => void;
    isShortlisted?: boolean;
    canChat?: boolean;
}

const EnhancedMatchCard: React.FC<EnhancedMatchCardProps> = ({
    profile,
    onInterest,
    onSuperInterest,
    onShortlist,
    onChat,
    onPress,
    isShortlisted = false,
    canChat = false,
}) => {
    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const formatIncome = (income?: string) => {
        if (!income) return 'Not specified';
        return income;
    };

    const getActivityStatus = () => {
        // TODO: Calculate from lastActive field
        return 'Active Yesterday';
    };

    const photoCount = profile.media?.length || 0;
    const age = calculateAge(profile.dateOfBirth);

    return (
        <Surface style={styles.card} elevation={3}>
            <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
                {/* Profile Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: profile.media?.[0]?.url || 'https://via.placeholder.com/400x600' }}
                        style={styles.profileImage}
                        resizeMode="cover"
                    />

                    {/* Activity Status Badge */}
                    <View style={styles.activityBadge}>
                        <Icon name="circle" size={8} color={Theme.colors.success} />
                        <Text variant="labelSmall" style={styles.activityText}>
                            {getActivityStatus()}
                        </Text>
                    </View>

                    {/* Photo Count Badge */}
                    {photoCount > 0 && (
                        <View style={styles.photoCountBadge}>
                            <Icon name="camera" size={14} color={Theme.colors.white} />
                            <Text variant="labelSmall" style={styles.photoCountText}>
                                {photoCount}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Profile Information */}
                <View style={styles.infoContainer}>
                    {/* Name and Age */}
                    <Text variant="headlineSmall" style={styles.name}>
                        {profile.firstName}, {age}
                    </Text>

                    {/* Details Grid */}
                    <View style={styles.detailsGrid}>
                        <InfoRow icon="human-male-height" label={`${profile.height || 0}cm`} />
                        <InfoRow icon="map-marker" label={`${profile.city}, ${profile.state}`} />
                        <InfoRow icon="account-group" label={`${profile.caste || 'Not specified'}`} />
                        <InfoRow icon="briefcase" label={profile.occupation || 'Not specified'} />
                        <InfoRow icon="currency-inr" label={formatIncome(profile.annualIncome)} />
                        <InfoRow icon="school" label={profile.education || 'Not specified'} />
                    </View>

                    {/* Profile Manager */}
                    <View style={styles.managerRow}>
                        <Icon name="account-circle" size={16} color={Theme.colors.textSecondary} />
                        <Text variant="bodySmall" style={styles.managerText}>
                            Profile managed by: Self
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Action Buttons */}
            <View style={styles.actionBar}>
                <ActionButton
                    icon="heart-outline"
                    label="Interest"
                    onPress={onInterest}
                    color={Theme.colors.primary}
                />
                <ActionButton
                    icon="star"
                    label="Super"
                    onPress={onSuperInterest}
                    color="#FFD700"
                    isPremium
                />
                <ActionButton
                    icon={isShortlisted ? 'bookmark' : 'bookmark-outline'}
                    label="Shortlist"
                    onPress={onShortlist}
                    color={Theme.colors.secondary}
                />
                <ActionButton
                    icon="chat"
                    label="Chat"
                    onPress={onChat}
                    color={Theme.colors.success}
                    disabled={!canChat}
                />
            </View>
        </Surface>
    );
};

// Info Row Component
const InfoRow: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
    <View style={styles.infoRow}>
        <Icon name={icon} size={16} color={Theme.colors.textSecondary} />
        <Text variant="bodySmall" style={styles.infoText}>
            {label}
        </Text>
    </View>
);

// Action Button Component
const ActionButton: React.FC<{
    icon: string;
    label: string;
    onPress: () => void;
    color: string;
    isPremium?: boolean;
    disabled?: boolean;
}> = ({ icon, label, onPress, color, isPremium, disabled }) => (
    <TouchableOpacity
        style={[styles.actionButton, disabled && styles.actionButtonDisabled]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
    >
        <View style={[styles.actionIconContainer, { backgroundColor: color + '20' }]}>
            <Icon name={icon} size={24} color={disabled ? Theme.colors.textSecondary : color} />
            {isPremium && (
                <View style={styles.premiumBadge}>
                    <Icon name="crown" size={10} color="#FFD700" />
                </View>
            )}
        </View>
        <Text variant="labelSmall" style={[styles.actionLabel, disabled && styles.actionLabelDisabled]}>
            {label}
        </Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: Theme.colors.white,
    },
    imageContainer: {
        width: '100%',
        height: CARD_HEIGHT * 0.6,
        position: 'relative',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    activityBadge: {
        position: 'absolute',
        top: 16,
        left: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    activityText: {
        color: Theme.colors.text,
        fontWeight: '600',
    },
    photoCountBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    photoCountText: {
        color: Theme.colors.white,
        fontWeight: '600',
    },
    infoContainer: {
        padding: 16,
    },
    name: {
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginBottom: 12,
    },
    detailsGrid: {
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoText: {
        color: Theme.colors.text,
        flex: 1,
    },
    managerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Theme.colors.border,
    },
    managerText: {
        color: Theme.colors.textSecondary,
    },
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderTopWidth: 1,
        borderTopColor: Theme.colors.border,
    },
    actionButton: {
        alignItems: 'center',
        gap: 6,
    },
    actionButtonDisabled: {
        opacity: 0.5,
    },
    actionIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    premiumBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: Theme.colors.white,
        borderRadius: 10,
        padding: 2,
    },
    actionLabel: {
        color: Theme.colors.text,
        fontWeight: '600',
    },
    actionLabelDisabled: {
        color: Theme.colors.textSecondary,
    },
});

export default EnhancedMatchCard;
