# 🧪 Testing Guide - Chhattisgarh Shaadi App

## 📋 Pre-Testing Checklist

### ✅ Before You Start

- [x] Frontend app built successfully
- [x] API config updated with local IP: `192.168.29.22`
- [ ] Backend server running
- [ ] Google OAuth configured

---

## 🚀 Step-by-Step Testing Guide

### Step 1: Start Backend Server

```bash
# Navigate to backend directory
cd /Users/pushp314/Desktop/Matrimony-App/Test/chhattisgarhshadi-backend

# Install dependencies (if not done)
npm install

# Add GOOGLE_CLIENT_SECRET to .env (if not added)
# Edit .env file and add:
# GOOGLE_CLIENT_SECRET=YOUR_SECRET_FROM_GOOGLE_CONSOLE

# Start backend
npm run dev
```

**Expected Output:**
```
Server running on port 8080
Database connected
Socket.io server running
```

**Verify Backend is Running:**
```bash
curl http://localhost:8080/api/health
```

Should return: `{"status":"ok"}` or similar

---

### Step 2: Test Backend Endpoints

#### Test 1: Health Check
```bash
curl http://192.168.29.22:8080/api/health
```

**Expected:** `200 OK` with health status

#### Test 2: Google OAuth Endpoint (will fail without valid code - that's ok)
```bash
curl -X POST http://192.168.29.22:8080/api/v1/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "authorizationCode": "test",
    "redirectUri": "com.chhattisgarhshaadi.app://oauth2redirect"
  }'
```

**Expected:** `400 Bad Request` or `401 Unauthorized` (this means endpoint exists!)

---

### Step 3: Start Frontend App

```bash
# Terminal 1: Metro Bundler (if not already running)
npm start

# Terminal 2: Install & Run App
npm run android
```

**Expected:**
- ✅ App installs successfully
- ✅ Metro bundler shows "Loading..." then connected
- ✅ App opens to Welcome screen

---

### Step 4: Test App Navigation (No Backend Needed)

#### Test Navigation Flow:
1. **Open App** → Should see Welcome screen
2. **Click "Get Started"** → Should navigate to Google Sign-In screen
3. **Press Back** → Should go back to Welcome screen
4. **Bottom Tabs** (after simulating login):
   - Tap Home → Home screen
   - Tap Search → Search screen
   - Tap Matches → Matches screen
   - Tap Messages → Messages screen
   - Tap Profile → Profile screen

**Expected:** All screens render without crashes

---

### Step 5: Test Google Sign-In Flow

#### Prerequisites:
1. ✅ Backend running
2. ✅ `GOOGLE_CLIENT_SECRET` in backend `.env`
3. ✅ Redirect URI added in Google Console: `com.chhattisgarhshaadi.app://oauth2redirect`

#### Test Steps:
1. **Open App** → Welcome screen
2. **Tap "Get Started"** → Google Sign-In screen
3. **Tap "Continue with Google"** → Browser should open
4. **Log in with Google** → Grant permissions
5. **Redirects back to app** → Wait for processing
6. **Check app state** → Should navigate to Phone Verification or Home

#### Expected Behavior:
- ✅ Browser opens with Google login page
- ✅ After login, closes and returns to app
- ✅ Backend logs show: "Authorization code received"
- ✅ App stores tokens and navigates

#### If it Fails:
Check Metro bundler logs (Terminal 1) for errors:
```
Look for:
- Network errors → Backend not reachable
- 401 Unauthorized → OAuth configuration issue
- Timeout → Backend too slow or not running
```

---

### Step 6: Test With Mock User (Skip Google for Now)

If Google Sign-In is not working yet, you can test with mock data:

