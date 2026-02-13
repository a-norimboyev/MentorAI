import { useAuth } from '../context/AuthContext'
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
  Users
} from 'lucide-react'

const Dashboard = () => {
  const { userProfile } = useAuth()

  const isTeacher = userProfile?.userType === 'teacher'

  // O'quvchi uchun statistika
  const studentStats = [
    { icon: <BookOpen className="w-6 h-6" />, label: "Tugallangan darslar", value: "24", color: "text-blue-500" },
    { icon: <Clock className="w-6 h-6" />, label: "O'qish vaqti", value: "48 soat", color: "text-green-500" },
    { icon: <Target className="w-6 h-6" />, label: "Yechilgan mashqlar", value: "156", color: "text-purple-500" },
    { icon: <Trophy className="w-6 h-6" />, label: "Sertifikatlar", value: "3", color: "text-yellow-500" }
  ]

  // Ustoz uchun statistika
  const teacherStats = [
    { icon: <Users className="w-6 h-6" />, label: "Jami o'quvchilar", value: "245", color: "text-blue-500" },
    { icon: <BookOpen className="w-6 h-6" />, label: "Faol kurslar", value: "8", color: "text-green-500" },
    { icon: <MessageSquare className="w-6 h-6" />, label: "Savollar", value: "32", color: "text-purple-500" },
    { icon: <BarChart3 className="w-6 h-6" />, label: "O'rtacha ball", value: "87%", color: "text-yellow-500" }
  ]

  const stats = isTeacher ? teacherStats : studentStats

  const recentActivities = [
    { title: "JavaScript asoslari kursi tugallandi", time: "2 soat oldin", type: "success" },
    { title: "Yangi mashq qo'shildi: React Hooks", time: "5 soat oldin", type: "info" },
    { title: "AI Ustoz bilan suhbat", time: "1 kun oldin", type: "chat" }
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64">
        {/* Header */}
        <header className="sticky top-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-700 z-30">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Salom, {userProfile?.name?.split(' ')[0] || 'Foydalanuvchi'}! 👋
              </h1>
              <p className="text-slate-400">
                {isTeacher ? "O'quvchilaringiz sizni kutmoqda" : "Bugun nima o'rganamiz?"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Qidirish..."
                  className="bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 w-64"
                />
              </div>
              {/* Notifications */}
              <button className="relative p-2 text-slate-400 hover:text-white transition">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.color} bg-opacity-10`} style={{backgroundColor: 'currentColor', opacity: 0.1}}>
                  <span className={stat.color}>{stat.icon}</span>
                </div>
                <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions */}
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Tez harakatlar</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {isTeacher ? (
                    <>
                      <button className="flex flex-col items-center gap-2 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition">
                        <BookOpen className="w-8 h-8 text-blue-500" />
                        <span className="text-slate-300 text-sm">Yangi dars</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition">
                        <Target className="w-8 h-8 text-green-500" />
                        <span className="text-slate-300 text-sm">Mashq yaratish</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition">
                        <Users className="w-8 h-8 text-purple-500" />
                        <span className="text-slate-300 text-sm">O'quvchilar</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="flex flex-col items-center gap-2 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition">
                        <MessageSquare className="w-8 h-8 text-blue-500" />
                        <span className="text-slate-300 text-sm">AI Ustoz</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition">
                        <BookOpen className="w-8 h-8 text-green-500" />
                        <span className="text-slate-300 text-sm">Darsni davom</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition">
                        <Target className="w-8 h-8 text-purple-500" />
                        <span className="text-slate-300 text-sm">Mashqlar</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* AI Chat Preview (only for students) */}
              {!isTeacher && (
                <div className="bg-linear-to-r from-blue-600 to-cyan-600 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2">AI Ustoz bilan suhbatlashing</h2>
                      <p className="text-blue-100">Savollaringizga tezkor javob oling</p>
                    </div>
                    <button className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition">
                      Boshlash <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Content */}
            <div className="space-y-8">
              {/* Recent Activity */}
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">So'nggi faoliyat</h2>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'chat' ? 'bg-blue-500' : 'bg-purple-500'
                      }`}></div>
                      <div>
                        <p className="text-slate-300 text-sm">{activity.title}</p>
                        <p className="text-slate-500 text-xs">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress (for students) */}
              {!isTeacher && (
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Haftalik maqsad</h2>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">5 ta darsdan 3 tasi</span>
                      <span className="text-blue-500">60%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full">
                      <div className="h-full w-3/5 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm">
                    Ajoyib! Maqsadga yetish uchun yana 2 ta dars qoldi.
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
