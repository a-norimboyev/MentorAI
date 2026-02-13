import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  GraduationCap, 
  Plus, 
  Users, 
  Copy, 
  Check,
  Search,
  MoreVertical,
  Trash2,
  Eye,
  X,
  Loader2,
  UserPlus,
  Clock
} from 'lucide-react'
import Sidebar from '../components/Sidebar'

const Groups = () => {
  const { userProfile } = useAuth()
  const navigate = useNavigate()
  const isTeacher = userProfile?.userType === 'teacher'

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [loading, setLoading] = useState(false)

  // Demo guruhlar (keyinroq Firebase dan keladi)
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

  // Talaba uchun kutilayotgan so'rovlar
  const [pendingRequests, setPendingRequests] = useState([
    { groupId: 'NODE-01', groupName: 'Node.js Backend', status: 'pending' }
  ])

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDeleteGroup = (groupId) => {
    if (confirm('Guruhni o\'chirishni xohlaysizmi?')) {
      setGroups(groups.filter(g => g.id !== groupId))
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />
      
      <main className="ml-64">
        {/* Header */}
        <header className="sticky top-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-700 z-30">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Guruhlar</h1>
              <p className="text-slate-400">
                {isTeacher ? 'Guruhlaringizni boshqaring' : 'Qo\'shilgan guruhlaringiz'}
              </p>
            </div>
            <button
              onClick={() => isTeacher ? setShowCreateModal(true) : setShowJoinModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              {isTeacher ? <Plus className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              {isTeacher ? 'Yangi guruh' : 'Guruhga qo\'shilish'}
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Talaba uchun kutilayotgan so'rovlar */}
          {!isTeacher && pendingRequests.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-4">Kutilayotgan so'rovlar</h2>
              <div className="space-y-3">
                {pendingRequests.map((req, index) => (
                  <div key={index} className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="text-white font-medium">{req.groupName}</p>
                        <p className="text-slate-400 text-sm">Kod: {req.groupId}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm">
                      Kutilmoqda
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guruhlar grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <div 
                key={group.id} 
                className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{group.name}</h3>
                      <p className="text-slate-400 text-sm">{group.subject}</p>
                    </div>
                  </div>
                  {isTeacher && (
                    <div className="relative group">
                      <button className="p-2 text-slate-400 hover:text-white transition">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      <div className="absolute right-0 top-full mt-1 bg-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <button 
                          onClick={() => navigate(`/groups/${group.id}`)}
                          className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-600 w-full text-left rounded-t-lg"
                        >
                          <Eye className="w-4 h-4" /> Ko'rish
                        </button>
                        <button 
                          onClick={() => handleDeleteGroup(group.id)}
                          className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-slate-600 w-full text-left rounded-b-lg"
                        >
                          <Trash2 className="w-4 h-4" /> O'chirish
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Guruh ID */}
                <div className="bg-slate-700/50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs mb-1">Guruh kodi</p>
                      <p className="text-white font-mono font-bold">{group.id}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(group.id)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition"
                    >
                      {copiedId === group.id ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* O'quvchilar soni */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">O'quvchilar</span>
                    <span className={`${group.currentStudents >= group.maxStudents ? 'text-red-400' : 'text-blue-400'}`}>
                      {group.currentStudents}/{group.maxStudents}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        group.currentStudents >= group.maxStudents ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${(group.currentStudents / group.maxStudents) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  {isTeacher ? (
                    <span className="text-slate-400 text-sm">
                      {new Date(group.createdAt).toLocaleDateString('uz-UZ')}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-sm">
                      Ustoz: {group.teacherName}
                    </span>
                  )}
                  <button
                    onClick={() => navigate(`/groups/${group.id}`)}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    Batafsil →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {groups.length === 0 && (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Guruhlar yo'q</h3>
              <p className="text-slate-400 mb-6">
                {isTeacher 
                  ? 'Birinchi guruhingizni yarating' 
                  : 'Guruh kodini kiritib qo\'shiling'}
              </p>
              <button
                onClick={() => isTeacher ? setShowCreateModal(true) : setShowJoinModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
              >
                {isTeacher ? 'Guruh yaratish' : 'Guruhga qo\'shilish'}
              </button>
            </div>
          )}
        </div>

        {/* Guruh yaratish modali (Ustoz) */}
        {showCreateModal && <CreateGroupModal onClose={() => setShowCreateModal(false)} onCreated={(group) => {
          setGroups([...groups, group])
          setShowCreateModal(false)
        }} />}

        {/* Guruhga qo'shilish modali (Talaba) */}
        {showJoinModal && <JoinGroupModal onClose={() => setShowJoinModal(false)} onRequested={(req) => {
          setPendingRequests([...pendingRequests, req])
          setShowJoinModal(false)
        }} />}
      </main>
    </div>
  )
}

// Guruh yaratish modali
const CreateGroupModal = ({ onClose, onCreated }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    maxStudents: 30
  })

  const generateGroupId = () => {
    const prefix = formData.subject.substring(0, 3).toUpperCase() || 'GRP'
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `${prefix}-${random}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Demo uchun
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newGroup = {
      id: generateGroupId(),
      name: formData.name,
      subject: formData.subject,
      teacherName: 'Siz',
      maxStudents: parseInt(formData.maxStudents),
      currentStudents: 0,
      createdAt: new Date().toISOString()
    }
    
    onCreated(newGroup)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Yangi guruh yaratish</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Guruh nomi
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="Masalan: JavaScript Boshlang'ich"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Fan
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="Masalan: JavaScript"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Maksimum o'quvchilar soni
            </label>
            <input
              type="number"
              value={formData.maxStudents}
              onChange={(e) => setFormData({...formData, maxStudents: e.target.value})}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              min="1"
              max="100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Guruh yaratish'}
          </button>
        </form>
      </div>
    </div>
  )
}

// Guruhga qo'shilish modali
const JoinGroupModal = ({ onClose, onRequested }) => {
  const [loading, setLoading] = useState(false)
  const [groupCode, setGroupCode] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    // Demo uchun
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Kodni tekshirish (demo)
    if (groupCode.length < 4) {
      setError('Noto\'g\'ri guruh kodi')
      setLoading(false)
      return
    }
    
    onRequested({
      groupId: groupCode.toUpperCase(),
      groupName: `Guruh ${groupCode.toUpperCase()}`,
      status: 'pending'
    })
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Guruhga qo'shilish</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Guruh kodi
            </label>
            <input
              type="text"
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white font-mono text-lg text-center tracking-wider focus:outline-none focus:border-blue-500"
              placeholder="Masalan: JS-2024"
              required
            />
            <p className="text-slate-400 text-sm mt-2">
              Guruh kodini ustozdan so'rang
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'So\'rov yuborish'}
          </button>
          
          <p className="text-slate-400 text-sm text-center">
            Ustoz so'rovingizni tasdiqlaganidan keyin guruhga qo'shilasiz
          </p>
        </form>
      </div>
    </div>
  )
}

export default Groups
