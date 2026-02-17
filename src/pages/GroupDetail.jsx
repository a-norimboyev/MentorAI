import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'
import { 
  ArrowLeft,
  Users, 
  Copy, 
  Check,
  User,
  Mail,
  MoreVertical,
  Trash2,
  LogOut,
  Calendar,
  Trophy,
  BarChart3,
  Clock
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { useSidebar } from '../context/SidebarContext'

const GroupDetail = () => {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const { userProfile } = useAuth()
  const { collapsed } = useSidebar()
  const { groups, addActivity, addNotification } = useAppData()
  const isTeacher = userProfile?.userType === 'teacher'
  const [copiedId, setCopiedId] = useState(false)

  // Guruhni umumiy ma'lumotlardan topish
  const groupFromContext = groups.find(g => g.id === groupId)
  
  const [group] = useState(groupFromContext || {
    id: groupId,
    name: 'JavaScript Boshlangich',
    subject: 'JavaScript',
    teacherName: 'Aziz Karimov',
    maxStudents: 30,
    currentStudents: 24,
    createdAt: '2024-01-15',
    description: 'Bu kursda JavaScript dasturlash tilining asoslari o\'rgatiladi.'
  })

  // Demo o'quvchilar ro'yxati
  const [students, setStudents] = useState([
    { id: '1', name: 'Ali Valiyev', email: 'ali@example.com', progress: 85, joinedAt: '2024-01-16' },
    { id: '2', name: 'Nilufar Karimova', email: 'nilufar@example.com', progress: 72, joinedAt: '2024-01-17' },
    { id: '3', name: 'Bobur Toshmatov', email: 'bobur@example.com', progress: 90, joinedAt: '2024-01-18' },
    { id: '4', name: 'Madina Rahimova', email: 'madina@example.com', progress: 65, joinedAt: '2024-01-20' },
    { id: '5', name: 'Jasur Aliyev', email: 'jasur@example.com', progress: 45, joinedAt: '2024-01-22' },
    { id: '6', name: 'Dilnoza Usmonova', email: 'dilnoza@example.com', progress: 78, joinedAt: '2024-01-25' },
  ])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(group.id)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  const handleRemoveStudent = (studentId) => {
    if (confirm('O\'quvchini guruhdan chiqarishni xohlaysizmi?')) {
      const student = students.find(s => s.id === studentId)
      setStudents(students.filter(s => s.id !== studentId))
      addActivity({ title: (student?.name || 'O\'quvchi') + ' guruhdan chiqarildi', type: 'info' })
      addNotification((student?.name || 'O\'quvchi') + ' ' + group.name + ' guruhidan chiqarildi')
    }
  }

  const handleLeaveGroup = () => {
    if (confirm('Guruhdan chiqishni xohlaysizmi?')) {
      addActivity({ title: group.name + ' guruhidan chiqildi', type: 'info' })
      navigate('/groups')
    }
  }

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-500 bg-green-500'
    if (progress >= 50) return 'text-yellow-500 bg-yellow-500'
    return 'text-red-500 bg-red-500'
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />
      
      <main className={`${collapsed ? 'ml-[85px]' : 'ml-64'} transition-all duration-300`}>
        {/* Header */}
        <header className="sticky top-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-700 z-30">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/groups')}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">{group.name}</h1>
                <p className="text-slate-400">{group.subject}</p>
              </div>
            </div>
            {!isTeacher && (
              <button
                onClick={handleLeaveGroup}
                className="flex items-center gap-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 px-4 py-2 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                Guruhdan chiqish
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Guruh info cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {/* Guruh kodi */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm mb-1">Guruh kodi</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-mono font-bold text-white">{group.id}</span>
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
                >
                  {copiedId ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* O'quvchilar soni */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm mb-1">O'quvchilar</p>
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-500" />
                <span className="text-xl font-bold text-white">
                  {students.length}/{group.maxStudents}
                </span>
              </div>
            </div>

            {/* O'rtacha progress */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm mb-1">O'rtacha progress</p>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-green-500" />
                <span className="text-xl font-bold text-white">
                  {Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length)}%
                </span>
              </div>
            </div>

            {/* Yaratilgan sana */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm mb-1">Yaratilgan</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-purple-500" />
                <span className="text-xl font-bold text-white">
                  {new Date(group.createdAt).toLocaleDateString('uz-UZ')}
                </span>
              </div>
            </div>
          </div>

          {/* O'quvchilar ro'yxati */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">O'quvchilar ro'yxati</h2>
            </div>

            <div className="divide-y divide-slate-700">
              {students.map((student, index) => (
                <div 
                  key={student.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-700/30 transition"
                >
                  <div className="flex items-center gap-4">
                    {/* Index */}
                    <span className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 text-sm">
                      {index + 1}
                    </span>
                    
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-500" />
                    </div>
                    
                    {/* Info */}
                    <div>
                      <h3 className="font-medium text-white">{student.name}</h3>
                      <p className="text-slate-400 text-sm">{student.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Progress */}
                    <div className="text-right">
                      <p className="text-slate-400 text-xs mb-1">Progress</p>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-700 rounded-full">
                          <div 
                            className={`h-full rounded-full ${getProgressColor(student.progress).split(' ')[1]}`}
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${getProgressColor(student.progress).split(' ')[0]}`}>
                          {student.progress}%
                        </span>
                      </div>
                    </div>

                    {/* Qo'shilgan sana */}
                    <div className="text-right w-24">
                      <p className="text-slate-400 text-xs mb-1">Qo'shilgan</p>
                      <p className="text-slate-300 text-sm">
                        {new Date(student.joinedAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>

                    {/* Actions (faqat ustoz uchun) */}
                    {isTeacher && (
                      <button
                        onClick={() => handleRemoveStudent(student.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                        title="O'chirish"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {students.length === 0 && (
              <div className="p-12 text-center">
                <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">O'quvchilar yo'q</h3>
                <p className="text-slate-400">Bu guruhda hali o'quvchilar yo'q</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default GroupDetail
