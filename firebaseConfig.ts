// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 👉 use your own config values from Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyB9sJEPOew2YJ08qTqPjkssFbdAADT1zNo",
  authDomain: "job-assigning-app.firebaseapp.com",
  projectId: "job-assigning-app",
  storageBucket: "job-assigning-app.firebasestorage.app",
  messagingSenderId: "753641746328",
  appId: "1:753641746328:web:8a2ec5acf1ad050e5f45ed",
};

const app = initializeApp(firebaseConfig);

// 🔹 this is what we will import in screens
export const db = getFirestore(app);
