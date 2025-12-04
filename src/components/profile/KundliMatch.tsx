/**
 * Kundli Match Component
 * Shows astrological compatibility score with simple progress bar
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';

interface KundliMatchProps {
    matchScore?: number; // 0-36 guna score
    isLoading?: boolean;
    isPremium?: boolean;
    onViewDetails?: () => void;
    onUpgrade?: () => void;
}

const KundliMatch: React.FC<KundliMatchProps> = ({
    matchScore,
    isLoading = false,
    isPremium = false,
    onViewDetails,
    onUpgrade,
}) => {
    const getMatchLabel = (score: number) => {
        if (score >= 28) return { label: 'Excellent Match', color: '#4CAF50' };
        if (score >= 21) return { label: 'Good Match', color: '#8BC34A' };
        if (score >= 14) return { label: 'Average Match', color: '#FFC107' };
        return { label: 'Below Average', color: '#FF5722' };
    };

    if (!isPremium) {
        return (
            <TouchableOpacity style={styles.lockedContainer} onPress={onUpgrade}>
                <View style={styles.lockedContent}>
                    <Icon name="lock" size={24} color="#999" />
                    <View style={styles.lockedText}>
                        <Text style={styles.lockedTitle}>Kundli Matching</Text>
                        <Text style={styles.lockedSubtitle}>Upgrade to see compatibility</Text>
                    </View>
                </View>
                <Icon name="crown" size={20} color="#FFD700" />
            </TouchableOpacity>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingIndicator} />
                <Text style={styles.loadingText}>Calculating compatibility...</Text>
            </View>
        );
    }

    if (matchScore === undefined) {
        return (
            <View style={styles.container}>
                <Icon name="zodiac-virgo" size={32} color="#999" />
                <Text style={styles.notAvailableText}>Kundli data not available</Text>
            </View>
        );
    }

    const { label, color } = getMatchLabel(matchScore);
    const percentage = (matchScore / 36) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Icon name="zodiac-virgo" size={24} color={Theme.colors.primary} />
                <Text style={styles.title}>Kundli Compatibility</Text>
            </View>

            <View style={styles.scoreContainer}>
                {/* Simple Progress Circle */}
                <View style={styles.progressCircle}>
                    <View style={[styles.progressFill, { backgroundColor: color }]}>
                        <Text style={styles.percentText}>{Math.round(percentage)}%</Text>
                    </View>
                </View>
                <View style={styles.scoreDetails}>
                    <Text style={[styles.scoreLabel, { color }]}>{label}</Text>
                    <Text style={styles.gunaScore}>{matchScore} / 36 Guna</Text>
                </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
                </View>
            </View>

            <View style={styles.aspectsGrid}>
                <AspectItem name="Varna" matched={matchScore >= 1} />
                <AspectItem name="Vashya" matched={matchScore >= 3} />
                <AspectItem name="Tara" matched={matchScore >= 6} />
                <AspectItem name="Yoni" matched={matchScore >= 10} />
                <AspectItem name="Graha Maitri" matched={matchScore >= 15} />
                <AspectItem name="Gana" matched={matchScore >= 21} />
                <AspectItem name="Bhakoot" matched={matchScore >= 28} />
                <AspectItem name="Nadi" matched={matchScore >= 32} />
            </View>

            <TouchableOpacity style={styles.detailsButton} onPress={onViewDetails}>
                <Text style={styles.detailsButtonText}>View Full Report</Text>
                <Icon name="chevron-right" size={20} color={Theme.colors.primary} />
            </TouchableOpacity>
        </View>
    );
};

const AspectItem: React.FC<{ name: string; matched: boolean }> = ({ name, matched }) => (
    <View style={styles.aspectItem}>
        <Icon
            name={matched ? 'check-circle' : 'circle-outline'}
            size={16}
            color={matched ? '#4CAF50' : '#ccc'}
        />
        <Text style={[styles.aspectName, matched && styles.aspectMatched]}>{name}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        margin: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    lockedContainer: {
        backgroundColor: '#F8F8F8',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lockedContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    lockedText: {},
    lockedTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    lockedSubtitle: {
        fontSize: 12,
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        marginBottom: 16,
    },
    progressCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressFill: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    percentText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    scoreDetails: {
        alignItems: 'flex-start',
    },
    scoreLabel: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    gunaScore: {
        fontSize: 14,
        color: '#666',
    },
    progressBarContainer: {
        marginBottom: 20,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    aspectsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    aspectItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        gap: 6,
        paddingVertical: 4,
    },
    aspectName: {
        fontSize: 13,
        color: '#999',
    },
    aspectMatched: {
        color: '#333',
    },
    detailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    detailsButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: Theme.colors.primary,
    },
    loadingIndicator: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F0F0F0',
        alignSelf: 'center',
        marginBottom: 12,
    },
    loadingText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    notAvailableText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginTop: 8,
    },
});

export default KundliMatch;
