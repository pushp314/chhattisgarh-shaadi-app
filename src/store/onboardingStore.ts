import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile } from '../types';

// Extended type for onboarding with additional fields
type OnboardingState = Partial<Profile> & {
  photos: string[]; // Store photo URIs

  // Chhattisgarh-Specific Location (additional)
  nativeTehsil?: string;
  nativeVillage?: string;

  // Physical & Lifestyle (additional fields not in Profile type)
  weight?: number;
  bloodGroup?: string; // NEW: O+, A+, B+, AB+, etc.
  diet?: 'VEG' | 'NON_VEG' | 'EGGITARIAN' | 'VEGAN';
  smokingHabit?: 'YES' | 'NO' | 'OCCASIONALLY';
  drinkingHabit?: 'YES' | 'NO' | 'OCCASIONALLY';
  complexion?: string;
  bodyType?: string;

  // Education & Career (expanded)
  highestEducation?: 'DOCTORATE' | 'MASTERS' | 'BACHELORS' | 'DIPLOMA' | 'HIGH_SCHOOL' | 'LESS_THAN_HIGH_SCHOOL';
  educationDetails?: string;
  occupationType?: 'PRIVATE_JOB' | 'GOVERNMENT_JOB' | 'BUSINESS' | 'SELF_EMPLOYED' | 'NOT_WORKING' | 'STUDENT';
  jobTitle?: string;
  occupationDetails?: string;
  annualIncome?: string;
  workLocation?: string;

  // Religion (additional)
  subCaste?: string;
  gothram?: string; // NEW: Important for Hindu marriages

  // Family Details
  fatherName?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherOccupation?: string;
  numberOfBrothers?: number;
  numberOfSisters?: number;
  familyType?: 'JOINT' | 'NUCLEAR';
  familyStatus?: 'MIDDLE_CLASS' | 'UPPER_MIDDLE' | 'RICH' | 'AFFLUENT';

  // About (additional)
  partnerExpectations?: string; // NEW: What they're looking for in partner

  // Horoscope (for Hindu profiles)
  manglik?: boolean; // NEW: Manglik status
  birthTime?: string; // NEW: Time of birth (HH:MM format)
  birthPlace?: string; // NEW: Place of birth
  rashi?: string; // NEW: Moon sign
  nakshatra?: string; // NEW: Birth star
};

// Define the actions available for this store
interface OnboardingActions {
  updateOnboardingData: <K extends keyof OnboardingState>(key: K, data: OnboardingState[K]) => void;
  addPhoto: (photoUri: string) => void;
  setPhotos: (photoUris: string[]) => void;
  resetOnboardingState: () => void;
}

// Define the initial state for the onboarding process
const initialState: OnboardingState = {
  // Basic Info
  firstName: '',
  lastName: '',
  dateOfBirth: undefined,
  gender: undefined,
  height: undefined,
  maritalStatus: undefined,
  motherTongue: undefined,

  // Location
  city: '',
  state: '',
  country: 'India',
  nativeDistrict: '',
  nativeTehsil: '',
  nativeVillage: '',
  speaksChhattisgarhi: false,

  // Religion
  religion: undefined,
  caste: '',
  subCaste: '',
  gothram: '',

  // Physical & Lifestyle
  weight: undefined,
  bloodGroup: undefined,
  diet: undefined,
  smokingHabit: undefined,
  drinkingHabit: undefined,
  complexion: undefined,
  bodyType: undefined,

  // Education & Career
  education: undefined,
  occupation: undefined,
  highestEducation: undefined,
  educationDetails: '',
  occupationType: undefined,
  jobTitle: '',
  occupationDetails: '',
  annualIncome: undefined,
  workLocation: '',

  // Family Details
  fatherName: '',
  fatherOccupation: '',
  motherName: '',
  motherOccupation: '',
  numberOfBrothers: 0,
  numberOfSisters: 0,
  familyType: undefined,
  familyStatus: undefined,

  // About
  bio: '',
  hobbies: '',
  partnerExpectations: '',

  // Horoscope
  manglik: undefined,
  birthTime: '',
  birthPlace: '',
  rashi: '',
  nakshatra: '',

  // Photos
  photos: [],
};

// Create the Zustand store with persist middleware for auto-save
export const useOnboardingStore = create<OnboardingState & OnboardingActions>()(
  persist(
    (set) => ({
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
    }),
    {
      name: 'onboarding-storage', // unique name for AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the actual data, not the action functions
      partialize: (state) => {
        const { updateOnboardingData, addPhoto, setPhotos, resetOnboardingState, ...data } = state as any;
        return data;
      },
    }
  )
);
