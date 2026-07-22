// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0m2EkbBfTNsZ1JhnYSWe1zZC73PB6niI",
  authDomain: "paopsz-app.firebaseapp.com",
  projectId: "paopsz-app",
  storageBucket: "paopsz-app.firebasestorage.app",
  messagingSenderId: "837049986162",
  appId: "1:837049986162:web:54620373b9a003fb6966eb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Cloud Functions and get a reference to the service
const functions = getFunctions(app);
export const createUser = httpsCallable(functions, 'createUser');