
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    handleRestart = () => {
        // In a real app, you might want to restart the app or clear specific state
        this.setState({ hasError: false, error: null });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Oops, Something went wrong</Text>
                    <ScrollView style={styles.scroll}>
                        <Text style={styles.errorText}>
                            {this.state.error?.toString()}
                        </Text>
                    </ScrollView>
                    <TouchableOpacity style={styles.button} onPress={this.handleRestart}>
                        <Text style={styles.buttonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#D81B60'
    },
    scroll: {
        maxHeight: 200,
        width: '100%',
        marginVertical: 20,
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 5
    },
    errorText: {
        color: '#333',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#D81B60',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold'
    }
});

export default ErrorBoundary;
