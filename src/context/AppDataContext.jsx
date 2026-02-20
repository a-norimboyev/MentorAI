import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { db } from '../config/firebase'
import { 
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  addDoc,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore'
import { getUserGroups } from '../utils/groupService'

const AppDataContext = createContext(null)

export const useAppData = () => {
  const context = useContext(AppDataContext)
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider')
  }
  return context
}

export const AppDataProvider = ({ children }) => {
  const { user, saveActivity } = useAuth()
  
  // =================== REAL-TIME LISTENERS SETUP ===================
  useEffect(() => {
    if (!user) {
      setNotifications([])
      return
    }

    // Notifications real-time listener
    try {
      const notifQuery = query(
        collection(db, 'users', user.uid, 'notifications'),
        orderBy('createdAt', 'desc'),
        limit(20)
      )
      const unsubscribeNotif = onSnapshot(notifQuery, (snapshot) => {
        const notifs = snapshot.docs.map(docSnap => {
          const data = docSnap.data()
          const createdAt = data.createdAt?.toDate() || new Date()
          return {
            id: docSnap.id,
            text: data.text,
            time: createdAt.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
            read: data.read
          }
        })
        setNotifications(notifs)
      })
      return () => unsubscribeNotif()
    } catch (error) {
      console.error('Error setting up notifications listener:', error)
    }
  }, [user])

  // =================== GURUHLAR ===================
  const [groups, setGroups] = useState([])

  const [pendingRequests, setPendingRequests] = useState([])

  // Firestore dan guruhlarni yuklash
  const loadGroups = useCallback(async () => {
    if (!user) return
    try {
      const userGroups = await getUserGroups(user.uid)
      const formattedGroups = userGroups.map(g => ({
        ...g,
        currentStudents: g.members?.length || 0,
        createdAt: g.createdAt?.toDate?.() ? g.createdAt.toDate().toISOString() : g.createdAt || new Date().toISOString()
      }))
      setGroups(formattedGroups)
    } catch (error) {
      console.error('Error loading groups from Firestore:', error)
    }
  }, [user])

  // User login bo'lganda guruhlarni yuklash
  useEffect(() => {
    if (user) {
      loadGroups()
    } else {
      setGroups([])
      setPendingRequests([])
    }
  }, [user, loadGroups])

  const addGroup = useCallback((group) => {
    setGroups(prev => [...prev, group])
  }, [])

  const removeGroup = useCallback((groupId) => {
    setGroups(prev => prev.filter(g => g.id !== groupId))
  }, [])

  const addPendingRequest = useCallback((req) => {
    setPendingRequests(prev => [...prev, req])
  }, [])

  // =================== DARSLAR ===================
  const [lessons, setLessons] = useState([])

  const updateLessonProgress = useCallback((lessonId, progress) => {
    setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, progress } : l))
  }, [])

  const addLesson = useCallback((lesson) => {
    setLessons(prev => [lesson, ...prev])
    // Firestore ga saqlash
    if (user) {
      const lessonRef = doc(db, 'users', user.uid, 'lessons', String(lesson.id))
      setDoc(lessonRef, lesson).catch(e => console.error('Error saving lesson:', e))
    }
  }, [user])

  // =================== MASHQLAR ===================
  const [exercises, setExercises] = useState([])

  const toggleExercise = useCallback((exerciseId) => {
    setExercises(prev => prev.map(e => 
      e.id === exerciseId ? { ...e, completed: !e.completed } : e
    ))
  }, [])

  const addExercise = useCallback((exercise) => {
    setExercises(prev => [exercise, ...prev])
    // Firestore ga saqlash
    if (user) {
      const exerciseRef = doc(db, 'users', user.uid, 'exercises', String(exercise.id))
      setDoc(exerciseRef, exercise).catch(e => console.error('Error saving exercise:', e))
    }
  }, [user])

  // =================== REJA ===================
  const [dailyTasks, setDailyTasks] = useState([])

  const toggleDailyTask = useCallback((taskId) => {
    setDailyTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ))
  }, [])

  const addDailyTask = useCallback((task) => {
    setDailyTasks(prev => [...prev, { ...task, id: task.id || Date.now() }])
  }, [])

  // =================== DARSLAR, MASHQLAR, REJA ni Firestore dan yuklash ===================
  useEffect(() => {
    if (!user) {
      setLessons([])
      setExercises([])
      setDailyTasks([])
      return
    }

    const loadUserData = async () => {
      try {
        // Progress ma'lumotlarini parallel yuklash
        const [lessonProgSnap, exerciseCompSnap] = await Promise.all([
          getDocs(collection(db, 'users', user.uid, 'lessonProgress')),
          getDocs(collection(db, 'users', user.uid, 'exerciseCompletion'))
        ])

        const lessonProgress = {}
        lessonProgSnap.forEach(d => {
          lessonProgress[d.id] = d.data().progress || 0
        })

        const completedExerciseIds = new Set()
        exerciseCompSnap.forEach(d => {
          completedExerciseIds.add(d.id)
        })

        // Darslar
        const lessonsRef = collection(db, 'users', user.uid, 'lessons')
        const lessonsSnap = await getDocs(lessonsRef)
        if (!lessonsSnap.empty) {
          const loadedLessons = lessonsSnap.docs.map(d => {
            const data = { id: d.id, ...d.data() }
            data.progress = lessonProgress[d.id] ?? data.progress ?? 0
            return data
          })
          setLessons(loadedLessons)
        } else {
          // Standart darslar (birinchi marta login)
          const defaults = [
            { id: 1, title: "JavaScript asoslari", description: "O'zgaruvchilar, funksiyalar va massivlar bilan ishlash", duration: "45 daqiqa", students: 24, progress: 0, thumbnail: "🟨", category: "JavaScript" },
            { id: 2, title: "React Hooks", description: "useState, useEffect va boshqa hooklar", duration: "60 daqiqa", students: 18, progress: 0, thumbnail: "⚛️", category: "React" },
            { id: 3, title: "Node.js kirish", description: "Server tomonlama JavaScript", duration: "55 daqiqa", students: 32, progress: 0, thumbnail: "🟢", category: "Backend" },
            { id: 4, title: "TypeScript asoslari", description: "Tiplar va interfacelar", duration: "40 daqiqa", students: 15, progress: 0, thumbnail: "🔷", category: "TypeScript" },
            { id: 5, title: "Git va GitHub", description: "Version control tizimi", duration: "35 daqiqa", students: 28, progress: 0, thumbnail: "🐙", category: "Tools" }
          ]
          setLessons(defaults.map(l => ({
            ...l,
            progress: lessonProgress[l.id] ?? 0
          })))
        }

        // Mashqlar
        const exercisesRef = collection(db, 'users', user.uid, 'exercises')
        const exercisesSnap = await getDocs(exercisesRef)
        if (!exercisesSnap.empty) {
          const loadedExercises = exercisesSnap.docs.map(d => {
            const data = { id: d.id, ...d.data() }
            data.completed = completedExerciseIds.has(String(d.id)) || data.completed
            return data
          })
          setExercises(loadedExercises)
        } else {
          const defaults = [
            { id: 1, title: "JavaScript Array Methods", description: "map, filter, reduce metodlarini qo'llash", difficulty: "Oson", points: 10, completed: false, category: "JavaScript" },
            { id: 2, title: "React State Management", description: "useState va useReducer bilan ishlash", difficulty: "O'rta", points: 20, completed: false, category: "React" },
            { id: 3, title: "API Integration", description: "fetch va axios bilan API so'rovlar", difficulty: "O'rta", points: 25, completed: false, category: "Backend" },
            { id: 4, title: "TypeScript Generics", description: "Generic tiplar bilan ishlash", difficulty: "Qiyin", points: 35, completed: false, category: "TypeScript" },
            { id: 5, title: "CSS Flexbox Layout", description: "Flexbox bilan responsive layout", difficulty: "Oson", points: 15, completed: false, category: "CSS" },
            { id: 6, title: "Node.js REST API", description: "Express.js bilan API yaratish", difficulty: "Qiyin", points: 40, completed: false, category: "Backend" }
          ]
          setExercises(defaults.map(e => ({
            ...e,
            completed: completedExerciseIds.has(String(e.id))
          })))
        }

        // Kunlik rejalar
        const tasksRef = collection(db, 'users', user.uid, 'dailyTasks')
        const tasksSnap = await getDocs(tasksRef)
        if (!tasksSnap.empty) {
          const loadedTasks = tasksSnap.docs.map(d => ({ id: d.id, ...d.data() }))
          setDailyTasks(loadedTasks)
        }
      } catch (error) {
        console.error('Error loading user data from Firestore:', error)
      }
    }

    loadUserData()
  }, [user])

  // =================== FAOLIYAT ===================
  const [activities, setActivities] = useState([])

  const addActivity = useCallback((activity) => {
    setActivities(prev => [{ ...activity, id: Date.now(), time: 'Hozir' }, ...prev].slice(0, 10))
    // Firestore ga ham saqlash
    if (saveActivity && activity.title) {
      saveActivity(activity.title, activity.type || 'info')
    }
  }, [saveActivity])

  // =================== BILDIRISHNOMALAR ===================
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback(async (text) => {
    if (!user) {
      setNotifications(prev => [
        { id: Date.now(), text, time: 'Hozir', read: false },
        ...prev
      ].slice(0, 20))
      return
    }

    try {
      const notifRef = collection(db, 'users', user.uid, 'notifications')
      await addDoc(notifRef, {
        text,
        read: false,
        createdAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error adding notification:', error)
    }
  }, [user])

  const markNotificationRead = useCallback(async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    if (!user) return
    try {
      const notifRef = doc(db, 'users', user.uid, 'notifications', String(id))
      await updateDoc(notifRef, { read: true })
    } catch (error) {
      console.error('Error marking notification read:', error)
    }
  }, [user])

  const markAllNotificationsRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    if (!user) return
    try {
      const notifQuery = query(
        collection(db, 'users', user.uid, 'notifications'),
        where('read', '==', false)
      )
      const snapshot = await getDocs(notifQuery)
      const updates = snapshot.docs.map(docSnap =>
        updateDoc(docSnap.ref, { read: true })
      )
      await Promise.all(updates)
    } catch (error) {
      console.error('Error marking all notifications read:', error)
    }
  }, [user])

  // =================== HISOBLANGAN QIYMATLAR ===================
  const completedLessons = lessons.filter(l => l.progress === 100).length
  const totalStudyHours = Math.round(lessons.reduce((sum, l) => {
    const minutes = parseInt(l.duration) || 0
    return sum + (minutes * l.progress / 100)
  }, 0) / 60)
  const completedExercises = exercises.filter(e => e.completed).length
  const totalPoints = exercises.filter(e => e.completed).reduce((sum, e) => sum + e.points, 0)
  const completedDailyTasks = dailyTasks.filter(t => t.completed).length
  const unreadNotifications = notifications.filter(n => !n.read).length

  // Haftalik maqsad foizi
  const weeklyLessonGoal = 5
  const weeklyLessonProgress = Math.min(100, Math.round((completedLessons / weeklyLessonGoal) * 100))

  const value = {
    // Guruhlar
    groups, setGroups, addGroup, removeGroup, loadGroups,
    pendingRequests, setPendingRequests, addPendingRequest,
    // Darslar
    lessons, setLessons, updateLessonProgress, addLesson,
    // Mashqlar
    exercises, setExercises, toggleExercise, addExercise,
    // Reja
    dailyTasks, setDailyTasks, toggleDailyTask, addDailyTask,
    // Faoliyat
    activities, addActivity,
    // Bildirishnomalar
    notifications, addNotification, markNotificationRead, markAllNotificationsRead, unreadNotifications,
    // Hisoblangan
    completedLessons, totalStudyHours, completedExercises, totalPoints,
    completedDailyTasks, weeklyLessonProgress
  }

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  )
}
