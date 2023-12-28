// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-djerba.firebaseapp.com",
  projectId: "mern-estate-djerba",
  storageBucket: "mern-estate-djerba.appspot.com",
  messagingSenderId: "265514884598",
  appId: "1:265514884598:web:6b4c6b8e44021006707bd7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);