# Chhattisgarh Shadi - API Documentation for React Native Frontend

## 🌐 Base URL
```
Development: http://localhost:8080/api/v1
Production: https://your-domain.com/api/v1
```

## 🔐 Authentication Overview

### Authentication Flow
1. **Google OAuth Only** - No password-based authentication
2. User signs in with Google (get `idToken` from Google Sign-In SDK)
3. Send `idToken` to backend → receive `accessToken` & `refreshToken`
4. Store tokens securely (use `@react-native-async-storage/async-storage`)
5. Include `Authorization: Bearer {accessToken}` in all authenticated requests
6. **Phone verification is one-time only** - NOT for login

### Token Management
- **Access Token**: Expires in 15 minutes (use for API requests)
- **Refresh Token**: Expires in 7 days (use to get new access token)
- When access token expires, call `/auth/refresh` endpoint

---

## 📋 API Endpoints

### 1. Authentication (`/auth`)

#### 1.1 Google Sign In (Mobile)
```http
POST /auth/google
Content-Type: application/json

{
  "idToken": "google_id_token_from_sdk",
  "deviceInfo": {
    "deviceId": "unique_device_id",
    "deviceName": "iPhone 14 Pro",
    "deviceType": "IOS", // or "ANDROID"
    "userAgent": "app_version_info"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "googleId": "google_user_id",
      "profilePicture": "url_to_picture",
      "role": "USER",
      "preferredLanguage": "HI", // EN, HI, or CG
      "isPhoneVerified": false,
      "profile": null // or profile object if exists
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token",
    "expiresIn": "15m",
    "isNewUser": true // true for first-time signup
  },
  "message": "Account created successfully"
}
```

#### 1.2 Refresh Access Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_access_token",
    "refreshToken": "new_jwt_refresh_token",
    "expiresIn": "15m"
  },
  "message": "Token refreshed successfully"
}
```

#### 1.3 Logout
```http
POST /auth/logout
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

#### 1.4 Send Phone OTP (One-Time Verification)
```http
POST /auth/phone/send-otp
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "phone": "9876543210",
  "countryCode": "+91"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "expiresIn": 300,
    "otpSentTo": "+919876543210"
  },
  "message": "OTP sent successfully"
}
```

#### 1.5 Verify Phone OTP
```http
POST /auth/phone/verify-otp
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "phone": "9876543210",
  "otp": "123456"
}
```

---

### 2. User Management (`/users`)

All endpoints require `Authorization: Bearer {accessToken}`

#### 2.1 Get My Profile
```http
GET /users/me
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "phone": "+919876543210",
    "isPhoneVerified": true,
    "profilePicture": "/uploads/profiles/1/photo.jpg",
    "role": "USER",
    "preferredLanguage": "HI",
    "profile": {
      "id": 1,
      "firstName": "Ramesh",
      "lastName": "Kumar",
      "gender": "MALE",
      "dateOfBirth": "1990-01-15",
      "city": "Raipur",
      "profileCompleteness": 75
    }
  }
}
```

#### 2.2 Update My User Data
```http
PUT /users/me
Content-Type: application/json

{
  "preferredLanguage": "EN", // EN, HI, or CG
  "profilePicture": "/uploads/profiles/1/new-photo.jpg"
}
```

#### 2.3 Delete My Account (Soft Delete)
```http
DELETE /users/me
```

#### 2.4 Search Users
```http
GET /users/search?page=1&limit=10&query=ramesh
```

#### 2.5 Get User By ID
```http
GET /users/:userId
```

---

### 3. Profile Management (`/profiles`)

All endpoints require authentication. Some require `requireCompleteProfile` middleware.

