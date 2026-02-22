import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  GraduationCap, Clock, Globe2, BookOpen, User, Wrench,
  Loader2, ArrowLeft, ArrowRight, CheckCircle2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

import { techOptions, hourOptions, englishOptions, experienceOptions, ageOptions } from '../data/onboardingOptions'

const steps = [
  { id: 'hours', title: "Kuniga necha soat o'qiysiz?", icon: Clock, emoji: '⏰' },
  { id: 'english', title: 'Ingliz tili darajangiz?', icon: Globe2, emoji: '🇬🇧' },
  { id: 'experience', title: "Oldin o'qiganmisiz?", icon: BookOpen, emoji: '📚' },
  { id: 'age', title: 'Yoshingiz nechada?', icon: User, emoji: '👤' },
  { id: 'tech', title: 'Qaysi texnologiyani o\'rganasiz?', icon: Wrench, emoji: '🛠' },
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

  const validateAnswers = () => {
    const errors = []
    if (!answers.age) errors.push('Yosh oralig\'ini tanlang')
    if (!answers.hours) errors.push('Kunlik soatlarni tanlang')
    if (!answers.english) errors.push('English darajasini tanlang')
    if (!answers.experience) errors.push('Tajribani tanlang')
    if (!shouldSkipTech && (!answers.tech || answers.tech.length === 0)) errors.push('Texnologiyani tanlang')
    return errors
  }

  const handleFinish = async () => {
    const errors = validateAnswers()
    if (errors.length > 0) {
      toast.error('Iltimos, barcha so\'rovlarga javob bering:\n' + errors.join('\n'))
      return
    }

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
        selectedTech: answers.tech[0] || null, // Birinchi texnologiya asosiy
        onboardingCompleted: true,
      })
      navigate('/dashboard')
    } catch (err) {
      console.error('Error saving onboarding:', err)
      toast.error('Profil saqlashda xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.')
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