#### Option A: Use Backend's Test Endpoint (if available)
```bash
curl -X POST http://192.168.29.22:8080/api/v1/auth/test-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

#### Option B: Modify Frontend Temporarily
Create a test login button in `GoogleSignInScreen.tsx`:

```typescript
// Add this button temporarily for testing
<TouchableOpacity
  style={styles.googleButton}
  onPress={async () => {
    // Mock successful login
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      isPhoneVerified: false,
    };
    const mockTokens = {
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token',
    };
    
    // Store in state
    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().setTokens(mockTokens.accessToken, mockTokens.refreshToken);
    
    // Navigate
    navigation.navigate('PhoneVerification');
  }}
>
  <Text>Test Login (DEV ONLY)</Text>
</TouchableOpacity>
```

---

## 🔍 Testing Individual Features

### Feature 1: Profile Creation

**Prerequisites:** User must be logged in

**Steps:**
1. Navigate to Profile tab
2. Tap "Create Profile" or "Complete Profile"
3. Fill in all required fields:
   - First Name: "John"
   - Last Name: "Doe"
   - Date of Birth: Select date
   - Gender: Select "Male"
   - Height: "175"
   - Religion: Select "Hindu"
   - Native District: Select "Raipur"
4. Tap "Save" or "Create Profile"

**Expected:**
- ✅ Form validates all fields
- ✅ Shows loading indicator
- ✅ Success message appears
- ✅ Navigates to Profile view screen
- ✅ Profile data visible

**Backend Check:**
```bash
# Check if profile was created
curl -X GET http://192.168.29.22:8080/api/v1/profiles/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### Feature 2: Search Users

**Prerequisites:** At least 2 users with profiles in database

**Steps:**
1. Navigate to Search tab
2. Tap filter icon
3. Set filters:
   - Min Age: 25
   - Max Age: 35
   - Gender: Female (or opposite of your profile)
   - Religion: Hindu
4. Tap "Apply"
5. Scroll through results

**Expected:**
- ✅ Loading indicator shows
- ✅ Results appear in list
- ✅ Each card shows: photo, name, age, height, location
- ✅ Tap card → Opens profile details
- ✅ "Send Match Request" button visible

---

### Feature 3: Send Match Request

**Prerequisites:** Viewing another user's profile

**Steps:**
1. Open a profile from search results
2. Scroll to bottom
3. Tap "Send Match Request"
4. (Optional) Add message: "Hi! I'm interested"
5. Tap "Send"

**Expected:**
- ✅ Loading indicator
- ✅ Success toast: "Match request sent"
- ✅ Button changes to "Request Sent" (disabled)
- ✅ Can view request in "Sent" tab of Matches

---

### Feature 4: Messaging (Real-Time)

**Prerequisites:** 
- 2 users logged in (use 2 devices/emulators)
- Match request accepted between them

**Steps - Device 1:**
1. Navigate to Messages tab
2. Tap conversation with User 2
3. Type message: "Hello there!"
4. Tap Send

**Steps - Device 2:**
1. Be on Messages tab or Home
2. Should see notification badge
3. Open conversation
4. See "Hello there!" message appear

**Expected:**
- ✅ Message appears instantly on Device 2
- ✅ Typing indicator shows when typing
- ✅ Message marked as "read" when opened
- ✅ Check icons (single/double check)

**Backend Check - Socket Connection:**
```bash
# In backend logs, you should see:
Socket.io: Client connected [user:1]
Socket.io: Client connected [user:2]
Socket.io: Message sent from user:1 to user:2
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Network Request Failed"

**Symptoms:** All API calls fail with network error

**Solutions:**
1. Check backend is running: `curl http://192.168.29.22:8080/api/health`
2. Check firewall isn't blocking port 8080
3. Verify IP address in `api.config.ts` matches your local IP
4. For Android emulator, use your computer's IP (not `localhost` or `127.0.0.1`)

**Test:**
```bash
# From your computer
curl http://192.168.29.22:8080/api/health

# Should return: {"status":"ok"}
```

---

### Issue 2: "DEVELOPER_ERROR" on Google Sign-In

**This shouldn't happen** with Web-Based OAuth, but if it does:

