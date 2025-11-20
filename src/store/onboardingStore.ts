import { create } from 'zustand';
import { Profile } from '../types'; // Assuming your main Profile type can be used/adapted

// This type will represent the entire multi-step form data
type OnboardingState = Partial<Profile> & {
  photos: string[]; // Store photo URIs
};

// Define the actions available for this store
interface OnboardingActions {
  // Action to update a slice of the state. K is a key of OnboardingState.
  updateOnboardingData: <K extends keyof OnboardingState>(key: K, data: OnboardingState[K]) => void;
  // Action to add a single photo URI
  addPhoto: (photoUri: string) => void;
  // Action to set all photos at once
  setPhotos: (photoUris: string[]) => void;
  // Action to reset the entire store to its initial state
  resetOnboardingState: () => void;
}

// Define the initial state for the onboarding process
const initialState: OnboardingState = {
  // Basic Info
  fullName: '',
  dob: undefined,
  gender: undefined,
  height: undefined,

  // Location
  city: '',
  state: '',
  country: 'India',

  // Religion
  religion: '',
  community: '',
  gotra: '',

  // Education & Career
  education: [],
  occupation: undefined,

  // About
  aboutMe: '',

  // Photos
  photos: [],
  
  // Partner Preferences
  partnerPreferences: undefined,
};

// Create the Zustand store
export const useOnboardingStore = create<OnboardingState & OnboardingActions>((set) => ({
  ...initialState,

  updateOnboardingData: (key, data) => {
    set((state) => ({ ...state, [key]: data }));
  },

  addPhoto: (photoUri) => {
    set((state) => ({ photos: [...state.photos, photoUri] }));
  },
  
  setPhotos: (photoUris) => {
    set({ photos: photoUris });
  },

  resetOnboardingState: () => {
    set(initialState);
  },
}));
