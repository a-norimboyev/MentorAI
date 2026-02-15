import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  GraduationCap, Clock, Globe2, BookOpen, User, Wrench,
  Loader2, ArrowLeft, ArrowRight, CheckCircle2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// Har bir sub-field uchun texnologiyalar
const techOptions = {
  // Web - Frontend
  frontend: [
    { id: 'html', name: 'HTML', emoji: '🌐', desc: 'Web sahifalar tuzilmasi va asosi' },
    { id: 'css', name: 'CSS', emoji: '🎨', desc: 'Dizayn va stillar berish' },
    { id: 'javascript', name: 'JavaScript', emoji: '⚡', desc: 'Saytga interaktivlik qo\'shish' },
    { id: 'typescript', name: 'TypeScript', emoji: '🔷', desc: 'JavaScript + tip xavfsizligi' },
    { id: 'react', name: 'React.js', emoji: '⚛️', desc: 'Komponentli UI kutubxonasi' },
    { id: 'vue', name: 'Vue.js', emoji: '💚', desc: 'Yengil va tez UI framework' },
    { id: 'angular', name: 'Angular', emoji: '🅰️', desc: 'Google tomonidan qo\'llab-quvvatlanadi' },
    { id: 'nextjs', name: 'Next.js', emoji: '▲', desc: 'React asosidagi fullstack framework' },
    { id: 'svelte', name: 'Svelte', emoji: '🔥', desc: 'Kompilyatsiya qilinadigan UI framework' },
    { id: 'tailwind', name: 'Tailwind CSS', emoji: '💨', desc: 'Utility-first CSS framework' },
    { id: 'bootstrap', name: 'Bootstrap', emoji: '🟪', desc: 'Tayyor UI komponentlar to\'plami' },
    { id: 'sass', name: 'Sass/SCSS', emoji: '💅', desc: 'CSS preprocessor - kengaytirilgan stillar' },
    { id: 'git', name: 'Git & GitHub', emoji: '🐙', desc: 'Versiya nazorati va hamkorlik' },
    { id: 'figma-fe', name: 'Figma (asoslar)', emoji: '🖌', desc: 'Dizaynni tushunish va ishlash' },
  ],
  // Web - Backend
  backend: [
    { id: 'nodejs', name: 'Node.js', emoji: '🟩', desc: 'JavaScript bilan server yaratish' },
    { id: 'python', name: 'Python (Django/Flask)', emoji: '🐍', desc: 'Tez va qulay backend framework' },
    { id: 'java', name: 'Java (Spring)', emoji: '☕', desc: 'Korporativ darajadagi backend' },
    { id: 'php', name: 'PHP (Laravel)', emoji: '🐘', desc: 'Web uchun mashhur server tili' },
    { id: 'golang', name: 'Go', emoji: '🔵', desc: 'Tez va samarali server dasturlash' },
    { id: 'csharp', name: 'C# (.NET)', emoji: '🟣', desc: 'Microsoft ekotizimi backend' },
  ],
  // Web - Fullstack
  fullstack: [
    { id: 'mern', name: 'MERN Stack', emoji: '🟢', desc: 'MongoDB + Express + React + Node' },
    { id: 'mevn', name: 'MEVN Stack', emoji: '💚', desc: 'MongoDB + Express + Vue + Node' },
    { id: 'mean', name: 'MEAN Stack', emoji: '🅰️', desc: 'MongoDB + Express + Angular + Node' },
    { id: 'nextjs-full', name: 'Next.js Full Stack', emoji: '▲', desc: 'React asosida frontend + backend' },
    { id: 'django-full', name: 'Django Full Stack', emoji: '🐍', desc: 'Python bilan to\'liq web ilova' },
    { id: 'laravel-full', name: 'Laravel Full Stack', emoji: '🐘', desc: 'PHP bilan to\'liq web ilova' },
  ],
  // Mobile
  android: [
    { id: 'kotlin', name: 'Kotlin', emoji: '🟣', desc: 'Zamonaviy Android dasturlash tili' },
    { id: 'java-android', name: 'Java', emoji: '☕', desc: 'Klassik Android dasturlash' },
    { id: 'jetpack', name: 'Jetpack Compose', emoji: '🎨', desc: 'Deklarativ UI yaratish' },
  ],
  ios: [
    { id: 'swift', name: 'Swift', emoji: '🍎', desc: 'Apple qurilmalari uchun til' },
    { id: 'swiftui', name: 'SwiftUI', emoji: '🎨', desc: 'Zamonaviy deklarativ iOS UI' },
    { id: 'uikit', name: 'UIKit', emoji: '📱', desc: 'Klassik iOS interfeys yaratish' },
  ],
  'cross-platform': [
    { id: 'flutter', name: 'Flutter (Dart)', emoji: '💙', desc: 'Android va iOS uchun bitta kod' },
    { id: 'react-native', name: 'React Native', emoji: '⚛️', desc: 'React bilan mobil ilova yaratish' },
    { id: 'kotlin-multi', name: 'Kotlin Multiplatform', emoji: '🟣', desc: 'Kotlin bilan kross-platforma' },
  ],
  // AI & Data
  'ai-ml': [
    { id: 'tensorflow', name: 'TensorFlow', emoji: '🧠', desc: 'Google ning ML kutubxonasi' },
    { id: 'pytorch', name: 'PyTorch', emoji: '🔥', desc: 'Ilmiy tadqiqotlar uchun ML' },
    { id: 'scikit', name: 'Scikit-learn', emoji: '📊', desc: 'Klassik ML algoritmlari' },
    { id: 'opencv', name: 'OpenCV', emoji: '👁', desc: 'Kompyuter ko\'rish texnologiyasi' },
  ],
  'data-science': [
    { id: 'pandas', name: 'Pandas', emoji: '🐼', desc: 'Ma\'lumotlarni tahlil qilish' },
    { id: 'numpy', name: 'NumPy', emoji: '🔢', desc: 'Raqamli hisoblash kutubxonasi' },
    { id: 'jupyter', name: 'Jupyter Notebook', emoji: '📓', desc: 'Interaktiv kod va tahlil' },
    { id: 'sql-ds', name: 'SQL', emoji: '🗄', desc: 'Ma\'lumotlar bazasi so\'rovlari' },
  ],
  'data-analytics': [
    { id: 'excel', name: 'Excel / Google Sheets', emoji: '📊', desc: 'Jadval va hisobotlar tayyorlash' },
    { id: 'powerbi', name: 'Power BI', emoji: '📈', desc: 'Microsoft vizualizatsiya vositasi' },
    { id: 'tableau', name: 'Tableau', emoji: '📉', desc: 'Ma\'lumotlarni vizualizatsiya qilish' },
    { id: 'sql-da', name: 'SQL', emoji: '🗄', desc: 'Ma\'lumotlar bazasi so\'rovlari' },
  ],
  // Desktop
  'desktop-dev': [
    { id: 'csharp-wpf', name: 'C# (WPF)', emoji: '🟣', desc: 'Windows uchun desktop ilovalar' },
    { id: 'java-desktop', name: 'Java (JavaFX)', emoji: '☕', desc: 'Kross-platforma desktop ilovalar' },
    { id: 'cpp-qt', name: 'C++ (Qt)', emoji: '🔵', desc: 'Yuqori samarali desktop ilovalar' },
    { id: 'electron', name: 'Electron', emoji: '⚡', desc: 'Web texnologiyalar bilan desktop' },
  ],
  // Game
  unity: [
    { id: 'unity-2d', name: 'Unity 2D', emoji: '🎮', desc: '2D o\'yinlar yaratish' },
    { id: 'unity-3d', name: 'Unity 3D', emoji: '🌍', desc: '3D o\'yinlar va simulyatsiyalar' },
    { id: 'unity-vr', name: 'Unity VR/AR', emoji: '🥽', desc: 'Virtual va kengaytirilgan reallik' },
  ],
  unreal: [
    { id: 'unreal-bp', name: 'Blueprints', emoji: '🧩', desc: 'Vizual skriptlash tizimi' },
    { id: 'unreal-cpp', name: 'C++', emoji: '⚙️', desc: 'Yuqori samarali o\'yin dasturlash' },
  ],
  // QA
  'manual-testing': [
    { id: 'functional', name: 'Functional Testing', emoji: '✅', desc: 'Funksional test o\'tkazish' },
    { id: 'regression', name: 'Regression Testing', emoji: '🔄', desc: 'O\'zgarishlardan keyin qayta test' },
    { id: 'api-testing', name: 'API Testing (Postman)', emoji: '📮', desc: 'API so\'rovlarni sinash' },
  ],
  'automation-testing': [
    { id: 'selenium', name: 'Selenium', emoji: '🤖', desc: 'Brauzer avtomatik test' },
    { id: 'cypress', name: 'Cypress', emoji: '🌲', desc: 'Zamonaviy frontend testlash' },
    { id: 'playwright', name: 'Playwright', emoji: '🎭', desc: 'Microsoft ning test vositasi' },
    { id: 'appium', name: 'Appium', emoji: '📱', desc: 'Mobil ilovalarni avtomatik test' },
  ],
  // UI/UX
  'ui-design': [
    { id: 'figma', name: 'Figma', emoji: '🎨', desc: 'Zamonaviy dizayn vositasi' },
    { id: 'adobe-xd', name: 'Adobe XD', emoji: '🖌', desc: 'Adobe ning UI dizayn dasturi' },
    { id: 'sketch', name: 'Sketch', emoji: '✏️', desc: 'macOS uchun dizayn vositasi' },
  ],
  'ux-design': [
    { id: 'figma-ux', name: 'Figma', emoji: '🎨', desc: 'Prototip va dizayn yaratish' },
    { id: 'user-research', name: 'User Research', emoji: '🔍', desc: 'Foydalanuvchi ehtiyojlarini o\'rganish' },
    { id: 'prototyping', name: 'Prototyping', emoji: '📐', desc: 'Interaktiv prototiplar yaratish' },
  ],
}

