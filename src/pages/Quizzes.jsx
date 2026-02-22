import Sidebar from '../components/Sidebar'
import { useSidebar } from '../context/SidebarContext'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'
import { 
  ClipboardCheck, Play, CheckCircle, XCircle, Clock, Trophy, 
  ChevronRight, RotateCcw, Star, Zap, Brain, Target, X
} from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { db } from '../config/firebase'
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore'

const quizData = [
  {
    id: 1,
    title: "JavaScript Asoslari",
    description: "O'zgaruvchilar, tiplar va operatorlar",
    category: "JavaScript",
    difficulty: "Oson",
    timeLimit: 10,
    emoji: "🟨",
    questions: [
      {
        id: 1,
        question: "JavaScript'da o'zgaruvchi e'lon qilishning qaysi usuli block scope'ga ega?",
        options: ["var", "let", "both var and let", "neither"],
        correct: 1,
        explanation: "'let' kalit so'zi block scope'ga ega, 'var' esa function scope'ga ega."
      },
      {
        id: 2,
        question: "typeof null ning qiymati nima?",
        options: ["'null'", "'undefined'", "'object'", "'boolean'"],
        correct: 2,
        explanation: "Bu JavaScript'dagi tarixiy xato - typeof null 'object' qaytaradi."
      },
      {
        id: 3,
        question: "Quyidagilardan qaysi biri JavaScript'da falsy qiymat emas?",
        options: ["0", "''", "'false'", "null"],
        correct: 2,
        explanation: "'false' string qiymati truthy hisoblanadi, chunki u bo'sh emas."
      },
      {
        id: 4,
        question: "=== operatori nimani tekshiradi?",
        options: ["Faqat qiymatni", "Faqat tipni", "Qiymat va tipni", "Hech birini"],
        correct: 2,
        explanation: "=== (strict equality) ham qiymatni, ham tipni tekshiradi."
      },
      {
        id: 5,
        question: "console.log(1 + '2') natijasi nima?",
        options: ["3", "'12'", "NaN", "Error"],
        correct: 1,
        explanation: "JavaScript 1 ni string'ga aylantirib, '12' qilib birlashtiradi (type coercion)."
      }
    ]
  },
  {
    id: 2,
    title: "React Hooklar",
    description: "useState, useEffect va boshqa hooklar",
    category: "React",
    difficulty: "O'rta",
    timeLimit: 15,
    emoji: "⚛️",
    questions: [
      {
        id: 1,
        question: "useState hook'i nima qaytaradi?",
        options: ["Faqat qiymat", "Faqat funksiya", "Massiv: [qiymat, funksiya]", "Object"],
        correct: 2,
        explanation: "useState [state, setState] massivini qaytaradi."
      },
      {
        id: 2,
        question: "useEffect hook'i qachon ishlaydi?",
        options: ["Faqat birinchi renderda", "Har bir renderdan keyin", "Dependency o'zgarganda", "Hammasiga bog'liq"],
        correct: 3,
        explanation: "useEffect dependency array'ga qarab ishlaydi - bo'sh array: 1 marta, array'siz: har doim."
      },
      {
        id: 3,
        question: "useRef hook'ining asosiy vazifasi nima?",
        options: ["State boshqarish", "DOM elementga murojaat", "Side effect'lar", "Context yaratish"],
        correct: 1,
        explanation: "useRef DOM elementlarga murojaat qilish va render'ga ta'sir qilmaydigan qiymatlar saqlash uchun."
      },
      {
        id: 4,
        question: "useMemo hook'i nima uchun ishlatiladi?",
        options: ["State saqlash", "Qiymatni eslab qolish (memoize)", "DOM bilan ishlash", "Event handling"],
        correct: 1,
        explanation: "useMemo qimmat hisob-kitoblarni memoize qilib, keraksiz qayta hisoblashlarni oldini oladi."
      },
      {
        id: 5,
        question: "Custom hook nomi nima bilan boshlanishi shart?",
        options: ["get", "hook", "use", "custom"],
        correct: 2,
        explanation: "React'da barcha custom hooklar 'use' prefiksi bilan boshlanishi kerak."
      }
    ]
  },
  {
    id: 3,
    title: "HTML & CSS",
    description: "Web asoslari va stillar",
    category: "Web",
    difficulty: "Oson",
    timeLimit: 8,
    emoji: "🌐",
    questions: [
      {
        id: 1,
        question: "HTML'da semantik teg qaysi?",
        options: ["<div>", "<span>", "<article>", "<b>"],
        correct: 2,
        explanation: "<article> semantik teg bo'lib, kontent ma'nosini anglatadi."
      },
      {
        id: 2,
        question: "CSS Flexbox'da justify-content nima qiladi?",
        options: ["Vertikal joylash", "Gorizontal joylash", "Asosiy o'q bo'yicha joylash", "O'lcham berish"],
        correct: 2,
        explanation: "justify-content elementlarni asosiy o'q (main axis) bo'yicha joylashtiradi."
      },
      {
        id: 3,
        question: "position: absolute qanday ishlaydi?",
        options: ["Normal flow'da", "Viewport'ga nisbatan", "Eng yaqin positioned ota'ga nisbatan", "Scroll'ga nisbatan"],
        correct: 2,
        explanation: "absolute - eng yaqin position:relative yoki positioned ancestor'ga nisbatan joylashadi."
      },
      {
        id: 4,
        question: "CSS'da specificity tartibi qanday (past→yuqori)?",
        options: ["class > id > element", "element > class > id", "id > element > class", "element > id > class"],
        correct: 1,
        explanation: "CSS specificity: element (1) < class (10) < id (100) < inline style (1000)."
      }
    ]
  },
  {
    id: 4,
    title: "Python Asoslari",
    description: "Tiplar, funksiyalar va OOP",
    category: "Python",
    difficulty: "O'rta",
    timeLimit: 12,
    emoji: "🐍",
    questions: [
      {
        id: 1,
        question: "Python'da list va tuple'ning farqi nima?",
        options: ["Farqi yo'q", "List o'zgarmas, tuple o'zgaruvchan", "List o'zgaruvchan, tuple o'zgarmas", "Ikkalasi ham o'zgarmas"],
        correct: 2,
        explanation: "List (mutable) - o'zgartirilishi mumkin, tuple (immutable) - o'zgartirib bo'lmaydi."
      },
      {
        id: 2,
        question: "def kalit so'zi nima uchun ishlatiladi?",
        options: ["O'zgaruvchi e'lon qilish", "Funksiya yaratish", "Sinf yaratish", "Import qilish"],
        correct: 1,
        explanation: "def - Python'da funksiya (function) yaratish uchun ishlatiladi."
      },
      {
        id: 3,
        question: "Python'da dictionary'ga qanday element qo'shiladi?",
        options: ["dict.add(key, val)", "dict.append(key, val)", "dict[key] = val", "dict.insert(key, val)"],
        correct: 2,
        explanation: "Dictionary'ga dict[key] = value orqali yangi juft qo'shiladi."
      },
      {
        id: 4,
        question: "Lambda funksiya nima?",
        options: ["Katta funksiya", "Anonim bir qatorli funksiya", "Class metodi", "Dekorator"],
        correct: 1,
        explanation: "Lambda - bir qatorli anonim funksiya: lambda x: x * 2"
      },
      {
        id: 5,
        question: "__init__ metodi nima?",
        options: ["Destruktor", "Konstruktor", "Getter", "Setter"],
        correct: 1,
        explanation: "__init__ - sinf konstruktori, object yaratilganda avtomatik chaqiriladi."
      }
    ]
  },
  {
    id: 5,
    title: "Git & GitHub",
    description: "Version control va hamkorlik",
    category: "Tools",
    difficulty: "Oson",
    timeLimit: 8,
    emoji: "🐙",
    questions: [
      {
        id: 1,
        question: "git commit -m buyrug'i nima qiladi?",
        options: ["Faylni o'chiradi", "O'zgarishlarni saqlaydi", "Branch yaratadi", "Push qiladi"],
        correct: 1,
        explanation: "git commit o'zgarishlarni lokal repository'ga saqlaydi (snapshot)."
      },
      {
        id: 2,
        question: "git pull va git fetch'ning farqi nima?",
        options: ["Farqi yo'q", "pull = fetch + merge", "fetch = pull + merge", "pull faqat remote'dan oladi"],
        correct: 1,
        explanation: "git pull = git fetch (yuklab olish) + git merge (birlashtirish)."
      },
      {
        id: 3,
        question: "Branch nima uchun kerak?",
        options: ["Faylni o'chirish", "Parallel ishlab chiqish", "Git o'rnatish", "Remote qo'shish"],
        correct: 1,
        explanation: "Branch'lar bir nechta feature'larni parallel ravishda ishlab chiqish imkonini beradi."
      },
      {
        id: 4,
        question: ".gitignore fayli nima uchun?",
        options: ["Git o'rnatish", "Fayllarni git'dan chiqarish", "Branch yaratish", "Commit qilish"],
        correct: 1,
        explanation: ".gitignore - git tomonidan kuzatilmasligi kerak bo'lgan fayllar ro'yxati."
      }
    ]
  }
]

