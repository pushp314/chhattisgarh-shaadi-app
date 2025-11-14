# Backend Changes for Web-Based OAuth

---

# 🚀 Quick Setup Checklist - 5 Minutes

## ⚡ Step 1: Add Environment Variables ⚠️ REQUIRED
Open your `.env` file and add:

```env
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_FROM_GOOGLE_CONSOLE
```

**Get Client Secret:**
1. Visit: https://console.cloud.google.com/apis/credentials
2. Click your **Web application** OAuth 2.0 Client ID
3. Copy the **Client secret** value
4. Paste it in `.env`

## ⚡ Step 2: Update Google Cloud Console ⚠️ REQUIRED
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your **Web client ID**: `250704044564-q3ql66oruro0a17ipumla9cloda24tkk.apps.googleusercontent.com`
3. Under **Authorized redirect URIs**, click **+ ADD URI**
4. Add: `com.chhattisgarhshaadi.app://oauth2redirect`
5. Click **SAVE**

## ⚡ Step 3: Restart Server ⚠️ REQUIRED
```bash
npm run dev
```

## ✅ That's It!

**Setup Time:** 5 minutes  
**Required Changes:** 2 (env variable + Google Console)  
**Backward Compatible:** Yes (idToken still works)

---

# 📖 Detailed Documentation

## What Changed in Frontend

The app now uses **Web-Based OAuth** flow instead of native Google Sign-In SDK. This means:

1. User clicks "Sign in with Google"
2. Opens Google OAuth in an in-app browser
3. User logs in and authorizes
4. Google redirects back with an **authorization code**
5. App sends the code to your backend
6. **Backend exchanges the code for user info**

## Backend Changes Required

### 1. Update Google Cloud Console

Add a new **Authorized redirect URI**:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your **Web client ID** (the one currently in use)
3. Under "Authorized redirect URIs", add:
   ```
   com.chhattisgarhshaadi.app://oauth2redirect
   ```
4. Click **Save**

### 2. Update Backend Endpoint: `/api/v1/auth/google`

#### Current Implementation (OLD):
```javascript
// POST /api/v1/auth/google
// Expects: { idToken, deviceInfo }
```

#### New Implementation (REQUIRED):
```javascript
// POST /api/v1/auth/google
// Expects: { authorizationCode, redirectUri, deviceInfo }
```

### 3. Backend Code Changes

Update your `src/controllers/auth.controller.js`:

```javascript
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET, // You'll need this now
  'com.chhattisgarhshaadi.app://oauth2redirect'
);

exports.googleSignIn = async (req, res, next) => {
  try {
    const { authorizationCode, redirectUri, deviceInfo } = req.body;

    // Validate inputs
    if (!authorizationCode) {
      return res.status(400).json({
        success: false,
        error: { message: 'Authorization code is required' }
      });
    }

    // Exchange authorization code for tokens
    const { tokens } = await client.getToken({
      code: authorizationCode,
      redirect_uri: redirectUri || 'com.chhattisgarhshaadi.app://oauth2redirect',
    });

    // Verify the ID token and get user info
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name, sub: googleId } = payload;

    // Check if user exists or create new user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          firstName: given_name || '',
          lastName: family_name || '',
          googleId,
          isPhoneVerified: false, // User needs to verify phone
          role: 'USER',
        },
      });
    }

    // Store device info if provided
    if (deviceInfo) {
      await prisma.device.create({
        data: {
          userId: user.id,
          deviceId: deviceInfo.deviceId,
          deviceName: deviceInfo.deviceName,
          deviceType: deviceInfo.deviceType,
          userAgent: deviceInfo.userAgent,
        },
      });
    }

    // Generate your JWT tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token in database
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isPhoneVerified: user.isPhoneVerified,
          isActive: user.isActive,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      message: 'Google sign-in successful',
    });
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    next(error);
  }
};
```

### 4. Install Required Package

```bash
npm install google-auth-library
```

### 5. Add Environment Variable

Update your `.env` file:

```env
GOOGLE_CLIENT_ID=250704044564-q3ql66oruro0a17ipumla9cloda24tkk.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_FROM_GOOGLE_CONSOLE
```

**Get Client Secret:**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your **Web client ID**
3. Copy the **Client secret**
4. Paste it in `.env`

### 6. Update Your Auth Service

If you have a separate service file (`src/services/auth.service.js`):

```javascript
const { OAuth2Client } = require('google-auth-library');

class AuthService {
  constructor() {
    this.googleClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'com.chhattisgarhshaadi.app://oauth2redirect'
    );
  }

  async verifyGoogleAuthCode(authorizationCode, redirectUri) {
    try {
      // Exchange code for tokens
      const { tokens } = await this.googleClient.getToken({
        code: authorizationCode,
        redirect_uri: redirectUri,
      });

      // Verify ID token
      const ticket = await this.googleClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      return ticket.getPayload();
    } catch (error) {
      throw new Error(`Google auth verification failed: ${error.message}`);
    }
  }
}

module.exports = new AuthService();
```

## Summary of Changes

### Frontend (Already Done):
✅ Now sends `authorizationCode` instead of `idToken`
✅ Opens OAuth in in-app browser
✅ No more DEVELOPER_ERROR issues!

### Backend (You Need to Do):
⚠️ **Change 1**: Accept `authorizationCode` in request body
⚠️ **Change 2**: Exchange code for tokens using `google-auth-library`
⚠️ **Change 3**: Add redirect URI to Google Console
⚠️ **Change 4**: Add `GOOGLE_CLIENT_SECRET` to `.env`
⚠️ **Change 5**: Install `google-auth-library` package

## Testing

After backend changes:

1. **Frontend**: Run `npm run android`
2. Click "Continue with Google"
3. Browser opens → User logs in
4. Redirects back to app with code
5. **Backend**: Receives code, exchanges for tokens, returns user data
6. ✅ **User logged in successfully!**

## Benefits of This Approach

✅ **No SHA-1 certificate needed**
✅ **No DEVELOPER_ERROR issues**
✅ **Works on emulators without Play Services**
✅ **More reliable**
✅ **Better user experience** (native browser UI)
✅ **100% FREE**

## Troubleshooting

### If you get "redirect_uri_mismatch":
- Verify redirect URI in Google Console matches: `com.chhattisgarhshaadi.app://oauth2redirect`

### If code exchange fails:
- Check your `GOOGLE_CLIENT_SECRET` is correct
- Verify the Web client ID is being used (not Android client)

### If user gets "Consent screen not configured":
- Go to Google Console → OAuth consent screen
- Publish your app (or add test users)
