import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import { Calendar, Clock, Target, CheckCircle, Circle, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const Schedule = () => {
  const { userProfile } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  // Demo haftalik jadval
  const weekDays = ['Dush', 'Sesh', 'Chor', 'Pay', 'Juma', 'Shan', 'Yak']
  
  const getDaysInWeek = () => {
    const week = []
    const current = new Date(selectedDate)
    const first = current.getDate() - current.getDay() + 1
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(current.setDate(first + i))
      week.push(day)
    }
    return week
  }

  const days = getDaysInWeek()
  const today = new Date().toDateString()

  // Demo kunlik vazifalar - state orqali boshqarish
  const [dailyTasks, setDailyTasks] = useState([
    { id: 1, title: "JavaScript dars", time: "09:00 - 10:30", type: "lesson", completed: true },
    { id: 2, title: "Array mashqlari", time: "11:00 - 12:00", type: "exercise", completed: true },
    { id: 3, title: "React Hook'lar video", time: "14:00 - 15:00", type: "video", completed: false },
    { id: 4, title: "API loyiha", time: "16:00 - 18:00", type: "project", completed: false }
  ])

  // Vazifani bajarilgan/bajarilmagan qilish
  const toggleTask = (taskId) => {
    setDailyTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  // Demo haftalik reja
  const weeklyGoals = [
    { id: 1, title: "JavaScript asoslarini tugatish", progress: 80 },
    { id: 2, title: "3 ta mashq bajarish", progress: 66 },
    { id: 3, title: "React loyiha boshlash", progress: 30 }
  ]

  // Demo kelgusi darslar
  const upcomingLessons = [
    { date: "Bugun, 14:00", title: "React Hooks", group: "Frontend" },
    { date: "Ertaga, 10:00", title: "State Management", group: "Frontend" },
    { date: "26-Yanvar, 09:00", title: "Node.js kirish", group: "Backend" }
  ]

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

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">O'quv Rejasi</h1>
            <p className="text-slate-400">Kunlik va haftalik rejangizni boshqaring</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
            <Plus className="w-5 h-5" />
            Yangi vazifa
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Calendar & Daily Tasks */}
          <div className="col-span-2 space-y-6">
            {/* Week Calendar */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">{formatDate()}</h2>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-700 rounded-lg transition">
                    <ChevronLeft className="w-5 h-5 text-slate-400" />
                  </button>
                  <button 
                    onClick={() => setSelectedDate(new Date())}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg"
                  >
                    Bugun
                  </button>
                  <button className="p-2 hover:bg-slate-700 rounded-lg transition">
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
                      className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto transition ${
                        days[idx].toDateString() === today
                          ? 'bg-blue-600 text-white'
                          : days[idx].toDateString() === selectedDate.toDateString()
                            ? 'bg-slate-700 text-white'
                            : 'hover:bg-slate-700 text-slate-400'
                      }`}
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
                <h2 className="text-lg font-semibold text-white">
                  Bugungi vazifalar
                </h2>
                <span className="text-sm text-slate-400">
                  {dailyTasks.filter(t => t.completed).length}/{dailyTasks.length} bajarildi
                </span>
              </div>
              
              <div className="space-y-3">
                {dailyTasks.map(task => (
                  <div 
                    key={task.id}
                    className={`flex items-center gap-4 p-3 rounded-lg border ${getTypeColor(task.type)} ${
                      task.completed ? 'opacity-60' : ''
                    }`}
                  >
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className="shrink-0 hover:scale-110 transition-transform"
                    >
                      {task.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400 hover:text-green-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={`font-medium ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.time}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                          {getTypeName(task.type)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Goals & Upcoming */}
          <div className="space-y-6">
            {/* Weekly Goals */}
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
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Lessons */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-green-400" />
                <h2 className="text-lg font-semibold text-white">Kelgusi darslar</h2>
              </div>
              
              <div className="space-y-3">
                {upcomingLessons.map((lesson, idx) => (
                  <div key={idx} className="p-3 bg-slate-700/50 rounded-lg">
                    <p className="text-xs text-blue-400 mb-1">{lesson.date}</p>
                    <p className="font-medium text-white">{lesson.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{lesson.group} guruhi</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-linear-to-br from-blue-600 to-purple-600 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-3">Bu hafta</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-white">12</p>
                  <p className="text-sm text-blue-200">soat o'qish</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">8</p>
                  <p className="text-sm text-blue-200">vazifa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Schedule
