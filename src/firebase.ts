// Import the functions you need from the SDKs you need
import { FirebaseOptions, initializeApp } from "firebase/app";
import { browserSessionPersistence, connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "storygenieio.firebaseapp.com",
  projectId: "storygenieio",
  storageBucket: "storygenieio.appspot.com",
  messagingSenderId: "988979911422",
  appId: "1:988979911422:web:4f6b90ea4cba7b29c723af",
  measurementId: "G-96Z0MTXBEY",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);
auth.setPersistence(browserSessionPersistence);

export const functions = getFunctions(app);

if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === "true") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  connectFunctionsEmulator(functions, "localhost", 5001);
}
