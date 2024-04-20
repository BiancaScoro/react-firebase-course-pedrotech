import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCRyyTv9i1MEdVKOStvlXPJSkwW3nGzj9Q",
  authDomain: "fir-course-bf113.firebaseapp.com",
  projectId: "fir-course-bf113",
  storageBucket: "fir-course-bf113.appspot.com",
  messagingSenderId: "536170540365",
  appId: "1:536170540365:web:b1bce124bc8f041dbc5b04",
  measurementId: "G-6L91TF50PH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);