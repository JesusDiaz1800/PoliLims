// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "polilims",
  appId: "1:360289090658:web:8b1669f6bc502b8822a53b",
  storageBucket: "polilims.firebasestorage.app",
  apiKey: "AIzaSyBJvN-e-MP4FMYT6-RJQ0o9hcPC2GiApt8",
  authDomain: "polilims.firebaseapp.com",
  messagingSenderId: "360289090658",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
