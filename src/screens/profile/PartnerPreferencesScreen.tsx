import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Alert,
} from 'react-native';
import {
    Text,
    TextInput,
    Button,
    Surface,
    Chip,
    ActivityIndicator,
    Switch,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import partnerPreferenceService from '../../services/partnerPreference.service';
import { PartnerPreference, Religion, MaritalStatus } from '../../types';

type PartnerPreferencesScreenNavigationProp = NativeStackNavigationProp<
    ProfileStackParamList,
    'PartnerPreferences'
>;

type Props = {
    navigation: PartnerPreferencesScreenNavigationProp;
};

const PartnerPreferencesScreen: React.FC<Props> = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [preferences, setPreferences] = useState<Partial<PartnerPreference>>({
        ageFrom: undefined,
        ageTo: undefined,
        heightFrom: undefined,
        heightTo: undefined,
        religion: [],
        caste: [],
        maritalStatus: [],
        state: [],
        city: [],
        nativeDistrict: [],
        mustSpeakChhattisgarhi: false,
        education: [],
        occupation: [],
        annualIncome: '',
        description: '',
    });

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        setIsLoading(true);
        try {
            const data = await partnerPreferenceService.getMyPreferences();
            if (data) {
                setPreferences(data);
            }
        } catch (error) {
            console.error('Error loading preferences:', error);
            // If no preferences exist yet, that's okay
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await partnerPreferenceService.updatePreferences(preferences);
            Alert.alert('Success', 'Partner preferences saved successfully');
            navigation.goBack();
        } catch (error: any) {
            console.error('Error saving preferences:', error);
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to save preferences',
            );
        } finally {
            setIsSaving(false);
        }
    };

    const updateField = <K extends keyof PartnerPreference>(
        field: K,
        value: PartnerPreference[K],
    ) => {
        setPreferences(prev => ({ ...prev, [field]: value }));
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#D81B60" />
                <Text style={styles.loadingText}>Loading preferences...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Surface style={styles.section} elevation={1}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                    Age Range
                </Text>
                <View style={styles.row}>
                    <TextInput
                        label="From"
                        value={preferences.ageFrom?.toString() || ''}
                        onChangeText={text => updateField('ageFrom', parseInt(text) || undefined)}
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.halfInput}
                    />
                    <TextInput
                        label="To"
                        value={preferences.ageTo?.toString() || ''}
                        onChangeText={text => updateField('ageTo', parseInt(text) || undefined)}
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.halfInput}
                    />
                </View>
            </Surface>

            <Surface style={styles.section} elevation={1}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                    Height Range (cm)
                </Text>
                <View style={styles.row}>
                    <TextInput
                        label="From"
                        value={preferences.heightFrom?.toString() || ''}
                        onChangeText={text =>
                            updateField('heightFrom', parseInt(text) || undefined)
                        }
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.halfInput}
                    />
                    <TextInput
                        label="To"
                        value={preferences.heightTo?.toString() || ''}
                        onChangeText={text =>
                            updateField('heightTo', parseInt(text) || undefined)
                        }
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.halfInput}
                    />
                </View>
            </Surface>

            <Surface style={styles.section} elevation={1}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                    Religion
                </Text>
                <View style={styles.chipContainer}>
                    {['HINDU', 'MUSLIM', 'CHRISTIAN', 'SIKH', 'BUDDHIST', 'JAIN'].map(
                        religion => (
                            <Chip
                                key={religion}
                                selected={preferences.religion?.includes(religion as Religion)}
                                onPress={() => {
                                    const current = preferences.religion || [];
                                    const updated = current.includes(religion as Religion)
                                        ? current.filter(r => r !== religion)
                                        : [...current, religion as Religion];
                                    updateField('religion', updated);
                                }}
                                style={styles.chip}>
                                {religion}
                            </Chip>
                        ),
                    )}
                </View>
            </Surface>

            <Surface style={styles.section} elevation={1}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                    Marital Status
                </Text>
                <View style={styles.chipContainer}>
                    {['NEVER_MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED'].map(status => (
                        <Chip
                            key={status}
                            selected={preferences.maritalStatus?.includes(
                                status as MaritalStatus,
                            )}
                            onPress={() => {
                                const current = preferences.maritalStatus || [];
                                const updated = current.includes(status as MaritalStatus)
                                    ? current.filter(s => s !== status)
                                    : [...current, status as MaritalStatus];
                                updateField('maritalStatus', updated);
                            }}
                            style={styles.chip}>
                            {status.replace('_', ' ')}
                        </Chip>
                    ))}
                </View>
            </Surface>

            <Surface style={styles.section} elevation={1}>
                <View style={styles.switchRow}>
                    <Text variant="bodyLarge">Must Speak Chhattisgarhi</Text>
                    <Switch
                        value={preferences.mustSpeakChhattisgarhi || false}
                        onValueChange={value =>
                            updateField('mustSpeakChhattisgarhi', value)
                        }
                    />
                </View>
            </Surface>

            <Surface style={styles.section} elevation={1}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                    Annual Income
                </Text>
                <TextInput
                    label="e.g., 5-10 LPA"
                    value={preferences.annualIncome || ''}
                    onChangeText={text => updateField('annualIncome', text)}
                    mode="outlined"
                />
            </Surface>

            <Surface style={styles.section} elevation={1}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                    Additional Description
                </Text>
                <TextInput
                    label="Describe your ideal partner..."
                    value={preferences.description || ''}
                    onChangeText={text => updateField('description', text)}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                />
            </Surface>

            <Button
                mode="contained"
                onPress={handleSave}
                loading={isSaving}
                disabled={isSaving}
                style={styles.saveButton}>
                Save Preferences
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        color: '#666',
    },
    section: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfInput: {
        flex: 1,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        marginBottom: 4,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    saveButton: {
        marginTop: 8,
        backgroundColor: '#D81B60',
    },
});

export default PartnerPreferencesScreen;
