# Source Code Structure

This directory contains the main source code for the Chhattisgarh Shaadi matrimony app.

## Directory Structure

```
src/
├── config/              # Configuration files
│   └── api.config.ts    # API endpoints and base URLs
│
├── constants/           # App-wide constants
│   └── enums.ts        # Enums matching backend
│
├── types/              # TypeScript type definitions
│   └── index.ts        # All type definitions
│
├── services/           # API and service layer
│   ├── api.service.ts      # Axios instance with interceptors
│   ├── auth.service.ts     # Authentication API calls
│   ├── profile.service.ts  # Profile management API calls
│   ├── message.service.ts  # Messaging API calls
│   ├── match.service.ts    # Match requests API calls
│   └── socket.service.ts   # Socket.io real-time communication
│
├── store/              # Zustand state management
│   ├── authStore.ts    # Authentication state
│   └── profileStore.ts # Profile state
│
├── navigation/         # React Navigation setup
│   ├── types.ts        # Navigation type definitions
│   ├── AppNavigator.tsx      # Root navigator
│   ├── AuthNavigator.tsx     # Auth flow navigation
│   ├── MainNavigator.tsx     # Main app bottom tabs
│   └── stacks/              # Stack navigators
│       ├── HomeStack.tsx
│       ├── SearchStack.tsx
│       ├── MatchesStack.tsx
│       ├── MessagesStack.tsx
│       └── ProfileStack.tsx
│
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   │   ├── WelcomeScreen.tsx
│   │   ├── GoogleSignInScreen.tsx
│   │   └── PhoneVerificationScreen.tsx
│   ├── home/          # Home screen
│   ├── search/        # Search screens
│   ├── matches/       # Match request screens
│   ├── messages/      # Messaging screens
│   └── profile/       # Profile screens
│
└── components/        # Reusable components
    └── PlaceholderScreen.tsx

```

## Key Features Implemented

### ✅ API Integration
- **Axios Configuration**: Pre-configured HTTP client with automatic token refresh
- **Authentication Service**: Google Sign-In, phone verification, logout
- **Profile Service**: CRUD operations, photo uploads
- **Message Service**: Chat functionality
- **Match Service**: Send/accept/reject match requests
- **Socket Service**: Real-time messaging and notifications

### ✅ State Management (Zustand)
- **Auth Store**: User authentication state
- **Profile Store**: User profile data and completeness tracking

### ✅ Navigation (React Navigation v7)
- **Auth Flow**: Welcome → Google Sign-In → Phone Verification
- **Main App**: Bottom tabs (Home, Search, Matches, Messages, Profile)
- **Stack Navigators**: Nested navigation for each tab

### ✅ Authentication Screens
- Beautiful gradient UI with React Native Paper
- Google Sign-In integration
- One-time phone verification
- Error handling and loading states

## Next Steps for Development

### 1. Profile Management Screens
- Create profile wizard (multi-step form)
- Edit profile with photo upload
- Profile details view

### 2. Search & Discovery
- Search filters (age, location, religion, etc.)
- Profile cards with swipe gestures
- Pagination and infinite scroll

### 3. Messaging System
- Real-time chat UI
- Typing indicators
- Message read receipts
- Image attachments

### 4. Match Requests
- Send match request with message
- Accept/reject interface
- Match list screens

### 5. Additional Features
- Razorpay payment integration
- Push notifications setup
- Multi-language support (English, Hindi, Chhattisgarhi)
- Profile completeness indicator

## Important Configuration Notes

### API Base URL
Update in `src/config/api.config.ts`:
```typescript
BASE_URL: __DEV__
  ? 'http://localhost:8080/api/v1'       // Development
  : 'https://your-domain.com/api/v1',    // Production
```

### Google Sign-In Setup
1. Get Web Client ID from Google Cloud Console
2. Update in `src/services/auth.service.ts`:
```typescript
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID',
  ...
});
```

### Firebase Setup (iOS)
Add `GoogleService-Info.plist` to `ios/AwesomeProject/`

## Development Workflow

### Running the App
```bash
# Start Metro
npm start

# Run on Android
npm run android

# Run on iOS (after pod install)
npm run ios
```

### Testing API Integration
1. Start backend server on `localhost:8080`
2. Update `API_CONFIG.BASE_URL` if needed
3. Test authentication flow
4. Check network tab in React Native Debugger

## Common Patterns

### Making API Calls
```typescript
import profileService from '../services/profile.service';

// In component or store
const fetchProfile = async () => {
  try {
    const profile = await profileService.getMyProfile();
    console.log(profile);
  } catch (error) {
    console.error('Failed to fetch profile:', error);
  }
};
```

### Using Zustand Store
```typescript
import { useAuthStore } from '../store/authStore';

// In component
const { user, isAuthenticated, signInWithGoogle } = useAuthStore();
```

### Socket.io Events
```typescript
import socketService from '../services/socket.service';

// Listen to events
socketService.on('message:received', (data) => {
  console.log('New message:', data);
});

// Emit events
socketService.sendMessage(userId, 'Hello!');
```

## Code Style
- Use TypeScript for type safety
- Follow React Hooks best practices
- Use functional components only
- Keep components small and focused
- Prefer composition over inheritance
