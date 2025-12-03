/**
 * Report Profile Dialog Component
 * Allows users to report inappropriate profiles with category selection
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
    Dialog,
    Portal,
    Button,
    RadioButton,
    Text,
    TextInput,
} from 'react-native-paper';
import { Theme } from '../../constants/theme';

export type ReportReason =
    | 'FAKE_PROFILE'
    | 'INAPPROPRIATE_CONTENT'
    | 'HARASSMENT'
    | 'SPAM'
    | 'UNDERAGE'
    | 'MARRIED'
    | 'SCAM'
    | 'OTHER';

interface ReportProfileDialogProps {
    visible: boolean;
    onDismiss: () => void;
    onSubmit: (reason: ReportReason, details?: string) => void;
    isSubmitting?: boolean;
}

const REPORT_REASONS: { value: ReportReason; label: string; description: string }[] = [
    {
        value: 'FAKE_PROFILE',
        label: 'Fake Profile',
        description: 'Profile uses fake photos or information',
    },
    {
        value: 'INAPPROPRIATE_CONTENT',
        label: 'Inappropriate Content',
        description: 'Profile contains offensive or inappropriate content',
    },
    {
        value: 'HARASSMENT',
        label: 'Harassment',
        description: 'User is harassing or threatening',
    },
    {
        value: 'SPAM',
        label: 'Spam',
        description: 'Profile is spamming or promoting services',
    },
    {
        value: 'UNDERAGE',
        label: 'Underage User',
        description: 'User appears to be under 18 years old',
    },
    {
        value: 'MARRIED',
        label: 'Already Married',
        description: 'User is already married but not disclosed',
    },
    {
        value: 'SCAM',
        label: 'Scam/Fraud',
        description: 'Profile appears to be a scam or fraud',
    },
    {
        value: 'OTHER',
        label: 'Other',
        description: 'Other reason not listed above',
    },
];

const ReportProfileDialog: React.FC<ReportProfileDialogProps> = ({
    visible,
    onDismiss,
    onSubmit,
    isSubmitting = false,
}) => {
    const [selectedReason, setSelectedReason] = useState<ReportReason>('FAKE_PROFILE');
    const [details, setDetails] = useState('');

    const handleSubmit = () => {
        onSubmit(selectedReason, details.trim() || undefined);
    };

    const handleDismiss = () => {
        setSelectedReason('FAKE_PROFILE');
        setDetails('');
        onDismiss();
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={handleDismiss} style={styles.dialog}>
                <Dialog.Title style={styles.title}>Report Profile</Dialog.Title>
                <Dialog.ScrollArea>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <Text variant="bodyMedium" style={styles.subtitle}>
                            Please select a reason for reporting this profile:
                        </Text>

                        <RadioButton.Group
                            onValueChange={value => setSelectedReason(value as ReportReason)}
                            value={selectedReason}>
                            {REPORT_REASONS.map(reason => (
                                <View key={reason.value} style={styles.radioItem}>
                                    <RadioButton.Item
                                        label={reason.label}
                                        value={reason.value}
                                        labelStyle={styles.radioLabel}
                                        style={styles.radioButton}
                                        color={Theme.colors.primary}
                                    />
                                    <Text variant="bodySmall" style={styles.reasonDescription}>
                                        {reason.description}
                                    </Text>
                                </View>
                            ))}
                        </RadioButton.Group>

                        <TextInput
                            label="Additional Details (Optional)"
                            value={details}
                            onChangeText={setDetails}
                            mode="outlined"
                            multiline
                            numberOfLines={4}
                            style={styles.textInput}
                            placeholder="Provide any additional information..."
                        />

                        <View style={styles.warningBox}>
                            <Text variant="bodySmall" style={styles.warningText}>
                                ⚠️ False reports may result in account suspension. Please report only genuine
                                concerns.
                            </Text>
                        </View>
                    </ScrollView>
                </Dialog.ScrollArea>
                <Dialog.Actions>
                    <Button onPress={handleDismiss} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onPress={handleSubmit}
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        textColor={Theme.colors.primary}
                        mode="contained"
                        buttonColor={Theme.colors.primary}>
                        Submit Report
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    dialog: {
        maxHeight: '80%',
    },
    title: {
        color: Theme.colors.primary,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 16,
    },
    subtitle: {
        marginBottom: 16,
        color: Theme.colors.text,
    },
    radioItem: {
        marginBottom: 8,
    },
    radioButton: {
        paddingVertical: 0,
    },
    radioLabel: {
        fontSize: 16,
        color: Theme.colors.text,
    },
    reasonDescription: {
        marginLeft: 56,
        marginTop: -8,
        marginBottom: 8,
        color: Theme.colors.textSecondary,
        fontStyle: 'italic',
    },
    textInput: {
        marginTop: 16,
        marginBottom: 16,
    },
    warningBox: {
        backgroundColor: Theme.colors.surfaceCard,
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: Theme.colors.secondary,
    },
    warningText: {
        color: Theme.colors.textSecondary,
        lineHeight: 18,
    },
});

export default ReportProfileDialog;
