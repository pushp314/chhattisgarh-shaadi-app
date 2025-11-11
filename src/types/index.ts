// CREATE: src/types/index.ts

// This would be expanded based on your Prisma schema
export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  role: 'USER' | 'ADMIN';
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  googleId: string | null;
  createdAt: string;
  updatedAt: string;
  profile: Profile | null;
}

export interface Profile {
  id: string;
  userId: string;
  bio: string | null;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  // Add all other profile fields from your schema...
  // e.g., height, religion, caste, education, occupation, etc.
  photos: Media[];
  idProof: Media | null;
  isComplete: boolean;
}

export interface Media {
  id: string;
  url: string;
  type: 'IMAGE' | 'DOCUMENT';
  key: string; // S3 key
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Add other types as needed (Message, Match, Notification, etc.)