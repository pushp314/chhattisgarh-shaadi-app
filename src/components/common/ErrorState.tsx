import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
    title?: string;
    message: string;
    onRetry?: () => void;
};

const ErrorState: React.FC<Props> = ({
    title = 'Oops! Something went wrong',
    message,
    onRetry,
}) => {
    return (
        <View style={styles.container}>
            <Icon name="alert-circle-outline" size={80} color="#F44336" />
            <Text variant="headlineSmall" style={styles.title}>
                {title}
            </Text>
            <Text variant="bodyMedium" style={styles.message}>
                {message}
            </Text>
            {onRetry && (
                <Button
                    mode="contained"
                    onPress={onRetry}
                    icon="refresh"
                    style={styles.button}
                    buttonColor="#D81B60">
                    Try Again
                </Button>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    title: {
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
        color: '#F44336',
    },
    message: {
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    button: {
        marginTop: 8,
    },
});

export default ErrorState;