const steps = [
  { id: 'hours', title: "Kuniga necha soat o'qiysiz?", icon: Clock, emoji: '⏰' },
  { id: 'english', title: 'Ingliz tili darajangiz?', icon: Globe2, emoji: '🇬🇧' },
  { id: 'experience', title: "Oldin o'qiganmisiz?", icon: BookOpen, emoji: '📚' },
  { id: 'age', title: 'Yoshingiz nechada?', icon: User, emoji: '👤' },
  { id: 'tech', title: 'Qaysi texnologiyani o\'rganasiz?', icon: Wrench, emoji: '🛠' },
]

const hourOptions = [
  { id: '1-2', label: '1-2 soat', desc: 'Kunlik oddiy mashg\'ul', emoji: '🕐' },
  { id: '2-4', label: '2-4 soat', desc: 'O\'rtacha jadval', emoji: '🕑' },
  { id: '4-6', label: '4-6 soat', desc: 'Jiddiy o\'rganish', emoji: '🕓' },
  { id: '6+', label: '6+ soat', desc: 'To\'liq vaqtli', emoji: '🔥' },
]

const englishOptions = [
  { id: 'a1', label: 'A1 — Beginner', desc: "Ingliz tilini endigina boshlayman", emoji: '🌱' },
  { id: 'a2', label: 'A2 — Elementary', desc: "Oddiy so'zlar va iboralarni tushunaman", emoji: '📗' },
  { id: 'b1', label: 'B1 — Intermediate', desc: "Texnik hujjatlarni qisman o'qiy olaman", emoji: '📘' },
  { id: 'b2', label: 'B2 — Upper Intermediate', desc: "Texnik dokumentatsiyani erkin o'qiyman", emoji: '📙' },
  { id: 'c1', label: 'C1 — Advanced', desc: "Ingliz tilida erkin muloqot qilaman", emoji: '📕' },
  { id: 'c2', label: 'C2 — Proficient', desc: "Ona tilidek bilaman", emoji: '🏆' },
]

