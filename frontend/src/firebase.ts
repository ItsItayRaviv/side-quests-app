// frontend/src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,   // or persistentSingleTabManager
} from 'firebase/firestore';

const firebaseConfig = {/* … */};
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
