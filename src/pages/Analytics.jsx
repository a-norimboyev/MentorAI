import Sidebar from '../components/Sidebar'
import { useSidebar } from '../context/SidebarContext'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'
import { 
  BarChart3, TrendingUp, Clock, Target, Trophy, BookOpen, 
  Calendar, Flame, ArrowUp, ArrowDown, Minus
} from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { db } from '../config/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

const Analytics = () => {
  const { user, userProfile } = useAuth()
  const { collapsed } = useSidebar()
  const { 
    completedLessons, totalStudyHours, completedExercises, totalPoints,
    lessons, exercises, dailyTasks, activities
  } = useAppData()

  const [period, setPeriod] = useState('week')
  const [activityLog, setActivityLog] = useState([])

  // Firestore dan faoliyat logini yuklash
  useEffect(() => {
    if (!user) return
    const loadActivityLog = async () => {
      try {
        const actRef = collection(db, 'users', user.uid, 'activities')
        const actQuery = query(actRef, orderBy('createdAt', 'desc'))
        const snap = await getDocs(actQuery)
        const logs = snap.docs.map(d => {
          const data = d.data()
          return {
            ...data,
            id: d.id,
            createdAt: data.createdAt?.toDate?.() || new Date()
          }
        })
        setActivityLog(logs)
      } catch (e) {
        console.error('Error loading activity log:', e)
      }
    }
    loadActivityLog()
  }, [user])

  // Haftalik / oylik ma'lumotlarni faoliyatlardan hisoblash
  const { weeklyData, monthlyData } = useMemo(() => {
    const now = new Date()
    const dayNames = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan']
    
    // Haftalik (oxirgi 7 kun)
    const weekly = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now)
      date.setDate(now.getDate() - (6 - i))
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const dayEnd = new Date(dayStart)
      dayEnd.setDate(dayEnd.getDate() + 1)
      
      const dayActivities = activityLog.filter(a => {
        const t = a.createdAt
        return t >= dayStart && t < dayEnd
      })
      
      const lessonsCount = dayActivities.filter(a => 
        a.type === 'success' || a.title?.includes('dars') || a.title?.includes('lesson')
      ).length
      const exercisesCount = dayActivities.filter(a => 
        a.title?.includes('mashq') || a.title?.includes('exercise') || a.title?.includes('ball')
      ).length
      
      return {
        day: dayNames[date.getDay()],
        hours: Math.round((lessonsCount * 0.5 + exercisesCount * 0.3) * 10) / 10,
        lessons: lessonsCount,
        exercises: exercisesCount
      }
    })

    // Oylik (oxirgi 4 hafta)
    const monthly = Array.from({ length: 4 }, (_, i) => {
      const weekEnd = new Date(now)
      weekEnd.setDate(now.getDate() - (i * 7))
      const weekStart = new Date(weekEnd)
      weekStart.setDate(weekEnd.getDate() - 7)
      
      const weekActivities = activityLog.filter(a => {
        const t = a.createdAt
        return t >= weekStart && t < weekEnd
      })
      
      const lessonsCount = weekActivities.filter(a => 
        a.type === 'success' || a.title?.includes('dars') || a.title?.includes('lesson')
      ).length
      const exercisesCount = weekActivities.filter(a => 
        a.title?.includes('mashq') || a.title?.includes('exercise') || a.title?.includes('ball')
      ).length
      
      return {
        week: `${4 - i}-hafta`,
        hours: Math.round((lessonsCount * 0.5 + exercisesCount * 0.3) * 10) / 10,
        lessons: lessonsCount,
        exercises: exercisesCount
      }
    }).reverse()

    return { weeklyData: weekly, monthlyData: monthly }
  }, [activityLog])

  const currentData = period === 'week' ? weeklyData : monthlyData
  const maxHours = Math.max(...currentData.map(d => d.hours), 1)
  
  const totalWeekHours = weeklyData.reduce((s, d) => s + d.hours, 0)
  const totalWeekLessons = weeklyData.reduce((s, d) => s + d.lessons, 0)
  const totalWeekExercises = weeklyData.reduce((s, d) => s + d.exercises, 0)
  const avgDailyHours = (totalWeekHours / 7).toFixed(1)

  // Streak (ketma-ket faol kunlar)
  const { currentStreak, longestStreak } = useMemo(() => {
    if (activityLog.length === 0) return { currentStreak: 0, longestStreak: 0 }
    
    const activeDays = new Set()
    activityLog.forEach(a => {
      const d = a.createdAt
      activeDays.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)
    })
    
    let current = 0
    let longest = 0
    let streak = 0
    const today = new Date()
    
    for (let i = 0; i < 90; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      
      if (activeDays.has(key)) {
        streak++
        if (i === 0 || current === i) current = streak
        longest = Math.max(longest, streak)
      } else {
        if (i === 0) current = 0
        streak = 0
      }
    }
    
    return { currentStreak: current, longestStreak: longest }
  }, [activityLog])

  // Kategoriya bo'yicha tahlil
  const categoryStats = useMemo(() => {
    const catMap = {}
    
    lessons.forEach(l => {
      const cat = l.category || 'Umumiy'
      if (!catMap[cat]) catMap[cat] = { name: cat, total: 0, completed: 0 }
      catMap[cat].total++
      if (l.progress === 100) catMap[cat].completed++
    })
    
    exercises.forEach(e => {
      const cat = e.category || 'Umumiy'
      if (!catMap[cat]) catMap[cat] = { name: cat, total: 0, completed: 0 }
      catMap[cat].total++
      if (e.completed) catMap[cat].completed++
    })
    
    const colors = ['bg-yellow-500', 'bg-cyan-500', 'bg-green-500', 'bg-blue-500', 'bg-orange-500', 'bg-purple-500', 'bg-red-500']
    
    return Object.values(catMap).map((cat, i) => ({
      name: cat.name,
      progress: cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0,
      lessonsCount: cat.completed,
      color: colors[i % colors.length]
    })).sort((a, b) => b.progress - a.progress)
  }, [lessons, exercises])

  // O'sish ko'rsatkichlari
  const growthStats = useMemo(() => [
    { icon: <BookOpen className="w-5 h-5" />, current: completedLessons, label: "Tugallangan darslar" },
    { icon: <Target className="w-5 h-5" />, current: completedExercises, label: "Bajarilgan mashqlar" },
    { icon: <Clock className="w-5 h-5" />, current: `${totalStudyHours} soat`, label: "O'qish vaqti" },
    { icon: <Trophy className="w-5 h-5" />, current: totalPoints, label: "Jami ball" }
  ], [completedLessons, completedExercises, totalStudyHours, totalPoints])

  // Kuchli va zaif tomonlar
  const { strengths, weaknesses } = useMemo(() => {
    const emojis = { JavaScript: '🟨', React: '⚛️', CSS: '🎨', Backend: '🔗', TypeScript: '🔷', Python: '🐍', Git: '🐙', Umumiy: '📚', Frontend: '⚛️', Tools: '🛠️' }
    
    const sorted = [...categoryStats]
    const strong = sorted.filter(c => c.progress >= 50).slice(0, 3).map(c => ({
      topic: c.name,
      score: c.progress,
      icon: emojis[c.name] || '📘'
    }))
    const weak = sorted.filter(c => c.progress < 50).sort((a, b) => a.progress - b.progress).slice(0, 3).map(c => ({
      topic: c.name,
      score: c.progress,
      icon: emojis[c.name] || '📘'
    }))
    
    return { strengths: strong, weaknesses: weak }
  }, [categoryStats])

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />
      <main className={`${collapsed ? 'ml-21.25' : 'ml-64'} p-8 transition-all duration-300`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Tahlil</h1>
            <p className="text-slate-400">O'qish jarayoningizni batafsil kuzating</p>
          </div>
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1">
            <button
              onClick={() => setPeriod('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                period === 'week' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Haftalik
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                period === 'month' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Oylik
            </button>
          </div>
        </div>

        {/* O'sish ko'rsatkichlari */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {growthStats.map((stat, index) => (
            <div key={index} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                  {stat.icon}
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-400">
                  <Minus className="w-3 h-3" /> -
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{stat.current}</p>
              <p className="text-slate-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Grafik */}
          <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6">
              {period === 'week' ? "Haftalik o'qish vaqti" : "Oylik o'qish vaqti"}
            </h2>
            
            {/* Bar Chart */}
            <div className="flex items-end gap-3 h-48 mb-4">
              {currentData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-slate-400">{item.hours}s</span>
                  <div className="w-full relative">
                    <div 
                      className="w-full bg-linear-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-500 hover:to-blue-300"
                      style={{ height: `${(item.hours / maxHours) * 160}px`, minHeight: '8px' }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {period === 'week' ? item.day : item.week}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
              <div className="text-sm">
                <span className="text-slate-400">Jami: </span>
                <span className="text-white font-bold">
                  {period === 'week' 
                    ? `${totalWeekHours.toFixed(1)} soat` 
                    : `${monthlyData.reduce((s, d) => s + d.hours, 0)} soat`
                  }
                </span>
              </div>
              <div className="text-sm">
                <span className="text-slate-400">O'rtacha: </span>
                <span className="text-white font-bold">
                  {period === 'week' ? `${avgDailyHours} soat/kun` : `${(monthlyData.reduce((s, d) => s + d.hours, 0) / 4).toFixed(1)} soat/hafta`}
                </span>
              </div>
            </div>
          </div>

          {/* Streak & Umumiy */}
          <div className="space-y-6">
            {/* Streak */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-white font-bold">Streak</p>
                  <p className="text-slate-400 text-sm">Ketma-ket o'qish</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-3xl font-bold text-orange-400">{currentStreak}</p>
                  <p className="text-slate-400 text-xs">Hozirgi</p>
                </div>
                <div className="w-px h-10 bg-slate-700" />
                <div>
                  <p className="text-3xl font-bold text-yellow-400">{longestStreak}</p>
                  <p className="text-slate-400 text-xs">Eng uzun</p>
                </div>
              </div>
              {/* Streak dots */}
              <div className="flex items-center gap-1 mt-4">
                {[...Array(7)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 h-3 rounded-full ${
                      i < currentStreak ? 'bg-orange-500' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Umumiy statistika */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">Umumiy natijalar</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Jami darslar</span>
                  <span className="text-white font-bold">{completedLessons}/{lessons.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Mashqlar</span>
                  <span className="text-white font-bold">{completedExercises}/{exercises.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Jami ball</span>
                  <span className="text-white font-bold">{totalPoints}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">O'qish vaqti</span>
                  <span className="text-white font-bold">{totalStudyHours} soat</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Kategoriya bo'yicha progress */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6">Mavzu bo'yicha o'zlashtirish</h2>
            {categoryStats.length === 0 ? (
              <p className="text-slate-400 text-sm">Hali ma'lumot yo'q</p>
            ) : (
            <div className="space-y-4">
              {categoryStats.map((cat, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium text-sm">{cat.name}</span>
                    <span className="text-slate-400 text-sm">{cat.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <div 
                      className={`${cat.color} h-2.5 rounded-full transition-all duration-700`}
                      style={{ width: `${cat.progress}%` }}
                    />
                  </div>
                  <p className="text-slate-500 text-xs mt-1">{cat.lessonsCount} tugallangan</p>
                </div>
              ))}
            </div>
            )}
          </div>

          {/* Kuchli va zaif tomonlar */}
          <div className="space-y-6">
            {/* Kuchli */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h2 className="text-lg font-bold text-white">Kuchli tomonlar</h2>
              </div>
              {strengths.length === 0 ? (
                <p className="text-slate-400 text-sm">Hali ma'lumot yetarli emas</p>
              ) : (
                <div className="space-y-3">
                  {strengths.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-500/5 border border-green-500/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-white font-medium text-sm">{item.topic}</span>
                      </div>
                      <span className="text-green-400 font-bold">{item.score}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Zaif */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-red-400" />
                <h2 className="text-lg font-bold text-white">O'stirish kerak</h2>
              </div>
              {weaknesses.length === 0 ? (
                <p className="text-slate-400 text-sm">Hali ma'lumot yetarli emas</p>
              ) : (
                <div className="space-y-3">
                  {weaknesses.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-white font-medium text-sm">{item.topic}</span>
                      </div>
                      <span className="text-red-400 font-bold">{item.score}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Haftalik maqsadlar */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Haftalik maqsadlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-sm">Darslar</span>
                <span className="text-white font-bold">{totalWeekLessons}/10</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, (totalWeekLessons / 10) * 100)}%` }} />
              </div>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-sm">Mashqlar</span>
                <span className="text-white font-bold">{totalWeekExercises}/15</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(100, (totalWeekExercises / 15) * 100)}%` }} />
              </div>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-sm">O'qish vaqti</span>
                <span className="text-white font-bold">{totalWeekHours.toFixed(1)}/20 soat</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.min(100, (totalWeekHours / 20) * 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Analytics
