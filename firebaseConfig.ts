// firebaseConfig.ts

const FIREBASE_API_KEY="AIzaSyDgNlNtZSChFOZTTQnvS7qASAtl_T22E9k"
const FIREBASE_PROJECT_ID="photojournal-a784e"
const FIREBASE_STORAGE_BUCKET="photojournal-a784e.firebasestorage.app"
const FIREBASE_MESSAGING_SENDER_ID="291215475883"
const FIREBASE_APP_ID="1:291215475883:ios:08d00dfe54cc547d99e3ee"
const FIREBASE_AUTH_DOMAIN="photojournal-a784e.firebaseapp.com"


const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
};

export default firebaseConfig;
