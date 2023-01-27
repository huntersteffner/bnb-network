// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "bnb-network-app.firebaseapp.com",
  projectId: "bnb-network-app",
  storageBucket: "bnb-network-app.appspot.com",
  messagingSenderId: "863149690293",
  appId: "1:863149690293:web:f485301212e80467daddfc"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore()