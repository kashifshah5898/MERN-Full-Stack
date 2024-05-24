// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-fullstack-app-28a63.firebaseapp.com",
  projectId: "mern-fullstack-app-28a63",
  storageBucket: "mern-fullstack-app-28a63.appspot.com",
  messagingSenderId: "634434676777",
  appId: "1:634434676777:web:5f9b4c2ab53a3530aa9438",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
