import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
    icon: string;
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
};

const EmptyState: React.FC<Props> = ({
    icon,
    title,
    message,
    actionLabel,
    onAction,
}) => {
    return (
        <View style={styles.container}>
            <Icon name={icon} size={80} color="#BDBDBD" />
            <Text variant="headlineSmall" style={styles.title}>
                {title}
            </Text>
            <Text variant="bodyMedium" style={styles.message}>
                {message}
            </Text>
            {actionLabel && onAction && (
                <Button
                    mode="contained"
                    onPress={onAction}
                    style={styles.button}
                    buttonColor="#D81B60">
                    {actionLabel}
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

export default EmptyState;
