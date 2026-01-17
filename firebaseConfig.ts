/**
 * Firebase Configuration
 * 
 * NOTE: For React Native with @react-native-firebase, the native SDKs
 * are configured via google-services.json (Android) and GoogleService-Info.plist (iOS).
 * 
 * This file is kept for reference and for any web-only Firebase features.
 * The actual phone authentication uses the native Firebase SDK.
 */

// Your Firebase project configuration
// Make sure this matches your google-services.json
export const firebaseConfig = {
  apiKey: "AIzaSyANP94pLXsMST7-q8sUfG9zCiU4kJEK7vg",
  authDomain: "job-app-29f3d.firebaseapp.com",
  projectId: "job-app-29f3d",
  storageBucket: "job-app-29f3d.firebasestorage.app",
  messagingSenderId: "597748089248",
  appId: "1:597748089248:web:2af11b9de7aad01ce2e4c5",
  measurementId: "G-KC915XBGW8"
};

// For React Native Firebase, initialization happens automatically
// via the native modules when google-services.json is properly configured.
// No need to call initializeApp() - @react-native-firebase/app handles this.