const experienceOptions = [
  { id: 'no', label: "Yo'q", desc: "Umuman o'qimaganman", emoji: '🆕' },
  { id: 'little', label: 'Biroz', desc: "Ozgina bilaman, video ko'rganman", emoji: '📖' },
  { id: 'yes', label: 'Ha', desc: "Oldin o'qiganman va tajribam bor", emoji: '✅' },
  { id: 'working', label: 'Ishlayman', desc: 'Hozir shu sohada ishlayman', emoji: '💼' },
]

const ageOptions = [
  { id: '14-17', label: '14-17 yosh', emoji: '🎒' },
  { id: '18-24', label: '18-24 yosh', emoji: '🎓' },
  { id: '25-34', label: '25-34 yosh', emoji: '💼' },
  { id: '35+', label: '35+ yosh', emoji: '🌟' },
]

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({
    hours: null,
    english: null,
    experience: null,
    age: null,
    tech: [],
  })
  const [loading, setLoading] = useState(false)
  const { updateUserProfile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // SelectField dan kelgan ma'lumotlar
  const { field, fieldName, category, categoryName } = location.state || {}

  // Agar state yo'q bo'lsa select-field ga qaytarish
  useEffect(() => {
    if (!field || !category) {
      navigate('/select-field', { replace: true })
    }
  }, [field, category, navigate])

  const currentStepData = steps[currentStep]
  const totalSteps = steps.length

  // Tajribasi yo'q bo'lsa texnologiya tanlash kerak emas
  const shouldSkipTech = answers.experience === 'no'

  const effectiveTotal = shouldSkipTech ? totalSteps - 1 : totalSteps
  const progress = ((currentStep + 1) / effectiveTotal) * 100

  const getTechsForField = () => {
    return techOptions[field] || []
  }

  const handleSelect = (stepId, value) => {
    if (stepId === 'tech') {
      // Multi-select for technologies
      setAnswers(prev => {
        const techs = prev.tech.includes(value)
          ? prev.tech.filter(t => t !== value)
          : [...prev.tech, value]
        return { ...prev, tech: techs }
      })
    } else {
      setAnswers(prev => ({ ...prev, [stepId]: value }))
    }
  }

  const canGoNext = () => {
    const stepId = steps[currentStep].id
    if (stepId === 'tech') return answers.tech.length > 0
    return answers[stepId] !== null
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1
      // Agar tajribasi yo'q bo'lsa va keyingi step tech bo'lsa — o'tkazib yubor
      if (shouldSkipTech && steps[nextStep]?.id === 'tech') {
        handleFinish()
        return
      }
      setCurrentStep(nextStep)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleFinish = async () => {
    setLoading(true)
    try {
      await updateUserProfile({
        field,
        fieldName,
        category,
        categoryName,
        dailyHours: answers.hours,
        englishLevel: answers.english,
        experience: answers.experience,
        ageRange: answers.age,
        technologies: answers.tech,
        onboardingCompleted: true,
      })
      navigate('/roadmap', {
        state: { field, fieldName, category, categoryName }
      })
    } catch (err) {
      console.error('Error saving onboarding:', err)
    } finally {
      setLoading(false)
    }
  }

  const renderOptions = () => {
    const stepId = currentStepData.id

    if (stepId === 'hours') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {hourOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => handleSelect('hours', opt.id)}
              className={`p-5 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.02] ${
                answers.hours === opt.id
                  ? 'bg-blue-500/10 border-blue-500/50 ring-2 ring-offset-2 ring-offset-slate-900 ring-blue-500/30'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{opt.emoji}</span>
                <div>
                  <p className={`font-semibold ${answers.hours === opt.id ? 'text-blue-400' : 'text-white'}`}>{opt.label}</p>
                  <p className="text-slate-400 text-sm">{opt.desc}</p>
                </div>
                {answers.hours === opt.id && <CheckCircle2 className="w-5 h-5 text-blue-400 ml-auto" />}
              </div>
            </button>
          ))}
        </div>
      )
    }

    if (stepId === 'english') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {englishOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => handleSelect('english', opt.id)}
              className={`p-5 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.02] ${
                answers.english === opt.id
                  ? 'bg-indigo-500/10 border-indigo-500/50 ring-2 ring-offset-2 ring-offset-slate-900 ring-indigo-500/30'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{opt.emoji}</span>
                <div>
                  <p className={`font-semibold ${answers.english === opt.id ? 'text-indigo-400' : 'text-white'}`}>{opt.label}</p>
                  <p className="text-slate-400 text-sm">{opt.desc}</p>
                </div>
                {answers.english === opt.id && <CheckCircle2 className="w-5 h-5 text-indigo-400 ml-auto" />}
              </div>
            </button>
          ))}
        </div>
      )
    }

    if (stepId === 'experience') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {experienceOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => handleSelect('experience', opt.id)}
              className={`p-5 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.02] ${
                answers.experience === opt.id
                  ? 'bg-green-500/10 border-green-500/50 ring-2 ring-offset-2 ring-offset-slate-900 ring-green-500/30'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{opt.emoji}</span>
                <div>
                  <p className={`font-semibold ${answers.experience === opt.id ? 'text-green-400' : 'text-white'}`}>{opt.label}</p>
                  <p className="text-slate-400 text-sm">{opt.desc}</p>
                </div>
                {answers.experience === opt.id && <CheckCircle2 className="w-5 h-5 text-green-400 ml-auto" />}
              </div>
            </button>
          ))}
        </div>
      )
    }

    if (stepId === 'age') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {ageOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => handleSelect('age', opt.id)}
              className={`p-6 rounded-xl border-2 text-center transition-all duration-200 hover:scale-[1.02] ${
                answers.age === opt.id
                  ? 'bg-amber-500/10 border-amber-500/50 ring-2 ring-offset-2 ring-offset-slate-900 ring-amber-500/30'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
              }`}
            >
              <span className="text-3xl block mb-2">{opt.emoji}</span>
              <p className={`font-semibold ${answers.age === opt.id ? 'text-amber-400' : 'text-white'}`}>{opt.label}</p>
              {answers.age === opt.id && <CheckCircle2 className="w-5 h-5 text-amber-400 mx-auto mt-2" />}
            </button>
          ))}
        </div>
      )
    }

    if (stepId === 'tech') {
      const techs = getTechsForField()
      return (
        <div className="space-y-4">
          <p className="text-slate-400 text-sm text-center mb-2">Bir yoki bir nechta tanlashingiz mumkin</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techs.map(tech => {
              const isSelected = answers.tech.includes(tech.id)
              return (
                <button
                  key={tech.id}
                  onClick={() => handleSelect('tech', tech.id)}
                  className={`p-5 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.02] ${
                    isSelected
                      ? 'bg-purple-500/10 border-purple-500/50 ring-2 ring-offset-2 ring-offset-slate-900 ring-purple-500/30'
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tech.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold ${isSelected ? 'text-purple-400' : 'text-white'}`}>{tech.name}</p>
                      {tech.desc && <p className="text-xs text-slate-400 mt-0.5">{tech.desc}</p>}
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )
    }
  }

  // Agar tech o'tkazib yuboriladigan bo'lsa age oxirgi step bo'ladi
  const isLastStep = shouldSkipTech 
    ? steps[currentStep]?.id === 'age' 
    : currentStep === totalSteps - 1

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <GraduationCap className="w-10 h-10 text-blue-500" />
            <span className="text-2xl font-bold text-white">MentorAI</span>
          </div>
          {fieldName && (
            <p className="text-slate-400 text-sm">
              {categoryName} → <span className="text-white font-medium">{fieldName}</span>
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>{currentStep + 1} / {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-linear-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <span className="text-4xl block mb-4">{currentStepData.emoji}</span>
            <h2 className="text-2xl font-bold text-white">{currentStepData.title}</h2>
          </div>

          {renderOptions()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition ${
              currentStep === 0
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Orqaga
          </button>

          {isLastStep ? (
            <button
              onClick={handleFinish}
              disabled={!canGoNext() || loading}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition ${
                canGoNext()
                  ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Kutilmoqda...
                </>
              ) : (
                <>
                  Boshlash 🚀
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canGoNext()}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition ${
                canGoNext()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              Keyingi
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Onboarding
