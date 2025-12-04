/**
 * Enhanced Match Card Component - Redesigned to match reference
 * Tinder-style card with rounded corners and action buttons
 */

import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { Text } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';
import { Profile } from '../../types';
import matchService from '../../services/match.service';
import retryRequest from '../../utils/retryRequest';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32; // 16px margin on each side
const CARD_HEIGHT = CARD_WIDTH * 1.4; // Aspect ratio

interface EnhancedMatchCardProps {
    profile: Profile;
    onPress: () => void;
    isShortlisted?: boolean;
    canChat?: boolean;
    onShortlistToggle?: () => void;
    onChatPress?: () => void;
    showToast?: (message: string) => void;
}

const EnhancedMatchCard: React.FC<EnhancedMatchCardProps> = ({
    profile,
    onPress,
    isShortlisted = false,
    canChat = false,
    onShortlistToggle,
    onChatPress,
    showToast,
}) => {
    const [isLoadingInterest, setIsLoadingInterest] = useState(false);
    const [isLoadingSuperInterest, setIsLoadingSuperInterest] = useState(false);
    const [interestSent, setInterestSent] = useState(false);
    const [superInterestSent, setSuperInterestSent] = useState(false);

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

    const handleInterest = async () => {
        if (isLoadingInterest || interestSent) return;

        // Optimistic update
        setInterestSent(true);
        showToast?.('Interest sent!');

        try {
            setIsLoadingInterest(true);
            // Retry logic with exponential backoff
            await retryRequest(
                () => matchService.sendMatchRequest(profile.userId, 'Interested in your profile'),
                {
                    maxRetries: 3,
                    onRetry: (attempt) => console.log(`Retrying interest (attempt ${attempt})...`)
                }
            );
        } catch (error: any) {
            // Rollback on error
            setInterestSent(false);
            console.error('Error sending interest:', error);
            showToast?.(error.message || 'Failed to send interest after retries');
        } finally {
            setIsLoadingInterest(false);
        }
    };

    const handleSuperInterest = async () => {
        if (isLoadingSuperInterest || superInterestSent) return;

        // Optimistic update
        setSuperInterestSent(true);
        showToast?.('Super interest sent!');

        try {
            setIsLoadingSuperInterest(true);
            // Retry logic with exponential backoff
            await retryRequest(
                () => matchService.sendMatchRequest(profile.userId, '⭐ Super interested in your profile!'),
                {
                    maxRetries: 3,
                    onRetry: (attempt) => console.log(`Retrying super interest (attempt ${attempt})...`)
                }
            );
        } catch (error: any) {
            // Rollback on error
            setSuperInterestSent(false);
            console.error('Error sending super interest:', error);
            showToast?.(error.message || 'Failed to send super interest after retries');
        } finally {
            setIsLoadingSuperInterest(false);
        }
    };

    const handleChat = () => {
        if (!canChat) {
            showToast?.('You need to match first to start chatting');
            return;
        }
        onChatPress?.();
    };

    const age = calculateAge(profile.dateOfBirth);
    const primaryPhoto = profile.media?.[0]?.url;
    const isOnline = true; // TODO: Get from actual online status

    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={onPress} activeOpacity={0.95} style={styles.cardContent}>
                {/* Profile Image */}
                <View style={styles.imageContainer}>
                    {primaryPhoto ? (
                        <Image
                            source={{ uri: primaryPhoto }}
                            style={styles.profileImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.placeholderImage}>
                            <Icon name="account" size={100} color="#999" />
                        </View>
                    )}

                    {/* Info Overlay at Bottom with Gradient */}
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.75)']}
                        style={styles.infoOverlay}
                    >
                        {/* Name and Age */}
                        <View style={styles.nameRow}>
                            <Text style={styles.nameText}>
                                {profile.firstName} {profile.lastName?.charAt(0)}.
                            </Text>
                            <Text style={styles.ageText}>, {age}</Text>
                            {isOnline && <View style={styles.onlineDot} />}
                        </View>

                        {/* Occupation */}
                        {profile.occupation && (
                            <View style={styles.infoRow}>
                                <Icon name="briefcase" size={16} color="#fff" />
                                <Text style={styles.infoText}>{profile.occupation}</Text>
                            </View>
                        )}

                        {/* Location */}
                        <View style={styles.infoRow}>
                            <Icon name="map-marker" size={16} color="#fff" />
                            <Text style={styles.infoText}>
                                {profile.city}, {profile.state}
                            </Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Action Buttons Bar */}
                <View style={styles.actionBar}>
                    {/* Interest Button - Pink Filled */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleInterest}
                        activeOpacity={0.7}
                        disabled={isLoadingInterest}
                    >
                        <View style={[styles.actionCircle, styles.interestCircle]}>
                            {isLoadingInterest ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Icon name="calendar-check" size={28} color="#fff" />
                            )}
                        </View>
                        <Text style={styles.actionLabel}>Interest</Text>
                    </TouchableOpacity>

                    {/* Super Interest Button - Pink Outlined */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleSuperInterest}
                        activeOpacity={0.7}
                        disabled={isLoadingSuperInterest}
                    >
                        <View style={[styles.actionCircle, styles.superInterestCircle]}>
                            {isLoadingSuperInterest ? (
                                <ActivityIndicator size="small" color={Theme.colors.primary} />
                            ) : (
                                <Icon name="heart" size={28} color={Theme.colors.primary} />
                            )}
                        </View>
                        <Text style={styles.actionLabel}>Super{'\n'}Interest</Text>
                    </TouchableOpacity>

                    {/* Shortlist Button - Outlined */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={onShortlistToggle}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.actionCircle, styles.outlinedCircle]}>
                            <Icon
                                name={isShortlisted ? "star" : "star-outline"}
                                size={28}
                                color={isShortlisted ? "#FFD700" : "rgba(255,255,255,0.8)"}
                            />
                        </View>
                        <Text style={styles.actionLabel}>Shortlist</Text>
                    </TouchableOpacity>

                    {/* Chat Button - Outlined */}
                    <TouchableOpacity
                        style={[styles.actionButton, !canChat && styles.disabledAction]}
                        onPress={handleChat}
                        disabled={!canChat}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.actionCircle, styles.outlinedCircle]}>
                            <Icon
                                name="message-text"
                                size={28}
                                color={canChat ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)"}
                            />
                        </View>
                        <Text style={[styles.actionLabel, !canChat && styles.disabledLabel]}>Chat</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    cardContent: {
        flex: 1,
    },
    imageContainer: {
        width: '100%',
        height: CARD_HEIGHT - 100, // Reserve space for action bar
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
        backgroundColor: '#f0f0f0',
    },
    infoOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 24,
        // Gradient effect handled by parent container or LinearGradient component
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    nameText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    ageText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    onlineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4CAF50',
        marginLeft: 8,
        borderWidth: 2,
        borderColor: '#fff',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    infoText: {
        fontSize: 15,
        color: '#fff',
        marginLeft: 8,
        fontWeight: '500',
    },
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(0,0,0,0.03)',
    },
    actionButton: {
        alignItems: 'center',
        flex: 1,
    },
    actionCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    interestCircle: {
        backgroundColor: Theme.colors.primary,
        shadowColor: Theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    superInterestCircle: {
        backgroundColor: 'transparent',
        borderWidth: 2.5,
        borderColor: Theme.colors.primary,
    },
    outlinedCircle: {
        backgroundColor: 'transparent',
        borderWidth: 2.5,
        borderColor: 'rgba(0,0,0,0.15)',
    },
    actionLabel: {
        color: '#666',
        fontSize: 11,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 14,
    },
    disabledAction: {
        opacity: 0.5,
    },
    disabledLabel: {
        color: '#999',
    },
});

export default EnhancedMatchCard;
