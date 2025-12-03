/**
 * Occupation Management Screen
 * Full CRUD operations for managing occupation records
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Alert,
} from 'react-native';
import {
    Text,
    Surface,
    Button,
    ActivityIndicator,
    IconButton,
    Dialog,
    Portal,
    TextInput,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';
import { Occupation } from '../../types';
import occupationService from '../../services/occupation.service';
import EmptyState from '../../components/common/EmptyState';

type OccupationManagementScreenNavigationProp = NativeStackNavigationProp<any>;

type Props = {
    navigation: OccupationManagementScreenNavigationProp;
};

const OccupationManagementScreen: React.FC<Props> = ({ navigation }) => {
    const [occupations, setOccupations] = useState<Occupation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [editingOccupation, setEditingOccupation] = useState<Occupation | null>(null);

    // Form fields
    const [jobTitle, setJobTitle] = useState('');
    const [company, setCompany] = useState('');
    const [industry, setIndustry] = useState('');
    const [annualIncome, setAnnualIncome] = useState('');
    const [workLocation, setWorkLocation] = useState('');

    useFocusEffect(
        useCallback(() => {
            loadOccupations();
        }, [])
    );

    const loadOccupations = async () => {
        setIsLoading(true);
        try {
            const data = await occupationService.getMyOccupation();
            setOccupations(data);
        } catch (error) {
            console.error('Error loading occupations:', error);
            Alert.alert('Error', 'Failed to load occupation records');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingOccupation(null);
        setJobTitle('');
        setCompany('');
        setIndustry('');
        setAnnualIncome('');
        setWorkLocation('');
        setShowDialog(true);
    };

    const handleEdit = (occupation: Occupation) => {
        setEditingOccupation(occupation);
        setJobTitle(occupation.designation || '');
        setCompany(occupation.companyName || '');
        setIndustry(occupation.industry || '');
        setAnnualIncome(occupation.annualIncome || '');
        setWorkLocation(occupation.location || '');
        setShowDialog(true);
    };

    const handleSave = async () => {
        if (!jobTitle || !company) {
            Alert.alert('Validation Error', 'Please fill in job title and company');
            return;
        }

        setIsSaving(true);
        try {
            const data = {
                designation: jobTitle,
                companyName: company,
                employmentType: 'FULL_TIME',
                isCurrent: true,
                industry: industry || undefined,
                annualIncome: annualIncome || undefined,
                location: workLocation || undefined,
            };

            if (editingOccupation) {
                await occupationService.updateOccupation(editingOccupation.id, data);
                Alert.alert('Success', 'Occupation updated successfully');
            } else {
                await occupationService.createOccupation(data);
                Alert.alert('Success', 'Occupation added successfully');
            }

            setShowDialog(false);
            loadOccupations();
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to save occupation');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (id: number) => {
        Alert.alert(
            'Delete Occupation',
            `Are you sure you want to delete ${occupations.find(o => o.id === id)?.designation}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await occupationService.deleteOccupation(id);
                            Alert.alert('Success', 'Occupation deleted successfully');
                            loadOccupations();
                        } catch (error: any) {
                            Alert.alert('Error', error.response?.data?.message || 'Failed to delete occupation');
                        }
                    },
                },
            ]
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const renderOccupation = ({ item: occupation }: { item: Occupation }) => (
        <Surface key={occupation.id} style={styles.card} elevation={1}>
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Icon name="briefcase" size={24} color={Theme.colors.secondary} />
                    <View style={styles.headerText}>
                        <Text variant="titleMedium" style={styles.jobTitle}>
                            {occupation.designation}
                        </Text>
                        <Text variant="bodyMedium" style={styles.company}>
                            {occupation.companyName}
                        </Text>
                    </View>
                    <View style={styles.actions}>
                        <IconButton icon="pencil" size={20} onPress={() => handleEdit(occupation)} />
                        <IconButton icon="delete" size={20} onPress={() => handleDelete(occupation.id)} />
                    </View>
                </View>

                {occupation.industry && (
                    <View style={styles.detailRow}>
                        <Icon name="domain" size={16} color={Theme.colors.textSecondary} />
                        <Text style={styles.detailText}>{occupation.industry}</Text>
                    </View>
                )}

                {occupation.location && (
                    <View style={styles.detailRow}>
                        <Icon name="map-marker" size={16} color={Theme.colors.textSecondary} />
                        <Text style={styles.detailText}>{occupation.location}</Text>
                    </View>
                )}

                {occupation.annualIncome && (
                    <View style={styles.detailRow}>
                        <Icon name="currency-inr" size={16} color={Theme.colors.success} />
                        <Text style={[styles.detailText, styles.income]}>
                            {formatCurrency(parseFloat(occupation.annualIncome))} per year
                        </Text>
                    </View>
                )}

                <View style={styles.actions}>
                    <Button
                        mode="outlined"
                        onPress={() => handleEdit(occupation)}
                        style={styles.actionButton}
                        textColor={Theme.colors.secondary}
                        icon="pencil">
                        Edit
                    </Button>
                    <Button
                        mode="outlined"
                        onPress={() => handleDelete(occupation.id)}
                        style={styles.actionButton}
                        textColor={Theme.colors.primary}
                        icon="delete">
                        Delete
                    </Button>
                </View>
            </View>
        </Surface>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Theme.colors.primary} />
                <Text style={styles.loadingText}>Loading occupation records...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={occupations}
                renderItem={renderOccupation}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <EmptyState
                        icon="briefcase"
                        title="No Occupation Records"
                        message="Add your professional details to enhance your profile"
                    />
                }
            />

            <Button
                mode="contained"
                onPress={handleAdd}
                style={styles.addButton}
                buttonColor={Theme.colors.secondary}
                textColor={Theme.colors.primaryDark}
                icon="plus">
                Add Occupation
            </Button>

            {/* Add/Edit Dialog */}
            <Portal>
                <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
                    <Dialog.Title>
                        {editingOccupation ? 'Edit Occupation' : 'Add Occupation'}
                    </Dialog.Title>
                    <Dialog.ScrollArea>
                        <View style={styles.dialogContent}>
                            <TextInput
                                label="Job Title *"
                                value={jobTitle}
                                onChangeText={setJobTitle}
                                mode="outlined"
                                style={styles.input}
                                placeholder="e.g., Software Engineer"
                            />
                            <TextInput
                                label="Company *"
                                value={company}
                                onChangeText={setCompany}
                                mode="outlined"
                                style={styles.input}
                                placeholder="e.g., Google India"
                            />
                            <TextInput
                                label="Industry"
                                value={industry}
                                onChangeText={setIndustry}
                                mode="outlined"
                                style={styles.input}
                                placeholder="e.g., Information Technology"
                            />
                            <TextInput
                                label="Annual Income (₹)"
                                value={annualIncome}
                                onChangeText={setAnnualIncome}
                                mode="outlined"
                                style={styles.input}
                                keyboardType="numeric"
                                placeholder="e.g., 1200000"
                            />
                            <TextInput
                                label="Work Location"
                                value={workLocation}
                                onChangeText={setWorkLocation}
                                mode="outlined"
                                style={styles.input}
                                placeholder="e.g., Bangalore, Karnataka"
                            />
                        </View>
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button onPress={() => setShowDialog(false)}>Cancel</Button>
                        <Button
                            onPress={handleSave}
                            loading={isSaving}
                            disabled={isSaving}
                            textColor={Theme.colors.secondary}>
                            Save
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Theme.colors.background,
    },
    loadingText: {
        marginTop: 16,
        color: Theme.colors.textSecondary,
    },
    listContent: {
        padding: 16,
        flexGrow: 1,
    },
    card: {
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: Theme.colors.white,
        ...Theme.shadows.md,
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 12,
    },
    headerText: {
        flex: 1,
    },
    jobTitle: {
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginBottom: 4,
    },
    company: {
        color: Theme.colors.textSecondary,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    detailText: {
        fontSize: 14,
        color: Theme.colors.textSecondary,
    },
    income: {
        color: Theme.colors.success,
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
    actionButton: {
        flex: 1,
        borderRadius: 8,
    },
    addButton: {
        margin: 16,
        borderRadius: 8,
    },
    dialogContent: {
        paddingHorizontal: 24,
    },
    input: {
        marginBottom: 12,
    },
});

export default OccupationManagementScreen;
