/**
 * Enums and Constants
 * Matches backend enums
 */

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum Language {
  EN = 'EN',
  HI = 'HI',
  CG = 'CG',
}

export enum MaritalStatus {
  NEVER_MARRIED = 'NEVER_MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED',
  AWAITING_DIVORCE = 'AWAITING_DIVORCE',
  ANNULLED = 'ANNULLED',
}

export enum Religion {
  HINDU = 'HINDU',
  MUSLIM = 'MUSLIM',
  CHRISTIAN = 'CHRISTIAN',
  SIKH = 'SIKH',
  BUDDHIST = 'BUDDHIST',
  JAIN = 'JAIN',
  PARSI = 'PARSI',
  JEWISH = 'JEWISH',
  BAHAI = 'BAHAI',
  NO_RELIGION = 'NO_RELIGION',
  SPIRITUAL = 'SPIRITUAL',
  OTHER = 'OTHER',
}

export enum MotherTongue {
  CHHATTISGARHI = 'CHHATTISGARHI',
  HINDI = 'HINDI',
  ENGLISH = 'ENGLISH',
  TAMIL = 'TAMIL',
  TELUGU = 'TELUGU',
  MALAYALAM = 'MALAYALAM',
  KANNADA = 'KANNADA',
  MARATHI = 'MARATHI',
  GUJARATI = 'GUJARATI',
  BENGALI = 'BENGALI',
  PUNJABI = 'PUNJABI',
  URDU = 'URDU',
  ODIA = 'ODIA',
  ASSAMESE = 'ASSAMESE',
  KONKANI = 'KONKANI',
  SINDHI = 'SINDHI',
  NEPALI = 'NEPALI',
  SANSKRIT = 'SANSKRIT',
  OTHER = 'OTHER',
}

export enum Education {
  HIGH_SCHOOL = 'High School',
  INTERMEDIATE = 'Intermediate',
  DIPLOMA = 'Diploma',
  BACHELORS = 'Bachelors',
  MASTERS = 'Masters',
  DOCTORATE = 'Doctorate',
  PROFESSIONAL = 'Professional Degree',
}

export enum Occupation {
  STUDENT = 'Student',
  PRIVATE_SECTOR = 'Private Sector',
  GOVERNMENT = 'Government Employee',
  SELF_EMPLOYED = 'Self Employed',
  BUSINESS = 'Business',
  DOCTOR = 'Doctor',
  ENGINEER = 'Engineer',
  TEACHER = 'Teacher',
  LAWYER = 'Lawyer',
  ACCOUNTANT = 'Accountant',
  FARMER = 'Farmer',
  HOMEMAKER = 'Homemaker',
  NOT_WORKING = 'Not Working',
  OTHER = 'Other',
}

export enum MatchStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

export enum MediaType {
  PROFILE_PHOTO = 'PROFILE_PHOTO',
  GALLERY_PHOTO = 'GALLERY_PHOTO',
  ID_PROOF = 'ID_PROOF',
  ADDRESS_PROOF = 'ADDRESS_PROOF',
  INCOME_PROOF = 'INCOME_PROOF',
  EDUCATION_CERTIFICATE = 'EDUCATION_CERTIFICATE',
  CHAT_IMAGE = 'CHAT_IMAGE',
  OTHER_DOCUMENT = 'OTHER_DOCUMENT',
}

export enum NotificationType {
  MATCH_REQUEST = 'MATCH_REQUEST',
  MATCH_ACCEPTED = 'MATCH_ACCEPTED',
  MATCH_REJECTED = 'MATCH_REJECTED',
  NEW_MESSAGE = 'NEW_MESSAGE',
  PROFILE_VIEW = 'PROFILE_VIEW',
  SHORTLISTED = 'SHORTLISTED',
  SUBSCRIPTION_EXPIRY = 'SUBSCRIPTION_EXPIRY',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PROFILE_VERIFIED = 'PROFILE_VERIFIED',
  PROFILE_REJECTED = 'PROFILE_REJECTED',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
  SECURITY_ALERT = 'SECURITY_ALERT',
}

export enum NotificationChannel {
  IN_APP = 'IN_APP',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
}

export enum UserRole {
  USER = 'USER',
  PREMIUM_USER = 'PREMIUM_USER',
  VERIFIED_USER = 'VERIFIED_USER',
  ADMIN = 'ADMIN',
}

export enum IndianState {
  ANDHRA_PRADESH = 'Andhra Pradesh',
  ARUNACHAL_PRADESH = 'Arunachal Pradesh',
  ASSAM = 'Assam',
  BIHAR = 'Bihar',
  CHHATTISGARH = 'Chhattisgarh',
  GOA = 'Goa',
  GUJARAT = 'Gujarat',
  HARYANA = 'Haryana',
  HIMACHAL_PRADESH = 'Himachal Pradesh',
  JHARKHAND = 'Jharkhand',
  KARNATAKA = 'Karnataka',
  KERALA = 'Kerala',
  MADHYA_PRADESH = 'Madhya Pradesh',
  MAHARASHTRA = 'Maharashtra',
  MANIPUR = 'Manipur',
  MEGHALAYA = 'Meghalaya',
  MIZORAM = 'Mizoram',
  NAGALAND = 'Nagaland',
  ODISHA = 'Odisha',
  PUNJAB = 'Punjab',
  RAJASTHAN = 'Rajasthan',
  SIKKIM = 'Sikkim',
  TAMIL_NADU = 'Tamil Nadu',
  TELANGANA = 'Telangana',
  TRIPURA = 'Tripura',
  UTTAR_PRADESH = 'Uttar Pradesh',
  UTTARAKHAND = 'Uttarakhand',
  WEST_BENGAL = 'West Bengal',
  DELHI = 'Delhi',
  JAMMU_AND_KASHMIR = 'Jammu and Kashmir',
  LADAKH = 'Ladakh',
  PUDUCHERRY = 'Puducherry',
  CHANDIGARH = 'Chandigarh',
}
