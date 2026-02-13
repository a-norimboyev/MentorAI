import { createContext, useContext, useState, useEffect } from 'react'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from '../config/firebase'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Foydalanuvchi profilini olish
  const fetchUserProfile = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setUserProfile(docSnap.data())
        return docSnap.data()
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
    return null
  }

  // Foydalanuvchi profilini yaratish
  const createUserProfile = async (uid, data) => {
    try {
      await setDoc(doc(db, 'users', uid), {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error creating user profile:', error)
      throw error
    }
  }

  // Ro'yxatdan o'tish
  const register = async (email, password, name, userType) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Profilni yangilash
      await updateProfile(result.user, { displayName: name })
      
      // Firestore da profil yaratish
      await createUserProfile(result.user.uid, {
        uid: result.user.uid,
        email,
        name,
        userType, // 'student' yoki 'teacher'
        photoURL: null
      })

      return result.user
    } catch (error) {
      throw error
    }
  }

  // Kirish
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      await fetchUserProfile(result.user.uid)
      return result.user
    } catch (error) {
      throw error
    }
  }

  // Google bilan kirish
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      
      // Profil mavjudligini tekshirish
      const existingProfile = await fetchUserProfile(result.user.uid)
      
      if (!existingProfile) {
        // Yangi foydalanuvchi - profil yaratish
        await createUserProfile(result.user.uid, {
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName,
          userType: 'student', // Default student
          photoURL: result.user.photoURL
        })
        await fetchUserProfile(result.user.uid)
      }

      return result.user
    } catch (error) {
      throw error
    }
  }

  // Chiqish
  const logout = async () => {
    try {
      await signOut(auth)
      setUserProfile(null)
    } catch (error) {
      throw error
    }
  }

  // Auth state kuzatish
  useEffect(() => {
    let unsubscribe = () => {}
    
    try {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user)
        if (user) {
          try {
            await fetchUserProfile(user.uid)
          } catch (err) {
            console.error('Profile fetch error:', err)
          }
        }
        setLoading(false)
      }, (error) => {
        console.error('Auth state error:', error)
        setLoading(false)
      })
    } catch (error) {
      console.error('Auth initialization error:', error)
      setLoading(false)
    }

    return () => unsubscribe()
  }, [])

  const value = {
    user,
    userProfile,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    fetchUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
