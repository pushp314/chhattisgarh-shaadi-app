/**
 * FCM Service
 * Handles Firebase Cloud Messaging logic with local notification display
 */
import messaging from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid, AppState, Alert } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import userService from './user.service';
import { useAuthStore } from '../store/authStore';

class FCMService {
    private messageUnsubscribe: (() => void) | null = null;
    private tokenRefreshUnsubscribe: (() => void) | null = null;

    /**
     * Request User Permission for Notifications
     */
    async requestUserPermission(): Promise<boolean> {
        try {
            if (Platform.OS === 'ios') {
                const authStatus = await messaging().requestPermission();
                const enabled =
                    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

                if (enabled) {
                    console.log('iOS notification permission granted:', authStatus);
                    return true;
                }
            } else if (Platform.OS === 'android') {
                // For Android 13+ (API 33+)
                if (Platform.Version >= 33) {
                    // Wait for activity to be attached
                    if (AppState.currentState !== 'active') {
                        console.log('Waiting for app to be active before requesting permission...');
                        await new Promise<void>(resolve => {
                            const subscription = AppState.addEventListener('change', nextAppState => {
                                if (nextAppState === 'active') {
                                    subscription.remove();
                                    resolve();
                                }
                            });
                        });
                    }

                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        console.log('Android notification permission granted');
                        return true;
                    } else {
                        console.log('Android notification permission denied');
                        return false;
                    }
                } else {
                    // Android < 13 doesn't need explicit permission
                    return true;
                }
            }
        } catch (error) {
            console.error('Permission request failed:', error);
        }
        return false;
    }

    /**
     * Get FCM Token
     */
    async getFCMToken(): Promise<string | null> {
        try {
            const token = await messaging().getToken();
            if (token) {
                if (__DEV__) console.log('FCM Token:', token.substring(0, 20) + '...');
                return token;
            }
        } catch (error) {
            console.error('Failed to get FCM token:', error);
        }
        return null;
    }

    /**
     * Register Token with Backend
     */
    async registerTokenWithBackend(): Promise<void> {
        try {
            const user = useAuthStore.getState().user;
            if (!user) {
                if (__DEV__) console.log('No user logged in, skipping FCM registration');
                return;
            }

            const token = await this.getFCMToken();
            if (token) {
                const deviceId = await DeviceInfo.getUniqueId();
                const deviceName = await DeviceInfo.getDeviceName();
                const deviceType = Platform.OS === 'ios' ? 'IOS' : 'ANDROID';

                await userService.registerFcmToken(token, deviceId, deviceName, deviceType);
                if (__DEV__) console.log('FCM token registered with backend');
            }
        } catch (error) {
            console.error('Failed to register FCM token with backend:', error);
        }
    }

    /**
     * Listen for Foreground Messages
     */
    listenForMessages(): () => void {
        this.messageUnsubscribe = messaging().onMessage(async remoteMessage => {
            if (__DEV__) console.log('Foreground FCM message received:', remoteMessage);

            // Show in-app alert for foreground notifications
            const { notification, data } = remoteMessage;
            if (notification) {
                Alert.alert(
                    notification.title || 'Notification',
                    notification.body || '',
                    [
                        { text: 'Dismiss', style: 'cancel' },
                        {
                            text: 'View',
                            onPress: () => this.handleNotificationPress(data)
                        },
                    ]
                );
            }
        });

        return () => {
            if (this.messageUnsubscribe) {
                this.messageUnsubscribe();
            }
        };
    }

    /**
     * Handle notification press - navigate based on data
     */
    private handleNotificationPress(data: any): void {
        if (__DEV__) console.log('Notification pressed with data:', data);
        // Navigation logic can be handled here
        // You can emit an event or use a navigation ref
    }

    /**
     * Handle Token Refresh
     */
    onTokenRefresh(): () => void {
        this.tokenRefreshUnsubscribe = messaging().onTokenRefresh(token => {
            if (__DEV__) console.log('FCM Token Refreshed');
            this.registerTokenWithBackend();
        });

        return () => {
            if (this.tokenRefreshUnsubscribe) {
                this.tokenRefreshUnsubscribe();
            }
        };
    }

    /**
     * Set up background message handler
     * NOTE: This should be called in index.js, not in a component
     */
    static setBackgroundMessageHandler(): void {
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            if (__DEV__) console.log('Background FCM message:', remoteMessage);
            // Handle background message (e.g., update badge count)
        });
    }

    /**
     * Initial Notification Check (When app opened from quit state)
     */
    async checkInitialNotification(): Promise<any> {
        try {
            const remoteMessage = await messaging().getInitialNotification();
            if (remoteMessage) {
                if (__DEV__) console.log('App opened from quit state by notification:', remoteMessage);
                return remoteMessage;
            }
        } catch (error) {
            console.error('Error checking initial notification:', error);
        }
        return null;
    }

    /**
     * Handle notification opened app (background state)
     */
    onNotificationOpenedApp(callback: (data: any) => void): () => void {
        return messaging().onNotificationOpenedApp(remoteMessage => {
            if (__DEV__) console.log('App opened from background by notification:', remoteMessage);
            callback(remoteMessage.data);
        });
    }

    /**
     * Unsubscribe from all listeners
     */
    cleanup(): void {
        if (this.messageUnsubscribe) this.messageUnsubscribe();
        if (this.tokenRefreshUnsubscribe) this.tokenRefreshUnsubscribe();
    }
}

export default new FCMService();
