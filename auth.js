import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig.js';

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const _googleProvider = new GoogleAuthProvider();
const _appleProvider = new OAuthProvider('apple.com');
_appleProvider.addScope('email');
_appleProvider.addScope('name');

export async function signInWithGoogle() {
  return signInWithPopup(auth, _googleProvider);
}

export async function signInWithApple() {
  try {
    return await signInWithPopup(auth, _appleProvider);
  } catch (e) {
    if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') {
      throw e;
    }
    return null;
  }
}

export async function signOutUser() {
  return signOut(auth);
}
