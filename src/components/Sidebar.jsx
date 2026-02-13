import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  GraduationCap, 
  LogOut, 
  User, 
  BookOpen, 
  MessageSquare, 
  BarChart3, 
  Calendar,
  Settings,
  Users,
  Target,
  Bell,
  FolderOpen,
  Bot
} from 'lucide-react'

const Sidebar = () => {
  const { user, userProfile, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const isTeacher = userProfile?.userType === 'teacher'

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const menuItems = isTeacher ? [
    { icon: <BarChart3 className="w-5 h-5" />, label: "Dashboard", path: "/dashboard" },
    { icon: <FolderOpen className="w-5 h-5" />, label: "Guruhlar", path: "/groups" },
    { icon: <Users className="w-5 h-5" />, label: "So'rovlar", path: "/requests" },
    { icon: <Target className="w-5 h-5" />, label: "Mashqlar", path: "/exercises" },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Xabarlar", path: "/messages" },
    { icon: <Calendar className="w-5 h-5" />, label: "Reja", path: "/schedule" },
    { icon: <Settings className="w-5 h-5" />, label: "Sozlamalar", path: "/settings" }
  ] : [
    { icon: <BarChart3 className="w-5 h-5" />, label: "Dashboard", path: "/dashboard" },
    { icon: <FolderOpen className="w-5 h-5" />, label: "Guruhlar", path: "/groups" },
    { icon: <BookOpen className="w-5 h-5" />, label: "Darslar", path: "/lessons" },
    { icon: <Target className="w-5 h-5" />, label: "Mashqlar", path: "/exercises" },
    { icon: <Bot className="w-5 h-5" />, label: "AI Ustoz", path: "/ai-chat" },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Xabarlar", path: "/messages" },
    { icon: <Calendar className="w-5 h-5" />, label: "Reja", path: "/schedule" },
    { icon: <Settings className="w-5 h-5" />, label: "Sozlamalar", path: "/settings" }
  ]

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-800 border-r border-slate-700 z-40">
      {/* Logo */}
      <div 
        className="flex items-center gap-2 p-6 border-b border-slate-700 cursor-pointer"
        onClick={() => navigate('/dashboard')}
      >
        <GraduationCap className="w-8 h-8 text-blue-500" />
        <span className="text-xl font-bold text-white">MentorAI</span>
      </div>

      {/* Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path
            return (
              <li key={index}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            {userProfile?.photoURL ? (
              <img src={userProfile.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">
              {userProfile?.name || user?.displayName || 'Foydalanuvchi'}
            </p>
            <p className="text-slate-400 text-sm">
              {isTeacher ? 'Ustoz' : "O'quvchi"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
        >
          <LogOut className="w-5 h-5" />
          <span>Chiqish</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
