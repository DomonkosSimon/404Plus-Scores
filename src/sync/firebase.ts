import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;
let anonymousSignInPromise: Promise<void> | null = null;

/**
 * Firebase is optional at build/dev time: without env vars configured, the app
 * must still run fully offline (scoring/wizard/history-local all work). Sync
 * simply becomes a permanent no-op until a real Firebase project is wired up.
 */
export function isFirebaseConfigured(): boolean {
  return isConfigured;
}

export function getFirebaseServices(): { auth: Auth; firestore: Firestore } | null {
  if (!isConfigured) return null;
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
  }
  return { auth: auth!, firestore: firestore! };
}

export async function ensureAnonymousAuth(): Promise<void> {
  const services = getFirebaseServices();
  if (!services) return;
  if (services.auth.currentUser) return;
  anonymousSignInPromise ??= signInAnonymously(services.auth).then(() => undefined);
  await anonymousSignInPromise;
}
