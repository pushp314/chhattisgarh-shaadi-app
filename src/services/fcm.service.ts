/**
 * FCM Service
 * Handles Firebase Cloud Messaging logic
 */
import messaging, {
    getMessaging,
    getToken,
    onMessage,
    onTokenRefresh,
    getInitialNotification,
    requestPermission,
} from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid, AppState } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import userService from './user.service';
import { useAuthStore } from '../store/authStore';

class FCMService {
    /**
     * Request User Permission for Notifications
     */
    async requestUserPermission() {
        try {
            if (Platform.OS === 'ios') {
                const msg = getMessaging();
                const authStatus = await requestPermission(msg);
                const enabled =
                    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

                if (enabled) {
                    console.log('Authorization status:', authStatus);
                    return true;
                }
            } else if (Platform.OS === 'android') {
                // For Android 13+
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
                        return true;
                    }
                } else {
                    return true;
                }
            }
        } catch (error) {
            console.error('Permission request failed', error);
        }
        return false;
    }

    /**
     * Get FCM Token
     */
    async getFCMToken() {
        try {
            const msg = getMessaging();
            const token = await getToken(msg);
            if (token) {
                console.log('FCM Token:', token);
                return token;
            }
        } catch (error) {
            console.error('Failed to get FCM token', error);
        }
        return null;
    }

    /**
     * Register Token with Backend
     */
    async registerTokenWithBackend() {
        const user = useAuthStore.getState().user;
        if (!user) return;

        const token = await this.getFCMToken();
        if (token) {
            const deviceId = await DeviceInfo.getUniqueId();
            const deviceName = await DeviceInfo.getDeviceName();
            const deviceType = Platform.OS === 'ios' ? 'IOS' : 'ANDROID';

            await userService.registerFcmToken(token, deviceId, deviceName, deviceType);
        }
    }

    /**
     * Listen for Foreground Messages
     */
    listenForMessages() {
        const msg = getMessaging();
        return onMessage(msg, async remoteMessage => {
            console.log('A new FCM message arrived!', remoteMessage);
            // Here you can show a local notification or toast
            // For now, we'll just log it. 
            // In a real app, use a toast service or local notifications library.
        });
    }

    /**
     * Handle Token Refresh
     */
    onTokenRefresh() {
        const msg = getMessaging();
        return onTokenRefresh(msg, token => {
            console.log('FCM Token Refreshed:', token);
            this.registerTokenWithBackend();
        });
    }

    /**
     * Initial Notification Check (When app opened from quit state)
     */
    async checkInitialNotification() {
        const msg = getMessaging();
        const remoteMessage = await getInitialNotification(msg);
        if (remoteMessage) {
            console.log('Notification caused app to open from quit state:', remoteMessage.notification);
            return remoteMessage;
        }
        return null;
    }
}

export default new FCMService();
