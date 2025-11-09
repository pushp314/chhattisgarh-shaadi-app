import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack Params
export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Welcome: undefined;
  GoogleAuth: undefined;
  PhoneVerification: undefined;
  OtpVerification: {
    phoneNumber: string;
    countryCode: string;
  };
  LanguageSelection: undefined;
};

// Profile Creation Stack Params
export type ProfileStackParamList = {
  CreateProfile: undefined;
  BasicInfo: undefined;
  ReligiousInfo: undefined;
  PhysicalAttributes: undefined;
  Lifestyle: undefined;
  Location: undefined;
  About: undefined;
  FamilyInfo: undefined;
  Horoscope: undefined;
  Education: undefined;
  Occupation: undefined;
  Photos: undefined;
  ProfilePreview: undefined;
};

// Main Bottom Tab Params
export type MainTabParamList = {
  Home: undefined;
  Discover: undefined;
  Matches: undefined;
  Chat: undefined;
  Settings: undefined;
};

// Main Stack Params (includes bottom tabs)
export type MainStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  EditProfile: undefined;
  Notifications: undefined;
  ChatScreen: {
    profileId: number;
    profileName: string;
    profilePhoto: string;
  };
  ProfileDetail: {
    profileId: number;
  };

  CreateProfile: undefined; // Or pass { isEditing: true } if you want
};

// Root Navigator Params
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

// Navigation Props Types
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

