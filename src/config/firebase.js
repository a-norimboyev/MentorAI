import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase console dan olingan config
// https://console.firebase.google.com/ ga kiring va yangi project yarating
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Firebase konfiguratsiyasi mavjudligini tekshirish
export const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY

if (!isFirebaseConfigured) {
  console.warn('Firebase konfiguratsiyasi topilmadi. .env faylga VITE_FIREBASE_* o\'zgaruvchilarni qo\'shing.')
}

// Firebase initialize
let app, auth, db, storage

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
} else {
  console.warn('Firebase is not configured. Set VITE_FIREBASE_* env variables.')
  // null exports — components should check isFirebaseConfigured before use
  app = null
  auth = null
  db = null
  storage = null
}

export { auth, db, storage }
export default app
