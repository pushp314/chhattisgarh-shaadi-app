// CREATE: src/hooks/useUserService.ts
import {useState, useCallback} from 'react';
import {useAuthStore} from '../store/auth.store';
import {userService} from '../api/client';
import * as storage from '../services/storage';

export const useUserService = () => {
  const {setUser, logout} = useAuthStore(state => ({
    setUser: state.setUser,
    logout: state.logout,
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const {data: user} = await userService.getMe();
      setUser(user);
      await storage.saveObject('user', user); // Cache user for next load
    } catch (e) {
      console.error('[useUserService] Failed to fetch /users/me', e);
      setError(e as Error);
      // If /me fails (e.g., token expired and refresh failed), log out
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [setUser, logout]);

  return {fetchUser, isLoading, error};
};