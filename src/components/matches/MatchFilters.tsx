/**
 * Match Filters Component
 * Horizontal scrollable filter chips for match discovery
 */

import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Chip, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';

export type FilterType = 'all' | 'verified' | 'justJoined' | 'nearby';

interface MatchFiltersProps {
    activeFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    onAdvancedFilter: () => void;
}

const MatchFilters: React.FC<MatchFiltersProps> = ({
    activeFilter,
    onFilterChange,
    onAdvancedFilter,
}) => {
    const filters: { key: FilterType; label: string; icon: string }[] = [
        { key: 'all', label: 'All Matches', icon: 'account-multiple' },
        { key: 'verified', label: 'Verified', icon: 'check-decagram' },
        { key: 'justJoined', label: 'Just Joined', icon: 'new-box' },
        { key: 'nearby', label: 'Nearby', icon: 'map-marker' },
    ];

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {filters.map((filter) => (
                    <Chip
                        key={filter.key}
                        selected={activeFilter === filter.key}
                        onPress={() => onFilterChange(filter.key)}
                        icon={filter.icon}
                        style={[
                            styles.chip,
                            activeFilter === filter.key && styles.chipSelected,
                        ]}
                        textStyle={[
                            styles.chipText,
                            activeFilter === filter.key && styles.chipTextSelected,
                        ]}
                        mode={activeFilter === filter.key ? 'flat' : 'outlined'}
                    >
                        {filter.label}
                    </Chip>
                ))}
            </ScrollView>

            {/* Advanced Filter Button */}
            <IconButton
                icon="filter-variant"
                size={24}
                iconColor={Theme.colors.primary}
                style={styles.filterButton}
                onPress={onAdvancedFilter}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        backgroundColor: Theme.colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.border,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    chip: {
        borderColor: Theme.colors.border,
    },
    chipSelected: {
        backgroundColor: Theme.colors.primary,
    },
    chipText: {
        color: Theme.colors.text,
    },
    chipTextSelected: {
        color: Theme.colors.white,
    },
    filterButton: {
        marginRight: 8,
    },
});

export default MatchFilters;
