/**
 * Shared types for profile creation
 */

export type ProfileFormData = {
  // Step 1: Basic Info
  name: string;
  dateOfBirth: Date;
  gender: string;
  height: number;

  // Step 2: Location
  state: string;
  city: string;
  nativeDistrict: string;

  // Step 3: Religion & Community
  religion: string;
  caste: string;
  subCaste?: string;
  maritalStatus: string;

  // Step 4: Education & Occupation
  education: string;
  educationDetails?: string;
  occupation: string;
  occupationDetails?: string;
  annualIncome?: string;

  // Step 5: About & Hobbies
  aboutMe: string;
  hobbies: string[];

  // Step 6: Photos
  photos: string[]; // Base64 or file URIs
};
