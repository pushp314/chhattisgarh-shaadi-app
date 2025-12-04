import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Modal, Portal, Text, Button, TextInput, Chip, Divider, IconButton } from 'react-native-paper';
import { Theme } from '../../constants/theme';
import { SearchProfilesParams } from '../../types';
import { Religion, MaritalStatus } from '../../constants/enums';

import { useAppTheme } from '../../hooks/useAppTheme';

interface FilterModalProps {
    visible: boolean;
    onDismiss: () => void;
    onApply: (filters: Partial<SearchProfilesParams>) => void;
    initialFilters: Partial<SearchProfilesParams>;
}

const FilterModal: React.FC<FilterModalProps> = ({
    visible,
    onDismiss,
    onApply,
    initialFilters,
}) => {
    const { theme } = useAppTheme();
    const [filters, setFilters] = useState<Partial<SearchProfilesParams>>(initialFilters);

    const handleApply = () => {
        onApply(filters);
        onDismiss();
    };

    const handleReset = () => {
        setFilters({});
    };

    const updateFilter = (key: keyof SearchProfilesParams, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}
            >
                <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                    <Text variant="titleLarge" style={[styles.title, { color: theme.colors.text }]}>Filters</Text>
                    <IconButton icon="close" onPress={onDismiss} iconColor={theme.colors.text} />
                </View>

                <ScrollView style={styles.content}>
                    {/* Age Range */}
                    <View style={styles.section}>
                        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.text }]}>Age Range</Text>
                        <View style={styles.row}>
                            <TextInput
                                mode="outlined"
                                label="Min Age"
                                value={filters.minAge?.toString() || ''}
                                onChangeText={text => updateFilter('minAge', text ? parseInt(text) : undefined)}
                                keyboardType="numeric"
                                style={[styles.input, { backgroundColor: theme.colors.surface }]}
                                theme={{ colors: { onSurfaceVariant: theme.colors.textSecondary } }}
                                textColor={theme.colors.text}
                            />
                            <Text style={[styles.toText, { color: theme.colors.textSecondary }]}>to</Text>
                            <TextInput
                                mode="outlined"
                                label="Max Age"
                                value={filters.maxAge?.toString() || ''}
                                onChangeText={text => updateFilter('maxAge', text ? parseInt(text) : undefined)}
                                keyboardType="numeric"
                                style={[styles.input, { backgroundColor: theme.colors.surface }]}
                                theme={{ colors: { onSurfaceVariant: theme.colors.textSecondary } }}
                                textColor={theme.colors.text}
                            />
                        </View>
                    </View>

                    <Divider style={styles.divider} />

                    {/* Profession */}
                    <View style={styles.section}>
                        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.text }]}>Profession</Text>
                        <TextInput
                            mode="outlined"
                            label="Search Profession (e.g. Engineer)"
                            value={filters.occupation || ''}
                            onChangeText={text => updateFilter('occupation', text)}
                            style={[styles.fullInput, { backgroundColor: theme.colors.surface }]}
                            theme={{ colors: { onSurfaceVariant: theme.colors.textSecondary } }}
                            textColor={theme.colors.text}
                        />
                    </View>

                    <Divider style={styles.divider} />

                    {/* Income */}
                    <View style={styles.section}>
                        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.text }]}>Annual Income</Text>
                        <View style={styles.chipContainer}>
                            {['0-5 Lakhs', '5-10 Lakhs', '10-20 Lakhs', '20+ Lakhs'].map(income => (
                                <Chip
                                    key={income}
                                    selected={filters.annualIncome === income}
                                    onPress={() => updateFilter('annualIncome', filters.annualIncome === income ? undefined : income)}
                                    style={[styles.chip, { backgroundColor: theme.colors.surfaceCardAlt }]}
                                    textStyle={{ color: theme.colors.text }}
                                    showSelectedOverlay
                                >
                                    {income}
                                </Chip>
                            ))}
                        </View>
                    </View>

                    <Divider style={styles.divider} />

                    {/* Religion */}
                    <View style={styles.section}>
                        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.text }]}>Religion</Text>
                        <View style={styles.chipContainer}>
                            {Object.values(Religion).map((religion) => (
                                <Chip
                                    key={religion}
                                    selected={filters.religions?.includes(religion)}
                                    onPress={() => {
                                        const current = filters.religions ? filters.religions.split(',') : [];
                                        let updated;
                                        if (current.includes(religion)) {
                                            updated = current.filter(r => r !== religion);
                                        } else {
                                            updated = [...current, religion];
                                        }
                                        updateFilter('religions', updated.length > 0 ? updated.join(',') : undefined);
                                    }}
                                    style={[styles.chip, { backgroundColor: theme.colors.surfaceCardAlt }]}
                                    textStyle={{ color: theme.colors.text }}
                                    showSelectedOverlay
                                >
                                    {religion.replace('_', ' ')}
                                </Chip>
                            ))}
                        </View>
                    </View>

                    <Divider style={styles.divider} />

                    {/* Marital Status */}
                    <View style={styles.section}>
                        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.text }]}>Marital Status</Text>
                        <View style={styles.chipContainer}>
                            {Object.values(MaritalStatus).map((status) => (
                                <Chip
                                    key={status}
                                    selected={filters.maritalStatus === status}
                                    onPress={() => updateFilter('maritalStatus', filters.maritalStatus === status ? undefined : status)}
                                    style={[styles.chip, { backgroundColor: theme.colors.surfaceCardAlt }]}
                                    textStyle={{ color: theme.colors.text }}
                                    showSelectedOverlay
                                >
                                    {status.replace('_', ' ')}
                                </Chip>
                            ))}
                        </View>
                    </View>

                    <Divider style={styles.divider} />

                    {/* Height Range */}
                    <View style={styles.section}>
                        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.text }]}>Height (cm)</Text>
                        <View style={styles.row}>
                            <TextInput
                                mode="outlined"
                                label="Min Height"
                                value={filters.minHeight?.toString() || ''}
                                onChangeText={text => updateFilter('minHeight', text ? parseInt(text) : undefined)}
                                keyboardType="numeric"
                                style={[styles.input, { backgroundColor: theme.colors.surface }]}
                                theme={{ colors: { onSurfaceVariant: theme.colors.textSecondary } }}
                                textColor={theme.colors.text}
                            />
                            <Text style={[styles.toText, { color: theme.colors.textSecondary }]}>to</Text>
                            <TextInput
                                mode="outlined"
                                label="Max Height"
                                value={filters.maxHeight?.toString() || ''}
                                onChangeText={text => updateFilter('maxHeight', text ? parseInt(text) : undefined)}
                                keyboardType="numeric"
                                style={[styles.input, { backgroundColor: theme.colors.surface }]}
                                theme={{ colors: { onSurfaceVariant: theme.colors.textSecondary } }}
                                textColor={theme.colors.text}
                            />
                        </View>
                    </View>

                    <Divider style={styles.divider} />

                    {/* Verified Only */}
                    <View style={styles.section}>
                        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.text }]}>Verification</Text>
                        <Chip
                            selected={filters.isVerified}
                            onPress={() => updateFilter('isVerified', !filters.isVerified)}
                            icon="check-decagram"
                            style={[styles.chip, { backgroundColor: theme.colors.surfaceCardAlt }]}
                            textStyle={{ color: theme.colors.text }}
                            showSelectedOverlay
                        >
                            Verified Profiles Only
                        </Chip>
                    </View>
                </ScrollView>

                <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
                    <Button mode="outlined" onPress={handleReset} style={styles.button} textColor={theme.colors.primary}>
                        Reset
                    </Button>
                    <Button mode="contained" onPress={handleApply} style={styles.button} buttonColor={theme.colors.primary}>
                        Apply Filters
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: Theme.colors.white,
        margin: 20,
        borderRadius: 16,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.border,
    },
    title: {
        fontWeight: 'bold',
    },
    content: {
        padding: 16,
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        marginBottom: 12,
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    input: {
        flex: 1,
        backgroundColor: Theme.colors.white,
    },
    fullInput: {
        backgroundColor: Theme.colors.white,
    },
    toText: {
        color: Theme.colors.textSecondary,
    },
    divider: {
        marginVertical: 16,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        backgroundColor: Theme.colors.surfaceCardAlt,
    },
    footer: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: Theme.colors.border,
        gap: 12,
    },
    button: {
        flex: 1,
    },
});

export default FilterModal;
