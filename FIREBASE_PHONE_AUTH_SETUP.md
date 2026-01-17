# Firebase Phone Authentication Setup Guide

## 🚨 Why OTP Was Not Working

Your original implementation had these critical issues:

### 1. **Firebase JS SDK Cannot Send OTP on React Native**
The Firebase JS SDK's `signInWithPhoneNumber()` requires a `RecaptchaVerifier` which only works on web browsers. On React Native (Android APK), there's no browser/DOM, so the reCAPTCHA cannot render, and OTP cannot be sent.

### 2. **Two Different Firebase Projects**
- `firebaseConfig.ts` had project: `job-app-29f3d`
- `auth.service.ts` had project: `job-assigning-app`

This mismatch would cause authentication failures.

### 3. **Missing Native Firebase Setup**
- No `google-services.json` in the project root
- No `@react-native-firebase/app` and `@react-native-firebase/auth` packages
- No Firebase plugins in `app.json`

### 4. **Mock Mode Fallback**
The code fell back to "mock mode" when no recaptchaVerifier was provided, meaning real OTP was never attempted.

---

## ✅ What Was Fixed

### 1. Installed React Native Firebase
```bash
npm install @react-native-firebase/app @react-native-firebase/auth
```

### 2. Updated `app.json`
Added Firebase plugins and google-services.json reference:
```json
{
  "android": {
    "googleServicesFile": "./google-services.json"
  },
  "plugins": [
    "@react-native-firebase/app",
    "@react-native-firebase/auth"
  ]
}
```

### 3. Rewrote `auth.service.ts`
Now uses `@react-native-firebase/auth` instead of Firebase JS SDK:
```typescript
import auth from '@react-native-firebase/auth';

// This works on native Android/iOS
const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
```

### 4. Updated Login/OTP Screens
Removed mock mode, now uses real Firebase phone auth.

---

## 📋 Required Steps to Complete Setup

### Step 1: Download `google-services.json`

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **job-app-29f3d**
3. Click ⚙️ (Settings) → **Project Settings**
4. Scroll to **Your apps** section
5. If no Android app exists, click **Add app** → **Android**
6. Enter package name: `com.anonymous.jobappfrontend`
7. Download `google-services.json`
8. Place it in: `/job-assigning-app-frontend-main/google-services.json`

### Step 2: Add SHA-1 and SHA-256 Fingerprints

For EAS builds, you need to add the SHA fingerprints to Firebase:

```bash
# Get SHA fingerprints from EAS
eas credentials -p android
```

Or for local debug keystore:
```bash
cd android && ./gradlew signingReport
```

Add both **SHA-1** and **SHA-256** to Firebase Console:
1. Project Settings → Your apps → Android app
2. Click "Add fingerprint"
3. Add both SHA-1 and SHA-256

### Step 3: Enable Phone Authentication

1. Firebase Console → Authentication → Sign-in method
2. Enable **Phone** provider
3. Save

### Step 4: Check API Key Restrictions (Important!)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. APIs & Services → Credentials
4. Find your API key (AIzaSyANP94pLXsMST7-q8sUfG9zCiU4kJEK7vg)
5. Make sure it's either:
   - **Unrestricted** (for testing), OR
   - Has these APIs enabled:
     - Firebase Auth API
     - Firebase Installations API
     - Token Service API
     - Identity Toolkit API

### Step 5: Set Up Test Phone Numbers (Optional but Recommended)

1. Firebase Console → Authentication → Sign-in method
2. Scroll to "Phone numbers for testing"
3. Add test numbers like: `+91 6505551234` with code `123456`

### Step 6: Rebuild the App

```bash
# Clean and rebuild
npx expo prebuild --clean

# Build APK
eas build -p android --profile preview
```

---

## 🧪 Testing

### Test with Firebase Test Numbers First
1. Add test number in Firebase Console (e.g., `+916505551234`)
2. Use that number in app - OTP should be the code you set

### Test with Real Numbers
1. Use a real phone number
2. OTP should arrive via SMS within 30-60 seconds

### Debug Logging
Check logs in the terminal or `adb logcat` for:
```
Sending OTP to: +91XXXXXXXXXX
OTP sent successfully, verificationId: xxxxx
```

---

## 🔧 Troubleshooting

### OTP Still Not Arriving?

1. **Check Firebase Console Logs**
   - Authentication → Usage → Check for errors

2. **Check Google Cloud Quotas**
   - APIs & Services → Quotas
   - Look for SMS-related quotas

3. **Verify SHA Fingerprints**
   - Must match the keystore used for building
   - EAS uses its own keystore, get SHA from `eas credentials`

4. **Check Phone Number Format**
   - Must include country code: `+91XXXXXXXXXX`
   - No spaces or special characters

5. **Check Rate Limits**
   - Firebase limits OTP requests per phone number
   - Wait 1-2 minutes between attempts

6. **Check SMS Region Policy**
   - Firebase Console → Authentication → Settings
   - Make sure your country (India +91) is not blocked

### Common Error Codes

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `auth/invalid-phone-number` | Wrong format | Use E.164 format (+91...) |
| `auth/too-many-requests` | Rate limited | Wait and try again |
| `auth/quota-exceeded` | SMS quota full | Check billing/quotas |
| `auth/app-not-authorized` | Missing SHA or wrong package | Verify Firebase setup |
| `auth/captcha-check-failed` | Play Integrity failed | Check SHA-256 fingerprint |

---

## 📱 How It Works Now

1. **User enters phone number** → Login.tsx
2. **`sendOTP()` called** → auth.service.ts
3. **React Native Firebase sends request to Firebase** → Native SDK
4. **Firebase verifies app via Play Integrity** → Uses SHA-256
5. **If Play Integrity fails, falls back to reCAPTCHA** → WebView
6. **OTP SMS sent to user** → Firebase SMS
7. **User enters OTP** → otp.tsx
8. **`verifyOTP()` confirms with Firebase** → User signed in
9. **Backend verification** → Creates/gets user in MongoDB

---

## 📁 Files Changed

1. `package.json` - Added @react-native-firebase packages
2. `app.json` - Added Firebase plugins and googleServicesFile
3. `services/auth.service.ts` - Complete rewrite using RN Firebase
4. `app/auth/Login.tsx` - Updated to use new auth service
5. `app/auth/SignUp.tsx` - Updated to use new auth service
6. `app/auth/otp.tsx` - Updated verification flow
7. `firebaseConfig.ts` - Updated documentation

---

## ⚠️ Important Notes

1. **Never commit `google-services.json` to public repos** - Add to `.gitignore`
2. **Use test phone numbers during development** - Saves SMS costs
3. **Monitor Firebase usage** - SMS can be expensive at scale
4. **EAS builds require separate SHA fingerprints** - Get from `eas credentials`
