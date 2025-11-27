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

// Main Tab Navigator
export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Matches: undefined;
  Messages: undefined;
  Profile: undefined;
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
};

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}
