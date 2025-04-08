// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCeelZsadgO5RvI8rwdHcLqXLSoogTICiM",
    authDomain: "casual-pokemon-team-builder.firebaseapp.com",
    projectId: "casual-pokemon-team-builder",
    storageBucket: "casual-pokemon-team-builder.firebasestorage.app",
    messagingSenderId: "52184583562",
    appId: "1:52184583562:web:1e2b669ac3d7826e8a4c73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);