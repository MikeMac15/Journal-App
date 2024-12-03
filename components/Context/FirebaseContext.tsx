import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import firebaseConfig from "@/firebaseConfig";
const FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN;
// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
// const firebaseConfig = {
//     apiKey: FIREBASE_API_KEY,
//     authDomain: FIREBASE_AUTH_DOMAIN,
//     projectId: FIREBASE_PROJECT_ID,
//     storageBucket: FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
//     appId: FIREBASE_APP_ID,

// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);