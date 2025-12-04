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
import VerificationBadge from '../common/VerificationBadge';
import PremiumBadge from '../common/PremiumBadge';

import { useAppTheme } from '../../hooks/useAppTheme';

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
    const { theme } = useAppTheme();

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
    const isPremium = profile.isPremium;
    const primaryPhoto = profile.media?.[0]?.url;

    return (
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }, isPremium && styles.premiumCard]} elevation={4}>
            <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
                {/* Image Section */}
                <View style={styles.imageContainer}>
                    {primaryPhoto ? (
                        <Image source={{ uri: primaryPhoto }} style={styles.profileImage} resizeMode="cover" />
                    ) : (
                        <View style={[styles.placeholderImage, { backgroundColor: theme.colors.surfaceCard }]}>
                            <Icon name="account" size={80} color={theme.colors.textSecondary} />
                        </View>
                    )}

                    {/* Premium Badge */}
                    {isPremium && (
                        <PremiumBadge variant="overlay" size={20} showText style={styles.premiumBadge} />
                    )}

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
                    <View style={styles.nameRow}>
                        <Text variant="headlineSmall" style={[styles.name, { color: theme.colors.text }]}>
                            {profile.firstName}, {age}
                        </Text>
                        {profile.isVerified && (
                            <VerificationBadge size={24} style={styles.badge} />
                        )}
                    </View>

                    {/* Details Grid */}
                    <View style={styles.detailsGrid}>
                        <InfoRow icon="human-male-height" label={`${profile.height || 0}cm`} theme={theme} />
                        <InfoRow icon="map-marker" label={`${profile.city}, ${profile.state}`} theme={theme} />
                        <InfoRow icon="account-group" label={`${profile.caste || 'Not specified'}`} theme={theme} />
                        <InfoRow icon="briefcase" label={profile.occupation || 'Not specified'} theme={theme} />
                        <InfoRow icon="currency-inr" label={formatIncome(profile.annualIncome)} theme={theme} />
                        <InfoRow icon="school" label={profile.education || 'Not specified'} theme={theme} />
                    </View>

                    {/* Profile Manager */}
                    <View style={[styles.managerRow, { borderTopColor: theme.colors.border }]}>
                        <Icon name="account-circle" size={16} color={theme.colors.textSecondary} />
                        <Text variant="bodySmall" style={[styles.managerText, { color: theme.colors.textSecondary }]}>
                            Profile managed by: Self
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Action Buttons */}
            <View style={[styles.actionBar, { borderTopColor: theme.colors.border }]}>
                <ActionButton
                    icon="heart-outline"
                    label="Interest"
                    onPress={onInterest}
                    color={theme.colors.primary}
                    theme={theme}
                />
                <ActionButton
                    icon="star"
                    label="Super"
                    onPress={onSuperInterest}
                    color="#FFD700"
                    isPremium
                    theme={theme}
                />
                <ActionButton
                    icon={isShortlisted ? 'bookmark' : 'bookmark-outline'}
                    label="Shortlist"
                    onPress={onShortlist}
                    color={theme.colors.secondary}
                    theme={theme}
                />
                <ActionButton
                    icon="chat"
                    label="Chat"
                    onPress={onChat}
                    color={theme.colors.success}
                    disabled={!canChat}
                    theme={theme}
                />
            </View>
        </Surface >
    );
};

// Info Row Component
const InfoRow: React.FC<{ icon: string; label: string; theme: any }> = ({ icon, label, theme }) => (
    <View style={styles.infoRow}>
        <Icon name={icon} size={16} color={theme.colors.textSecondary} />
        <Text variant="bodySmall" style={[styles.infoText, { color: theme.colors.text }]}>
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
    theme: any;
}> = ({ icon, label, onPress, color, isPremium, disabled, theme }) => (
    <TouchableOpacity
        style={[styles.actionButton, disabled && styles.actionButtonDisabled]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
    >
        <View style={[styles.actionIconContainer, { backgroundColor: color + '20' }]}>
            <Icon name={icon} size={24} color={disabled ? theme.colors.textSecondary : color} />
            {isPremium && (
                <View style={[styles.buttonPremiumBadge, { backgroundColor: theme.colors.surface }]}>
                    <Icon name="crown" size={10} color="#FFD700" />
                </View>
            )}
        </View>
        <Text variant="labelSmall" style={[styles.actionLabel, { color: theme.colors.text }, disabled && { color: theme.colors.textSecondary }]}>
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
    placeholderImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Theme.colors.surfaceCard,
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
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    badge: {
        marginTop: 2,
    },
    premiumCard: {
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    premiumBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 1,
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
    buttonPremiumBadge: {
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
