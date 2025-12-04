import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Platform,
} from 'react-native';
import { Text, Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';

const AdvancedFiltersScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();

    // Filter States
    const [ageRange, setAgeRange] = useState({ min: '18', max: '35' });
    const [heightRange, setHeightRange] = useState({ min: '4\'5"', max: '7\'0"' });
    const [maritalStatus, setMaritalStatus] = useState<string[]>([]);
    const [religion, setReligion] = useState<string[]>([]);
    const [community, setCommunity] = useState<string[]>([]);
    const [income, setIncome] = useState<string>('Any');
    const [education, setEducation] = useState<string>('Any');
    const [workingWith, setWorkingWith] = useState<string[]>([]);

    // Toggles
    const [withPhoto, setWithPhoto] = useState(true);
    const [isVerified, setIsVerified] = useState(false);

    // Options
    const maritalOptions = ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'];
    const religionOptions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist'];
    const communityOptions = ['Brahmin', 'Kshatriya', 'Baniya', 'Kayastha', 'SC', 'ST', 'OBC', 'Maratha', 'Rajput'];
    const incomeOptions = ['Any', '0-3 LPA', '3-6 LPA', '6-10 LPA', '10-15 LPA', '15-25 LPA', '25+ LPA'];
    const educationOptions = ['Any', 'Doctorate', 'Masters', 'Bachelors', 'Diploma', 'High School'];
    const workingWithOptions = ['Private Company', 'Government', 'Business', 'Self Employed', 'Not Working'];

    const toggleSelection = (item: string, list: string[], setList: (l: string[]) => void) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const handleApply = () => {
        // Apply filters logic here
        // In a real app, pass these back to the previous screen or update context/store
        console.log('Filters Applied:', {
            ageRange,
            heightRange,
            maritalStatus,
            religion,
            community,
            income,
            education,
            workingWith,
            withPhoto,
            isVerified
        });
        navigation.goBack();
    };

    const handleReset = () => {
        setAgeRange({ min: '18', max: '35' });
        setMaritalStatus([]);
        setReligion([]);
        setCommunity([]);
        setIncome('Any');
        setEducation('Any');
        setWorkingWith([]);
        setWithPhoto(true);
        setIsVerified(false);
    };

    const renderSectionTitle = (title: string) => (
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{title}</Text>
    );

    const renderChipGroup = (options: string[], selected: string[], setSelected: (l: string[]) => void) => (
        <View style={styles.chipContainer}>
            {options.map(option => {
                const isSelected = selected.includes(option);
                return (
                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.chip,
                            {
                                backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                                borderColor: isSelected ? theme.colors.primary : theme.colors.border
                            }
                        ]}
                        onPress={() => toggleSelection(option, selected, setSelected)}
                    >
                        <Text style={[
                            styles.chipText,
                            { color: isSelected ? theme.colors.white : theme.colors.text }
                        ]}>
                            {option}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Icon name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>All Filters</Text>
                <TouchableOpacity onPress={handleReset}>
                    <Text style={[styles.resetText, { color: theme.colors.primary }]}>Reset</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Basic Preferences */}
                <View style={styles.section}>
                    {renderSectionTitle('Basic Preferences')}

                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Min Age</Text>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: theme.colors.surface,
                                    color: theme.colors.text,
                                    borderColor: theme.colors.border
                                }]}
                                value={ageRange.min}
                                onChangeText={t => setAgeRange(prev => ({ ...prev, min: t }))}
                                keyboardType="numeric"
                                maxLength={2}
                            />
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Max Age</Text>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: theme.colors.surface,
                                    color: theme.colors.text,
                                    borderColor: theme.colors.border
                                }]}
                                value={ageRange.max}
                                onChangeText={t => setAgeRange(prev => ({ ...prev, max: t }))}
                                keyboardType="numeric"
                                maxLength={2}
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Min Height</Text>
                            <TouchableOpacity style={[styles.dropdown, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
                                <Text style={{ color: theme.colors.text }}>{heightRange.min}</Text>
                                <Icon name="chevron-down" size={20} color={theme.colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Max Height</Text>
                            <TouchableOpacity style={[styles.dropdown, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
                                <Text style={{ color: theme.colors.text }}>{heightRange.max}</Text>
                                <Icon name="chevron-down" size={20} color={theme.colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

                {/* Marital Status */}
                <View style={styles.section}>
                    {renderSectionTitle('Marital Status')}
                    {renderChipGroup(maritalOptions, maritalStatus, setMaritalStatus)}
                </View>

                <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

                {/* Religion & Community */}
                <View style={styles.section}>
                    {renderSectionTitle('Religion')}
                    {renderChipGroup(religionOptions, religion, setReligion)}

                    <View style={{ height: 16 }} />

                    {renderSectionTitle('Community')}
                    {renderChipGroup(communityOptions, community, setCommunity)}
                </View>

                <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

                {/* Professional */}
                <View style={styles.section}>
                    {renderSectionTitle('Education & Career')}

                    <Text style={[styles.subLabel, { color: theme.colors.textSecondary }]}>Annual Income</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                        {incomeOptions.map(opt => (
                            <TouchableOpacity
                                key={opt}
                                style={[
                                    styles.chip,
                                    {
                                        backgroundColor: income === opt ? theme.colors.primary : theme.colors.surface,
                                        borderColor: income === opt ? theme.colors.primary : theme.colors.border
                                    }
                                ]}
                                onPress={() => setIncome(opt)}
                            >
                                <Text style={[
                                    styles.chipText,
                                    { color: income === opt ? theme.colors.white : theme.colors.text }
                                ]}>{opt}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <Text style={[styles.subLabel, { color: theme.colors.textSecondary, marginTop: 12 }]}>Education</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                        {educationOptions.map(opt => (
                            <TouchableOpacity
                                key={opt}
                                style={[
                                    styles.chip,
                                    {
                                        backgroundColor: education === opt ? theme.colors.primary : theme.colors.surface,
                                        borderColor: education === opt ? theme.colors.primary : theme.colors.border
                                    }
                                ]}
                                onPress={() => setEducation(opt)}
                            >
                                <Text style={[
                                    styles.chipText,
                                    { color: education === opt ? theme.colors.white : theme.colors.text }
                                ]}>{opt}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

                {/* Other Settings */}
                <View style={styles.section}>
                    <View style={styles.switchRow}>
                        <Text style={[styles.switchLabel, { color: theme.colors.text }]}>Profiles with Photos Only</Text>
                        <Switch value={withPhoto} onValueChange={setWithPhoto} color={theme.colors.primary} />
                    </View>
                    <View style={styles.switchRow}>
                        <Text style={[styles.switchLabel, { color: theme.colors.text }]}>Verified Profiles Only</Text>
                        <Switch value={isVerified} onValueChange={setIsVerified} color={theme.colors.primary} />
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Footer */}
            <View style={[styles.footer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
                <TouchableOpacity
                    style={[styles.applyButton, { backgroundColor: theme.colors.primary }]}
                    onPress={handleApply}
                >
                    <Text style={styles.applyButtonText}>Apply Filters</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    iconButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    resetText: {
        fontSize: 14,
        fontWeight: '600',
    },
    content: {
        paddingBottom: 20,
    },
    section: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 12,
    },
    halfInput: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        marginBottom: 6,
    },
    subLabel: {
        fontSize: 13,
        marginBottom: 8,
        marginTop: 4,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
    },
    dropdown: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        width: '100%',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 4,
    },
    chipText: {
        fontSize: 13,
        fontWeight: '500',
    },
    horizontalScroll: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    switchLabel: {
        fontSize: 15,
        fontWeight: '500',
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    applyButton: {
        paddingVertical: 14,
        borderRadius: 24,
        alignItems: 'center',
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default AdvancedFiltersScreen;
