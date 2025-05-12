// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBL1hMgLPbg2f4z3xvsoyIVoZfm1HhethQ",
    authDomain: "ai-agent-612.firebaseapp.com",
    projectId: "ai-agent-612",
    storageBucket: "ai-agent-612.firebasestorage.app",
    messagingSenderId: "803707706995",
    appId: "1:803707706995:web:2af08f4a77b610c1505406",
    measurementId: "G-139EQH1EQ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export { db };