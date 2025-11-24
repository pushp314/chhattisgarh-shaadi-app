import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, useTheme } from 'react-native-paper';
import { useOnboardingStore } from '../../store/onboardingStore';

interface PhysicalLifestyleStepProps {
    onNext: () => void;
    onBack: () => void;
}

const PhysicalLifestyleStep: React.FC<PhysicalLifestyleStepProps> = ({ onNext, onBack }) => {
    const theme = useTheme();

    // Use individual selectors to avoid re-render loops
    const storeWeight = useOnboardingStore((state) => state.weight);
    const storeBloodGroup = useOnboardingStore((state) => state.bloodGroup);
    const storeDiet = useOnboardingStore((state) => state.diet);
    const storeSmokingHabit = useOnboardingStore((state) => state.smokingHabit);
    const storeDrinkingHabit = useOnboardingStore((state) => state.drinkingHabit);
    const storeComplexion = useOnboardingStore((state) => state.complexion);
    const storeBodyType = useOnboardingStore((state) => state.bodyType);
    const updateOnboardingData = useOnboardingStore((state) => state.updateOnboardingData);

    // Local state for form fields (initialize once from store)
    const [weight, setWeight] = useState(storeWeight?.toString() || '');
    const [bloodGroup, setBloodGroup] = useState(storeBloodGroup || '');
    const [diet, setDiet] = useState(storeDiet || '');
    const [smokingHabit, setSmokingHabit] = useState(storeSmokingHabit || '');
    const [drinkingHabit, setDrinkingHabit] = useState(storeDrinkingHabit || '');
    const [complexion, setComplexion] = useState(storeComplexion || '');
    const [bodyType, setBodyType] = useState(storeBodyType || '');

    const handleNext = () => {
        // Update store with all values
        if (weight) {
            updateOnboardingData('weight', parseFloat(weight));
        }
        if (bloodGroup) {
            updateOnboardingData('bloodGroup', bloodGroup);
        }
        if (diet) {
            updateOnboardingData('diet', diet as any);
        }
        if (smokingHabit) {
            updateOnboardingData('smokingHabit', smokingHabit as any);
        }
        if (drinkingHabit) {
            updateOnboardingData('drinkingHabit', drinkingHabit as any);
        }
        if (complexion) {
            updateOnboardingData('complexion', complexion);
        }
        if (bodyType) {
            updateOnboardingData('bodyType', bodyType);
        }
        onNext();
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Text variant="headlineSmall" style={styles.title}>
                Physical & Lifestyle Details
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
                Tell us about your physical attributes and lifestyle preferences
            </Text>

            {/* Weight */}
            <TextInput
                label="Weight (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
            />

            {/* Blood Group */}
            <Text variant="labelLarge" style={styles.label}>
                Blood Group (Optional)
            </Text>
            <SegmentedButtons
                value={bloodGroup}
                onValueChange={setBloodGroup}
                buttons={[
                    { value: 'O+', label: 'O+' },
                    { value: 'A+', label: 'A+' },
                    { value: 'B+', label: 'B+' },
                    { value: 'AB+', label: 'AB+' },
                ]}
                style={styles.segmentedButtons}
            />
            <SegmentedButtons
                value={bloodGroup}
                onValueChange={setBloodGroup}
                buttons={[
                    { value: 'O-', label: 'O-' },
                    { value: 'A-', label: 'A-' },
                    { value: 'B-', label: 'B-' },
                    { value: 'AB-', label: 'AB-' },
                ]}
                style={styles.segmentedButtons}
            />

            {/* Diet */}
            <Text variant="labelLarge" style={styles.label}>
                Diet Preference
            </Text>
            <SegmentedButtons
                value={diet}
                onValueChange={setDiet}
                buttons={[
                    { value: 'VEG', label: 'Veg' },
                    { value: 'NON_VEG', label: 'Non-Veg' },
                    { value: 'EGGITARIAN', label: 'Eggetarian' },
                    { value: 'VEGAN', label: 'Vegan' },
                ]}
                style={styles.segmentedButtons}
            />

            {/* Smoking Habit */}
            <Text variant="labelLarge" style={styles.label}>
                Smoking Habit
            </Text>
            <SegmentedButtons
                value={smokingHabit}
                onValueChange={setSmokingHabit}
                buttons={[
                    { value: 'NO', label: 'No' },
                    { value: 'OCCASIONALLY', label: 'Occasionally' },
                    { value: 'YES', label: 'Yes' },
                ]}
                style={styles.segmentedButtons}
            />

            {/* Drinking Habit */}
            <Text variant="labelLarge" style={styles.label}>
                Drinking Habit
            </Text>
            <SegmentedButtons
                value={drinkingHabit}
                onValueChange={setDrinkingHabit}
                buttons={[
                    { value: 'NO', label: 'No' },
                    { value: 'OCCASIONALLY', label: 'Occasionally' },
                    { value: 'YES', label: 'Yes' },
                ]}
                style={styles.segmentedButtons}
            />

            {/* Complexion */}
            <Text variant="labelLarge" style={styles.label}>
                Complexion (Optional)
            </Text>
            <SegmentedButtons
                value={complexion}
                onValueChange={setComplexion}
                buttons={[
                    { value: 'Fair', label: 'Fair' },
                    { value: 'Wheatish', label: 'Wheatish' },
                    { value: 'Dark', label: 'Dark' },
                ]}
                style={styles.segmentedButtons}
            />

            {/* Body Type */}
            <Text variant="labelLarge" style={styles.label}>
                Body Type (Optional)
            </Text>
            <SegmentedButtons
                value={bodyType}
                onValueChange={setBodyType}
                buttons={[
                    { value: 'Slim', label: 'Slim' },
                    { value: 'Average', label: 'Average' },
                    { value: 'Athletic', label: 'Athletic' },
                    { value: 'Heavy', label: 'Heavy' },
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
    input: {
        marginBottom: 16,
    },
    label: {
        marginTop: 8,
        marginBottom: 8,
    },
    segmentedButtons: {
        marginBottom: 16,
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

export default PhysicalLifestyleStep;
