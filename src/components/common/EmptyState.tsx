import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Theme } from '../../constants/theme';
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
            <Icon name={icon} size={80} color={Theme.colors.textSecondary} />
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
                    buttonColor={Theme.colors.secondary}
                    textColor={Theme.colors.primaryDark}>
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
        color: Theme.colors.text,
    },
    message: {
        color: Theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    button: {
        marginTop: 8,
        borderRadius: 8,
    },
});

export default EmptyState;
