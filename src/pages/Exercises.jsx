import Sidebar from '../components/Sidebar'
import { useSidebar } from '../context/SidebarContext'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'
import { Target, Plus, CheckCircle, Clock, Star, Trophy, Filter, Search, X, Upload, Calendar, Video, Tag, FileText, Trash2, Loader2 } from 'lucide-react'
import { useState, useRef } from 'react'
import { storage } from '../config/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const Exercises = () => {
  const { userProfile, saveExerciseCompletion } = useAuth()
  const { collapsed } = useSidebar()
  const { exercises, toggleExercise, addExercise, totalPoints, completedExercises, addActivity, addNotification } = useAppData()
  const isTeacher = userProfile?.userType === 'teacher'
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState(false)
  const fileInputRef = useRef(null)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [newExercise, setNewExercise] = useState({
    title: '', description: '', difficulty: 'Oson', points: 10, deadline: '', timeLimit: '', videoUrl: '', tags: []
  })

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    setUploadingFiles(true)
    try {
      const uploaded = await Promise.all(files.map(async (file) => {
        const fileId = Date.now() + Math.random()
        const storageRef = ref(storage, `exercises/${user?.uid || 'anon'}/${fileId}_${file.name}`)
        await uploadBytes(storageRef, file)
        const downloadURL = await getDownloadURL(storageRef)
        return {
          id: fileId,
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          type: file.type,
          url: downloadURL
        }
      }))
      setUploadedFiles(prev => [...prev, ...uploaded])
    } catch (err) {
      console.error('File upload error:', err)
    } finally {
      setUploadingFiles(false)
    }
  }

  const handleRemoveFile = (fileId) => { setUploadedFiles(prev => prev.filter(f => f.id !== fileId)) }

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!newExercise.tags.includes(tagInput.trim())) {
        setNewExercise(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }))
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag) => { setNewExercise(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) })) }

  const handleAddExercise = () => {
    if (!newExercise.title.trim() || !newExercise.description.trim()) return
    const exercise = {
      id: crypto.randomUUID(),
      title: newExercise.title,
      description: newExercise.description,
      difficulty: newExercise.difficulty,
      points: parseInt(newExercise.points),
      completed: false,
      category: newExercise.tags[0] || 'Umumiy',
      deadline: newExercise.deadline,
      timeLimit: newExercise.timeLimit,
      videoUrl: newExercise.videoUrl,
      tags: newExercise.tags,
      files: uploadedFiles
    }
    addExercise(exercise)
    addNotification("Yangi mashq qo'shildi: " + exercise.title)
    addActivity({ title: "Yangi mashq yaratildi: " + exercise.title, type: 'info' })
    setNewExercise({ title: '', description: '', difficulty: 'Oson', points: 10, deadline: '', timeLimit: '', videoUrl: '', tags: [] })
    setUploadedFiles([])
    setShowModal(false)
  }

  const handleToggleExercise = (exerciseId) => {
    const ex = exercises.find(e => e.id === exerciseId)
    toggleExercise(exerciseId)
    if (ex && !ex.completed) {
      // Firestore ga saqlash
      saveExerciseCompletion(exerciseId, ex.points, ex.difficulty)
      addActivity({ title: "Mashq bajarildi: " + ex.title, type: 'success' })
      addNotification("Tabriklaymiz! \"" + ex.title + "\" mashqi bajarildi! +" + ex.points + " ball")
    }
  }

  const filteredExercises = filter === 'all' ? exercises : filter === 'completed' ? exercises.filter(e => e.completed) : exercises.filter(e => !e.completed)

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Oson': return 'text-green-400 bg-green-500/20'
      case "O'rta": return 'text-yellow-400 bg-yellow-500/20'
      case 'Qiyin': return 'text-red-400 bg-red-500/20'
      default: return 'text-slate-400 bg-slate-500/20'
    }
  }

  const getRank = () => {
    if (totalPoints >= 100) return 'Senior'
    if (totalPoints >= 50) return 'Middle'
    return 'Junior'
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />
      <main className={`${collapsed ? 'ml-21.25' : 'ml-64'} p-8 transition-all duration-300`}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Mashqlar</h1>
            <p className="text-slate-400">{isTeacher ? "Mashqlarni yarating va boshqaring" : "Bilimlaringizni sinab ko'ring"}</p>
          </div>
          {isTeacher && (
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
              <Plus className="w-5 h-5" /> Yangi mashq
            </button>
          )}
        </div>

        {!isTeacher && (
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center"><CheckCircle className="w-6 h-6 text-blue-500" /></div>
                <div><p className="text-slate-400 text-sm">Bajarilgan</p><p className="text-2xl font-bold text-white">{completedExercises}/{exercises.length}</p></div>
              </div>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center"><Star className="w-6 h-6 text-yellow-500" /></div>
                <div><p className="text-slate-400 text-sm">Jami ball</p><p className="text-2xl font-bold text-white">{totalPoints}</p></div>
              </div>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center"><Trophy className="w-6 h-6 text-green-500" /></div>
                <div><p className="text-slate-400 text-sm">Daraja</p><p className="text-2xl font-bold text-white">{getRank()}</p></div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-6">
          {['all', 'completed', 'pending'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={"px-4 py-2 rounded-lg transition " + (filter === f ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700')}>
              {f === 'all' ? 'Barchasi' : f === 'completed' ? 'Bajarilgan' : 'Kutilmoqda'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredExercises.map(exercise => (
            <div key={exercise.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={"w-12 h-12 rounded-xl flex items-center justify-center " + (exercise.completed ? 'bg-green-500/20' : 'bg-slate-700')}>
                    {exercise.completed ? <CheckCircle className="w-6 h-6 text-green-500" /> : <Target className="w-6 h-6 text-slate-400" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-white">{exercise.title}</h3>
                      <span className={"text-xs px-2 py-0.5 rounded-full " + getDifficultyColor(exercise.difficulty)}>{exercise.difficulty}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{exercise.description}</p>
                    <span className="text-xs text-slate-500 mt-1 inline-block">{exercise.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right"><p className="text-yellow-400 font-bold">+{exercise.points}</p><p className="text-slate-500 text-xs">ball</p></div>
                  <button onClick={() => handleToggleExercise(exercise.id)} className={"px-4 py-2 rounded-lg transition " + (exercise.completed ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' : 'bg-blue-600 hover:bg-blue-700 text-white')}>
                    {exercise.completed ? "✓ Bajarildi" : "Boshlash"}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredExercises.length === 0 && (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-1">Mashqlar topilmadi</h3>
              <p className="text-slate-400 text-sm">
                {filter === 'completed' ? 'Hali bajarilgan mashqlar yo\'q' : filter === 'pending' ? 'Barcha mashqlar bajarilgan!' : 'Mashqlar yo\'q'}
              </p>
            </div>
          )}
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-slate-800 pb-4 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">Yangi mashq qo'shish</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-700 rounded-lg transition"><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Mashq nomi *</label>
                  <input type="text" value={newExercise.title} onChange={(e) => setNewExercise(prev => ({ ...prev, title: e.target.value }))} placeholder="Masalan: JavaScript Basics" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Tavsif *</label>
                  <textarea value={newExercise.description} onChange={(e) => setNewExercise(prev => ({ ...prev, description: e.target.value }))} placeholder="Mashq haqida qisqacha" rows={3} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Qiyinlik</label>
                    <select value={newExercise.difficulty} onChange={(e) => setNewExercise(prev => ({ ...prev, difficulty: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                      <option value="Oson">Oson</option><option value="O'rta">O'rta</option><option value="Qiyin">Qiyin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Ball</label>
                    <input type="number" value={newExercise.points} onChange={(e) => setNewExercise(prev => ({ ...prev, points: e.target.value }))} min={5} max={100} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2"><Calendar className="w-4 h-4 inline mr-1" />Topshirish muddati</label>
                    <input type="datetime-local" value={newExercise.deadline} onChange={(e) => setNewExercise(prev => ({ ...prev, deadline: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2"><Clock className="w-4 h-4 inline mr-1" />Vaqt chegarasi (daqiqa)</label>
                    <input type="number" value={newExercise.timeLimit} onChange={(e) => setNewExercise(prev => ({ ...prev, timeLimit: e.target.value }))} placeholder="Masalan: 30" min={1} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2"><Video className="w-4 h-4 inline mr-1" />Video havola</label>
                  <input type="url" value={newExercise.videoUrl} onChange={(e) => setNewExercise(prev => ({ ...prev, videoUrl: e.target.value }))} placeholder="https://youtube.com/watch?v=..." className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2"><Tag className="w-4 h-4 inline mr-1" />Teglar</label>
                  <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag} placeholder="Teg yozing va Enter bosing" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                  {newExercise.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newExercise.tags.map((tag, index) => (
                        <span key={index} className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                          #{tag}<button onClick={() => handleRemoveTag(tag)} className="hover:text-red-400 transition"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2"><Upload className="w-4 h-4 inline mr-1" />Fayllar</label>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple className="hidden" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif" />
                  <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-slate-800/50 transition">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">Fayllarni yuklash uchun bosing</p>
                    <p className="text-slate-500 text-xs mt-1">PDF, DOC, TXT, JPG, PNG (max 10MB)</p>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {uploadedFiles.map(file => (
                        <div key={file.id} className="flex items-center justify-between bg-slate-900 rounded-lg px-4 py-2">
                          <div className="flex items-center gap-3"><FileText className="w-5 h-5 text-blue-400" /><div><p className="text-white text-sm">{file.name}</p><p className="text-slate-500 text-xs">{file.size}</p></div></div>
                          <button onClick={() => handleRemoveFile(file.id)} className="p-1 hover:bg-red-500/20 rounded transition"><Trash2 className="w-4 h-4 text-red-400" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg transition">Bekor qilish</button>
                  <button onClick={handleAddExercise} disabled={!newExercise.title.trim() || !newExercise.description.trim()} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg transition">Qo'shish</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Exercises