**Solutions:**
1. Check redirect URI in Google Console: `com.chhattisgarhshaadi.app://oauth2redirect`
2. Verify `GOOGLE_CLIENT_SECRET` is in backend `.env`
3. Check backend logs for OAuth errors
4. Clear app data and retry

---

### Issue 3: "401 Unauthorized" After Login

**Symptoms:** Logged in but all API calls return 401

**Solutions:**
1. Check tokens are stored:
   ```typescript
   // In app, add console.log
   const { user } = useAuthStore();
   console.log('User:', user);
   console.log('Token:', await AsyncStorage.getItem('accessToken'));
   ```
2. Verify token is sent in headers (check Metro logs)
3. Check backend JWT secret matches

---

### Issue 4: Socket.io Not Connecting

**Symptoms:** Messages don't appear in real-time

**Solutions:**
1. Check Socket.io URL: `http://192.168.29.22:8080` (same as API)
2. Verify token is passed in auth:
   ```typescript
   socket = io('http://192.168.29.22:8080', {
     auth: { token: accessToken }
   });
   ```
3. Check backend Socket.io server is running
4. Look for connection logs in Metro bundler

**Test:**
```javascript
// Add in ChatScreen useEffect
socket.on('connect', () => {
  console.log('✅ Socket connected!');
});

socket.on('disconnect', () => {
  console.log('❌ Socket disconnected');
});

socket.on('error', (err) => {
  console.error('Socket error:', err);
});
```

---

### Issue 5: App Crashes on Specific Screen

**Symptoms:** App closes when opening certain screens

**Solutions:**
1. Check Metro bundler for error stack trace
2. Common causes:
   - Missing null checks (`user?.profile?.firstName`)
   - Array methods on undefined (`conversations?.map()`)
   - Accessing properties before data loads
3. Add error boundaries
4. Use optional chaining everywhere

---

### Issue 6: Images Not Uploading

**Symptoms:** Profile photo upload fails

**Solutions:**
1. Check permissions in AndroidManifest.xml:
   ```xml
   <uses-permission android:name="android.permission.CAMERA"/>
   <uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
   ```
2. Request runtime permissions
3. Verify backend accepts `multipart/form-data`
4. Check file size limits (backend + frontend)

**Test:**
```bash
# Test upload endpoint directly
curl -X POST http://192.168.29.22:8080/api/v1/uploads/profile-photo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "photo=@/path/to/test-image.jpg"
```

---

## 📊 Testing Checklist

### Phase 1: Setup ✅
- [ ] Backend server running
- [ ] Frontend app installed
- [ ] Google OAuth configured
- [ ] API URLs updated with local IP

### Phase 2: Navigation 📱
- [ ] Welcome screen loads
- [ ] Navigate to Google Sign-In
- [ ] All bottom tabs accessible
- [ ] Stack navigation works (push/pop)
- [ ] Back button works correctly

### Phase 3: Authentication 🔐
- [ ] Google Sign-In opens browser
- [ ] Redirects back after login
- [ ] Tokens stored locally
- [ ] User data saved
- [ ] Phone verification flow works
- [ ] Logout clears data

### Phase 4: Profile Management 👤
- [ ] Create profile with all fields
- [ ] View own profile
- [ ] Edit profile
- [ ] Upload profile photo
- [ ] Upload multiple photos
- [ ] Delete photo
- [ ] Profile completeness updates

### Phase 5: Discovery 🔍
- [ ] Search without filters
- [ ] Apply age filter
- [ ] Apply height filter
- [ ] Apply religion/caste filter
- [ ] Apply district filter
- [ ] View profile details
- [ ] Pagination works
- [ ] Pull to refresh

### Phase 6: Match Requests 💕
- [ ] Send match request
- [ ] View sent requests
- [ ] View received requests
- [ ] Accept request
- [ ] Reject request
- [ ] Cancel sent request
- [ ] View accepted matches
- [ ] Request status updates

