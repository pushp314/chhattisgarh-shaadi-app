# ✅ Production Backend Configuration

Your React Native app is now configured to connect to the **production backend on Render**.

---

## 🎯 Backend URL

**Production:** `https://chhattisgarhshadi-backend.onrender.com/api/v1`

- ✅ Automatically used when app is built in **release mode**
- ✅ Development mode still uses local backend (`http://10.0.2.2:8080` or `localhost:8080`)

---

## 📝 What Was Updated

### 1. **API Configuration** (`src/config/api.config.ts`)

```typescript
// Development: Uses local backend
__DEV__ ? 'http://10.0.2.2:8080/api/v1'

// Production: Uses Render backend
'https://chhattisgarhshadi-backend.onrender.com/api/v1'
```

### 2. **OAuth Redirect URI** (`src/services/auth.service.ts`)

```typescript
// Development: Local backend callback
__DEV__ ? 'http://localhost:8080/api/v1/auth/google/callback'

// Production: Render backend callback
'https://chhattisgarhshadi-backend.onrender.com/api/v1/auth/google/callback'
```

### 3. **Socket.io URL**

Automatically uses the same URL as the API (without `/api/v1` suffix).

---

## ⚠️ CRITICAL: Google Cloud Console Setup Required

You **must** add the production redirect URI to Google Cloud Console:

### Steps:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client ID
3. Under **Authorized redirect URIs**, add:
   ```
   https://chhattisgarhshadi-backend.onrender.com/api/v1/auth/google/callback
   ```
4. Click **SAVE**

**Without this, Google OAuth will fail with "redirect_uri_mismatch" error!**

---

## 🧪 Testing

### Test Backend Health

```bash
curl https://chhattisgarhshadi-backend.onrender.com/api/v1/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "✅ API is healthy and running",
  "environment": "production"
}
```

### Test from React Native App

1. **Build Release APK:**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

2. **Install on Device:**
   ```bash
   adb install app/build/outputs/apk/release/app-release.apk
   ```

3. **Test Google Sign-In:**
   - Open app
   - Tap "Continue with Google"
   - Sign in with Google account
   - ✅ Should successfully authenticate!

---

## 🔧 Development vs Production

| Mode | API URL | Redirect URI | Usage |
|------|---------|--------------|-------|
| **Development** (`npm run android`) | `http://10.0.2.2:8080/api/v1` | `http://localhost:8080/api/v1/auth/google/callback` | Local backend testing |
| **Production** (Release build) | `https://chhattisgarhshadi-backend.onrender.com/api/v1` | `https://chhattisgarhshadi-backend.onrender.com/api/v1/auth/google/callback` | Production app |

---

## 📱 Building for Production

### Android

```bash
# Build release APK
cd android
./gradlew assembleRelease

# APK location:
# android/app/build/outputs/apk/release/app-release.apk

# Build App Bundle (for Google Play Store)
./gradlew bundleRelease

# AAB location:
# android/app/build/outputs/bundle/release/app-release.aab
```

### iOS

```bash
# Install pods
cd ios
bundle exec pod install

# Open in Xcode
open AwesomeProject.xcworkspace

# In Xcode:
# 1. Select target → "Any iOS Device (arm64)"
# 2. Product → Archive
# 3. Distribute App → App Store Connect
```

---

## 🔐 Environment Variables Needed on Render

Make sure these are set in your Render dashboard:

### Required (Already Set)
- ✅ `DATABASE_URL`
- ✅ `JWT_ACCESS_SECRET`
- ✅ `JWT_REFRESH_SECRET`
- ✅ `CORS_ORIGIN=*`
- ✅ `NODE_ENV=production`

### Google OAuth (YOU NEED TO ADD THESE)
- ⚠️ `GOOGLE_CLIENT_ID` - From Google Cloud Console
- ⚠️ `GOOGLE_CLIENT_SECRET` - From Google Cloud Console

**How to Add:**
1. Go to: https://dashboard.render.com/
2. Select your service
3. Go to **Environment** tab
4. Click **Add Environment Variable**
5. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
6. Click **Save Changes** (app will redeploy)

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to backend"

**Solution:**
1. Check if backend is running:
   ```bash
   curl https://chhattisgarhshadi-backend.onrender.com/api/v1/health
   ```
2. For development, use local backend URL (`http://10.0.2.2:8080`)
3. For production, ensure app is built in release mode

### Issue: "redirect_uri_mismatch"

**Solution:**
- Verify redirect URI in Google Console matches **exactly**:
  ```
  https://chhattisgarhshadi-backend.onrender.com/api/v1/auth/google/callback
  ```

### Issue: "invalid_client"

**Solution:**
1. Check `GOOGLE_CLIENT_ID` matches in both:
   - Render environment variables
   - React Native app (`src/services/auth.service.ts`)
2. Verify `GOOGLE_CLIENT_SECRET` is set in Render

### Issue: "Network request failed"

**Solution:**
- Android: Enable cleartext traffic in `AndroidManifest.xml`:
  ```xml
  <application
    android:usesCleartextTraffic="true">
  ```
- Check device internet connection
- Verify backend is not rate-limiting your IP

---

## 📚 Next Steps

1. ✅ **Google Cloud Console:** Add production redirect URI
2. ✅ **Render Dashboard:** Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
3. ✅ **Test:** Build release APK and test Google Sign-In
4. ✅ **Monitor:** Check Render logs for any errors
5. ✅ **Optional Services:** Configure AWS S3, Razorpay, MSG91 (see backend docs)

---

## 🎉 Success Checklist

- [ ] Backend health check returns 200 OK
- [ ] Google Console has production redirect URI
- [ ] Render has `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- [ ] Release APK builds successfully
- [ ] Google Sign-In works in production app
- [ ] API calls return data (not 401/403 errors)
- [ ] Socket.io connects successfully
- [ ] File uploads work (if AWS S3 configured)

---

**Last Updated:** November 14, 2025  
**Production Backend:** https://chhattisgarhshadi-backend.onrender.com  
**Status:** ✅ Ready for Testing
