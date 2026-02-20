import Sidebar from '../components/Sidebar'
import { useSidebar } from '../context/SidebarContext'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'
import { Calendar, Clock, Target, CheckCircle, Circle, Plus, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createScheduleEvent, getUserScheduleEvents, deleteScheduleEvent } from '../utils/scheduleService'

const Schedule = () => {
  const { user, userProfile } = useAuth()
  const { collapsed } = useSidebar()
  const { dailyTasks, setDailyTasks, toggleDailyTask, addDailyTask, completedDailyTasks,
          lessons, completedLessons, completedExercises, exercises, addActivity, addNotification } = useAppData()
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', time: '', type: 'lesson' })
  const [loadingSchedule, setLoadingSchedule] = useState(false)

  // Firestore dan schedule eventlarni yuklash
  useEffect(() => {
    const loadSchedule = async () => {
      if (!user) return
      setLoadingSchedule(true)
      try {
        const events = await getUserScheduleEvents(user.uid)
        if (events.length > 0) {
          const tasks = events.map(ev => ({
            id: ev.id,
            title: ev.title,
            time: ev.time || '09:00 - 10:00',
            type: ev.type || 'lesson',
            completed: ev.completed || false,
            firestoreId: ev.id
          }))
          // Mavjud tasklarni merge qilish, faqat yangilarini qo'shish
          setDailyTasks(prev => {
            const existingIds = new Set(prev.map(t => t.id))
            const newTasks = tasks.filter(t => !existingIds.has(t.id))
            return newTasks.length > 0 ? [...prev, ...newTasks] : prev.length === 0 ? tasks : prev
          })
        }
      } catch (error) {
        console.error('Error loading schedule:', error)
      } finally {
        setLoadingSchedule(false)
      }
    }
    loadSchedule()
  }, [user])

  const weekDays = ['Dush', 'Sesh', 'Chor', 'Pay', 'Juma', 'Shan', 'Yak']

  const getDaysInWeek = () => {
    const week = []
    const current = new Date(selectedDate)
    const first = current.getDate() - current.getDay() + 1
    for (let i = 0; i < 7; i++) {
      const day = new Date(new Date(current).setDate(first + i))
      week.push(day)
    }
    return week
  }

  const days = getDaysInWeek()
  const today = new Date().toDateString()

  const handleToggleTask = (taskId) => {
    const task = dailyTasks.find(t => t.id === taskId)
    toggleDailyTask(taskId)
    if (task && !task.completed) {
      addActivity({ title: "Vazifa bajarildi: " + task.title, type: 'success' })
    }
  }

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return
    const taskData = {
      title: newTask.title,
      time: newTask.time || '09:00 - 10:00',
      type: newTask.type,
      completed: false,
      date: selectedDate.toISOString().split('T')[0]
    }
    
    try {
      if (user) {
        const eventId = await createScheduleEvent(user.uid, taskData)
        addDailyTask({ ...taskData, id: eventId })
      } else {
        addDailyTask(taskData)
      }
      addNotification("Yangi vazifa qo'shildi: " + newTask.title)
      addActivity({ title: "Yangi vazifa: " + newTask.title, type: 'info' })
    } catch (error) {
      console.error('Error adding task:', error)
      addDailyTask(taskData)
    }
    setNewTask({ title: '', time: '', type: 'lesson' })
    setShowAddTask(false)
  }

  const handlePrevWeek = () => {
    setSelectedDate(prev => {
      const d = new Date(prev)
      d.setDate(d.getDate() - 7)
      return d
    })
  }

  const handleNextWeek = () => {
    setSelectedDate(prev => {
      const d = new Date(prev)
      d.setDate(d.getDate() + 7)
      return d
    })
  }

  // Haqiqiy haftalik maqsadlar
  const weeklyGoals = [
    { id: 1, title: "Darslarni tugatish", progress: lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0 },
    { id: 2, title: "Mashqlarni bajarish", progress: exercises.length > 0 ? Math.round((completedExercises / exercises.length) * 100) : 0 },
    { id: 3, title: "Bugungi vazifalar", progress: dailyTasks.length > 0 ? Math.round((completedDailyTasks / dailyTasks.length) * 100) : 0 }
  ]

  // Keyingi darslarni lessonlardan olish
  const upcomingLessons = lessons.filter(l => l.progress < 100).slice(0, 3).map((l, idx) => ({
    date: idx === 0 ? "Bugun" : idx === 1 ? "Ertaga" : "Keyingi hafta",
    title: l.title,
    group: l.category
  }))

  const getTypeColor = (type) => {
    switch(type) {
      case 'lesson': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'exercise': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'video': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'project': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const getTypeName = (type) => {
    switch(type) {
      case 'lesson': return 'Dars'
      case 'exercise': return 'Mashq'
      case 'video': return 'Video'
      case 'project': return 'Loyiha'
      default: return 'Boshqa'
    }
  }

  const formatDate = () => {
    return selectedDate.toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' })
  }

  // Haqiqiy statistika
  const totalStudyHours = Math.round(dailyTasks.filter(t => t.completed).length * 1.5)

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />
      <main className={`${collapsed ? 'ml-21.25' : 'ml-64'} p-8 transition-all duration-300`}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">O'quv Rejasi</h1>
            <p className="text-slate-400">Kunlik va haftalik rejangizni boshqaring</p>
          </div>
          <button onClick={() => setShowAddTask(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
            <Plus className="w-5 h-5" /> Yangi vazifa
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {/* Week Calendar */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">{formatDate()}</h2>
                <div className="flex items-center gap-2">
                  <button onClick={handlePrevWeek} className="p-2 hover:bg-slate-700 rounded-lg transition">
                    <ChevronLeft className="w-5 h-5 text-slate-400" />
                  </button>
                  <button onClick={() => setSelectedDate(new Date())} className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg">Bugun</button>
                  <button onClick={handleNextWeek} className="p-2 hover:bg-slate-700 rounded-lg transition">
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day, idx) => (
                  <div key={day} className="text-center">
                    <p className="text-xs text-slate-500 mb-2">{day}</p>
                    <button
                      onClick={() => setSelectedDate(days[idx])}
                      className={"w-10 h-10 rounded-full flex items-center justify-center mx-auto transition " + (
                        days[idx].toDateString() === today ? 'bg-blue-600 text-white' :
                        days[idx].toDateString() === selectedDate.toDateString() ? 'bg-slate-700 text-white' :
                        'hover:bg-slate-700 text-slate-400'
                      )}
                    >
                      {days[idx].getDate()}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Tasks */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Bugungi vazifalar</h2>
                <span className="text-sm text-slate-400">{completedDailyTasks}/{dailyTasks.length} bajarildi</span>
              </div>
              <div className="space-y-3">
                {dailyTasks.map(task => (
                  <div key={task.id} className={"flex items-center gap-4 p-3 rounded-lg border " + getTypeColor(task.type) + " " + (task.completed ? 'opacity-60' : '')}>
                    <button onClick={() => handleToggleTask(task.id)} className="shrink-0 hover:scale-110 transition-transform">
                      {task.completed ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Circle className="w-5 h-5 text-slate-400 hover:text-green-400" />}
                    </button>
                    <div className="flex-1">
                      <p className={"font-medium " + (task.completed ? 'line-through text-slate-500' : 'text-white')}>{task.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{task.time}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">{getTypeName(task.type)}</span>
                      </div>
                    </div>
                    {task.type === 'lesson' && (
                      <button onClick={() => navigate('/lessons')} className="text-xs text-blue-400 hover:text-blue-300 transition">Darsga o'tish →</button>
                    )}
                    {task.type === 'exercise' && (
                      <button onClick={() => navigate('/exercises')} className="text-xs text-green-400 hover:text-green-300 transition">Mashqga o'tish →</button>
                    )}
                  </div>
                ))}
                {dailyTasks.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-slate-400">Hali vazifalar yo'q</p>
                    <button onClick={() => setShowAddTask(true)} className="mt-2 text-blue-400 hover:text-blue-300 text-sm">+ Vazifa qo'shish</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">Haftalik maqsadlar</h2>
              </div>
              <div className="space-y-4">
                {weeklyGoals.map(goal => (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-slate-300">{goal.title}</p>
                      <span className="text-xs text-slate-400">{goal.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: goal.progress + '%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-green-400" />
                <h2 className="text-lg font-semibold text-white">Kelgusi darslar</h2>
              </div>
              <div className="space-y-3">
                {upcomingLessons.map((lesson, idx) => (
                  <div key={idx} onClick={() => navigate('/lessons')} className="p-3 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700 transition">
                    <p className="text-xs text-blue-400 mb-1">{lesson.date}</p>
                    <p className="font-medium text-white">{lesson.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{lesson.group}</p>
                  </div>
                ))}
                {upcomingLessons.length === 0 && (
                  <p className="text-slate-400 text-sm text-center py-4">Barcha darslar tugallangan!</p>
                )}
              </div>
            </div>

            <div className="bg-linear-to-br from-blue-600 to-purple-600 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-3">Bu hafta</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-2xl font-bold text-white">{totalStudyHours}</p><p className="text-sm text-blue-200">soat o'qish</p></div>
                <div><p className="text-2xl font-bold text-white">{dailyTasks.length}</p><p className="text-sm text-blue-200">vazifa</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* Yangi vazifa modali */}
        {showAddTask && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Yangi vazifa</h2>
                <button onClick={() => setShowAddTask(false)} className="p-2 hover:bg-slate-700 rounded-lg transition"><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Vazifa nomi *</label>
                  <input type="text" value={newTask.title} onChange={(e) => setNewTask(p => ({...p, title: e.target.value}))} placeholder="Masalan: React darsini ko'rish" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Vaqt</label>
                  <input type="text" value={newTask.time} onChange={(e) => setNewTask(p => ({...p, time: e.target.value}))} placeholder="09:00 - 10:30" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Turi</label>
                  <select value={newTask.type} onChange={(e) => setNewTask(p => ({...p, type: e.target.value}))} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                    <option value="lesson">Dars</option><option value="exercise">Mashq</option><option value="video">Video</option><option value="project">Loyiha</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowAddTask(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg transition">Bekor qilish</button>
                  <button onClick={handleAddTask} disabled={!newTask.title.trim()} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg transition">Qo'shish</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Schedule