#### 3.1 Create Profile
```http
POST /profiles
Content-Type: application/json

{
  "firstName": "Ramesh",
  "lastName": "Kumar",
  "dateOfBirth": "1990-01-15T00:00:00.000Z",
  "gender": "MALE", // MALE, FEMALE, OTHER
  "maritalStatus": "NEVER_MARRIED", // NEVER_MARRIED, DIVORCED, WIDOWED, etc.
  "religion": "HINDU", // HINDU, MUSLIM, CHRISTIAN, SIKH, etc.
  "motherTongue": "CHHATTISGARHI", // See constants
  "caste": "General",
  "country": "India",
  "state": "Chhattisgarh",
  "city": "Raipur",
  "height": 170, // in cm
  "speaksChhattisgarhi": true,
  "nativeDistrict": "Raipur", // Chhattisgarh-specific
  "bio": "About me..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": { /* profile object */ },
    "profileCompleteness": 50
  },
  "message": "Profile created successfully"
}
```

#### 3.2 Get My Profile
```http
GET /profiles/me
```

#### 3.3 Update My Profile
```http
PUT /profiles/me
Content-Type: application/json

{
  "bio": "Updated bio...",
  "hobbies": "Reading, Traveling",
  "occupation": "Software Engineer",
  "annualIncome": "5-10 LPA",
  "nativeVillage": "Village Name",
  "nativeTehsil": "Tehsil Name"
}
```

**Note:** Cannot update `isVerified`, `profileCompleteness` (auto-calculated), or `userId`.

#### 3.4 Search Profiles (Requires Complete Profile)
```http
GET /profiles/search?page=1&limit=20&gender=FEMALE&minAge=25&maxAge=30&religions=HINDU,SIKH&city=Raipur
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (default: 10, max: 100)
- `gender` (enum): MALE, FEMALE, OTHER
- `minAge`, `maxAge` (number): Age range (18-100)
- `religions` (comma-separated): HINDU,MUSLIM,CHRISTIAN, etc.
- `castes` (comma-separated): General,OBC,SC,ST
- `maritalStatus` (enum): NEVER_MARRIED, DIVORCED, etc.
- `minHeight`, `maxHeight` (number): Height in cm

**Response:**
```json
{
  "success": true,
  "data": {
    "profiles": [ /* array of profile objects */ ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

#### 3.5 Get Profile By User ID (Requires Complete Profile)
```http
GET /profiles/:userId
```

#### 3.6 Delete Profile Photo
```http
DELETE /profiles/photos/:mediaId
```

---

### 4. Match Requests (`/matches`)

All endpoints require authentication and complete profile (≥50% completion).

#### 4.1 Send Match Request
```http
POST /matches
Content-Type: application/json

{
  "receiverId": 25,
  "message": "Hi, I would like to connect with you."
}
```

#### 4.2 Get Sent Match Requests
```http
GET /matches/sent?page=1&limit=10&status=PENDING
```

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: PENDING, ACCEPTED, REJECTED, CANCELLED, EXPIRED

#### 4.3 Get Received Match Requests
```http
GET /matches/received?page=1&limit=10&status=PENDING
```

#### 4.4 Get Accepted Matches
```http
GET /matches/accepted?page=1&limit=20
```

#### 4.5 Accept Match Request
```http
PUT /matches/:matchId/accept
Content-Type: application/json

{
  "responseMessage": "Thank you for connecting!"
}
```

#### 4.6 Reject Match Request
```http
PUT /matches/:matchId/reject
Content-Type: application/json

{
  "responseMessage": "Sorry, not interested at the moment."
}
```

#### 4.7 Cancel/Delete Match
```http
DELETE /matches/:matchId
```

---

### 5. Messaging (`/messages`)

All endpoints require authentication and complete profile.

#### 5.1 Send Message
```http
POST /messages
Content-Type: application/json

{
  "receiverId": 25,
  "content": "Hello! How are you?",
  "attachmentUrl": "/uploads/chat-media/conversation-123/image.jpg", // optional
  "attachmentType": "image" // optional
}
```

#### 5.2 Get All Conversations
```http
GET /messages/conversations
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "userId": 25,
        "user": {
          "id": 25,
          "email": "user@example.com",
          "profile": {
            "firstName": "Priya",
            "lastName": "Sharma"
          }
        },
        "lastMessage": {
          "content": "See you soon!",
          "createdAt": "2025-11-13T10:30:00Z"
        },
        "unreadCount": 3
      }
    ]
  }
}
```

#### 5.3 Get Conversation with User
```http
GET /messages/:userId?page=1&limit=50
```

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": 101,
        "senderId": 1,
        "receiverId": 25,
        "content": "Hello!",
        "attachmentUrl": null,
        "isRead": true,
        "createdAt": "2025-11-13T10:00:00Z"
      }
    ],
    "pagination": { /* pagination info */ }
  }
}
```

#### 5.4 Mark Messages as Read
```http
PUT /messages/:userId/read
```

#### 5.5 Get Unread Message Count
```http
GET /messages/unread-count
```

**Response:**
```json
{
  "success": true,
  "data": {
    "unreadCount": 5
  }
}
```

#### 5.6 Delete Message
```http
DELETE /messages/:messageId
```

---

### 6. Notifications (`/notifications`)

All endpoints require authentication.

#### 6.1 Get My Notifications
```http
GET /notifications?page=1&limit=20&isRead=false
```

**Query Parameters:**
- `page`, `limit`: Pagination
- `isRead`: Filter by read status (true/false)

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": 1,
        "type": "MATCH_REQUEST", // See Notification Types below
        "channel": "IN_APP", // IN_APP, SMS, EMAIL, PUSH
        "title": "New Match Request",
        "message": "Ramesh Kumar sent you a match request",
        "data": "{\"userId\":25,\"matchId\":10}",
        "language": "HI", // EN, HI, CG
        "isRead": false,
        "createdAt": "2025-11-13T10:00:00Z"
      }
    ],
    "pagination": { /* pagination info */ }
  }
}
```

