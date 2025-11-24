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
  gender?: Gender | 'MALE' | 'FEMALE';
  minAge?: number;
  maxAge?: number;
  religions?: string;
  castes?: string;
  maritalStatus?: MaritalStatus;
  minHeight?: number;
  maxHeight?: number;
  city?: string;
  state?: string;
  nativeDistrict?: string;
  speaksChhattisgarhi?: boolean;
}

export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  deviceType: 'IOS' | 'ANDROID';
  userAgent: string;
}

export interface Education {
  id: number;
  userId: number;
  degree: string;
  institution: string;
  field?: string;
  university?: string;
  yearOfPassing?: number;
  grade?: string;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Occupation {
  id: number;
  userId: number;
  companyName: string;
  designation: string;
  employmentType: string;
  industry?: string;
  annualIncome?: string;
  startDate?: string;
  endDate?: string;
  isCurrent: boolean;
  location?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerPreference {
  id: number;
  userId: number;
  ageFrom?: number;
  ageTo?: number;
  heightFrom?: number;
  heightTo?: number;
  religion?: Religion[];
  caste?: string[];
  motherTongue?: MotherTongue;
  maritalStatus?: MaritalStatus[];
  country?: string;
  state?: string[];
  city?: string[];
  residencyStatus?: string;
  nativeDistrict?: string[];
  mustSpeakChhattisgarhi?: boolean;
  education?: string[];
  occupation?: string[];
  annualIncome?: string;
  diet?: string;
  smoking?: string;
  drinking?: string;
  manglik?: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export enum ContactRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum ContactRequestType {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
}

export interface ContactRequest {
  id: number;
  senderId: number;
  receiverId: number;
  profileId: number;
  requestType: ContactRequestType;
  status: ContactRequestStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
  sender?: User;
  receiver?: User;
  profile?: Profile;
}

export interface BlockedUser {
  id: number;
  blockerId: number;
  blockedId: number;
  reason?: string;
  createdAt: string;
  blockedUser?: User;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  durationInMonths: number;
  features: string[];
  isActive: boolean;
}

export enum ReportType {
  PROFILE = 'PROFILE',
  MESSAGE = 'MESSAGE',
  PHOTO = 'PHOTO',
}

export interface Report {
  id: number;
  reporterId: number;
  reportedUserId: number;
  reason: string;
  description?: string;
  reportType: ReportType;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shortlist {
  id: number;
  userId: number;
  profileId: number;
  createdAt: string;
  profile?: Profile;
}

export enum PhotoRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface PhotoRequest {
  id: number;
  senderId: number;
  receiverId: number;
  photoId: number;
  message?: string;
  status: PhotoRequestStatus;
  createdAt: string;
  updatedAt: string;
  sender?: User;
  receiver?: User;
}

export interface PhotoPrivacySettings {
  visibility: 'REGISTERED' | 'MATCHED' | 'HIDDEN';
  enableWatermark: boolean;
  watermarkText?: string;
  watermarkPosition?: 'BOTTOM_RIGHT' | 'CENTER' | 'TOP_LEFT';
  preventScreenshots: boolean;
  disableRightClick: boolean;
  blurForNonPremium: boolean;
  blurLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  allowDownload: boolean;
  allowViewRequests: boolean;
  autoApprovePremium: boolean;
  autoApproveVerified: boolean;
}

export interface ProfilePrivacySettings {
  profileVisibility: 'PUBLIC' | 'REGISTERED' | 'MATCHED' | 'HIDDEN';
  showLastName: boolean;
  showEmail: 'PUBLIC' | 'REGISTERED' | 'MATCHED' | 'HIDDEN';
  showPhoneNumber: 'PUBLIC' | 'REGISTERED' | 'MATCHED' | 'HIDDEN';
  // Add other fields as needed from API docs
}

export interface CommunicationSettings {
  allowMatchRequestsFrom: 'EVERYONE' | 'MATCHED_ONLY' | 'HIDDEN';
  minAgeForRequests?: number;
  maxAgeForRequests?: number;
  allowMessagesFrom: 'EVERYONE' | 'MATCHED_ONLY';
  // Add other fields as needed from API docs
}

export interface SearchVisibilitySettings {
  showInSearch: boolean;
  showInSuggestions: boolean;
  visibleToFreeUsers: boolean;
  visibleToPremiumUsers: boolean;
  visibleToVerifiedUsers: boolean;
  // Add other fields as needed from API docs
}

export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  planName: string;
}

export interface ProfileView {
  id: number;
  viewerId: number;
  viewedProfileId: number;
  isAnonymous: boolean;
  createdAt: string;
  viewer?: User;
  viewedProfile?: Profile;
}

export interface AccountSecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod?: 'SMS' | 'EMAIL' | 'BOTH';
  requireOtpNewDevice: boolean;
  requireOtpNewLocation: boolean;
  sessionTimeout?: number;
  maxActiveSessions?: number;
  recoveryEmail?: string;
  recoveryPhone?: string;
}
