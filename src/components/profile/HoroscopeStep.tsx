import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { useOnboardingStore } from '../../store/onboardingStore';
import DateTimePicker from '@react-native-community/datetimepicker';

type HoroscopeStepProps = {
    onNext: () => void;
    onBack: () => void;
};

const HoroscopeStep: React.FC<HoroscopeStepProps> = ({ onNext, onBack }) => {
    // Use individual selectors
    const storeManglik = useOnboardingStore((state) => state.manglik);
    const storeBirthTime = useOnboardingStore((state) => state.birthTime);
    const storeBirthPlace = useOnboardingStore((state) => state.birthPlace);
    const storeRashi = useOnboardingStore((state) => state.rashi);
    const storeNakshatra = useOnboardingStore((state) => state.nakshatra);
    const updateOnboardingData = useOnboardingStore((state) => state.updateOnboardingData);

    // Local state
    const [manglik, setManglik] = useState(storeManglik?.toString() || '');
    const [birthTime, setBirthTime] = useState(storeBirthTime || '');
    const [birthPlace, setBirthPlace] = useState(storeBirthPlace || '');
    const [rashi, setRashi] = useState(storeRashi || '');
    const [nakshatra, setNakshatra] = useState(storeNakshatra || '');

    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedTime, setSelectedTime] = useState(new Date());

    // Sync local state with store when store values change (for auto-fill)
    React.useEffect(() => {
        if (storeManglik !== undefined) setManglik(storeManglik ? 'yes' : 'no');
        if (storeBirthTime) setBirthTime(storeBirthTime);
        if (storeBirthPlace) setBirthPlace(storeBirthPlace);
        if (storeRashi) setRashi(storeRashi);
        if (storeNakshatra) setNakshatra(storeNakshatra);
    }, [storeManglik, storeBirthTime, storeBirthPlace, storeRashi, storeNakshatra]);

    const handleTimeChange = (event: any, time?: Date) => {
        setShowTimePicker(false);
        if (time) {
            const hours = time.getHours().toString().padStart(2, '0');
            const minutes = time.getMinutes().toString().padStart(2, '0');
            setBirthTime(`${hours}:${minutes}`);
        }
    };

    const handleNext = () => {
        // Update store
        if (manglik) {
            updateOnboardingData('manglik', manglik === 'yes');
        }
        if (birthTime) {
            updateOnboardingData('birthTime', birthTime);
        }
        if (birthPlace) {
            updateOnboardingData('birthPlace', birthPlace);
        }
        if (rashi) {
            updateOnboardingData('rashi', rashi);
        }
        if (nakshatra) {
            updateOnboardingData('nakshatra', nakshatra);
        }
        onNext();
    };

    const rashiOptions = [
        'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)',
        'Karka (Cancer)', 'Simha (Leo)', 'Kanya (Virgo)',
        'Tula (Libra)', 'Vrishchika (Scorpio)', 'Dhanu (Sagittarius)',
        'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
    ];

    const nakshatraOptions = [
        'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
        'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
        'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
        'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
        'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
    ];

    return (
        <ScrollView style={styles.container}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
                Horoscope Details (Optional)
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
                These details are important for Hindu marriages
            </Text>

            {/* Manglik Status */}
            <Text variant="labelLarge" style={styles.label}>
                Manglik Status
            </Text>
            <SegmentedButtons
                value={manglik}
                onValueChange={setManglik}
                buttons={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                    { value: 'unknown', label: "Don't Know" },
                ]}
                style={styles.segmentedButtons}
            />

            {/* Birth Time */}
            <TextInput
                label="Birth Time (Optional)"
                value={birthTime}
                onChangeText={setBirthTime}
                mode="outlined"
                style={styles.input}
                placeholder="HH:MM (24-hour format)"
                right={
                    <TextInput.Icon
                        icon="clock-outline"
                        onPress={() => setShowTimePicker(true)}
                    />
                }
            />

            {showTimePicker && (
                <DateTimePicker
                    value={selectedTime}
                    mode="time"
                    is24Hour={true}
                    onChange={handleTimeChange}
                />
            )}

            {/* Birth Place */}
            <TextInput
                label="Birth Place (Optional)"
                value={birthPlace}
                onChangeText={setBirthPlace}
                mode="outlined"
                style={styles.input}
                placeholder="e.g., Raipur, Chhattisgarh"
            />

            {/* Rashi (Moon Sign) */}
            <TextInput
                label="Rashi / Moon Sign (Optional)"
                value={rashi}
                onChangeText={setRashi}
                mode="outlined"
                style={styles.input}
                placeholder="e.g., Mesha, Vrishabha"
            />

            {/* Nakshatra */}
            <TextInput
                label="Nakshatra / Birth Star (Optional)"
                value={nakshatra}
                onChangeText={setNakshatra}
                mode="outlined"
                style={styles.input}
                placeholder="e.g., Ashwini, Bharani"
            />

            <View style={styles.buttonContainer}>
                <Button mode="outlined" onPress={onBack} style={styles.backButton}>
                    Back
                </Button>
                <Button mode="contained" onPress={handleNext} style={styles.nextButton}>
                    Next
                </Button>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16 },
    sectionTitle: { marginBottom: 8 },
    subtitle: { marginBottom: 24, opacity: 0.7 },
    label: { marginTop: 16, marginBottom: 8 },
    input: { marginBottom: 12 },
    segmentedButtons: { marginBottom: 16 },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        marginBottom: 32,
        gap: 12,
    },
    backButton: { flex: 1 },
    nextButton: { flex: 1 },
});

export default HoroscopeStep;