**Notification Types:**
- `MATCH_REQUEST`, `MATCH_ACCEPTED`, `MATCH_REJECTED`
- `NEW_MESSAGE`, `PROFILE_VIEW`, `SHORTLISTED`
- `SUBSCRIPTION_EXPIRY`, `PAYMENT_SUCCESS`, `PAYMENT_FAILED`
- `PROFILE_VERIFIED`, `PROFILE_REJECTED`
- `SYSTEM_ALERT`, `SECURITY_ALERT`

#### 6.2 Get Unread Count
```http
GET /notifications/unread-count
```

#### 6.3 Mark Notification as Read
```http
PUT /notifications/:notificationId/read
```

#### 6.4 Mark All as Read
```http
PUT /notifications/read-all
```

#### 6.5 Delete Notification
```http
DELETE /notifications/:notificationId
```

#### 6.6 Delete All Notifications
```http
DELETE /notifications
```

---

### 7. File Uploads (`/uploads`)

All endpoints require authentication. Uses multipart/form-data.

#### 7.1 Upload Single Profile Photo
```http
POST /uploads/profile-photo
Content-Type: multipart/form-data

FormData:
  photo: <file> // Field name must be 'photo'
```

**Accepted formats:** JPEG, JPG, PNG, WEBP  
**Max size:** 5 MB

**Response:**
```json
{
  "success": true,
  "data": {
    "media": {
      "id": 1,
      "type": "PROFILE_PHOTO",
      "url": "/uploads/profiles/1/original/photo-1699876543210.jpg",
      "thumbnailUrl": "/uploads/profiles/1/thumbnails/photo-1699876543210-150x150.jpg",
      "mediumUrl": "/uploads/profiles/1/medium/photo-1699876543210-400x400.jpg",
      "largeUrl": "/uploads/profiles/1/large/photo-1699876543210-800x800.jpg"
    }
  },
  "message": "Photo uploaded successfully"
}
```

#### 7.2 Upload Multiple Profile Photos
```http
POST /uploads/profile-photos
Content-Type: multipart/form-data

FormData:
  photos: <file[]> // Field name must be 'photos', max 6 files
```

