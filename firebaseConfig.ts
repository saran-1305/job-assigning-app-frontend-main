// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANP94pLXsMST7-q8sUfG9zCiU4kJEK7vg",
  authDomain: "job-app-29f3d.firebaseapp.com",
  projectId: "job-app-29f3d",
  storageBucket: "job-app-29f3d.firebasestorage.app",
  messagingSenderId: "597748089248",
  appId: "1:597748089248:web:2af11b9de7aad01ce2e4c5",
  measurementId: "G-KC915XBGW8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);