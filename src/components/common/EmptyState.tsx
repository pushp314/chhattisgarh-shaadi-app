import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Theme } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
    icon?: string;
    image?: any;
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
    style?: any;
};

const EmptyState: React.FC<Props> = ({
    icon = 'alert-circle-outline',
    image,
    title,
    message,
    actionLabel,
    onAction,
    style,
}) => {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.iconContainer}>
                {image ? (
                    <Image source={image} style={styles.image} resizeMode="contain" />
                ) : (
                    <Icon name={icon} size={64} color={Theme.colors.primary} />
                )}
            </View>
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
                    contentStyle={styles.buttonContent}
                    buttonColor={Theme.colors.primary}>
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
        minHeight: 400,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: 80,
        height: 80,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
        color: Theme.colors.text,
    },
    message: {
        color: Theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
        maxWidth: '80%',
    },
    button: {
        borderRadius: 24,
        elevation: 4,
    },
    buttonContent: {
        paddingHorizontal: 24,
        height: 48,
    },
});

export default EmptyState;
