// CREATE: src/services/google.config.ts
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    /**
     * TODO: IMPORTANT!
     * Replace with your Web Client ID from Google Cloud Console
     * (the one for your backend, not Android)
     */
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
    offlineAccess: true, // required to get idToken
  });
};