### Phase 7: Messaging 💬
- [ ] View conversations list
- [ ] Open conversation
- [ ] Send text message
- [ ] Receive message (real-time)
- [ ] Typing indicator shows
- [ ] Mark as read
- [ ] Unread badge updates
- [ ] Delete message
- [ ] Search conversations

### Phase 8: Real-Time Features ⚡
- [ ] Socket.io connects
- [ ] Message received instantly
- [ ] Typing indicator works
- [ ] Online/offline status
- [ ] Notification badge updates
- [ ] Reconnects after disconnect

### Phase 9: Edge Cases 🔧
- [ ] Slow network handling
- [ ] No internet error
- [ ] Token expiry & refresh
- [ ] 401 handling
- [ ] Empty states
- [ ] Loading states
- [ ] Error states
- [ ] Offline mode

---

## 🎯 Quick Test Commands

### Test Backend Health
```bash
curl http://192.168.29.22:8080/api/health
```

### Test Google OAuth Endpoint
```bash
curl -X POST http://192.168.29.22:8080/api/v1/auth/google \
  -H "Content-Type: application/json" \
  -d '{"authorizationCode":"test","redirectUri":"com.chhattisgarhshaadi.app://oauth2redirect"}'
```

### Test Profile Endpoint (Need Token)
```bash
curl -X GET http://192.168.29.22:8080/api/v1/profiles/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### View Metro Logs
```bash
# In terminal where npm start is running
# Look for:
# - Network requests
# - Console.log output
# - Error messages
# - Socket events
```

### View Android Logs
```bash
adb logcat | grep -i "ReactNative\|Matrimony"
```

---

## 📱 Manual Testing Flows

### Flow 1: New User Onboarding
1. Install fresh app
2. Open app → See Welcome
3. Sign in with Google
4. Verify phone number
5. Create profile
6. See Home dashboard
7. Browse profiles
8. Send first match request

**Time:** ~5 minutes

---

### Flow 2: Match & Chat
1. User A: Send match request to User B
2. User B: Receive notification
3. User B: View request
4. User B: Accept request
5. User A: See "Matched" notification
6. User A: Send message "Hi!"
7. User B: Receive message instantly
8. User B: Reply "Hello!"
9. Both: See typing indicators

**Time:** ~3 minutes

---

### Flow 3: Search & Discovery
1. Open Search tab
2. Apply filters (age, height, district)
3. Browse results
4. Open profile details
5. View photo gallery
6. Read about section
7. Check compatibility
8. Send match request
9. Add optional message

**Time:** ~4 minutes

---

## 🚀 Production Testing Checklist

Before deploying to production:

- [ ] Test on physical Android device (not just emulator)
- [ ] Test on iOS device (if supporting iOS)
- [ ] Test on slow 3G network
- [ ] Test with 100+ profiles in database
- [ ] Load test with 50 concurrent users
- [ ] Security audit (tokens, API keys)
- [ ] SSL/HTTPS working
- [ ] Push notifications working
- [ ] App doesn't crash after 1 hour usage
- [ ] Memory leaks checked
- [ ] Battery drain acceptable
- [ ] APK size reasonable (<50MB)

---

## 📞 Get Help

### Metro Bundler Not Starting?
```bash
# Reset Metro cache
npm start -- --reset-cache
```

### App Won't Install?
```bash
# Uninstall old version
adb uninstall com.chhattisgarhshaadi.app

# Clean build
cd android && ./gradlew clean && cd ..
npm run android
```

### Backend Won't Start?
```bash
# Check if port 8080 is in use
lsof -i :8080

# Kill process using port 8080
kill -9 $(lsof -t -i:8080)
```

---

**Testing Status:** Ready to start! ✅  
**Current IP:** `192.168.29.22`  
**Backend Port:** `8080`  
**Last Updated:** 2025-11-14

---

## 🎬 Let's Start Testing!

**Next Step:** Start your backend server:
```bash
cd /Users/pushp314/Desktop/Matrimony-App/Test/chhattisgarhshadi-backend
npm run dev
```

Then test Google Sign-In in your app! 🚀
