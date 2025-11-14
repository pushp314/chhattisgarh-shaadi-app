# Chhattisgarh Shaadi App - AI Coding Agent Instructions

## Project Overview
React Native 0.81.4 matrimony/matchmaking mobile app with New Architecture enabled. Currently in early development with core dependencies configured but minimal implementation.

## Tech Stack & Architecture

### Core Framework
- **React Native 0.81.4** with New Architecture (`newArchEnabled=true` in `android/gradle.properties`)
- **Hermes** JavaScript engine (enabled)
- **TypeScript 5.8.3** - extends `@react-native/typescript-config`
- **Node.js >=20** required

### Key Dependencies & Usage Patterns
- **State Management**: Zustand (`zustand`) - prefer over Context API for global state
- **Navigation**: React Navigation v7 (native-stack, stack, bottom-tabs)
- **Forms**: React Hook Form + Zod for validation (`@hookform/resolvers`, `zod`)
- **UI**: React Native Paper 5.14.5 + React Native Vector Icons
- **Firebase**: Messaging & core (`@react-native-firebase/app`, `@react-native-firebase/messaging`)
- **Real-time**: Socket.io client for chat/notifications
- **Auth**: Google Sign-In, React Native Keychain for secure storage
- **Payments**: Razorpay integration
- **Media**: Image Crop Picker for profile photos
- **Animations**: Reanimated 4.1.3 + Worklets (note: worklets plugin in `babel.config.js`)

### Entry Point & Setup
Main entry is `index.js` which wraps `App.tsx` with:
```javascript
<GestureHandlerRootView style={{ flex: 1 }}>
  <PaperProvider>
    <App />
  </PaperProvider>
</GestureHandlerRootView>
```
**Important**: New components requiring gestures must be wrapped in existing `GestureHandlerRootView`, not nested.

## Development Workflows

### Running the App
```bash
# Start Metro bundler
npm start

# Android (auto-installs APK to emulator/device)
npm run android

# iOS (requires CocoaPods setup first)
bundle install                    # First time only
bundle exec pod install           # After any native dependency changes
npm run ios
```

### iOS Native Dependencies
**Critical**: After installing/updating native modules, always run:
```bash
cd ios && bundle exec pod install && cd ..
```
Podfile uses CocoaPods 1.13+ with specific exclusions for problematic versions (see `Gemfile`).

### Android Configuration
- **Package**: `com.chhattisgarhshaadi.app`
- **Firebase**: `google-services.json` in `android/app/` (configured for project ID `chhattishgarh-shaadi`)
- **Signing**: Uses debug keystore for both debug and release builds (production keystore needed before release)
- **API Keys**: Google Client ID stored in `android/local.properties` as `GOOGLE_CLIENT_ID` (not tracked in git)
- **Permissions**: Camera, storage, internet already declared in `AndroidManifest.xml`

### iOS Configuration
- **Bundle ID**: `org.reactjs.native.example.AwesomeProject` (needs updating for production)
- **Minimum iOS**: 15.1
- **Swift**: AppDelegate in Swift (`ios/AwesomeProject/AppDelegate.swift`)
- **Privacy**: `PrivacyInfo.xcprivacy` tracks file timestamps, user defaults, system boot time

## Critical Development Patterns

### Adding Native Modules
1. Install npm package: `npm install <package>`
2. **Android**: Autolinking handles most cases; check `android/app/build.gradle` for manual additions
3. **iOS**: Run `bundle exec pod install` from root
4. Rebuild: `npm run android` / `npm run ios`

### Babel Configuration
Custom setup for Reanimated Worklets:
```javascript
plugins: ['react-native-worklets/plugin']  // Required for Reanimated
env: { production: { plugins: ['react-native-paper/babel'] } }
```
Don't remove worklets plugin when adding other Babel plugins.

### Form Validation Pattern
Use React Hook Form + Zod schema:
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({ /* fields */ });
const { control, handleSubmit } = useForm({ resolver: zodResolver(schema) });
```

### Firebase Integration
- **Android**: `google-services` plugin applied in `android/app/build.gradle`
- **iOS**: Requires `GoogleService-Info.plist` (not yet present - add to `ios/AwesomeProject/`)
- Firebase BoM 34.5.0 ensures compatible versions

### Vector Icons
Fonts auto-linked via `apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")` in `android/app/build.gradle`. For iOS, fonts configured in Podfile.

