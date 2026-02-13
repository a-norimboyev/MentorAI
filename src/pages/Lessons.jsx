import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import { BookOpen, Plus, Play, Clock, Users, Search, Filter } from 'lucide-react'
import { useState } from 'react'

const Lessons = () => {
  const { userProfile } = useAuth()
  const isTeacher = userProfile?.userType === 'teacher'
  const [searchTerm, setSearchTerm] = useState('')

  // Demo darslar
  const lessons = [
    {
      id: 1,
      title: "JavaScript asoslari",
      description: "O'zgaruvchilar, funksiyalar va massivlar bilan ishlash",
      duration: "45 daqiqa",
      students: 24,
      progress: 100,
      thumbnail: "🟨",
      category: "Dasturlash"
    },
    {
      id: 2,
      title: "React Hooks",
      description: "useState, useEffect va boshqa hooklar",
      duration: "60 daqiqa",
      students: 18,
      progress: 75,
      thumbnail: "⚛️",
      category: "Frontend"
    },
    {
      id: 3,
      title: "Node.js kirish",
      description: "Server tomonlama JavaScript",
      duration: "55 daqiqa",
      students: 32,
      progress: 50,
      thumbnail: "🟢",
      category: "Backend"
    },
    {
      id: 4,
      title: "TypeScript asoslari",
      description: "Tiplar va interfacelar",
      duration: "40 daqiqa",
      students: 15,
      progress: 25,
      thumbnail: "🔷",
      category: "Dasturlash"
    },
    {
      id: 5,
      title: "Git va GitHub",
      description: "Version control tizimi",
      duration: "35 daqiqa",
      students: 28,
      progress: 0,
      thumbnail: "🐙",
      category: "Tools"
    }
  ]

  const filteredLessons = lessons.filter(lesson => 
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Darslar</h1>
            <p className="text-slate-400">
              {isTeacher ? "O'quv materiallaringizni boshqaring" : "O'rganishni davom eting"}
            </p>
          </div>
          {isTeacher && (
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
              <Plus className="w-5 h-5" />
              Yangi dars
            </button>
          )}
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Darslarni qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-700 transition">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>

        {/* Lessons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map(lesson => (
            <div key={lesson.id} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-slate-600 transition group">
              {/* Thumbnail */}
              <div className="h-32 bg-slate-700 flex items-center justify-center text-5xl">
                {lesson.thumbnail}
              </div>
              
              {/* Content */}
              <div className="p-5">
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                  {lesson.category}
                </span>
                <h3 className="text-lg font-semibold text-white mt-3 mb-2">{lesson.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{lesson.description}</p>
                
                <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {lesson.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {lesson.students} o'quvchi
                  </span>
                </div>

                {/* Progress */}
                {!isTeacher && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-blue-400">{lesson.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${lesson.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition">
                  <Play className="w-4 h-4" />
                  {lesson.progress > 0 && lesson.progress < 100 ? "Davom etish" : lesson.progress === 100 ? "Qayta ko'rish" : "Boshlash"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Lessons
