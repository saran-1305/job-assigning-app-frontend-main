/**
 * Auth Service
 * Handles Firebase Authentication using React Native Firebase SDK
 * 
 * IMPORTANT: This uses @react-native-firebase/auth which provides native
 * Android/iOS phone authentication with Play Integrity / reCAPTCHA fallback
 */

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import api, { setAuthToken, clearAuthToken } from './api.service';
import { ENDPOINTS } from '../config/api.config';

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

// Store confirmation result globally for OTP verification
let confirmationResult: FirebaseAuthTypes.ConfirmationResult | null = null;

/**
 * Send OTP to phone number using React Native Firebase
 * This automatically handles Play Integrity and reCAPTCHA verification
 */
export const sendOTP = async (phoneNumber: string) => {
  try {
    // Format phone number with country code
    const formattedPhone = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+91${phoneNumber}`;
    
    console.log('Sending OTP to:', formattedPhone);
    
    // Use React Native Firebase's phone auth
    // This handles Play Integrity / reCAPTCHA automatically on Android
    const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
    
    // Store confirmation result for later verification
    confirmationResult = confirmation;
    
    console.log('OTP sent successfully, verificationId:', confirmation.verificationId);
    
    return {
      success: true,
      verificationId: confirmation.verificationId,
    };
  } catch (error: any) {
    console.error('Send OTP error:', error);
    
    // Handle specific Firebase errors
    let errorMessage = 'Failed to send OTP';
    
    if (error.code === 'auth/invalid-phone-number') {
      errorMessage = 'Invalid phone number format';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many requests. Please try again later.';
    } else if (error.code === 'auth/quota-exceeded') {
      errorMessage = 'SMS quota exceeded. Please try again later.';
    } else if (error.code === 'auth/missing-phone-number') {
      errorMessage = 'Phone number is required';
    } else if (error.code === 'auth/app-not-authorized') {
      errorMessage = 'App not authorized. Check Firebase configuration.';
    } else if (error.code === 'auth/captcha-check-failed') {
      errorMessage = 'reCAPTCHA verification failed. Please try again.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage,
      code: error.code,
    };
  }
};

/**
 * Verify OTP and sign in
 */
export const verifyOTP = async (
  otp: string,
  fcmToken?: string
) => {
  try {
    if (!confirmationResult) {
      throw new Error('No confirmation result. Please request OTP again.');
    }
    
    console.log('Verifying OTP...');
    
    // Confirm OTP with Firebase
    const credential = await confirmationResult.confirm(otp);
    
    if (!credential || !credential.user) {
      throw new Error('No user returned from Firebase');
    }
    
    const firebaseUser = credential.user;
    
    console.log('OTP verified, Firebase UID:', firebaseUser.uid);
    
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
    
    // Clear confirmation result after successful verification
    confirmationResult = null;
    
    return {
      success: true,
      user: response.data?.user,
      isNewUser: response.data?.isNewUser,
    };
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    
    let errorMessage = 'OTP verification failed';
    
    if (error.code === 'auth/invalid-verification-code') {
      errorMessage = 'Invalid OTP. Please check and try again.';
    } else if (error.code === 'auth/session-expired') {
      errorMessage = 'OTP session expired. Please request a new OTP.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage,
      code: error.code,
    };
  }
};

/**
 * Verify OTP using verification ID (alternative method)
 */
export const verifyOTPWithId = async (
  verificationId: string,
  otp: string,
  fcmToken?: string
) => {
  try {
    console.log('Verifying OTP with verificationId...');
    
    // Create credential from verification ID and OTP
    const credential = auth.PhoneAuthProvider.credential(verificationId, otp);
    
    // Sign in with credential
    const result = await auth().signInWithCredential(credential);
    const firebaseUser = result.user;
    
    if (!firebaseUser) {
      throw new Error('No user returned from Firebase');
    }
    
    console.log('OTP verified, Firebase UID:', firebaseUser.uid);
    
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
    
    let errorMessage = 'OTP verification failed';
    
    if (error.code === 'auth/invalid-verification-code') {
      errorMessage = 'Invalid OTP. Please check and try again.';
    } else if (error.code === 'auth/session-expired') {
      errorMessage = 'OTP session expired. Please request a new OTP.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage,
      code: error.code,
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
    await auth().signOut();
    
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
export const onAuthStateChange = (callback: (user: FirebaseAuthTypes.User | null) => void) => {
  return auth().onAuthStateChanged(callback);
};

/**
 * Get current Firebase user
 */
export const getFirebaseUser = () => auth().currentUser;

/**
 * Refresh token
 */
export const refreshToken = async () => {
  const user = auth().currentUser;
  if (user) {
    const token = await user.getIdToken(true);
    await setAuthToken(token);
    return token;
  }
  return null;
};

/**
 * Check if user is signed in
 */
export const isSignedIn = () => {
  return auth().currentUser !== null;
};

export { auth };