## Testing
- Jest 29.6.3 configured with `preset: 'react-native'`
- Single test: `__tests__/App.test.tsx` (currently basic render test)
- Run: `npm test`

## Code Style
- Prettier configured: arrow parens avoid, single quotes, trailing commas
- ESLint extends `@react-native`
- Format: `npm run lint`

## Common Gotchas

1. **New Architecture**: Some third-party libraries may need updates for compatibility. Check library docs for Fabric/TurboModules support.

2. **Android Build Issues**: If builds fail, try:
   ```bash
   cd android && ./gradlew clean && cd ..
   rm -rf android/app/build
   ```

3. **iOS Simulator Reset**: Metro cache can cause issues:
   ```bash
   npm start -- --reset-cache
   ```

4. **Reanimated Worklets**: Functions passed to `useAnimatedStyle`, `withTiming`, etc. run on UI thread. Can't access non-worklet functions/closures.

5. **Google Sign-In**: Requires `GOOGLE_CLIENT_ID` in `android/local.properties`. iOS needs client ID in `Info.plist` URL scheme.

## Project Structure
Organized `src/` directory with proper separation of concerns:

```
src/
├── config/         # API endpoints, base URLs
├── constants/      # Enums matching backend
├── types/          # TypeScript definitions
├── services/       # API layer (auth, profile, messages, matches, socket)
├── store/          # Zustand stores (auth, profile)
├── navigation/     # React Navigation setup
│   ├── stacks/    # Stack navigators for each tab
│   └── types.ts   # Navigation types
├── screens/        # Screen components organized by feature
│   ├── auth/      # Welcome, Google Sign-In, Phone Verification
│   ├── home/      # Home feed
│   ├── search/    # Search and filters
│   ├── matches/   # Match requests
│   ├── messages/  # Chat screens
│   └── profile/   # Profile management
└── components/     # Reusable UI components
```

See `src/README.md` for detailed documentation.

## API Integration

### Services Architecture
All API calls are centralized in service files:
- **auth.service.ts**: Google Sign-In, phone OTP, logout
- **profile.service.ts**: CRUD operations, photo uploads
- **message.service.ts**: Chat, conversations
- **match.service.ts**: Match requests
- **socket.service.ts**: Real-time Socket.io communication

### Axios Configuration
`api.service.ts` provides:
- Automatic token injection via interceptors
- Token refresh on 401 errors
- Centralized error handling
- Token storage with AsyncStorage

### Making API Calls
```typescript
import profileService from '../services/profile.service';

const profile = await profileService.getMyProfile();
```

## State Management

### Zustand Stores
- **authStore**: User authentication, login/logout, phone verification
- **profileStore**: Profile data, completeness, photo uploads

Usage:
```typescript
import { useAuthStore } from '../store/authStore';

const { user, isAuthenticated, signInWithGoogle } = useAuthStore();
```

## Current Implementation Status

### ✅ Completed
1. **API Integration Layer**: All services configured with automatic token refresh
2. **Authentication Screens**: Welcome, Google Sign-In, Phone Verification with gradient UI
3. **Navigation Structure**: Auth flow + Main app with 5 bottom tabs
4. **State Management**: Zustand stores for auth and profile
5. **Socket.io Setup**: Real-time messaging infrastructure
6. **Type Safety**: Full TypeScript coverage with enums matching backend

### 🚧 In Progress / Next Steps
1. **Profile Screens**: Create profile wizard, edit profile, photo upload UI
2. **Search & Discovery**: Filter UI, profile cards, pagination
3. **Messaging UI**: Chat interface, typing indicators, message bubbles
4. **Match Requests**: Send/accept/reject UI
5. **Razorpay Integration**: Payment screens and subscription management

## Firebase Analytics
Firebase Analytics is imported in `android/app/build.gradle`. Enable by initializing in app startup code.

## Configuration Required Before Running

### 1. API Base URL
Update `src/config/api.config.ts`:
```typescript
BASE_URL: 'http://YOUR_LOCAL_IP:8080/api/v1'  // For Android emulator/device
```

### 2. Google Sign-In
Update `src/services/auth.service.ts`:
```typescript
webClientId: 'YOUR_WEB_CLIENT_ID_FROM_GOOGLE_CONSOLE'
```

### 3. iOS Firebase
Add `GoogleService-Info.plist` to `ios/AwesomeProject/`
