/**
 * Match Filters Component - With functional filter state
 * Filter buttons with active state management
 */

import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';

export type FilterType = 'all' | 'verified' | 'justJoined' | 'nearby';
export type SortOption = 'newest' | 'active' | 'nearby' | 'recommended';

interface MatchFiltersProps {
    onFilterChange?: (filters: { verified?: boolean; justJoined?: boolean; nearby?: boolean }) => void;
    onSortChange?: (sort: SortOption) => void;
}

const MatchFilters: React.FC<MatchFiltersProps> = ({
    onFilterChange,
    onSortChange,
}) => {
    const [activeFilters, setActiveFilters] = useState<Set<FilterType>>(new Set(['all']));
    const [currentSort, setCurrentSort] = useState<SortOption>('newest');
    const [showSortModal, setShowSortModal] = useState(false);

    const handleFilterToggle = (filter: FilterType) => {
        const newFilters = new Set(activeFilters);

        if (filter === 'all') {
            newFilters.clear();
            newFilters.add('all');
        } else {
            newFilters.delete('all');
            if (newFilters.has(filter)) {
                newFilters.delete(filter);
            } else {
                newFilters.add(filter);
            }

            if (newFilters.size === 0) {
                newFilters.add('all');
            }
        }

        setActiveFilters(newFilters);

        // Emit filter changes
        onFilterChange?.({
            verified: newFilters.has('verified'),
            justJoined: newFilters.has('justJoined'),
            nearby: newFilters.has('nearby'),
        });
    };

    const handleSortChange = (sort: SortOption) => {
        setCurrentSort(sort);
        setShowSortModal(false);
        onSortChange?.(sort);
    };

    const getSortLabel = () => {
        switch (currentSort) {
            case 'newest': return 'Newest';
            case 'active': return 'Active';
            case 'nearby': return 'Nearby';
            case 'recommended': return 'Recommended';
            default: return 'Newest';
        }
    };

    return (
        <>
            <View style={styles.container}>
                {/* Filters Button */}
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => handleFilterToggle('verified')}
                    activeOpacity={0.7}
                >
                    <Icon name="tune-variant" size={20} color="#333" />
                    <Text style={styles.filterText}>Filters</Text>
                    {(activeFilters.has('verified') || activeFilters.has('justJoined') || activeFilters.has('nearby')) && (
                        <View style={styles.activeDot} />
                    )}
                </TouchableOpacity>

                {/* Sort By Button */}
                <TouchableOpacity
                    style={styles.sortButton}
                    onPress={() => setShowSortModal(true)}
                    activeOpacity={0.7}
                >
                    <Icon name="swap-vertical" size={20} color="#333" />
                    <Text style={styles.sortText}>Sort By</Text>
                </TouchableOpacity>

                {/* Active Sort Pill */}
                <View style={styles.pillContainer}>
                    <Text style={styles.pillText}>{getSortLabel()}</Text>
                    <TouchableOpacity onPress={() => setCurrentSort('newest')}>
                        <Icon name="close" size={16} color={Theme.colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Sort Modal */}
            <Modal
                visible={showSortModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowSortModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowSortModal(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Sort By</Text>

                        <TouchableOpacity
                            style={styles.sortOption}
                            onPress={() => handleSortChange('newest')}
                        >
                            <Text style={styles.sortOptionText}>Newest First</Text>
                            {currentSort === 'newest' && (
                                <Icon name="check" size={20} color={Theme.colors.primary} />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.sortOption}
                            onPress={() => handleSortChange('active')}
                        >
                            <Text style={styles.sortOptionText}>Recently Active</Text>
                            {currentSort === 'active' && (
                                <Icon name="check" size={20} color={Theme.colors.primary} />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.sortOption}
                            onPress={() => handleSortChange('nearby')}
                        >
                            <Text style={styles.sortOptionText}>Nearby</Text>
                            {currentSort === 'nearby' && (
                                <Icon name="check" size={20} color={Theme.colors.primary} />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.sortOption}
                            onPress={() => handleSortChange('recommended')}
                        >
                            <Text style={styles.sortOptionText}>Recommended</Text>
                            {currentSort === 'recommended' && (
                                <Icon name="check" size={20} color={Theme.colors.primary} />
                            )}
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: Theme.colors.white,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        gap: 12,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
        gap: 6,
        position: 'relative',
    },
    filterText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    activeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Theme.colors.primary,
        position: 'absolute',
        top: 4,
        right: 4,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
        gap: 6,
    },
    sortText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    pillContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFE5F0',
        gap: 8,
    },
    pillText: {
        fontSize: 14,
        color: Theme.colors.primary,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        width: '80%',
        maxWidth: 300,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    sortOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    sortOptionText: {
        fontSize: 16,
        color: '#333',
    },
});

export default MatchFilters;
