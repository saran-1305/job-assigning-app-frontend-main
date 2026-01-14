/**
 * Auth Service
 * Handles Firebase Authentication and backend auth
 */

import { 
  getAuth, 
  signInWithPhoneNumber, 
  PhoneAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import api, { setAuthToken, clearAuthToken } from './api.service';
import { ENDPOINTS } from '../config/api.config';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB9sJEPOew2YJ08qTqPjkssFbdAADT1zNo",
  authDomain: "job-assigning-app.firebaseapp.com",
  projectId: "job-assigning-app",
  storageBucket: "job-assigning-app.firebasestorage.app",
  messagingSenderId: "753641746328",
  appId: "1:753641746328:web:8a2ec5acf1ad050e5f45ed",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

// User type
export interface User {
  id: string;
  phone: string;
  name?: string;
  skills?: string[];
  isProfileComplete: boolean;
  currentMode: 'employer' | 'worker';
  availability?: {
    isAvailable: boolean;
    schedule?: string;
  };
  rating?: {
    average: number;
    count: number;
  };
  profileImage?: string;
}

/**
 * Send OTP to phone number
 * For React Native, recaptchaVerifier is optional (handled by Firebase internally)
 */
export const sendOTP = async (phoneNumber: string, recaptchaVerifier?: any) => {
  try {
    // Format phone number with country code
    const formattedPhone = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+91${phoneNumber}`;
    
    if (recaptchaVerifier) {
      const confirmationResult = await signInWithPhoneNumber(
        auth, 
        formattedPhone, 
        recaptchaVerifier
      );
      
      return {
        success: true,
        confirmationResult,
      };
    } else {
      // For React Native without recaptcha (testing/dev mode)
      // In production, you'd use Firebase's phone auth for React Native
      console.warn('No recaptchaVerifier provided. Using mock flow for dev.');
      return {
        success: true,
        confirmationResult: null,
        mockMode: true,
      };
    }
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send OTP',
    };
  }
};

/**
 * Verify OTP and sign in
 */
export const verifyOTP = async (
  confirmationResult: any, 
  otp: string,
  fcmToken?: string
) => {
  try {
    // Confirm OTP with Firebase
    const credential = await confirmationResult.confirm(otp);
    const firebaseUser = credential.user;
    
    // Get Firebase ID token
    const idToken = await firebaseUser.getIdToken();
    
    // Store token for API calls
    await setAuthToken(idToken);
    
    // Verify with backend and get/create user
    const response = await api.post(ENDPOINTS.AUTH.VERIFY_TOKEN, {
      idToken,
      fcmToken,
    });
    
    if (!response.success) {
      throw new Error(response.message || 'Backend verification failed');
    }
    
    return {
      success: true,
      user: response.data?.user,
      isNewUser: response.data?.isNewUser,
    };
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return {
      success: false,
      error: error.message || 'OTP verification failed',
    };
  }
};

/**
 * Get current user from backend
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get(ENDPOINTS.AUTH.ME);
    
    if (response.success && response.data?.user) {
      return response.data.user;
    }
    
    return null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (data: Partial<User>) => {
  try {
    const response = await api.put(ENDPOINTS.USERS.PROFILE, data);
    return response;
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Complete profile after signup
 */
export const completeProfile = async (data: {
  name: string;
  age?: number;
  skills: string[];
  aadhaarImage?: string;
}) => {
  try {
    const response = await api.post(ENDPOINTS.USERS.COMPLETE_PROFILE, data);
    return response;
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Switch user mode (employer/worker)
 */
export const switchMode = async (mode: 'employer' | 'worker') => {
  try {
    const response = await api.put(ENDPOINTS.USERS.SWITCH_MODE, { mode });
    return response;
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Toggle availability
 */
export const toggleAvailability = async () => {
  try {
    const response = await api.put(ENDPOINTS.USERS.TOGGLE_AVAILABILITY);
    return response;
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Update FCM token
 */
export const updateFCMToken = async (fcmToken: string) => {
  try {
    const response = await api.put(ENDPOINTS.AUTH.FCM_TOKEN, { fcmToken });
    return response;
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Sign out
 */
export const signOut = async () => {
  try {
    // Notify backend
    await api.post(ENDPOINTS.AUTH.LOGOUT);
    
    // Clear local token
    await clearAuthToken();
    
    // Sign out from Firebase
    await firebaseSignOut(auth);
    
    return { success: true };
  } catch (error: any) {
    // Still clear local data even if backend call fails
    await clearAuthToken();
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Listen for auth state changes
 */
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current Firebase user
 */
export const getFirebaseUser = () => auth.currentUser;

/**
 * Refresh token
 */
export const refreshToken = async () => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken(true);
    await setAuthToken(token);
    return token;
  }
  return null;
};

export { auth };
