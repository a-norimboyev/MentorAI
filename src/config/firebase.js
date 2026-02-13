import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase console dan olingan config
// https://console.firebase.google.com/ ga kiring va yangi project yarating
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:000000000000'
}

// Firebase konfiguratsiyasi mavjudligini tekshirish
export const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY ? true : false

// Firebase initialize
const app = initializeApp(firebaseConfig)

// Auth va Firestore export
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
