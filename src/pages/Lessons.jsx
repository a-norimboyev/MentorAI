import Sidebar from '../components/Sidebar'
import { useSidebar } from '../context/SidebarContext'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'
import { BookOpen, Plus, Play, Clock, Users, Search, Filter, X, ArrowLeft, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Lessons = () => {
  const { userProfile } = useAuth()
  const { collapsed } = useSidebar()
  const { lessons, updateLessonProgress, addLesson, addActivity, addNotification } = useAppData()
  const navigate = useNavigate()
  const isTeacher = userProfile?.userType === 'teacher'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newLesson, setNewLesson] = useState({ title: '', description: '', duration: '', category: 'Dasturlash', thumbnail: '���' })

  const filteredLessons = lessons.filter(lesson => 
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleStartLesson = (lesson) => {
    setSelectedLesson(lesson)
    if (lesson.progress === 0) {
      updateLessonProgress(lesson.id, 25)
      addActivity({ title: "Dars boshlandi: " + lesson.title, type: 'info' })
    }
  }

  const handleProgressUpdate = (lessonId, newProgress) => {
    updateLessonProgress(lessonId, newProgress)
    if (newProgress === 100) {
      addActivity({ title: "Dars tugallandi: " + selectedLesson.title, type: 'success' })
      addNotification("Tabriklaymiz! \"" + selectedLesson.title + "\" darsi tugallandi! ���")
    }
    setSelectedLesson(prev => ({ ...prev, progress: newProgress }))
  }

  const handleAddLesson = () => {
    if (!newLesson.title.trim()) return
    const lesson = {
      id: Date.now(),
      title: newLesson.title,
      description: newLesson.description,
      duration: newLesson.duration || '30 daqiqa',
      students: 0,
      progress: 0,
      thumbnail: newLesson.thumbnail,
      category: newLesson.category
    }
    addLesson(lesson)
    addNotification("Yangi dars qo'shildi: " + lesson.title)
    addActivity({ title: "Yangi dars yaratildi: " + lesson.title, type: 'success' })
    setNewLesson({ title: '', description: '', duration: '', category: 'Dasturlash', thumbnail: '���' })
    setShowAddModal(false)
  }

  // Dars ko'rish oynasi
  if (selectedLesson) {
    const currentLesson = lessons.find(l => l.id === selectedLesson.id) || selectedLesson
    return (
      <div className="min-h-screen bg-slate-900">
        <Sidebar />
        <main className={`${collapsed ? 'ml-21.25' : 'ml-64'} p-8 transition-all duration-300`}>
          <button onClick={() => setSelectedLesson(null)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition">
            <ArrowLeft className="w-5 h-5" /> Ortga
          </button>
          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
              <div className="h-48 bg-slate-700 flex items-center justify-center text-8xl">
                {currentLesson.thumbnail}
              </div>
              <div className="p-8">
                <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">{currentLesson.category}</span>
                <h1 className="text-3xl font-bold text-white mt-4 mb-2">{currentLesson.title}</h1>
                <p className="text-slate-400 mb-6">{currentLesson.description}</p>
                <div className="flex items-center gap-6 text-sm text-slate-400 mb-8">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{currentLesson.duration}</span>
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" />{currentLesson.students} o'quvchi</span>
                </div>

                {/* Progress */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-blue-400">{currentLesson.progress}%</span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: currentLesson.progress + '%' }}></div>
                  </div>
                </div>

                {/* Dars bo'limlari */}
                <h3 className="text-lg font-semibold text-white mb-4">Dars bo'limlari</h3>
                <div className="space-y-3 mb-8">
                  {['Kirish va asosiy tushunchalar', "Amaliy misollar", "Mashqlar va topshiriqlar", "Yakuniy test"].map((section, idx) => {
                    const sectionProgress = (idx + 1) * 25
                    const isCompleted = currentLesson.progress >= sectionProgress
                    const isCurrent = currentLesson.progress >= sectionProgress - 25 && currentLesson.progress < sectionProgress
                    return (
                      <div key={idx} className={"flex items-center justify-between p-4 rounded-lg border transition " + (isCompleted ? 'bg-green-500/10 border-green-500/30' : isCurrent ? 'bg-blue-500/10 border-blue-500/30' : 'bg-slate-700/30 border-slate-700')}>
                        <div className="flex items-center gap-3">
                          {isCompleted ? <CheckCircle className="w-5 h-5 text-green-500" /> : <div className={"w-5 h-5 rounded-full border-2 " + (isCurrent ? 'border-blue-500' : 'border-slate-600')}></div>}
                          <span className={isCompleted ? 'text-green-400' : isCurrent ? 'text-white' : 'text-slate-400'}>{section}</span>
                        </div>
                        {isCurrent && !isTeacher && (
                          <button onClick={() => handleProgressUpdate(currentLesson.id, sectionProgress)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm transition">
                            Tugatish
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>

                {currentLesson.progress === 100 && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-green-400 mb-2">Dars tugallandi!</h3>
                    <p className="text-slate-400">Tabriklaymiz! Keyingi darsga o'ting.</p>
                    <button onClick={() => setSelectedLesson(null)} className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition">
                      Barcha darslarga qaytish
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />
      <main className={`${collapsed ? 'ml-21.25' : 'ml-64'} p-8 transition-all duration-300`}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Darslar</h1>
            <p className="text-slate-400">{isTeacher ? "O'quv materiallaringizni boshqaring" : "O'rganishni davom eting"}</p>
          </div>
          {isTeacher && (
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
              <Plus className="w-5 h-5" /> Yangi dars
            </button>
          )}
        </div>

        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Darslarni qidirish..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map(lesson => (
            <div key={lesson.id} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-slate-600 transition group">
              <div className="h-32 bg-slate-700 flex items-center justify-center text-5xl">{lesson.thumbnail}</div>
              <div className="p-5">
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">{lesson.category}</span>
                <h3 className="text-lg font-semibold text-white mt-3 mb-2">{lesson.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{lesson.description}</p>
                <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{lesson.duration}</span>
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" />{lesson.students} o'quvchi</span>
                </div>
                {!isTeacher && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-blue-400">{lesson.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full">
                      <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: lesson.progress + '%' }}></div>
                    </div>
                  </div>
                )}
                <button onClick={() => handleStartLesson(lesson)} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition">
                  <Play className="w-4 h-4" />
                  {lesson.progress > 0 && lesson.progress < 100 ? "Davom etish" : lesson.progress === 100 ? "Qayta ko'rish" : "Boshlash"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Yangi dars modali */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Yangi dars qo'shish</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-700 rounded-lg transition"><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Dars nomi *</label>
                  <input type="text" value={newLesson.title} onChange={(e) => setNewLesson(p => ({...p, title: e.target.value}))} placeholder="Masalan: CSS Grid" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Tavsif</label>
                  <textarea value={newLesson.description} onChange={(e) => setNewLesson(p => ({...p, description: e.target.value}))} placeholder="Dars haqida" rows={2} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Davomiyligi</label>
                    <input type="text" value={newLesson.duration} onChange={(e) => setNewLesson(p => ({...p, duration: e.target.value}))} placeholder="45 daqiqa" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Kategoriya</label>
                    <select value={newLesson.category} onChange={(e) => setNewLesson(p => ({...p, category: e.target.value}))} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                      <option>Dasturlash</option><option>Frontend</option><option>Backend</option><option>Tools</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Emoji</label>
                  <div className="flex gap-2">
                    {['���', '���', '⚛️', '���', '���', '���', '���', '���'].map(e => (
                      <button key={e} onClick={() => setNewLesson(p => ({...p, thumbnail: e}))} className={"w-10 h-10 rounded-lg text-xl flex items-center justify-center " + (newLesson.thumbnail === e ? 'bg-blue-600 ring-2 ring-blue-400' : 'bg-slate-700 hover:bg-slate-600')}>{e}</button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowAddModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg transition">Bekor qilish</button>
                  <button onClick={handleAddLesson} disabled={!newLesson.title.trim()} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg transition">Qo'shish</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Lessons
