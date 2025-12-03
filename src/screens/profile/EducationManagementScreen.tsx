/**
 * Education Management Screen
 * Full CRUD operations for managing education records
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
    Menu,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';
import { Education } from '../../types';
import educationService from '../../services/education.service';
import EmptyState from '../../components/common/EmptyState';

type EducationManagementScreenNavigationProp = NativeStackNavigationProp<any>;

type Props = {
    navigation: EducationManagementScreenNavigationProp;
};

const EducationManagementScreen: React.FC<Props> = ({ navigation }) => {
    const [educations, setEducations] = useState<Education[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [editingEducation, setEditingEducation] = useState<Education | null>(null);

    // Form fields
    const [degree, setDegree] = useState('');
    const [institution, setInstitution] = useState('');
    const [fieldOfStudy, setFieldOfStudy] = useState('');
    const [yearOfPassing, setYearOfPassing] = useState('');
    const [grade, setGrade] = useState('');

    useFocusEffect(
        useCallback(() => {
            loadEducations();
        }, [])
    );

    const loadEducations = async () => {
        setIsLoading(true);
        try {
            const data = await educationService.getMyEducation();
            setEducations(data);
        } catch (error) {
            console.error('Error loading educations:', error);
            Alert.alert('Error', 'Failed to load education records');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingEducation(null);
        setDegree('');
        setInstitution('');
        setFieldOfStudy('');
        setYearOfPassing('');
        setGrade('');
        setShowDialog(true);
    };

    const handleEdit = (education: Education) => {
        setEditingEducation(education);
        setDegree(education.degree || '');
        setInstitution(education.institution || '');
        setFieldOfStudy(education.field || '');
        setYearOfPassing(education.yearOfPassing?.toString() || '');
        setGrade(education.grade || '');
        setShowDialog(true);
    };

    const handleSave = async () => {
        if (!degree || !institution) {
            Alert.alert('Validation Error', 'Please fill in degree and institution');
            return;
        }

        setIsSaving(true);
        try {
            const data = {
                degree,
                institution,
                fieldOfStudy: fieldOfStudy || undefined,
                yearOfPassing: yearOfPassing ? parseInt(yearOfPassing) : undefined,
                grade: grade || undefined,
            };

            if (editingEducation) {
                await educationService.updateEducation(editingEducation.id, data);
                Alert.alert('Success', 'Education updated successfully');
            } else {
                await educationService.createEducation(data);
                Alert.alert('Success', 'Education added successfully');
            }

            setShowDialog(false);
            loadEducations();
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to save education');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (education: Education) => {
        Alert.alert(
            'Delete Education',
            `Are you sure you want to delete ${education.degree}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await educationService.deleteEducation(education.id);
                            Alert.alert('Success', 'Education deleted successfully');
                            loadEducations();
                        } catch (error: any) {
                            Alert.alert('Error', error.response?.data?.message || 'Failed to delete education');
                        }
                    },
                },
            ]
        );
    };

    const renderEducation = ({ item }: { item: Education }) => (
        <Surface style={styles.card} elevation={1}>
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Icon name="school" size={24} color={Theme.colors.primary} />
                    <View style={styles.headerText}>
                        <Text variant="titleMedium" style={styles.degree}>
                            {item.degree}
                        </Text>
                        <Text variant="bodyMedium" style={styles.institution}>
                            {item.institution}
                        </Text>
                    </View>
                </View>

                {item.field && (
                    <View style={styles.detailRow}>
                        <Icon name="book-open-variant" size={16} color={Theme.colors.textSecondary} />
                        <Text style={styles.detailText}>{item.field}</Text>
                    </View>
                )}

                {item.yearOfPassing && (
                    <View style={styles.detailRow}>
                        <Icon name="calendar" size={16} color={Theme.colors.textSecondary} />
                        <Text style={styles.detailText}>Graduated: {item.yearOfPassing}</Text>
                    </View>
                )}

                {item.grade && (
                    <View style={styles.detailRow}>
                        <Icon name="medal" size={16} color={Theme.colors.textSecondary} />
                        <Text style={styles.detailText}>Grade: {item.grade}</Text>
                    </View>
                )}

                <View style={styles.actions}>
                    <Button
                        mode="outlined"
                        onPress={() => handleEdit(item)}
                        style={styles.actionButton}
                        textColor={Theme.colors.secondary}
                        icon="pencil">
                        Edit
                    </Button>
                    <Button
                        mode="outlined"
                        onPress={() => handleDelete(item)}
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
                <Text style={styles.loadingText}>Loading education records...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={educations}
                renderItem={renderEducation}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <EmptyState
                        icon="school"
                        title="No Education Records"
                        message="Add your educational qualifications to enhance your profile"
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
                Add Education
            </Button>

            {/* Add/Edit Dialog */}
            <Portal>
                <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
                    <Dialog.Title>
                        {editingEducation ? 'Edit Education' : 'Add Education'}
                    </Dialog.Title>
                    <Dialog.ScrollArea>
                        <View style={styles.dialogContent}>
                            <TextInput
                                label="Degree *"
                                value={degree}
                                onChangeText={setDegree}
                                mode="outlined"
                                style={styles.input}
                                placeholder="e.g., Bachelor of Engineering"
                            />
                            <TextInput
                                label="Institution *"
                                value={institution}
                                onChangeText={setInstitution}
                                mode="outlined"
                                style={styles.input}
                                placeholder="e.g., IIT Delhi"
                            />
                            <TextInput
                                label="Field of Study"
                                value={fieldOfStudy}
                                onChangeText={setFieldOfStudy}
                                mode="outlined"
                                style={styles.input}
                                placeholder="e.g., Computer Science"
                            />
                            <TextInput
                                label="Year of Passing"
                                value={yearOfPassing}
                                onChangeText={setYearOfPassing}
                                mode="outlined"
                                style={styles.input}
                                keyboardType="numeric"
                                placeholder="e.g., 2020"
                            />
                            <TextInput
                                label="Grade/Percentage"
                                value={grade}
                                onChangeText={setGrade}
                                mode="outlined"
                                style={styles.input}
                                placeholder="e.g., 8.5 CGPA or 85%"
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
    degree: {
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginBottom: 4,
    },
    institution: {
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

export default EducationManagementScreen;
