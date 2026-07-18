import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Singleton Firebase app initialization — safe to call multiple times
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);

// Firestore: use persistent cache only in browser, plain getFirestore on server
// Guard against calling initializeFirestore twice (which throws an error)
let db: ReturnType<typeof getFirestore>;

if (typeof window !== "undefined") {
  // Browser: try to initialize with persistent multi-tab cache
  // If already initialized (e.g., HMR), fall back to getFirestore
  try {
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
  } catch {
    db = getFirestore(app);
  }
} else {
  // Server/SSR: use standard Firestore (no IndexedDB persistence)
  db = getFirestore(app);
}

const storage = getStorage(app);

export { app, auth, db, storage };