const difficultyColor = {
  'Oson': 'text-green-400 bg-green-500/10',
  "O'rta": 'text-yellow-400 bg-yellow-500/10',
  'Qiyin': 'text-red-400 bg-red-500/10'
}

const Quizzes = () => {
  const { user, userProfile } = useAuth()
  const { collapsed } = useSidebar()
  const { addActivity, addNotification } = useAppData()

  const [activeQuiz, setActiveQuiz] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState([])
  const [quizFinished, setQuizFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [quizHistory, setQuizHistory] = useState([])
  
  // Refs for stale closure prevention
  const answersRef = useRef(answers)
  const activeQuizRef = useRef(activeQuiz)
  answersRef.current = answers
  activeQuizRef.current = activeQuiz

  // Firestore dan quiz tarixini yuklash
  useEffect(() => {
    if (!user) return
    const loadHistory = async () => {
      try {
        const histRef = collection(db, 'users', user.uid, 'quizResults')
        const q = query(histRef, orderBy('completedAt', 'desc'))
        const snap = await getDocs(q)
        const history = snap.docs.map(d => {
          const data = d.data()
          return {
            ...data,
            id: d.id,
            date: data.completedAt?.toDate?.()?.toLocaleDateString('uz-UZ') || data.date
          }
        })
        setQuizHistory(history)
      } catch (e) {
        console.error('Error loading quiz history:', e)
      }
    }
    loadHistory()
  }, [user])

  // Timer
  useEffect(() => {
    if (!activeQuiz || quizFinished || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [activeQuiz, quizFinished])

  // Vaqt tugaganda testni yakunlash
  useEffect(() => {
    if (activeQuizRef.current && !quizFinished && timeLeft === 0) {
      finishQuiz()
    }
  }, [timeLeft, quizFinished, finishQuiz])

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setAnswers([])
    setQuizFinished(false)
    setTimeLeft(quiz.timeLimit * 60)
  }

  const handleAnswer = (answerIndex) => {
    if (showResult) return
    setSelectedAnswer(answerIndex)
    setShowResult(true)
    setAnswers(prev => [...prev, { 
      questionId: activeQuiz.questions[currentQuestion].id, 
      selected: answerIndex, 
      correct: activeQuiz.questions[currentQuestion].correct 
    }])
  }

  const nextQuestion = () => {
    if (currentQuestion < activeQuiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      finishQuiz()
    }
  }

  const finishQuiz = useCallback(() => {
    setQuizFinished(true)
    const currentAnswers = answersRef.current
    const quiz = activeQuizRef.current
    if (!quiz) return
    const correctCount = currentAnswers.filter(a => a.selected === a.correct).length
    const score = Math.round((correctCount / quiz.questions.length) * 100)
    
    const result = {
      quizId: quiz.id,
      title: quiz.title,
      score,
      correctCount,
      totalQuestions: quiz.questions.length,
      date: new Date().toLocaleDateString('uz-UZ')
    }

    setQuizHistory(prev => [...prev, result])

    // Firestore ga saqlash
    if (user) {
      const histRef = collection(db, 'users', user.uid, 'quizResults')
      addDoc(histRef, {
        ...result,
        completedAt: serverTimestamp()
      }).catch(e => console.error('Error saving quiz result:', e))
    }

    addActivity({ title: `"${quiz.title}" testi yakunlandi - ${score}%`, type: score >= 70 ? 'success' : 'info' })
    if (score >= 80) {
      addNotification(`🏆 "${quiz.title}" testida a'lo natija - ${score}%!`)
    }
  }, [user, addActivity, addNotification])

  const resetQuiz = () => {
    setActiveQuiz(null)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setAnswers([])
    setQuizFinished(false)
  }

  const correctAnswers = answers.filter(a => a.selected === a.correct).length
  const totalQuizzesTaken = quizHistory.length
  const avgScore = totalQuizzesTaken > 0 ? Math.round(quizHistory.reduce((s, q) => s + q.score, 0) / totalQuizzesTaken) : 0
  const bestScore = totalQuizzesTaken > 0 ? Math.max(...quizHistory.map(q => q.score)) : 0

  // Quiz playing mode
  if (activeQuiz && !quizFinished) {
    const question = activeQuiz.questions[currentQuestion]
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60

    return (
      <div className="min-h-screen bg-slate-900">
        <Sidebar />
        <main className={`${collapsed ? 'ml-21.25' : 'ml-64'} p-8 transition-all duration-300`}>
          {/* Quiz Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button onClick={resetQuiz} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">{activeQuiz.title}</h1>
                <p className="text-slate-400 text-sm">Savol {currentQuestion + 1} / {activeQuiz.questions.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeLeft < 60 ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-white'}`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono font-bold">{minutes}:{seconds.toString().padStart(2, '0')}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-white font-medium">{correctAnswers}/{answers.length}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700 rounded-full h-2 mb-8">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / activeQuiz.questions.length) * 100}%` }}
            />
          </div>

          {/* Question */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-slate-400 text-sm">Savol {currentQuestion + 1}</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-8">{question.question}</h2>

              <div className="space-y-3">
                {question.options.map((option, index) => {
                  let optionClass = 'bg-slate-700/50 border-slate-600 hover:border-blue-500 hover:bg-slate-700 cursor-pointer'
                  
                  if (showResult) {
                    if (index === question.correct) {
                      optionClass = 'bg-green-500/10 border-green-500 text-green-400'
                    } else if (index === selectedAnswer && index !== question.correct) {
                      optionClass = 'bg-red-500/10 border-red-500 text-red-400'
                    } else {
                      optionClass = 'bg-slate-700/30 border-slate-700 opacity-50'
                    }
                  } else if (selectedAnswer === index) {
                    optionClass = 'bg-blue-500/10 border-blue-500'
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={showResult}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${optionClass}`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        showResult && index === question.correct ? 'bg-green-500 text-white' :
                        showResult && index === selectedAnswer ? 'bg-red-500 text-white' :
                        'bg-slate-600 text-slate-300'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-white text-left flex-1">{option}</span>
                      {showResult && index === question.correct && <CheckCircle className="w-5 h-5 text-green-400" />}
                      {showResult && index === selectedAnswer && index !== question.correct && <XCircle className="w-5 h-5 text-red-400" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Explanation */}
            {showResult && (
              <div className={`p-4 rounded-xl border mb-6 ${
                selectedAnswer === question.correct 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <p className={`font-medium mb-1 ${selectedAnswer === question.correct ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedAnswer === question.correct ? '✅ To\'g\'ri!' : '❌ Noto\'g\'ri!'}
                </p>
                <p className="text-slate-300 text-sm">{question.explanation}</p>
              </div>
            )}

            {showResult && (
              <button
                onClick={nextQuestion}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition font-medium"
              >
                {currentQuestion < activeQuiz.questions.length - 1 ? (
                  <>Keyingi savol <ChevronRight className="w-5 h-5" /></>
                ) : (
                  <>Testni yakunlash <Trophy className="w-5 h-5" /></>
                )}
              </button>
            )}
          </div>
        </main>
      </div>
    )
  }

  // Quiz result screen
  if (activeQuiz && quizFinished) {
    const score = Math.round((correctAnswers / activeQuiz.questions.length) * 100)
    const isPassed = score >= 70

    return (
      <div className="min-h-screen bg-slate-900">
        <Sidebar />
        <main className={`${collapsed ? 'ml-21.25' : 'ml-64'} p-8 transition-all duration-300`}>
          <div className="max-w-2xl mx-auto text-center">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
              isPassed ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              {isPassed ? <Trophy className="w-12 h-12 text-green-400" /> : <Target className="w-12 h-12 text-red-400" />}
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              {isPassed ? "Ajoyib natija! 🎉" : "Yaxshi urinish! 💪"}
            </h1>
            <p className="text-slate-400 mb-8">{activeQuiz.title}</p>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 mb-8">
              <div className={`text-6xl font-bold mb-4 ${isPassed ? 'text-green-400' : 'text-red-400'}`}>
                {score}%
              </div>
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-slate-300">To'g'ri: {correctAnswers}</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-slate-300">Noto'g'ri: {activeQuiz.questions.length - correctAnswers}</span>
                </div>
              </div>
            </div>

            {/* Stars */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className={`w-8 h-8 ${score >= star * 20 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
              ))}
            </div>

            <div className="flex items-center gap-4 justify-center">
              <button
                onClick={() => startQuiz(activeQuiz)}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl transition"
              >
                <RotateCcw className="w-5 h-5" /> Qayta topshirish
              </button>
              <button
                onClick={resetQuiz}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
              >
                Boshqa testlar <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Quiz list (main page)
  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />
      <main className={`${collapsed ? 'ml-21.25' : 'ml-64'} p-8 transition-all duration-300`}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Testlar</h1>
          <p className="text-slate-400">Bilimlaringizni sinab ko'ring va natijalaringizni kuzating</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalQuizzesTaken}</p>
              <p className="text-slate-400 text-sm">Topshirilgan testlar</p>
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{avgScore}%</p>
              <p className="text-slate-400 text-sm">O'rtacha ball</p>
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{bestScore}%</p>
              <p className="text-slate-400 text-sm">Eng yaxshi natija</p>
            </div>
          </div>
        </div>

        {/* Quiz Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {quizData.map(quiz => {
            const history = quizHistory.filter(h => h.quizId === quiz.id)
            const lastScore = history.length > 0 ? history[history.length - 1].score : null

            return (
              <div key={quiz.id} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-slate-600 transition group">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{quiz.emoji}</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${difficultyColor[quiz.difficulty]}`}>
                      {quiz.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{quiz.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{quiz.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Brain className="w-4 h-4" />
                      {quiz.questions.length} savol
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {quiz.timeLimit} daq
                    </div>
                  </div>

                  {lastScore !== null && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex-1 bg-slate-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${lastScore >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${lastScore}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${lastScore >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                        {lastScore}%
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => startQuiz(quiz)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl transition font-medium"
                  >
                    <Play className="w-4 h-4" />
                    {lastScore !== null ? 'Qayta topshirish' : 'Boshlash'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Recent Results */}
        {quizHistory.length > 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">So'nggi natijalar</h2>
            <div className="space-y-3">
              {quizHistory.slice().reverse().slice(0, 5).map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      result.score >= 70 ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {result.score >= 70 ? <CheckCircle className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                    </div>
                    <div>
                      <p className="text-white font-medium">{result.title}</p>
                      <p className="text-slate-400 text-sm">{result.correctCount}/{result.totalQuestions} to'g'ri • {result.date}</p>
                    </div>
                  </div>
                  <span className={`text-lg font-bold ${result.score >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                    {result.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Quizzes
