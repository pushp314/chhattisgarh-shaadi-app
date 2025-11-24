/**
 * Shared types for profile creation
 * Matches backend API requirements
 */

export type ProfileFormData = {
  // Step 1: Basic Info
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO Date string
  gender: string; // MALE | FEMALE | OTHER
  height?: number;
  weight?: number;
  complexion?: string;
  bodyType?: string;
  physicalStatus?: string;
  bio?: string;

  // Step 2: Location
  state: string; // Main state field (e.g., "Chhattisgarh")
  city: string;
  country: string;
  nativeDistrict?: string;
  nativeTehsil?: string;
  nativeVillage?: string;
  speaksChhattisgarhi?: boolean;

  // Step 3: Religion & Community
  religion: string; // HINDU | MUSLIM | etc.
  caste?: string;
  subCaste?: string;
  gothram?: string;
  maritalStatus: string; // NEVER_MARRIED | DIVORCED | etc.
  motherTongue?: string;

  // Step 4: Education & Occupation (Collected here, sent separately)
  education?: {
    degree?: string;
    institution?: string;
    field?: string;
    yearOfPassing?: number;
    grade?: string;
    isCurrent?: boolean;
  };
  occupation?: {
    companyName?: string;
    designation?: string;
    employmentType?: string;
    industry?: string;
    annualIncome?: string;
    isCurrent?: boolean;
    location?: string;
  };

  // Step 5: Family Details
  fatherName?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherOccupation?: string;
  numberOfBrothers?: number;
  numberOfSisters?: number;
  familyType?: string;
  familyStatus?: string;

  // Step 6: About & Preferences
  hobbies?: string[];
  partnerExpectations?: string;
  diet?: string;
  smokingHabit?: string;
  drinkingHabit?: string;

  // Step 7: Horoscope (Hindu only)
  manglik?: boolean;
  birthTime?: string;
  birthPlace?: string;
  rashi?: string;
  nakshatra?: string;

  // Step 8: Photos
  photos: string[]; // File URIs for upload
};

export type EducationPayload = {
  degree: string;
  institution: string;
  field?: string;
  yearOfPassing?: number;
  grade?: string;
  isCurrent?: boolean;
};

export type OccupationPayload = {
  companyName: string;
  designation: string;
  employmentType?: string;
  industry?: string;
  annualIncome?: string;
  isCurrent?: boolean;
  location?: string;
};
