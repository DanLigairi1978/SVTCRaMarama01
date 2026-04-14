import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    // Config for: SVTC Website (Project ID: svtc-website)
    // Since this is a public client-side config, it's safe to include the project ID.
    // For standard Firebase Web Apps, the API key is also generally public, 
    // but usually we'd use env vars. given the user provided the Project ID and Number directly,
    // I will use a standard placeholder or try to infer if they provided the full config object.
    // The user provided: Project name: SVTC Website, Project ID: svtc-website, Project number: 377905992979.
    // Missing: API Key, Messaging Sender ID, App ID. 
    // I will use environment variables for the sensitive/specific parts to be safe and clean.

    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "svtc-website.firebaseapp.com",
    projectId: "svtc-website",
    storageBucket: "svtc-website.firebasestorage.app",
    messagingSenderId: "377905992979",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
