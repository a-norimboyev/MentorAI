import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { db } from '../config/firebase'
import { doc, setDoc, getDoc, updateDoc, collection, query, where, onSnapshot, getDocs } from 'firebase/firestore'

const AppDataContext = createContext(null)

export const useAppData = () => {
  const context = useContext(AppDataContext)
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider')
  }
  return context
}

export const AppDataProvider = ({ children }) => {
  const { user } = useAuth()
  
  // =================== REAL-TIME LISTENERS SETUP ===================
  useEffect(() => {
    if (!user) return

    // Notifications real-time listener
    try {
      const notifQuery = query(
        collection(db, 'users', user.uid, 'notifications'),
        where('read', '==', false)
      )
      const unsubscribeNotif = onSnapshot(notifQuery, (snapshot) => {
        const notifs = snapshot.docs.map(doc => ({
          id: doc.id,
          text: doc.data().text,
          time: doc.data().createdAt?.toDate() || new Date(),
          read: doc.data().read
        }))
        setNotifications(prev => [...notifs, ...prev.filter(n => n.read)].slice(0, 20))
      })
      return () => unsubscribeNotif()
    } catch (error) {
      console.error('Error setting up notifications listener:', error)
    }
  }, [user])

  // =================== LOAD PROGRESS FROM FIRESTORE ===================
  useEffect(() => {
    if (!user) return

    const loadProgressFromFirestore = async () => {
      try {
        // Load lesson progress
        const lessonProgRef = collection(db, 'users', user.uid, 'lessonProgress')
        const lessonProgSnap = await getDocs(lessonProgRef)
        const lessonProgress = {}
        lessonProgSnap.forEach(doc => {
          lessonProgress[doc.id] = doc.data().progress || 0
        })

        // Update lessons with saved progress
        setLessons(prev => prev.map(lesson => ({
          ...lesson,
          progress: lessonProgress[lesson.id] || lesson.progress
        })))

        // Load exercise completion
        const exerciseCompRef = collection(db, 'users', user.uid, 'exerciseCompletion')
        const exerciseCompSnap = await getDocs(exerciseCompRef)
        const completedExerciseIds = new Set()
        let totalPoints = 0
        
        exerciseCompSnap.forEach(doc => {
          completedExerciseIds.add(doc.id)
          totalPoints += doc.data().points || 0
        })

        // Update exercises with saved completion status
        setExercises(prev => prev.map(exercise => ({
          ...exercise,
          completed: completedExerciseIds.has(String(exercise.id))
        })))
      } catch (error) {
        console.error('Error loading progress from Firestore:', error)
      }
    }

    loadProgressFromFirestore()
  }, [user])

  // =================== GURUHLAR ===================
  const [groups, setGroups] = useState([
    {
      id: 'JS-2024',
      name: 'JavaScript Boshlangich',
      subject: 'JavaScript',
      teacherName: 'Aziz Karimov',
      maxStudents: 30,
      currentStudents: 24,
      createdAt: '2024-01-15'
    },
    {
      id: 'PY-2024',
      name: 'Python Advanced',
      subject: 'Python',
      teacherName: 'Aziz Karimov',
      maxStudents: 25,
      currentStudents: 18,
      createdAt: '2024-02-01'
    },
    {
      id: 'REACT-01',
      name: 'React.js Kursi',
      subject: 'React',
      teacherName: 'Aziz Karimov',
      maxStudents: 20,
      currentStudents: 20,
      createdAt: '2024-02-10'
    }
  ])

  const [pendingRequests, setPendingRequests] = useState([
    { groupId: 'NODE-01', groupName: 'Node.js Backend', status: 'pending' }
  ])

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
  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: "JavaScript asoslari",
      description: "O'zgaruvchilar, funksiyalar va massivlar bilan ishlash",
      duration: "45 daqiqa",
      students: 24,
      progress: 100,
      thumbnail: "🟨",
      category: "Dasturlash"
    },
    {
      id: 2,
      title: "React Hooks",
      description: "useState, useEffect va boshqa hooklar",
      duration: "60 daqiqa",
      students: 18,
      progress: 75,
      thumbnail: "⚛️",
      category: "Frontend"
    },
    {
      id: 3,
      title: "Node.js kirish",
      description: "Server tomonlama JavaScript",
      duration: "55 daqiqa",
      students: 32,
      progress: 50,
      thumbnail: "🟢",
      category: "Backend"
    },
    {
      id: 4,
      title: "TypeScript asoslari",
      description: "Tiplar va interfacelar",
      duration: "40 daqiqa",
      students: 15,
      progress: 25,
      thumbnail: "🔷",
      category: "Dasturlash"
    },
    {
      id: 5,
      title: "Git va GitHub",
      description: "Version control tizimi",
      duration: "35 daqiqa",
      students: 28,
      progress: 0,
      thumbnail: "🐙",
      category: "Tools"
    }
  ])

  const updateLessonProgress = useCallback((lessonId, progress) => {
    setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, progress } : l))
  }, [])

  const addLesson = useCallback((lesson) => {
    setLessons(prev => [lesson, ...prev])
  }, [])

  // =================== MASHQLAR ===================
  const [exercises, setExercises] = useState([
    {
      id: 1,
      title: "JavaScript Array Methods",
      description: "map, filter, reduce metodlarini qo'llash",
      difficulty: "Oson",
      points: 10,
      completed: true,
      category: "JavaScript"
    },
    {
      id: 2,
      title: "React State Management",
      description: "useState va useReducer bilan ishlash",
      difficulty: "O'rta",
      points: 20,
      completed: true,
      category: "React"
    },
    {
      id: 3,
      title: "API Integration",
      description: "fetch va axios bilan API so'rovlar",
      difficulty: "O'rta",
      points: 25,
      completed: false,
      category: "Backend"
    },
    {
      id: 4,
      title: "TypeScript Generics",
      description: "Generic tiplar bilan ishlash",
      difficulty: "Qiyin",
      points: 35,
      completed: false,
      category: "TypeScript"
    },
    {
      id: 5,
      title: "CSS Flexbox Layout",
      description: "Flexbox bilan responsive layout",
      difficulty: "Oson",
      points: 15,
      completed: true,
      category: "CSS"
    },
    {
      id: 6,
      title: "Node.js REST API",
      description: "Express.js bilan API yaratish",
      difficulty: "Qiyin",
      points: 40,
      completed: false,
      category: "Backend"
    }
  ])

  const toggleExercise = useCallback((exerciseId) => {
    setExercises(prev => prev.map(e => 
      e.id === exerciseId ? { ...e, completed: !e.completed } : e
    ))
  }, [])

  const addExercise = useCallback((exercise) => {
    setExercises(prev => [exercise, ...prev])
  }, [])

  // =================== REJA ===================
  const [dailyTasks, setDailyTasks] = useState([
    { id: 1, title: "JavaScript dars", time: "09:00 - 10:30", type: "lesson", completed: true },
    { id: 2, title: "Array mashqlari", time: "11:00 - 12:00", type: "exercise", completed: true },
    { id: 3, title: "React Hook'lar video", time: "14:00 - 15:00", type: "video", completed: false },
    { id: 4, title: "API loyiha", time: "16:00 - 18:00", type: "project", completed: false }
  ])

  const toggleDailyTask = useCallback((taskId) => {
    setDailyTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ))
  }, [])

  const addDailyTask = useCallback((task) => {
    setDailyTasks(prev => [...prev, { ...task, id: Date.now() }])
  }, [])

  // =================== FAOLIYAT ===================
  const [activities, setActivities] = useState([
    { id: 1, title: "JavaScript asoslari kursi tugallandi", time: "2 soat oldin", type: "success" },
    { id: 2, title: "Yangi mashq qo'shildi: React Hooks", time: "5 soat oldin", type: "info" },
    { id: 3, title: "AI Ustoz bilan suhbat", time: "1 kun oldin", type: "chat" }
  ])

  const addActivity = useCallback((activity) => {
    setActivities(prev => [{ ...activity, id: Date.now(), time: 'Hozir' }, ...prev].slice(0, 10))
  }, [])

  // =================== BILDIRISHNOMALAR ===================
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Yangi mashq qo'shildi: React Hooks", time: "5 daqiqa oldin", read: false },
    { id: 2, text: "JavaScript kursi yangilandi", time: "1 soat oldin", read: false },
    { id: 3, text: "AI Ustoz javob berdi", time: "2 soat oldin", read: true },
  ])

  const addNotification = useCallback((text) => {
    setNotifications(prev => [
      { id: Date.now(), text, time: 'Hozir', read: false },
      ...prev
    ].slice(0, 20))
  }, [])

  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

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
    groups, setGroups, addGroup, removeGroup,
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
