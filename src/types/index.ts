/**
 * TypeScript Type Definitions
 * Matches backend data models
 */

import {
  Gender,
  Language,
  MaritalStatus,
  Religion,
  MotherTongue,
  MatchStatus,
  SubscriptionStatus,
  PaymentStatus,
  MediaType,
  NotificationType,
  NotificationChannel,
  UserRole,
} from '../constants/enums';

// Re-export enums for convenience
export {
  Gender,
  Language,
  MaritalStatus,
  Religion,
  MotherTongue,
  MatchStatus,
  SubscriptionStatus,
  PaymentStatus,
  MediaType,
  NotificationType,
  NotificationChannel,
  UserRole,
};

export interface User {
  id: number;
  email: string;
  googleId: string;
  phone?: string;
  countryCode: string;
  isPhoneVerified: boolean;
  profilePicture?: string;
  role: UserRole;
  preferredLanguage: Language;
  isActive: boolean;
  isBanned: boolean;
  createdAt: string;
  profile?: Profile;
}

export interface Profile {
  id: number;
  userId: number;
  profileId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  religion: Religion;
  motherTongue: MotherTongue;
  caste?: string;
  country: string;
  state: string;
  city: string;
  height?: number;
  speaksChhattisgarhi: boolean;
  nativeDistrict?: string;
  nativeVillage?: string;
  nativeTehsil?: string;
  bio?: string;
  occupation?: string;
  annualIncome?: string;
  hobbies?: string;
  education?: string;
  profileCompleteness: number;
  isVerified: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  media?: Media[];
}

export interface Media {
  id: number;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  mediumUrl?: string;
  largeUrl?: string;
  createdAt: string;
}

export interface MatchRequest {
  id: number;
  senderId: number;
  receiverId: number;
  status: MatchStatus;
  message?: string;
  responseMessage?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  sender?: User;
  receiver?: User;
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  attachmentUrl?: string;
  attachmentType?: string;
  isRead: boolean;
  createdAt: string;
  sender?: User;
  receiver?: User;
}

export interface Conversation {
  userId: number;
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  message: string;
  data?: string;
  language: Language;
  isRead: boolean;
  createdAt: string;
}

export interface Payment {
  id: number;
  userId: number;
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: string;
}

export interface Subscription {
  id: number;
  userId: number;
  planId: number;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  isNewUser: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  data: T;
  message: string;
  errors?: any[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SearchProfilesParams extends PaginationParams {
  gender?: Gender;
  minAge?: number;
  maxAge?: number;
  religions?: string;
  castes?: string;
  maritalStatus?: MaritalStatus;
  minHeight?: number;
  maxHeight?: number;
  city?: string;
  state?: string;
}

export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  deviceType: 'IOS' | 'ANDROID';
  userAgent: string;
}