#### 7.3 Upload ID Proof
```http
POST /uploads/id-proof
Content-Type: multipart/form-data

FormData:
  document: <file> // Field name must be 'document'
```

**Accepted formats:** PDF, JPEG, JPG, PNG  
**Max size:** 10 MB

---

### 8. Payments (`/payments`)

#### 8.1 Create Payment Order (Razorpay)
```http
POST /payments/orders
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "planId": 1, // Subscription plan ID
  "amount": 999, // in rupees (optional, fetched from plan if not provided)
  "currency": "INR"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_razorpay_id",
    "amount": 99900, // in paise
    "currency": "INR",
    "razorpayKeyId": "rzp_test_xxxxx"
  },
  "message": "Order created successfully"
}
```

**Next Steps:**
1. Use Razorpay SDK to show payment UI
2. After payment success, verify payment using endpoint below

#### 8.2 Verify Payment
```http
POST /payments/verify
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "razorpayOrderId": "order_id_from_razorpay",
  "razorpayPaymentId": "pay_id_from_razorpay",
  "razorpaySignature": "signature_from_razorpay"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "payment": { /* payment object */ },
    "subscription": { /* subscription object */ }
  },
  "message": "Payment verified successfully"
}
```

#### 8.3 Get My Payments
```http
GET /payments/me?page=1&limit=10
```

#### 8.4 Get Payment By ID
```http
GET /payments/:paymentId
```

---

## 🔌 WebSocket (Socket.io) Events

### Connection Setup
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:8080', {
  auth: {
    token: accessToken // JWT access token
  },
  transports: ['websocket']
});

socket.on('connect', () => {
  console.log('Connected to socket server');
});
```

### Events to Listen To

#### Message Received
```javascript
socket.on('message:received', (data) => {
  // data: { id, senderId, receiverId, content, createdAt, ... }
  console.log('New message:', data);
});
```

#### Message Read Status
```javascript
socket.on('message:read', (data) => {
  // data: { userId, conversationId }
  console.log('Messages marked as read');
});
```

#### Notification Received
```javascript
socket.on('notification:received', (data) => {
  // data: { id, type, title, message, ... }
  console.log('New notification:', data);
});
```

#### User Online/Offline
```javascript
socket.on('user:online', (data) => {
  // data: { userId }
  console.log('User online:', data.userId);
});

socket.on('user:offline', (data) => {
  // data: { userId }
  console.log('User offline:', data.userId);
});
```

#### Typing Indicators
```javascript
socket.on('typing:start', (data) => {
  // data: { userId, conversationId }
  console.log('User is typing...');
});

socket.on('typing:stop', (data) => {
  // data: { userId, conversationId }
  console.log('User stopped typing');
});
```

### Events to Emit

#### Send Message
```javascript
socket.emit('message:send', {
  receiverId: 25,
  content: 'Hello!',
  attachmentUrl: null // optional
});
```

#### Send Typing Indicator
```javascript
socket.emit('typing:start', {
  receiverId: 25
});

// Stop typing after user stops
socket.emit('typing:stop', {
  receiverId: 25
});
```

---

## 📊 Data Models & Enums

### Important Enums

```javascript
// Gender
const GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER'
};

// Language
const LANGUAGE = {
  EN: 'EN',     // English
  HI: 'HI',     // Hindi
  CG: 'CG'      // Chhattisgarhi
};

// Marital Status
const MARITAL_STATUS = {
  NEVER_MARRIED: 'NEVER_MARRIED',
  DIVORCED: 'DIVORCED',
  WIDOWED: 'WIDOWED',
  AWAITING_DIVORCE: 'AWAITING_DIVORCE',
  ANNULLED: 'ANNULLED'
};

