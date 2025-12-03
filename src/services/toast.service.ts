/**
 * Toast Notification Service
 * Provides elegant, non-blocking toast notifications
 */

import { ToastAndroid, Platform, Alert } from 'react-native';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

class ToastService {
    /**
     * Show a toast notification
     */
    show(message: string, type: ToastType = 'info', duration: 'short' | 'long' = 'short') {
        if (Platform.OS === 'android') {
            const toastDuration = duration === 'long' ? ToastAndroid.LONG : ToastAndroid.SHORT;
            ToastAndroid.show(message, toastDuration);
        } else {
            // For iOS, we'll use Alert as fallback (can be replaced with a custom toast component)
            Alert.alert(
                type === 'success' ? '✅ Success' :
                    type === 'error' ? '❌ Error' :
                        type === 'warning' ? '⚠️ Warning' :
                            'ℹ️ Info',
                message,
                [{ text: 'OK' }]
            );
        }
    }

    /**
     * Show success toast
     */
    success(message: string, duration: 'short' | 'long' = 'short') {
        this.show(message, 'success', duration);
    }

    /**
     * Show error toast
     */
    error(message: string, duration: 'short' | 'long' = 'short') {
        this.show(message, 'error', duration);
    }

    /**
     * Show info toast
     */
    info(message: string, duration: 'short' | 'long' = 'short') {
        this.show(message, 'info', duration);
    }

    /**
     * Show warning toast
     */
    warning(message: string, duration: 'short' | 'long' = 'short') {
        this.show(message, 'warning', duration);
    }
}

export default new ToastService();
