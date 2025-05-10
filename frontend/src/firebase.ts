// frontend/src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,   // or persistentSingleTabManager
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyATx12yhJajVfOxSjOquRKDm3zK5Yjl9u8",
  authDomain: "life-quests-app.firebaseapp.com",
  projectId: "life-quests-app",
  storageBucket: "life-quests-app.firebasestorage.app",
  messagingSenderId: "356726449521",
  appId: "1:356726449521:web:dd09b69893033d6b9c82d0",
  measurementId: "G-5P2R9KWKQ1"
};

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);

/**
 * Creates a Firestore instance that:
 *   • caches docs in IndexedDB
 *   • keeps multiple browser tabs in sync
 */
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

export const functions = getFunctions(app);