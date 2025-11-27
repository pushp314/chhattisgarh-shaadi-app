import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, useTheme } from 'react-native-paper';
import { useOnboardingStore } from '../../store/onboardingStore';

interface FamilyDetailsStepProps {
    onNext: () => void;
    onBack: () => void;
}

const FamilyDetailsStep: React.FC<FamilyDetailsStepProps> = ({ onNext, onBack }) => {
    const theme = useTheme();

    // Use individual selectors to avoid re-render loops
    const storeFatherName = useOnboardingStore((state) => state.fatherName);
    const storeFatherOccupation = useOnboardingStore((state) => state.fatherOccupation);
    const storeMotherName = useOnboardingStore((state) => state.motherName);
    const storeMotherOccupation = useOnboardingStore((state) => state.motherOccupation);
    const storeNumberOfBrothers = useOnboardingStore((state) => state.numberOfBrothers);
    const storeNumberOfSisters = useOnboardingStore((state) => state.numberOfSisters);
    const storeFamilyType = useOnboardingStore((state) => state.familyType);
    const storeFamilyStatus = useOnboardingStore((state) => state.familyStatus);
    const updateOnboardingData = useOnboardingStore((state) => state.updateOnboardingData);

    // Local state for form fields (initialize once from store)
    const [fatherName, setFatherName] = useState(storeFatherName || '');
    const [fatherOccupation, setFatherOccupation] = useState(storeFatherOccupation || '');
    const [motherName, setMotherName] = useState(storeMotherName || '');
    const [motherOccupation, setMotherOccupation] = useState(storeMotherOccupation || '');
    const [numberOfBrothers, setNumberOfBrothers] = useState(storeNumberOfBrothers?.toString() || '0');
    const [numberOfSisters, setNumberOfSisters] = useState(storeNumberOfSisters?.toString() || '0');
    const [familyType, setFamilyType] = useState(storeFamilyType || '');
    const [familyStatus, setFamilyStatus] = useState(storeFamilyStatus || '');

    // Sync local state with store when store values change (for auto-fill)
    React.useEffect(() => {
        if (storeFatherName) setFatherName(storeFatherName);
        if (storeFatherOccupation) setFatherOccupation(storeFatherOccupation);
        if (storeMotherName) setMotherName(storeMotherName);
        if (storeMotherOccupation) setMotherOccupation(storeMotherOccupation);
        if (storeNumberOfBrothers !== undefined) setNumberOfBrothers(storeNumberOfBrothers.toString());
        if (storeNumberOfSisters !== undefined) setNumberOfSisters(storeNumberOfSisters.toString());
        if (storeFamilyType) setFamilyType(storeFamilyType);
        if (storeFamilyStatus) setFamilyStatus(storeFamilyStatus);
    }, [storeFatherName, storeFatherOccupation, storeMotherName, storeMotherOccupation, storeNumberOfBrothers, storeNumberOfSisters, storeFamilyType, storeFamilyStatus]);

    const handleNext = () => {
        // Update store with all values
        if (fatherName) updateOnboardingData('fatherName', fatherName);
        if (fatherOccupation) updateOnboardingData('fatherOccupation', fatherOccupation);
        if (motherName) updateOnboardingData('motherName', motherName);
        if (motherOccupation) updateOnboardingData('motherOccupation', motherOccupation);

        updateOnboardingData('numberOfBrothers', parseInt(numberOfBrothers) || 0);
        updateOnboardingData('numberOfSisters', parseInt(numberOfSisters) || 0);

        if (familyType) updateOnboardingData('familyType', familyType as any);
        if (familyStatus) updateOnboardingData('familyStatus', familyStatus as any);

        onNext();
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Text variant="headlineSmall" style={styles.title}>
                Family Details
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
                Tell us about your family background
            </Text>

            {/* Father's Details */}
            <Text variant="titleMedium" style={styles.sectionTitle}>
                Father's Details
            </Text>
            <TextInput
                label="Father's Name"
                value={fatherName}
                onChangeText={setFatherName}
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label="Father's Occupation"
                value={fatherOccupation}
                onChangeText={setFatherOccupation}
                mode="outlined"
                style={styles.input}
            />

            {/* Mother's Details */}
            <Text variant="titleMedium" style={styles.sectionTitle}>
                Mother's Details
            </Text>
            <TextInput
                label="Mother's Name"
                value={motherName}
                onChangeText={setMotherName}
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label="Mother's Occupation"
                value={motherOccupation}
                onChangeText={setMotherOccupation}
                mode="outlined"
                style={styles.input}
            />

            {/* Siblings */}
            <Text variant="titleMedium" style={styles.sectionTitle}>
                Siblings
            </Text>
            <View style={styles.row}>
                <TextInput
                    label="Number of Brothers"
                    value={numberOfBrothers}
                    onChangeText={setNumberOfBrothers}
                    keyboardType="numeric"
                    mode="outlined"
                    style={[styles.input, styles.halfInput]}
                />
                <TextInput
                    label="Number of Sisters"
                    value={numberOfSisters}
                    onChangeText={setNumberOfSisters}
                    keyboardType="numeric"
                    mode="outlined"
                    style={[styles.input, styles.halfInput]}
                />
            </View>

            {/* Family Type */}
            <Text variant="labelLarge" style={styles.label}>
                Family Type
            </Text>
            <SegmentedButtons
                value={familyType}
                onValueChange={setFamilyType}
                buttons={[
                    { value: 'NUCLEAR', label: 'Nuclear' },
                    { value: 'JOINT', label: 'Joint' },
                ]}
                style={styles.segmentedButtons}
            />

            {/* Family Status */}
            <Text variant="labelLarge" style={styles.label}>
                Family Status
            </Text>
            <SegmentedButtons
                value={familyStatus}
                onValueChange={setFamilyStatus}
                buttons={[
                    { value: 'MIDDLE_CLASS', label: 'Middle Class' },
                    { value: 'UPPER_MIDDLE', label: 'Upper Middle' },
                ]}
                style={styles.segmentedButtons}
            />
            <SegmentedButtons
                value={familyStatus}
                onValueChange={setFamilyStatus}
                buttons={[
                    { value: 'RICH', label: 'Rich' },
                    { value: 'AFFLUENT', label: 'Affluent' },
                ]}
                style={styles.segmentedButtons}
            />

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                <Button
                    mode="outlined"
                    onPress={onBack}
                    style={styles.button}
                >
                    Back
                </Button>
                <Button
                    mode="contained"
                    onPress={handleNext}
                    style={styles.button}
                >
                    Next
                </Button>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        marginBottom: 24,
        opacity: 0.7,
    },
    sectionTitle: {
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 12,
    },
    input: {
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfInput: {
        flex: 1,
    },
    label: {
        marginTop: 8,
        marginBottom: 8,
    },
    segmentedButtons: {
        marginBottom: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        gap: 12,
    },
    button: {
        flex: 1,
    },
});

export default FamilyDetailsStep;
