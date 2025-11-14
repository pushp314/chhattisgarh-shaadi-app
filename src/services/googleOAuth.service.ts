/**
 * Alternative Google OAuth Service using WebView
 * This is more reliable than the native Google Sign-In SDK
 */

import { Linking } from 'react-native';

const GOOGLE_OAUTH_CONFIG = {
  clientId: '250704044564-q3ql66oruro0a17ipumla9cloda24tkk.apps.googleusercontent.com',
  redirectUri: 'com.chhattisgarhshaadi.app:/oauth2redirect', // Or use https://your-domain.com/oauth/callback
  scopes: [
    'openid',
    'profile',
    'email',
  ],
};

class GoogleOAuthService {
  /**
   * Generate OAuth URL
   */
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: GOOGLE_OAUTH_CONFIG.clientId,
      redirect_uri: GOOGLE_OAUTH_CONFIG.redirectUri,
      response_type: 'code',
      scope: GOOGLE_OAUTH_CONFIG.scopes.join(' '),
      access_type: 'offline',
      prompt: 'consent',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Open Google OAuth in browser
   */
  async signIn(): Promise<string> {
    const authUrl = this.getAuthUrl();
    
    // Open OAuth URL
    const supported = await Linking.canOpenURL(authUrl);
    if (!supported) {
      throw new Error('Cannot open Google OAuth URL');
    }

    // Listen for redirect
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        Linking.removeAllListeners('url');
        reject(new Error('OAuth timeout'));
      }, 5 * 60 * 1000); // 5 minutes

      Linking.addEventListener('url', ({ url }) => {
        clearTimeout(timeout);
        Linking.removeAllListeners('url');

        // Extract authorization code
        const match = url.match(/code=([^&]+)/);
        if (match && match[1]) {
          resolve(match[1]);
        } else {
          reject(new Error('No authorization code received'));
        }
      });

      // Open the URL
      Linking.openURL(authUrl);
    });
  }

  /**
   * Exchange authorization code for tokens (call your backend)
   */
  async exchangeCodeForTokens(_authCode: string): Promise<any> {
    // Your backend should handle this
    // POST /auth/google/exchange
    // { code: _authCode }
    // Backend exchanges code for ID token and returns user data
    throw new Error('Implement this by calling your backend /auth/google/exchange endpoint');
  }
}

export default new GoogleOAuthService();
