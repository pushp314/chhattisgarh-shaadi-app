/**
 * Shared types for profile creation
 * Matches backend API requirements
 */

export type ProfileFormData = {
  // Step 1: Basic Info
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string; // MALE | FEMALE | OTHER
  height: number;
  weight?: number;
  complexion?: string;
  bodyType?: string;
  physicalStatus?: string;

  // Step 2: Location
  state: string; // Should be enum like CHHATTISGARH
  city: string;
  nativeState?: string;
  nativeDistrict: string;
  speaksChhattisgarhi?: boolean;

  // Step 3: Religion & Community
  religion: string; // HINDU | MUSLIM | etc.
  caste: string;
  subCaste?: string;
  maritalStatus: string; // NEVER_MARRIED | DIVORCED | etc.
  motherTongue?: string;

  // Step 4: Education & Occupation
  education?: string;
  educationDetails?: string;
  occupation?: string;
  occupationDetails?: string;
  annualIncome?: string;

  // Step 5: About & Preferences
  aboutMe: string;
  hobbies?: string[];
  eatingHabits?: string;
  drinkingHabits?: string;
  smokingHabits?: string;

  // Step 6: Photos
  photos: string[]; // File URIs for upload
};
