import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AuthAPI } from '../api/auth.api';
import { StorageService } from '../utils/storage';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // From Google Cloud Console
  offlineAccess: false,
  forceCodeForRefreshToken: false,
});

export const AuthService = {
  // Check if user is signed in
  async isSignedIn(): Promise<boolean> {
    const token = await StorageService.getAccessToken();
    return token !== null;
  },

  // Google Sign-In
  async signInWithGoogle() {
    try {
      // Check Google Play Services
      await GoogleSignin.hasPlayServices();

      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();

      if (!userInfo.data?.idToken) {
        throw new Error('No ID token received from Google');
      }

      // Send ID token to backend
      const response = await AuthAPI.googleAuth(userInfo.data.idToken);

      // Save tokens
      await StorageService.saveTokens(
        response.data.accessToken,
        response.data.refreshToken
      );

      // Save user data
      await StorageService.saveUser(response.data.user);

      return {
        user: response.data.user,
        isNewUser: response.data.isNewUser,
      };
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      const refreshToken = await StorageService.getRefreshToken();

      // Revoke Google token
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();

      // Call backend logout
      if (refreshToken) {
        await AuthAPI.logout(refreshToken);
      }

      // Clear local storage
      await StorageService.clearAll();
    } catch (error) {
      console.error('Logout error:', error);
      // Clear storage anyway
      await StorageService.clearAll();
    }
  },

  // Get current user
  async getCurrentUser() {
    return await StorageService.getUser();
  },
};