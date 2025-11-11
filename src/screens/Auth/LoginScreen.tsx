// OVERWRITE: src/screens/Auth/LoginScreen.tsx
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Text, ActivityIndicator, useTheme} from 'react-native-paper';
import {
  GoogleSignin,
  statusCodes,
  SignInResponse, // Import the response type for clarity
} from '@react-native-google-signin/google-signin';
import {authService} from '../../api/client';
import {useAuthStore} from '../../store/auth.store';
import {AuthStackScreenProps} from '../../navigation/types';

type Props = AuthStackScreenProps<'Login'>;

export const LoginScreen = ({navigation}: Props) => {
  const theme = useTheme();
  const setTokens = useAuthStore(state => state.setTokens);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await GoogleSignin.hasPlayServices();
      
      // --- Refactored Method ---
      // 1. Get the full response object without destructuring
      const signInResponse: SignInResponse = await GoogleSignin.signIn();

      // 2. (Optional) Log the full object to debug its structure
      console.log('[GoogleSignIn] Full Response:', signInResponse);

      // 3. Safely access the idToken property from the variable
      const idToken = signInResponse.idToken;
      // --- End Refactor ---
      
      if (!idToken) {
        throw new Error('Google Sign-In failed to return an idToken.');
      }

      // Send idToken to your backend
      const {data: tokens} = await authService.googleLogin(idToken);
      
      // Save tokens to store (which saves to state and keychain)
      await setTokens(tokens);

      // Navigation will be handled by RootNavigator
    } catch (e: any) {
      if (e.code === statusCodes.SIGN_IN_CANCELLED) {
        setError('Sign-in cancelled.');
      } else if (e.code === statusCodes.IN_PROGRESS) {
        setError('Sign-in is already in progress.');
      } else if (e.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setError('Google Play Services not available.');
      } else {
        console.error('Google Sign-In Error', e);
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        Chhattisgarh Shaadi
      </Text>
      
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Button
            mode="contained"
            icon="google"
            onPress={handleGoogleSignIn}
            style={styles.button}>
            Sign in with Google
          </Button>
          <Button
            mode="outlined"
            icon="phone"
            onPress={() => navigation.navigate('PhoneLogin')}
            style={styles.button}>
            Sign in with Phone
          </Button>
        </>
      )}

      {error && <Text style={[styles.error, {color: theme.colors.error}]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 40,
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    marginVertical: 10,
  },
  error: {
    marginTop: 20,
    textAlign: 'center',
  },
});