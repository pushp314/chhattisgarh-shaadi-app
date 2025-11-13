# Google Sign-In Configuration Guide

## Current Issues
1. **Invalid GOOGLE_CLIENT_ID** in `android/local.properties` (has duplicate `.apps.googleusercontent.com`)
2. **Placeholder Web Client ID** in `src/services/auth.service.ts`

## Step-by-Step Fix

### 1. Get Your Google OAuth Credentials

Go to [Google Cloud Console](https://console.cloud.google.com/):

1. Select your project: **chhattishgarh-shaadi** (or create new project)
2. Go to **APIs & Services** → **Credentials**
3. You should see OAuth 2.0 Client IDs

### 2. Find Your Client IDs

You need **TWO** different client IDs:

#### A. Web Client ID (for Backend)
- **Type**: Web application
- **Format**: `XXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com`
- **Use**: Goes in `auth.service.ts` line 19

#### B. Android Client ID (for App)
- **Type**: Android
- **Package name**: `com.chhattisgarhshaadi.app`
- **SHA-1 certificate**: Your debug/release keystore SHA-1
- **Format**: `XXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com`
- **Use**: Goes in `android/local.properties`

### 3. Fix android/local.properties

**Current (BROKEN):**
```properties
GOOGLE_CLIENT_ID=250704044564-q3ql66oruro0a17ipumla9cloda24tkk.apps.googleusercontent.com.apps.googleusercontent.com
```

**Should be (example):**
```properties
GOOGLE_CLIENT_ID=250704044564-q3ql66oruro0a17ipumla9cloda24tkk.apps.googleusercontent.com
```

**Action Required:**
1. Remove the duplicate `.apps.googleusercontent.com` at the end
2. OR get the correct Android Client ID from Google Console

### 4. Fix auth.service.ts

**Current (BROKEN):**
```typescript
webClientId: 'YOUR_WEB_CLIENT_ID', // Get from Google Cloud Console
```

**Should be (example):**
```typescript
webClientId: '123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com',
```

**Action Required:**
Replace `'YOUR_WEB_CLIENT_ID'` with your actual **Web Client ID** from Google Console

### 5. Get SHA-1 Certificate Fingerprint (If Creating New Android Client)

For **debug** keystore:
```bash
cd android
./gradlew signingReport
```

Look for `SHA1` under `Variant: debug`:
```
SHA1: AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD
```

### 6. Create Android OAuth Client (If Needed)

If you don't have an Android client:

1. In Google Console → Credentials → **Create Credentials** → **OAuth 2.0 Client ID**
2. Application type: **Android**
3. Package name: `com.chhattisgarhshaadi.app`
4. SHA-1 certificate fingerprint: (paste from step 5)
5. Click **Create**
6. Copy the generated Client ID

### 7. Verify Configuration

After fixing both files:

1. **Clean build**:
   ```bash
   cd android && ./gradlew clean && cd ..
   ```

2. **Rebuild**:
   ```bash
   npm run android
   ```

3. **Test**: Try Google Sign-In - should work without DEVELOPER_ERROR

## Common Mistakes

❌ **Don't use iOS Client ID** for Android (different format)
❌ **Don't use Android Client ID** in `auth.service.ts` (needs Web Client ID)
❌ **Don't forget** to enable Google Sign-In API in Google Console
❌ **Don't have** duplicate `.apps.googleusercontent.com` suffix

## Troubleshooting

### Still getting DEVELOPER_ERROR?

1. **Verify SHA-1 matches**: Run `./gradlew signingReport` and check SHA-1 matches Google Console
2. **Check package name**: Must be `com.chhattisgarhshaadi.app`
3. **Enable APIs**: Ensure "Google Sign-In API" is enabled in Google Console
4. **Wait 5 minutes**: Changes can take a few minutes to propagate
5. **Clean rebuild**: `cd android && ./gradlew clean && cd .. && npm run android`

### How to verify your Client IDs are correct?

In Google Console → Credentials, you should see:
- ✅ **Web client** (OAuth 2.0 Client ID)
- ✅ **Android client** (OAuth 2.0 Client ID) with package `com.chhattisgarhshaadi.app`

## Quick Fix (Right Now)

**Minimum to stop the error:**

1. Edit `android/local.properties` - remove duplicate suffix:
   ```properties
   GOOGLE_CLIENT_ID=250704044564-q3ql66oruro0a17ipumla9cloda24tkk.apps.googleusercontent.com
   ```

2. Edit `src/services/auth.service.ts` line 19 - use same ID temporarily (not ideal but will work):
   ```typescript
   webClientId: '250704044564-q3ql66oruro0a17ipumla9cloda24tkk.apps.googleusercontent.com',
   ```

3. Rebuild:
   ```bash
   cd android && ./gradlew clean && cd .. && npm run android
   ```

**Note**: This is a quick fix. For production, you should have separate Web and Android client IDs.
