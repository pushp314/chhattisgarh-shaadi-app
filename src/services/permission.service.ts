
import { Platform, PermissionsAndroid, Permission, Alert } from 'react-native';

class PermissionService {
    async requestInitialPermissions() {
        if (Platform.OS === 'android') {
            try {
                const permissionsToRequest: Permission[] = [];

                // 1. Notification Permission (Android 13+)
                if (Platform.Version >= 33) {
                    permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
                }

                // 2. Camera Permission
                permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.CAMERA);

                // 3. Storage / Gallery Permissions
                if (Platform.Version >= 33) {
                    permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
                    // Add VIDEO/AUDIO if needed, but usually images are enough for profile
                } else {
                    permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
                    permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
                }

                const granted = await PermissionsAndroid.requestMultiple(permissionsToRequest);

                // Optional: Check results
                const allGranted = Object.values(granted).every(
                    (status) => status === PermissionsAndroid.RESULTS.GRANTED
                );

                if (!allGranted) {
                    console.log('Some permissions were denied');
                    // You could show an alert here explaining why, if critically needed
                } else {
                    console.log('All permissions granted');
                }

            } catch (err) {
                console.warn('Permission request error:', err);
            }
        }
    }
}

export const permissionService = new PermissionService();
