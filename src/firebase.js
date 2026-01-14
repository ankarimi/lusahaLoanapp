// src\firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'fake-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'localhost',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'campushub-local',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:0:web:fake',
};

if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  console.warn('VITE_FIREBASE_API_KEY is not set. Using a placeholder config — set env vars in .env for real Firebase credentials.');
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
