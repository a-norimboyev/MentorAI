import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Check, 
  X, 
  Clock,
  User,
  Users,
  Mail,
  Filter,
  Search
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { useSidebar } from '../context/SidebarContext'

const Requests = () => {
  const navigate = useNavigate()
  const { collapsed } = useSidebar()
  const [filter, setFilter] = useState('pending') // pending, approved, rejected

  // Demo so'rovlar
  const [requests, setRequests] = useState([
    {
      id: '1',
      studentName: 'Ali Valiyev',
      studentEmail: 'ali@example.com',
      groupId: 'JS-2024',
      groupName: 'JavaScript Boshlangich',
      status: 'pending',
      createdAt: '2024-02-10T10:30:00'
    },
    {
      id: '2',
      studentName: 'Nilufar Karimova',
      studentEmail: 'nilufar@example.com',
      groupId: 'JS-2024',
      groupName: 'JavaScript Boshlangich',
      status: 'pending',
      createdAt: '2024-02-10T09:15:00'
    },
    {
      id: '3',
      studentName: 'Bobur Toshmatov',
      studentEmail: 'bobur@example.com',
      groupId: 'PY-2024',
      groupName: 'Python Advanced',
      status: 'pending',
      createdAt: '2024-02-09T16:45:00'
    },
    {
      id: '4',
      studentName: 'Madina Rahimova',
      studentEmail: 'madina@example.com',
      groupId: 'REACT-01',
      groupName: 'React.js Kursi',
      status: 'approved',
      createdAt: '2024-02-08T14:20:00'
    },
    {
      id: '5',
      studentName: 'Jasur Aliyev',
      studentEmail: 'jasur@example.com',
      groupId: 'JS-2024',
      groupName: 'JavaScript Boshlangich',
      status: 'rejected',
      createdAt: '2024-02-07T11:00:00'
    }
  ])

  const handleApprove = (requestId) => {
    setRequests(requests.map(req => 
      req.id === requestId ? { ...req, status: 'approved' } : req
    ))
  }

  const handleReject = (requestId) => {
    setRequests(requests.map(req => 
      req.id === requestId ? { ...req, status: 'rejected' } : req
    ))
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
      
      <main className={`${collapsed ? 'ml-[85px]' : 'ml-64'} transition-all duration-300`}>
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

          {filteredRequests.length === 0 && (
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
