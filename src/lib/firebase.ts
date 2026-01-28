/**
 * Configuración e inicialización de Firebase para PoliLims
 */

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, initializeFirestore, connectFirestoreEmulator, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getPerformance } from 'firebase/performance';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Configuración de Firestore simplificada
const firestoreConfig = {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
};

// Inicialización de servicios con singleton pattern
let app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
let db = initializeFirestore(app, firestoreConfig);
let auth = getAuth(app);
let storage = getStorage(app);
let functions = getFunctions(app);

// Configurar emuladores en desarrollo
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  connectStorageEmulator(storage, 'localhost', 9199);
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

// Inicializar Performance Monitoring solo en producción
if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
  getPerformance(app);
}

// Exportar servicios inicializados
export const getFirestoreDb = () => db;
export const getFirebaseAuth = () => auth;
export const getFirebaseStorage = () => storage;
export const getFirebaseFunctions = () => functions;
