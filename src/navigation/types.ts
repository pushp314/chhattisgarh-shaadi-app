/**
 * Navigation Types
 * Type definitions for React Navigation
 */

import { NavigatorScreenParams } from '@react-navigation/native';
import { Profile } from '../types';

// Auth Stack
export type AuthStackParamList = {
  Welcome: undefined;
  GoogleSignIn: undefined;
  PhoneVerification: undefined;
};

// Subscription Stack
export type SubscriptionStackParamList = {
  SubscriptionPlans: undefined;
  Payment: {
    planId: number;
    planName: string;
    amount: number;
    duration: number;
  };
  TransactionHistory: undefined;
};

// Main Tab Navigator
export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Matches: undefined;
  Messages: undefined;
  Subscription: undefined;
};

// Drawer Navigator
export type DrawerParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};

// Home Stack
export type HomeStackParamList = {
  HomeScreen: undefined;
  ProfileDetails: { userId: number };
  SendMatchRequest: { profile: Profile };
};

// Search Stack
export type SearchStackParamList = {
  SearchScreen: undefined;
  SearchResults: {
    query?: string;
    filters?: any;
  };
  ProfileDetails: { userId: number };
};

// Matches Stack
export type MatchesStackParamList = {
  MatchesScreen: undefined;
  MatchDetails: { matchId: number };
  ProfileDetails: { userId: number };
};

// Messages Stack
export type MessagesStackParamList = {
  ConversationsList: undefined;
  ChatScreen: { userId: number; userName: string };
};

// Profile Stack
export type ProfileStackParamList = {
  ProfileScreen: undefined;
  EditProfile: undefined;
  CreateProfile: undefined;
  PhoneVerification: undefined;
  Settings: undefined;
  Subscription: undefined;
  PhotoManagement: undefined;
  PartnerPreferences: undefined;
  Shortlist: undefined;
  NotificationCenter: undefined;
  WhoViewedMe: undefined;
  ProfileDetails: { userId: number };
  BlockedUsers: undefined;
  ContactRequests: undefined;
  MatchRequests: undefined;
  PhotoPrivacy: undefined;
  PhotoRequests: undefined;
  EducationManagement: undefined;
  OccupationManagement: undefined;
  PrivacyPolicy: undefined;
  TermsConditions: undefined;
};

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<DrawerParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}
