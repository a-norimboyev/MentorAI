import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'
import Sidebar from '../components/Sidebar'
import { 
  BookOpen, 
  MessageSquare, 
  BarChart3, 
  Bell,
  Search,
  ChevronRight,
  Clock,
  Target,
  Trophy,
  Users,
  X
} from 'lucide-react'

const Dashboard = () => {
  const { userProfile } = useAuth()
  const navigate = useNavigate()
  const {
    completedLessons, totalStudyHours, completedExercises, totalPoints,
    groups, lessons, exercises, activities,
    notifications, markNotificationRead, markAllNotificationsRead, unreadNotifications,
    weeklyLessonProgress, completedDailyTasks, dailyTasks, addActivity
  } = useAppData()

  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const notifRef = useRef(null)

  const isTeacher = userProfile?.userType === 'teacher'

  const searchPages = [
    { label: 'Dashboard', path: '/dashboard', keywords: ['dashboard', 'bosh sahifa', 'asosiy'] },
    { label: 'Guruhlar', path: '/groups', keywords: ['guruh', 'groups', 'sinf'] },
    { label: 'Darslar', path: '/lessons', keywords: ['dars', 'lessons', 'kurs'] },
    { label: 'Mashqlar', path: '/exercises', keywords: ['mashq', 'exercises', 'topshiriq'] },
    { label: 'AI Ustoz', path: '/ai-chat', keywords: ['ai', 'ustoz', 'chat', 'suhbat'] },
    { label: 'Xabarlar', path: '/messages', keywords: ['xabar', 'messages', 'chat'] },
    { label: 'Reja', path: '/schedule', keywords: ['reja', 'schedule', 'jadval', 'kalendar'] },
    { label: 'Sozlamalar', path: '/settings', keywords: ['sozlama', 'settings', 'profil'] },
  ]

  const filteredPages = searchQuery.trim()
    ? searchPages.filter(page =>
        page.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.keywords.some(k => k.includes(searchQuery.toLowerCase()))
      )
    : []

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const studentStats = [
    { icon: <BookOpen className="w-6 h-6" />, label: "Tugallangan darslar", value: String(completedLessons), color: "text-blue-500" },
    { icon: <Clock className="w-6 h-6" />, label: "O'qish vaqti", value: (totalStudyHours || 1) + " soat", color: "text-green-500" },
    { icon: <Target className="w-6 h-6" />, label: "Yechilgan mashqlar", value: String(completedExercises), color: "text-purple-500" },
    { icon: <Trophy className="w-6 h-6" />, label: "Jami ball", value: String(totalPoints), color: "text-yellow-500" }
  ]

  const totalStudents = groups.reduce((sum, g) => sum + g.currentStudents, 0)
  const teacherStats = [
    { icon: <Users className="w-6 h-6" />, label: "Jami o'quvchilar", value: String(totalStudents), color: "text-blue-500" },
    { icon: <BookOpen className="w-6 h-6" />, label: "Faol kurslar", value: String(lessons.length), color: "text-green-500" },
    { icon: <MessageSquare className="w-6 h-6" />, label: "Guruhlar", value: String(groups.length), color: "text-purple-500" },
    { icon: <BarChart3 className="w-6 h-6" />, label: "Mashqlar", value: String(exercises.length), color: "text-yellow-500" }
  ]

  const stats = isTeacher ? teacherStats : studentStats
  const remainingLessons = lessons.length - completedLessons

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />
      <main className="ml-64">
        <header className="sticky top-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-700 z-30">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Salom, {userProfile?.name?.split(' ')[0] || userProfile?.fullName?.split(' ')[0] || 'Foydalanuvchi'}! í±‹
              </h1>
              <p className="text-slate-400">
                {isTeacher ? "O'quvchilaringiz sizni kutmoqda" : "Bugun nima o'rganamiz?"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 w-64"
                />
                {filteredPages.length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
                    {filteredPages.map((page, i) => (
                      <button
                        key={i}
                        onClick={() => { navigate(page.path); setSearchQuery('') }}
                        className="w-full text-left px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition flex items-center gap-2"
                      >
                        <Search className="w-4 h-4 text-slate-500" />
                        {page.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-slate-400 hover:text-white transition"
                >
                  <Bell className="w-6 h-6" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
                      <h3 className="text-white font-semibold">Bildirishnomalar</h3>
                      {unreadNotifications > 0 && (
                        <button onClick={markAllNotificationsRead} className="text-blue-400 text-xs hover:text-blue-300 transition">
                          Barchasini o'qilgan deb belgilash
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={"px-4 py-3 border-b border-slate-700/50 cursor-pointer hover:bg-slate-700/50 transition " + (!notif.read ? 'bg-slate-700/30' : '')}
                        >
                          <div className="flex items-start gap-2">
                            {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>}
                            <div className={!notif.read ? '' : 'ml-4'}>
                              <p className="text-slate-300 text-sm">{notif.text}</p>
                              <p className="text-slate-500 text-xs mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <div className={"w-12 h-12 rounded-xl flex items-center justify-center mb-4 " + stat.color + " bg-opacity-10"} style={{backgroundColor: 'currentColor', opacity: 0.1}}>
                  <span className={stat.color}>{stat.icon}</span>
                </div>
                <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Tez harakatlar</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {isTeacher ? (
                    <>
                      <button onClick={() => navigate('/lessons')} className="flex flex-col items-center gap-2 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition">
                        <BookOpen className="w-8 h-8 text-blue-500" />
                        <span className="text-slate-300 text-sm">Yangi dars</span>
                      </button>
                      <button onClick={() => navigate('/exercises')} className="flex flex-col items-center gap-2 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition">
                        <Target className="w-8 h-8 text-green-500" />
                        <span className="text-slate-300 text-sm">Mashq yaratish</span>
                      </button>
                      <button onClick={() => navigate('/groups')} className="flex flex-col items-center gap-2 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition">
                        <Users className="w-8 h-8 text-purple-500" />
                        <span className="text-slate-300 text-sm">O'quvchilar</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => navigate('/ai-chat')} className="flex flex-col items-center gap-2 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition">
                        <MessageSquare className="w-8 h-8 text-blue-500" />
                        <span className="text-slate-300 text-sm">AI Ustoz</span>
                      </button>
                      <button onClick={() => navigate('/lessons')} className="flex flex-col items-center gap-2 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition">
                        <BookOpen className="w-8 h-8 text-green-500" />
                        <span className="text-slate-300 text-sm">Darsni davom</span>
                      </button>
                      <button onClick={() => navigate('/exercises')} className="flex flex-col items-center gap-2 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition">
                        <Target className="w-8 h-8 text-purple-500" />
                        <span className="text-slate-300 text-sm">Mashqlar</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {!isTeacher && (
                <div className="bg-linear-to-r from-blue-600 to-cyan-600 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2">AI Ustoz bilan suhbatlashing</h2>
                      <p className="text-blue-100">Savollaringizga tezkor javob oling</p>
                    </div>
                    <button
                      onClick={() => navigate('/ai-chat')}
                      className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition"
                    >
                      Boshlash <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">So'nggi faoliyat</h2>
                <div className="space-y-4">
                  {activities.slice(0, 5).map((activity, index) => (
                    <div key={activity.id || index} className="flex items-start gap-3">
                      <div className={"w-2 h-2 rounded-full mt-2 " + (
                        activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'chat' ? 'bg-blue-500' : 'bg-purple-500'
                      )}></div>
                      <div>
                        <p className="text-slate-300 text-sm">{activity.title}</p>
                        <p className="text-slate-500 text-xs">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {!isTeacher && (
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Haftalik maqsad</h2>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">{lessons.length} ta darsdan {completedLessons} tasi</span>
                      <span className="text-blue-500">{weeklyLessonProgress}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full">
                      <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: weeklyLessonProgress + '%' }}></div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Bugungi vazifalar</span>
                      <span className="text-green-500">{completedDailyTasks}/{dailyTasks.length}</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full">
                      <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: (dailyTasks.length > 0 ? (completedDailyTasks / dailyTasks.length * 100) : 0) + '%' }}></div>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm">
                    {remainingLessons > 0
                      ? "Ajoyib! Maqsadga yetish uchun yana " + remainingLessons + " ta dars qoldi."
                      : "Tabriklaymiz! Barcha darslar tugallandi! í¾‰"
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
