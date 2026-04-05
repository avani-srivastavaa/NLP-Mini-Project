import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAngUhm2fb4qIMccch0z35kQ9d6K8Qa6wY",
  authDomain: "library-management-a1cee.firebaseapp.com",
  projectId: "library-management-a1cee",
  storageBucket: "library-management-a1cee.firebasestorage.app",
  messagingSenderId: "686739070182",
  appId: "1:686739070182:web:4455bb746165e6c0c7ef27",
  measurementId: "G-WQMDTDGWC4"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logOut() {
  await signOut(auth);
}