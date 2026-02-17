import Sidebar from '../components/Sidebar'
import { useSidebar } from '../context/SidebarContext'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'
import { 
  BarChart3, TrendingUp, Clock, Target, Trophy, BookOpen, 
  Calendar, Flame, ArrowUp, ArrowDown, Minus
} from 'lucide-react'
import { useState } from 'react'

const Analytics = () => {
  const { userProfile } = useAuth()
  const { collapsed } = useSidebar()
  const { 
    completedLessons, totalStudyHours, completedExercises, totalPoints,
    lessons, exercises, dailyTasks, activities
  } = useAppData()

  const [period, setPeriod] = useState('week')

  // Haftalik o'qish ma'lumotlari (demo)
  const weeklyData = [
    { day: 'Dush', hours: 2.5, lessons: 2, exercises: 3 },
    { day: 'Sesh', hours: 1.8, lessons: 1, exercises: 2 },
    { day: 'Chor', hours: 3.2, lessons: 3, exercises: 4 },
    { day: 'Pay', hours: 0.5, lessons: 0, exercises: 1 },
    { day: 'Jum', hours: 2.0, lessons: 2, exercises: 2 },
    { day: 'Shan', hours: 4.0, lessons: 4, exercises: 5 },
    { day: 'Yak', hours: 1.5, lessons: 1, exercises: 1 },
  ]

  const monthlyData = [
    { week: '1-hafta', hours: 12, lessons: 8, exercises: 15 },
    { week: '2-hafta', hours: 15, lessons: 10, exercises: 18 },
    { week: '3-hafta', hours: 9, lessons: 6, exercises: 12 },
    { week: '4-hafta', hours: 18, lessons: 12, exercises: 22 },
  ]

  const currentData = period === 'week' ? weeklyData : monthlyData
  const maxHours = Math.max(...currentData.map(d => d.hours))
  
  const totalWeekHours = weeklyData.reduce((s, d) => s + d.hours, 0)
  const totalWeekLessons = weeklyData.reduce((s, d) => s + d.lessons, 0)
  const totalWeekExercises = weeklyData.reduce((s, d) => s + d.exercises, 0)
  const avgDailyHours = (totalWeekHours / 7).toFixed(1)

  // Streak hisoblash (demo)
  const currentStreak = 5
  const longestStreak = 12

  // Kategoriya bo'yicha tahlil
  const categoryStats = [
    { name: 'JavaScript', progress: 75, lessonsCount: 8, color: 'bg-yellow-500' },
    { name: 'React', progress: 60, lessonsCount: 5, color: 'bg-cyan-500' },
    { name: 'Python', progress: 40, lessonsCount: 3, color: 'bg-green-500' },
    { name: 'CSS', progress: 90, lessonsCount: 10, color: 'bg-blue-500' },
    { name: 'Git', progress: 55, lessonsCount: 4, color: 'bg-orange-500' },
  ]

  // Kuchli va zaif tomonlar
  const strengths = [
    { topic: "CSS & Layoutlar", score: 90, icon: "🎨" },
    { topic: "JavaScript asoslari", score: 75, icon: "🟨" },
    { topic: "Git version control", score: 70, icon: "🐙" },
  ]

  const weaknesses = [
    { topic: "Python OOP", score: 30, icon: "🐍" },
    { topic: "Backend API", score: 35, icon: "🔗" },
    { topic: "TypeScript", score: 25, icon: "🔷" },
  ]

  // O'sish ko'rsatkichlari
  const growthStats = [
    { label: "O'qish vaqti", current: totalWeekHours.toFixed(1) + " soat", change: +15, icon: <Clock className="w-5 h-5" /> },
    { label: "Tugallangan darslar", current: String(completedLessons), change: +8, icon: <BookOpen className="w-5 h-5" /> },
    { label: "Mashq ballari", current: String(totalPoints), change: +22, icon: <Target className="w-5 h-5" /> },
    { label: "Streak", current: currentStreak + " kun", change: 0, icon: <Flame className="w-5 h-5" /> },
  ]

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
                {stat.change !== 0 && (
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    stat.change > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {Math.abs(stat.change)}%
                  </div>
                )}
                {stat.change === 0 && (
                  <div className="flex items-center gap-1 text-sm text-slate-400">
                    <Minus className="w-3 h-3" /> 0%
                  </div>
                )}
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
                  <p className="text-slate-500 text-xs mt-1">{cat.lessonsCount} dars tugallangan</p>
                </div>
              ))}
            </div>
          </div>

          {/* Kuchli va zaif tomonlar */}
          <div className="space-y-6">
            {/* Kuchli */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h2 className="text-lg font-bold text-white">Kuchli tomonlar</h2>
              </div>
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
            </div>

            {/* Zaif */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-red-400" />
                <h2 className="text-lg font-bold text-white">O'stirish kerak</h2>
              </div>
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
