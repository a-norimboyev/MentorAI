import { createContext, useContext, useState, useEffect } from 'react'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth'
import { doc, setDoc, getDoc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from '../config/firebase'
import { resetChat } from '../config/gemini'
import toast from 'react-hot-toast'

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
  const register = async (email, password, name, userType, extraData = {}) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Profilni yangilash
      await updateProfile(result.user, { displayName: name })
      
      // Email tasdiqlash yuborish
      try {
        await sendEmailVerification(result.user)
        toast.success('Tasdiqlash havolasi emailingizga yuborildi!', {
          duration: 5000,
        })
      } catch (verificationError) {
        console.error('Email verification error:', verificationError)
        toast.error('Email tasdiqlash yuborishda xatolik')
      }
      
      // Firestore da profil yaratish
      await createUserProfile(result.user.uid, {
        uid: result.user.uid,
        email,
        name,
        userType, // 'student' yoki 'teacher'
        photoURL: null,
        selectedTech: null,
        technologies: [],
        onboardingCompleted: false,
        ...extraData
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
      if (!result.user.emailVerified) {
        // Resend uchun foydalanuvchini saqlab qo'yish (signOut dan oldin)
        setUnverifiedUser(result.user)
        await signOut(auth)
        const error = new Error('Email not verified')
        error.code = 'auth/email-not-verified'
        throw error
      }
      await fetchUserProfile(result.user.uid)
      return result.user
    } catch (error) {
      throw error
    }
  }

  // Tasdiqlanmagan foydalanuvchini saqlash (resend uchun)
  const [unverifiedUser, setUnverifiedUser] = useState(null)

  const resendVerificationEmail = async () => {
    const targetUser = auth.currentUser || unverifiedUser
    if (!targetUser) {
      const error = new Error('No current user')
      error.code = 'auth/no-current-user'
      throw error
    }
    await sendEmailVerification(targetUser)
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
          photoURL: result.user.photoURL,
          selectedTech: null,
          technologies: [],
          onboardingCompleted: false
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
      resetChat()
    } catch (error) {
      throw error
    }
  }

  // Auth state kuzatish
  useEffect(() => {
    let unsubscribeAuth = () => {}
    let unsubscribeProfile = () => {}
    
    try {
      unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        setUser(user)
        if (user) {
          try {
            // Real-time profile listener o'rnatish
            const userDocRef = doc(db, 'users', user.uid)
            unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
              if (docSnap.exists()) {
                setUserProfile(docSnap.data())
              }
            }, (error) => {
              console.error('Profile snapshot error:', error)
            })
          } catch (err) {
            console.error('Profile listener setup error:', err)
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

    return () => {
      unsubscribeAuth()
      unsubscribeProfile()
    }
  }, [])

  // Profilni yangilash
  const updateUserProfile = async (data) => {
    try {
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          ...userProfile,
          ...data,
          updatedAt: new Date().toISOString()
        }, { merge: true })
        setUserProfile(prev => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  // Dars progresini Firestore ga saqlash
  const saveLessonProgress = async (lessonId, progress) => {
    try {
      if (user) {
        const progressRef = doc(db, 'users', user.uid, 'lessonProgress', String(lessonId))
        await updateDoc(progressRef, {
          progress,
          updatedAt: serverTimestamp()
        }).catch(async () => {
          // Agar document yo'q bo'lsa, yangi document yaratish
          await setDoc(progressRef, {
            lessonId,
            progress,
            completedAt: progress === 100 ? serverTimestamp() : null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          })
        })
      }
    } catch (error) {
      console.error('Error saving lesson progress:', error)
    }
  }

  // Mashq tugallashni Firestore ga saqlash
  const saveExerciseCompletion = async (exerciseId, points, difficulty) => {
    try {
      if (user) {
        const exerciseRef = doc(db, 'users', user.uid, 'exerciseCompletion', String(exerciseId))
        await updateDoc(exerciseRef, {
          completed: true,
          completedAt: serverTimestamp(),
          points,
          difficulty
        }).catch(async () => {
          // Agar document yo'q bo'lsa, yangi document yaratish
          await setDoc(exerciseRef, {
            exerciseId,
            completed: true,
            points,
            difficulty,
            completedAt: serverTimestamp(),
            createdAt: serverTimestamp()
          })
        })
        
        // Jami ballni yangilash
        const currentPoints = userProfile?.totalPoints || 0
        await updateUserProfile({
          totalPoints: currentPoints + points
        })
      }
    } catch (error) {
      console.error('Error saving exercise completion:', error)
    }
  }

  // Faoliyatni Firestore ga saqlash
  const saveActivity = async (title, type = 'info') => {
    try {
      if (user) {
        const activityRef = doc(db, 'users', user.uid, 'activities', Date.now().toString())
        await setDoc(activityRef, {
          title,
          type,
          createdAt: serverTimestamp()
        })
      }
    } catch (error) {
      console.error('Error saving activity:', error)
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    resendVerificationEmail,
    fetchUserProfile,
    updateUserProfile,
    saveLessonProgress,
    saveExerciseCompletion,
    saveActivity
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
