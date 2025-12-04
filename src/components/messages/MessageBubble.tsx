/**
 * Message Bubble Component
 * WhatsApp-style message bubbles for chat
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/theme';

interface MessageBubbleProps {
    message: string;
    timestamp: string;
    isSent: boolean;
    isRead?: boolean;
    isDelivered?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
    message,
    timestamp,
    isSent,
    isRead = false,
    isDelivered = false,
}) => {
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    if (isSent) {
        return (
            <View style={styles.sentContainer}>
                <LinearGradient
                    colors={['#E91E63', '#D81B60']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.sentBubble}
                >
                    <Text style={styles.sentText}>{message}</Text>
                    <View style={styles.sentFooter}>
                        <Text style={styles.sentTimestamp}>{formatTime(timestamp)}</Text>
                        {isRead ? (
                            <Icon name="check-all" size={16} color="#fff" style={styles.checkmark} />
                        ) : isDelivered ? (
                            <Icon name="check-all" size={16} color="rgba(255,255,255,0.7)" style={styles.checkmark} />
                        ) : (
                            <Icon name="check" size={16} color="rgba(255,255,255,0.7)" style={styles.checkmark} />
                        )}
                    </View>
                </LinearGradient>
            </View>
        );
    }

    return (
        <View style={styles.receivedContainer}>
            <View style={styles.receivedBubble}>
                <Text style={styles.receivedText}>{message}</Text>
                <Text style={styles.receivedTimestamp}>{formatTime(timestamp)}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sentContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: 4,
        marginHorizontal: 16,
    },
    sentBubble: {
        maxWidth: '75%',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        borderTopRightRadius: 4,
    },
    sentText: {
        color: '#fff',
        fontSize: 15,
        lineHeight: 20,
    },
    sentFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 4,
    },
    sentTimestamp: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 11,
        marginRight: 4,
    },
    checkmark: {
        marginLeft: 2,
    },
    receivedContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginVertical: 4,
        marginHorizontal: 16,
    },
    receivedBubble: {
        maxWidth: '75%',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        borderTopLeftRadius: 4,
    },
    receivedText: {
        color: '#333',
        fontSize: 15,
        lineHeight: 20,
    },
    receivedTimestamp: {
        color: '#999',
        fontSize: 11,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
});

export default MessageBubble;