// Religion
const RELIGION = {
  HINDU: 'HINDU',
  MUSLIM: 'MUSLIM',
  CHRISTIAN: 'CHRISTIAN',
  SIKH: 'SIKH',
  BUDDHIST: 'BUDDHIST',
  JAIN: 'JAIN',
  PARSI: 'PARSI',
  JEWISH: 'JEWISH',
  BAHAI: 'BAHAI',
  NO_RELIGION: 'NO_RELIGION',
  SPIRITUAL: 'SPIRITUAL',
  OTHER: 'OTHER'
};

// Mother Tongue
const MOTHER_TONGUE = {
  CHHATTISGARHI: 'CHHATTISGARHI', // Primary focus
  HINDI: 'HINDI',
  ENGLISH: 'ENGLISH',
  TAMIL: 'TAMIL',
  TELUGU: 'TELUGU',
  MALAYALAM: 'MALAYALAM',
  KANNADA: 'KANNADA',
  MARATHI: 'MARATHI',
  GUJARATI: 'GUJARATI',
  BENGALI: 'BENGALI',
  PUNJABI: 'PUNJABI',
  URDU: 'URDU',
  // ... and more (see constants.js)
};

// Match Request Status
const MATCH_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED'
};

// Subscription Status
const SUBSCRIPTION_STATUS = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
  PENDING: 'PENDING'
};

// Payment Status
const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  CANCELLED: 'CANCELLED'
};

// Media Types
const MEDIA_TYPES = {
  PROFILE_PHOTO: 'PROFILE_PHOTO',
  GALLERY_PHOTO: 'GALLERY_PHOTO',
  ID_PROOF: 'ID_PROOF',
  ADDRESS_PROOF: 'ADDRESS_PROOF',
  INCOME_PROOF: 'INCOME_PROOF',
  EDUCATION_CERTIFICATE: 'EDUCATION_CERTIFICATE',
  CHAT_IMAGE: 'CHAT_IMAGE',
  OTHER_DOCUMENT: 'OTHER_DOCUMENT'
};
```

### User Object Structure
```typescript
{
  id: number;
  email: string;
  googleId: string;
  phone?: string;
  countryCode: string; // default: "+91"
  isPhoneVerified: boolean;
  profilePicture?: string;
  role: "USER" | "PREMIUM_USER" | "VERIFIED_USER" | "ADMIN";
  preferredLanguage: "EN" | "HI" | "CG";
  isActive: boolean;
  isBanned: boolean;
  createdAt: string; // ISO datetime
  profile?: Profile; // nested profile object
}
```

### Profile Object Structure
```typescript
{
  id: number;
  userId: number;
  profileId: string; // unique CUID
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO date
  gender: Gender;
  maritalStatus: MaritalStatus;
  religion: Religion;
  motherTongue: MotherTongue;
  caste?: string;
  country: string;
  state: string;
  city: string;
  height?: number; // cm
  speaksChhattisgarhi: boolean; // Chhattisgarh-specific
  nativeDistrict?: string; // Chhattisgarh-specific
  nativeVillage?: string;
  nativeTehsil?: string;
  bio?: string;
  occupation?: string;
  annualIncome?: string;
  profileCompleteness: number; // 0-100
  isVerified: boolean;
  isPublished: boolean;
  createdAt: string;
}
```

---

## ⚠️ Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message here",
  "errors": [] // validation errors if any
}
```

### Common HTTP Status Codes
- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required or invalid token
- **403 Forbidden**: Insufficient permissions (e.g., profile incomplete)
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **422 Unprocessable Entity**: Validation failed
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

### Handling 401 Unauthorized
When you receive a 401 error:
1. Try refreshing the token using `/auth/refresh`
2. If refresh fails, redirect user to login screen
3. Clear stored tokens

### Handling 403 Forbidden
Common causes:
- Profile incomplete (< 50% completion)
- Phone not verified
- Subscription expired
- Account banned/inactive

Check the error message for specific requirements.

---

## 🛡️ Security Best Practices for Frontend

### Token Storage
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store tokens securely
await AsyncStorage.setItem('accessToken', token);
await AsyncStorage.setItem('refreshToken', refreshToken);

