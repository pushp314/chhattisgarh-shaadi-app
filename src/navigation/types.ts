// CREATE: src/navigation/types.ts
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

// Params for the auth stack
export type AuthStackParamList = {
  Login: undefined;
  PhoneLogin: undefined;
  VerifyOtp: {phone: string};
};

// Params for the main app tabs
export type MainTabsParamList = {
  Discover: undefined;
  Matches: undefined;
  Messages: undefined;
  Me: undefined;
};

// Params for the main app stack (post-auth)
export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
  ProfileSetup: undefined;
  ProfileDetail: {userId: string};
  ChatDetail: {userId: string; name: string};
  Payment: undefined;
  Settings: undefined;
};

// Combined Root Stack (for the navigator)
export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};

/**
 * Screen Prop Types
 * These helpers make it easy to type your screen components
 */

// Props for screens in the RootStack
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

// Props for screens in the AuthStack
export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

// Props for screens in the AppStack
export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

// Props for screens in the MainTabs
// Note: CompositeScreenProps is used to combine tab props with stack props
export type MainTabScreenProps<T extends keyof MainTabsParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabsParamList, T>,
    AppStackScreenProps<keyof AppStackParamList>
  >;