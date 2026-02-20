import Sidebar from '../components/Sidebar'
import { useSidebar } from '../context/SidebarContext'
import { useAuth } from '../context/AuthContext'
import { Search, Loader2, BookOpen, Target, Users, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { globalSearch } from '../utils/searchService'
import { useNavigate } from 'react-router-dom'

const SearchPage = () => {
  const { user } = useAuth()
  const { collapsed } = useSidebar()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ lessons: [], exercises: [], groups: [], users: [], total: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let timeoutId = null

    if (!query.trim()) {
      setResults({ lessons: [], exercises: [], groups: [], users: [], total: 0 })
      setLoading(false)
      setError(null)
      return undefined
    }

    setLoading(true)
    setError(null)
    timeoutId = setTimeout(async () => {
      try {
        const data = await globalSearch(user?.uid, query)
        setResults(data)
      } catch (err) {
        console.error('Search error:', err)
        setError('Qidirishda xatolik yuz berdi')
        setResults({ lessons: [], exercises: [], groups: [], users: [], total: 0 })
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [query, user])

  const Section = ({ title, icon, items, onClick }) => (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-slate-400">{icon}</span>
        <h2 className="text-white font-semibold">{title}</h2>
        <span className="text-slate-500 text-sm">({items.length})</span>
      </div>
      {items.length === 0 && (
        <p className="text-slate-400 text-sm">Hech narsa topilmadi</p>
      )}
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onClick(item)}
            className="w-full text-left p-3 rounded-lg bg-slate-700/40 hover:bg-slate-700 transition"
          >
            <p className="text-white font-medium">{item.title || item.name || item.email}</p>
            {item.description && (
              <p className="text-slate-400 text-sm mt-1">{item.description}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  )

  const handleLessonClick = () => navigate('/lessons')
  const handleExerciseClick = () => navigate('/exercises')
  const handleGroupClick = () => navigate('/groups')
  const handleUserClick = () => navigate('/messages')

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />
      <main className={`${collapsed ? 'ml-21.25' : 'ml-64'} p-8 transition-all duration-300`}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Qidiruv</h1>
          <p className="text-slate-400">Darslar, mashqlar, guruhlar va foydalanuvchilarni qidiring</p>
        </div>

        <div className="relative mb-8 max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Masalan: React"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            Qidirilmoqda...
          </div>
        )}

        {!loading && query.trim() && results.total === 0 && !error && (
          <div className="text-slate-400">Hech narsa topilmadi</div>
        )}

        {error && (
          <div className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            {error}
          </div>
        )}

        {!loading && results.total > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section
              title="Darslar"
              icon={<BookOpen className="w-4 h-4" />}
              items={results.lessons}
              onClick={handleLessonClick}
            />
            <Section
              title="Mashqlar"
              icon={<Target className="w-4 h-4" />}
              items={results.exercises}
              onClick={handleExerciseClick}
            />
            <Section
              title="Guruhlar"
              icon={<Users className="w-4 h-4" />}
              items={results.groups}
              onClick={handleGroupClick}
            />
            <Section
              title="Foydalanuvchilar"
              icon={<User className="w-4 h-4" />}
              items={results.users}
              onClick={handleUserClick}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default SearchPage