// Retrieve tokens
const accessToken = await AsyncStorage.getItem('accessToken');
```

### API Request Interceptor (Axios Example)
```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 10000,
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token expiry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const response = await axios.post(
          'http://localhost:8080/api/v1/auth/refresh',
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        
        // Store new tokens
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', newRefreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        // Navigate to login screen
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### File Upload Example
```javascript
import api from './api';

const uploadProfilePhoto = async (photoUri) => {
  const formData = new FormData();
  
  formData.append('photo', {
    uri: photoUri,
    type: 'image/jpeg',
    name: 'profile-photo.jpg',
  });

  try {
    const response = await api.post('/uploads/profile-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};
```

---

## 🎯 Key Features to Implement in Frontend

### 1. Authentication Flow
- Google Sign-In button
- Token management with auto-refresh
- Phone verification screen (one-time)

### 2. Profile Creation & Management
- Multi-step profile creation wizard
- Profile completeness indicator (show ≥50% required for features)
- Photo upload with preview
- Chhattisgarh-specific fields: native district, speaks Chhattisgarhi

### 3. Search & Discovery
- Filter by age, gender, religion, location
- Chhattisgarh-specific filters (native district, language)
- Paginated results with infinite scroll

### 4. Match Requests
- Send/receive match requests
- Accept/reject with optional message
- View accepted matches

### 5. Messaging
- Real-time chat using Socket.io
- Conversation list with unread counts
- Typing indicators
- Message read status
- Image attachments

### 6. Notifications
- In-app notification badge
- Push notifications (FCM)
- Notification center with mark as read

### 7. Payments (Razorpay)
- Subscription plans display
- Razorpay checkout integration
- Payment history

### 8. Multi-language Support
- Language selector (English, Hindi, Chhattisgarhi)
- Respect user's `preferredLanguage`
- Localized content for notifications

---

## 📱 React Native Libraries to Use

### Essential
- `@react-navigation/native` - Navigation
- `@react-native-async-storage/async-storage` - Secure storage
- `axios` - HTTP client
- `socket.io-client` - Real-time communication
- `@react-native-google-signin/google-signin` - Google OAuth
- `react-native-razorpay` - Payment integration

### UI Components
- `react-native-paper` or `native-base` - UI components
- `react-native-vector-icons` - Icons
- `react-native-image-picker` - Photo selection
- `react-native-fast-image` - Optimized images

### Push Notifications
- `@react-native-firebase/app` - Firebase core
- `@react-native-firebase/messaging` - FCM

### Optional
- `react-native-reanimated` - Animations
- `formik` + `yup` - Form validation
- `react-query` or `swr` - Data fetching/caching

---

## 🚀 Getting Started Checklist

- [ ] Set up React Native project with TypeScript
- [ ] Install required dependencies
- [ ] Configure Google Sign-In (get OAuth credentials)
- [ ] Set up Razorpay SDK (get API keys)
- [ ] Configure Firebase for push notifications
- [ ] Create API service with Axios interceptors
- [ ] Implement authentication flow
- [ ] Create navigation structure
- [ ] Build profile creation screens
- [ ] Implement Socket.io connection
- [ ] Test payment flow in sandbox mode
- [ ] Add multi-language support

---

## 📞 Support & Testing

### Health Check
Test if backend is running:
```http
GET /health
```

### Testing Credentials
For development, you'll need:
- Valid Google OAuth client ID
- Test Razorpay account with test keys
- Firebase project with FCM enabled

### Common Issues
1. **CORS errors**: Ensure backend `CORS_ORIGIN` includes your dev server
2. **Socket connection failed**: Check auth token is passed correctly
3. **File upload fails**: Check file size limits and formats
4. **Payment verification fails**: Ensure Razorpay keys match

---

**Last Updated:** November 13, 2025  
**Backend Version:** 1.0.0  
**API Version:** v1
