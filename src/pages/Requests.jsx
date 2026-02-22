import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'
import { 
  Check, 
  X, 
  Clock,
  User,
  Users,
  Mail,
  Filter,
  Search,
  Loader2
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { useSidebar } from '../context/SidebarContext'
import { getPendingRequests, approveStudentRequest, rejectStudentRequest } from '../utils/groupService'
import { db } from '../config/firebase'
import { doc, getDoc, query, where, getDocs, collection, documentId } from 'firebase/firestore'

const Requests = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { groups, addNotification, addActivity } = useAppData()
  const { collapsed } = useSidebar()
  const [filter, setFilter] = useState('pending')
  const [requests, setRequests] = useState([])
  const [loadingRequests, setLoadingRequests] = useState(true)

  // Firestore dan so'rovlarni yuklash
  useEffect(() => {
    const loadRequests = async () => {
      if (!user || groups.length === 0) {
        setLoadingRequests(false)
        return
      }
      
      setLoadingRequests(true)
      try {
        const allRequests = []
        const allPendingReqs = []
        
        for (const group of groups) {
          const pending = await getPendingRequests(group.id)
          for (const req of pending) {
            allPendingReqs.push({ ...req, groupId: group.id, groupName: group.name })
          }
        }

        // Barcha student ID larni to'plash va batchda yuklash
        const studentIds = [...new Set(allPendingReqs.map(r => r.studentId).filter(Boolean))]
        const studentMap = {}
        
        // Firestore 'in' max 30 ta
        for (let i = 0; i < studentIds.length; i += 30) {
          const chunk = studentIds.slice(i, i + 30)
          try {
            const q = query(collection(db, 'users'), where(documentId(), 'in', chunk))
            const snapshot = await getDocs(q)
            snapshot.docs.forEach(d => {
              const data = d.data()
              studentMap[d.id] = { name: data.name || 'Noma\'lum', email: data.email || '' }
            })
          } catch (e) {
            console.error('Error loading students batch:', e)
          }
        }

        for (const req of allPendingReqs) {
          const student = studentMap[req.studentId] || { name: 'Noma\'lum', email: '' }
          allRequests.push({
            id: req.id,
            studentId: req.studentId,
            studentName: student.name,
            studentEmail: student.email,
            groupId: req.groupId,
            groupName: req.groupName,
            status: req.status || 'pending',
            createdAt: req.createdAt?.toDate?.() ? req.createdAt.toDate().toISOString() : new Date().toISOString()
          })
        }
        setRequests(allRequests)
      } catch (error) {
        console.error('Error loading requests:', error)
      } finally {
        setLoadingRequests(false)
      }
    }

    loadRequests()
  }, [user, groups])

  const handleApprove = async (requestId) => {
    const req = requests.find(r => r.id === requestId)
    if (!req) return
    try {
      await approveStudentRequest(req.groupId, requestId, req.studentId)
      setRequests(requests.map(r => 
        r.id === requestId ? { ...r, status: 'approved' } : r
      ))
      addNotification(req.studentName + ' ' + req.groupName + ' guruhiga qo\'shildi')
      addActivity({ title: req.studentName + ' tasdiqlandi', type: 'success' })
    } catch (error) {
      console.error('Approve error:', error)
    }
  }

  const handleReject = async (requestId) => {
    const req = requests.find(r => r.id === requestId)
    if (!req) return
    try {
      await rejectStudentRequest(req.groupId, requestId)
      setRequests(requests.map(r => 
        r.id === requestId ? { ...r, status: 'rejected' } : r
      ))
      addActivity({ title: req.studentName + ' rad etildi', type: 'info' })
    } catch (error) {
      console.error('Reject error:', error)
    }
  }

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true
    return req.status === filter
  })

  const pendingCount = requests.filter(r => r.status === 'pending').length

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm">
            <Clock className="w-4 h-4" /> Kutilmoqda
          </span>
        )
      case 'approved':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm">
            <Check className="w-4 h-4" /> Tasdiqlangan
          </span>
        )
      case 'rejected':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-500 rounded-full text-sm">
            <X className="w-4 h-4" /> Rad etilgan
          </span>
        )
    }
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('uz-UZ', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />
      
      <main className={`${collapsed ? 'ml-21.25' : 'ml-64'} transition-all duration-300`}>
        {/* Header */}
        <header className="sticky top-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-700 z-30">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                So'rovlar
                {pendingCount > 0 && (
                  <span className="px-3 py-1 bg-yellow-500 text-slate-900 text-sm font-bold rounded-full">
                    {pendingCount} yangi
                  </span>
                )}
              </h1>
              <p className="text-slate-400">O'quvchilarning qo'shilish so'rovlarini boshqaring</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Filter tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { key: 'pending', label: 'Kutilmoqda', count: requests.filter(r => r.status === 'pending').length },
              { key: 'approved', label: 'Tasdiqlangan', count: requests.filter(r => r.status === 'approved').length },
              { key: 'rejected', label: 'Rad etilgan', count: requests.filter(r => r.status === 'rejected').length },
              { key: 'all', label: 'Barchasi', count: requests.length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                  filter === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  filter === tab.key ? 'bg-blue-500' : 'bg-slate-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Requests list */}
          {loadingRequests ? (
            <div className="text-center py-16">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-slate-400">So'rovlar yuklanmoqda...</p>
            </div>
          ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div 
                key={request.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-500" />
                    </div>
                    
                    {/* Info */}
                    <div>
                      <h3 className="font-semibold text-white">{request.studentName}</h3>
                      <p className="text-slate-400 text-sm flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {request.studentEmail}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Guruh */}
                    <div className="text-right">
                      <p className="text-white font-medium">{request.groupName}</p>
                      <p className="text-slate-400 text-sm">Kod: {request.groupId}</p>
                    </div>

                    {/* Status yoki Buttons */}
                    {request.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReject(request.id)}
                          className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-lg transition"
                          title="Rad etish"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="p-2 bg-green-500/20 text-green-500 hover:bg-green-500/30 rounded-lg transition"
                          title="Tasdiqlash"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      getStatusBadge(request.status)
                    )}
                  </div>
                </div>

                {/* Timestamp */}
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className="text-slate-500 text-sm">
                    So'rov yuborilgan: {formatDate(request.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          )}

          {filteredRequests.length === 0 && !loadingRequests && (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">So'rovlar yo'q</h3>
              <p className="text-slate-400">
                {filter === 'pending' && 'Yangi so\'rovlar yo\'q'}
                {filter === 'approved' && 'Tasdiqlangan so\'rovlar yo\'q'}
                {filter === 'rejected' && 'Rad etilgan so\'rovlar yo\'q'}
                {filter === 'all' && 'Hech qanday so\'rov yo\'q'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Requests
