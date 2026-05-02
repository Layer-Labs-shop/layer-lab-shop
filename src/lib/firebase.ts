import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB2IfMpmlFidX4U8n9VMRRoZbiKDrPCEDU",
  authDomain: "layerlab-auth.firebaseapp.com",
  projectId: "layerlab-auth",
  storageBucket: "layerlab-auth.firebasestorage.app",
  messagingSenderId: "148258695216",
  appId: "1:148258695216:web:7cdeabcda3d3827316e5f5",
  measurementId: "G-EQDJDD9LTZ",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
