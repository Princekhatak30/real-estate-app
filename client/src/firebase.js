// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate2-e64e5.firebaseapp.com",
  projectId: "mern-estate2-e64e5",
  storageBucket: "mern-estate2-e64e5.appspot.com",
  messagingSenderId: "176464103387",
  appId: "1:176464103387:web:9c9c509be77eeebb2189fe"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);