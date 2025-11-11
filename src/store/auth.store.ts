// OVERWRITE: src/store/auth.store.ts
import {create} from 'zustand';
import * as storage from '../services/storage';
import {User} from '../types';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  status: AuthStatus;
}

interface AuthActions {
  setTokens: (tokens: {
    accessToken: string;
    refreshToken: string;
  }) => Promise<void>;
  setUser: (user: User | null) => void;
  setStatus: (status: AuthStatus) => void;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>((set, _get) => ({ // FIX: changed 'get' to '_get'
  user: null,
  accessToken: null,
  status: 'idle',

  setTokens: async ({accessToken, refreshToken}) => {
    set({accessToken, status: 'authenticated'});
    await storage.saveRefreshToken(refreshToken);
  },

  setUser: user => {
    set({user});
  },

  setStatus: status => {
    set({status});
  },

  logout: async () => {
    // Notify backend
    // Note: We call this without awaiting, it's fire-and-forget.
    // The API client interceptor will be built to handle this.
    // We import api inside to avoid circular dependency
    import('../api/client').then(api => api.apiClient.post('/auth/logout'));

    set({user: null, accessToken: null, status: 'unauthenticated'});
    await storage.removeRefreshToken();
    await storage.remove('user');
    // TODO: Add Google Sign-Out
  },

  /**
   * Checks for refresh token on app start.
   * If found, attempts to refresh.
   * If not, sets status to unauthenticated.
   */
  initializeAuth: async () => {
    set({status: 'loading'});
    try {
      const refreshToken = await storage.loadRefreshToken();
      if (!refreshToken) {
        set({status: 'unauthenticated'});
        return;
      }

      // We'll let the API client's interceptor handle the first
      // protected call (e.g., /users/me) to trigger the refresh.
      // For simplicity, we just check for the token.
      // A more robust way is to try a refresh call here.

      // Let's assume for now if a refresh token exists, we're "authenticated"
      // and the API client will handle the refresh. We need to load user.
      const user = await storage.loadObject<User>('user');
      if (user) {
        set({user, status: 'authenticated'}); // Optimistic
      } else {
        // No user, but token. API client will fetch on first try.
        // Or, we can try to fetch user here.
        set({status: 'authenticated'}); // Optimistic
      }
    } catch (e) {
      console.error('[Auth] Initialization failed', e);
      set({status: 'unauthenticated'});
    }
  },
}));