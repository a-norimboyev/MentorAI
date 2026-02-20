import { useAuth } from '../context/AuthContext'
import { useSidebar } from '../context/SidebarContext'
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
  Bot,
  PanelLeftClose,
  PanelLeft,
  ClipboardCheck,
  TrendingUp,
  Search
} from 'lucide-react'

const Sidebar = () => {
  const { user, userProfile, logout } = useAuth()
  const { collapsed, toggleSidebar } = useSidebar()
  const navigate = useNavigate()
  const location = useLocation()
  
  const isTeacher = userProfile?.userType === 'teacher'
  const isSelfLearner = userProfile?.userType === 'self-learner'

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const getMenuItems = () => {
    if (isTeacher) {
      return [
        { icon: <BarChart3 className="w-5 h-5" />, label: "Dashboard", path: "/dashboard" },
        { icon: <Search className="w-5 h-5" />, label: "Qidiruv", path: "/search" },
        { icon: <FolderOpen className="w-5 h-5" />, label: "Guruhlar", path: "/groups" },
        { icon: <Users className="w-5 h-5" />, label: "So'rovlar", path: "/requests" },
        { icon: <Target className="w-5 h-5" />, label: "Mashqlar", path: "/exercises" },
        { icon: <MessageSquare className="w-5 h-5" />, label: "Xabarlar", path: "/messages" },
        { icon: <Calendar className="w-5 h-5" />, label: "Reja", path: "/schedule" },
        { icon: <Settings className="w-5 h-5" />, label: "Sozlamalar", path: "/settings" }
      ]
    }
    if (isSelfLearner) {
      return [
        { icon: <BarChart3 className="w-5 h-5" />, label: "Dashboard", path: "/dashboard" },
        { icon: <Search className="w-5 h-5" />, label: "Qidiruv", path: "/search" },
        { icon: <BookOpen className="w-5 h-5" />, label: "Darslar", path: "/lessons" },
        { icon: <Target className="w-5 h-5" />, label: "Mashqlar", path: "/exercises" },
        { icon: <ClipboardCheck className="w-5 h-5" />, label: "Testlar", path: "/quizzes" },
        { icon: <TrendingUp className="w-5 h-5" />, label: "Tahlil", path: "/analytics" },
        { icon: <Bot className="w-5 h-5" />, label: "AI Ustoz", path: "/ai-chat" },
        { icon: <Calendar className="w-5 h-5" />, label: "Reja", path: "/schedule" },
        { icon: <Settings className="w-5 h-5" />, label: "Sozlamalar", path: "/settings" }
      ]
    }
    return [
      { icon: <BarChart3 className="w-5 h-5" />, label: "Dashboard", path: "/dashboard" },
      { icon: <Search className="w-5 h-5" />, label: "Qidiruv", path: "/search" },
      { icon: <FolderOpen className="w-5 h-5" />, label: "Guruhlar", path: "/groups" },
      { icon: <BookOpen className="w-5 h-5" />, label: "Darslar", path: "/lessons" },
      { icon: <Target className="w-5 h-5" />, label: "Mashqlar", path: "/exercises" },
      { icon: <Bot className="w-5 h-5" />, label: "AI Ustoz", path: "/ai-chat" },
      { icon: <MessageSquare className="w-5 h-5" />, label: "Xabarlar", path: "/messages" },
      { icon: <Calendar className="w-5 h-5" />, label: "Reja", path: "/schedule" },
      { icon: <Settings className="w-5 h-5" />, label: "Sozlamalar", path: "/settings" }
    ]
  }

  const menuItems = getMenuItems()

  return (
    <aside className={`fixed left-0 top-0 h-full ${collapsed ? 'w-21.25' : 'w-64'} bg-slate-800 border-r border-slate-700 z-40 sidebar-light transition-all duration-300`}>
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          <GraduationCap className="w-8 h-8 text-blue-500 shrink-0" />
          {!collapsed && <span className="text-xl font-bold text-white">MentorAI</span>}
        </div>
        <button
          onClick={toggleSidebar}
          className="text-slate-400 hover:text-white hover:bg-slate-700 p-1.5 rounded-lg transition shrink-0"
          title={collapsed ? "Sidebar ochish" : "Sidebar yopish"}
        >
          {collapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>
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
                  title={collapsed ? item.label : ''}
                  className={`w-full flex items-center ${collapsed ? 'justify-center' : ''} gap-3 px-4 py-3 rounded-lg transition ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
        {collapsed ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              {userProfile?.photoURL ? (
                <img src={userProfile.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <button
              onClick={handleLogout}
              title="Chiqish"
              className="w-10 h-10 flex items-center justify-center bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
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
                  {isTeacher ? 'Ustoz' : isSelfLearner ? "Mustaqil o'rganuvchi" : "O'quvchi"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Chiqish</span>
            </button>
          </>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
