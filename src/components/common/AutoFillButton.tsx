/**
 * Auto-fill helper component for all profile form steps
 */
import React from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface AutoFillButtonProps {
    onAutoFill: () => void;
    style?: any;
}

const AutoFillButton: React.FC<AutoFillButtonProps> = ({ onAutoFill, style }) => {
    return (
        <Button
            mode="outlined"
            onPress={onAutoFill}
            style={[styles.button, style]}
            icon="auto-fix"
        >
            Auto-Fill Test Data
        </Button>
    );
};

const styles = StyleSheet.create({
    button: {
        marginBottom: 16,
    },
});

export default AutoFillButton;
