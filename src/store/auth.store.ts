import { create } from 'zustand';
import { AuthService } from '../services/auth.service';

interface AuthState {
  isAuthenticated: boolean;
  hasProfile: boolean;
  user: any | null;
  checkAuth: () => Promise<void>; // Add action to check auth on load
  login: (user: any, hasProfile: boolean) => void;
  logout: () => void;
  setHasProfile: (hasProfile: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  hasProfile: false,
  user: null,
  login: (user, hasProfile) => set({ isAuthenticated: true, user, hasProfile }),
  logout: () => set({ isAuthenticated: false, user: null, hasProfile: false }),
  setHasProfile: (hasProfile) => set({ hasProfile }),
  checkAuth: async () => {
    // This logic moves from App.tsx/RootNavigator
    // You'd also check your secure token here
    const user = await AuthService.getCurrentUser(); // Assuming this checks token
    if (user) {
      set({ isAuthenticated: true, user, hasProfile: user.profile != null });
    } else {
      set({ isAuthenticated: false, user: null, hasProfile: false });
    }
  },
}));