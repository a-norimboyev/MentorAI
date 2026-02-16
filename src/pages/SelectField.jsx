import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  GraduationCap, Globe, Monitor, Smartphone, Brain, 
  PenTool, Gamepad2, FlaskConical, ChevronRight, 
  ArrowLeft, CheckCircle2
} from 'lucide-react'

const categories = [
  {
    id: 'web',
    name: 'Web Dasturlash',
    emoji: '💻',
    icon: Globe,
    color: 'from-cyan-500 to-blue-600',
    shadow: 'shadow-cyan-500/30',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    subFields: [
      { id: 'frontend', name: 'Frontend Development', emoji: '🌐', desc: 'HTML, CSS, JavaScript, React, Vue' },
      { id: 'backend', name: 'Backend Development', emoji: '⚙️', desc: 'Python, Node.js, Java, PHP' },
      { id: 'fullstack', name: 'Full Stack Development', emoji: '🔗', desc: 'Frontend + Backend birga' },
    ]
  },
  {
    id: 'mobile',
    name: 'Mobile Dasturlash',
    emoji: '📱',
    icon: Smartphone,
    color: 'from-green-500 to-emerald-600',
    shadow: 'shadow-green-500/30',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
    subFields: [
      { id: 'android', name: 'Android Development', emoji: '🤖', desc: 'Kotlin, Java' },
      { id: 'ios', name: 'iOS Development', emoji: '🍎', desc: 'Swift' },
      { id: 'cross-platform', name: 'Cross-platform', emoji: '🔄', desc: 'Flutter, React Native' },
    ]
  },
  {
    id: 'ai-data',
    name: "Sun'iy Intellekt va Data",
    emoji: '🤖',
    icon: Brain,
    color: 'from-purple-500 to-violet-600',
    shadow: 'shadow-purple-500/30',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    subFields: [
      { id: 'ai-ml', name: 'AI / Machine Learning', emoji: '🧠', desc: 'Machine Learning, Deep Learning' },
      { id: 'data-science', name: 'Data Science', emoji: '📊', desc: "Ma'lumotlarni tahlil qilish" },
      { id: 'data-analytics', name: 'Data Analytics', emoji: '📈', desc: 'Biznes uchun analiz' },
    ]
  },
  {
    id: 'desktop',
    name: 'Desktop Dasturlash',
    emoji: '🖥',
    icon: Monitor,
    color: 'from-slate-400 to-slate-600',
    shadow: 'shadow-slate-400/30',
    bg: 'bg-slate-400/10',
    border: 'border-slate-400/30',
    text: 'text-slate-300',
    subFields: [
      { id: 'desktop-dev', name: 'Desktop Development', emoji: '💻', desc: 'C#, Java, C++ — Windows, Mac dasturlari' },
    ]
  },
  {
    id: 'game',
    name: 'Game Development',
    emoji: '🎮',
    icon: Gamepad2,
    color: 'from-red-500 to-orange-600',
    shadow: 'shadow-red-500/30',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    subFields: [
      { id: 'unity', name: 'Unity', emoji: '🎯', desc: "C# bilan o'yin yaratish" },
      { id: 'unreal', name: 'Unreal Engine', emoji: '🚀', desc: "C++ bilan o'yin yaratish" },
    ]
  },
  {
    id: 'qa',
    name: 'QA / Software Testing',
    emoji: '🧪',
    icon: FlaskConical,
    color: 'from-amber-500 to-yellow-600',
    shadow: 'shadow-amber-500/30',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    subFields: [
      { id: 'manual-testing', name: 'Manual Testing', emoji: '🔍', desc: "Qo'lda testlash" },
      { id: 'automation-testing', name: 'Automation Testing', emoji: '⚡', desc: 'Avtomatlashtirilgan testlash' },
    ]
  },
  {
    id: 'ui-ux',
    name: 'UI/UX Design',
    emoji: '🎨',
    icon: PenTool,
    color: 'from-pink-500 to-rose-600',
    shadow: 'shadow-pink-500/30',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    text: 'text-pink-400',
    subFields: [
      { id: 'ui-design', name: 'UI Design', emoji: '🖌', desc: 'Figma, interfeys dizayni' },
      { id: 'ux-design', name: 'UX Design', emoji: '🧩', desc: 'Dizayn tizimlari, foydalanuvchi tajribasi' },
    ]
  },
]

const SelectField = () => {
  const [step, setStep] = useState('category')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubField, setSelectedSubField] = useState(null)
  const navigate = useNavigate()

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setSelectedSubField(null)
    if (category.subFields.length === 1) {
      setSelectedSubField(category.subFields[0])
    }
    setStep('subfield')
  }

  const handleBack = () => {
    setStep('category')
    setSelectedCategory(null)
    setSelectedSubField(null)
  }

  const handleContinue = async () => {
    if (!selectedCategory || !selectedSubField) return
    navigate('/onboarding', {
      state: {
        field: selectedSubField.id,
        fieldName: selectedSubField.name,
        category: selectedCategory.id,
        categoryName: selectedCategory.name,
      }
    })
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <GraduationCap className="w-10 h-10 text-blue-500" />
            <span className="text-2xl font-bold text-white">MentorAI</span>
          </div>
          
          {step === 'category' ? (
            <>
              <h1 className="text-3xl font-bold text-white mb-3">Qaysi yo'nalishni tanlaysiz?</h1>
              <p className="text-slate-400 text-lg">O'zingizga mos sohani tanlang</p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-white mb-3">
                {selectedCategory?.emoji} {selectedCategory?.name}
              </h1>
              <p className="text-slate-400 text-lg">Aniq yo'nalishni tanlang</p>
            </>
          )}
        </div>

        {/* Step 1: Category Selection */}
        {step === 'category' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat)}
                  className="relative p-6 rounded-xl border-2 bg-slate-800/50 border-slate-700 hover:border-slate-500 transition-all duration-200 text-left group hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <div className={`absolute inset-0 w-14 h-14 rounded-2xl bg-linear-to-br ${cat.color} blur-md opacity-40 group-hover:opacity-60 transition-opacity`} />
                      <div className={`relative w-14 h-14 rounded-2xl bg-linear-to-br ${cat.color} flex items-center justify-center shadow-xl ${cat.shadow} ring-1 ring-white/10`}>
                        <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-white/20 to-transparent" />
                        <Icon className="relative w-7 h-7 text-white drop-shadow-lg" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white text-[15px]">{cat.name}</h3>
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {cat.subFields.map(s => s.name).join(' · ')}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition shrink-0 mt-1" />
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Step 2: Sub-field Selection */}
        {step === 'subfield' && selectedCategory && (
          <>
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Orqaga</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {selectedCategory.subFields.map((sub) => {
                const isSelected = selectedSubField?.id === sub.id
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubField(sub)}
                    className={`relative p-6 rounded-xl border-2 transition-all duration-200 text-left group hover:scale-[1.02] ${
                      isSelected
                        ? `${selectedCategory.bg} ${selectedCategory.border} ring-2 ring-offset-2 ring-offset-slate-900`
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle2 className={`absolute top-3 right-3 w-5 h-5 ${selectedCategory.text}`} />
                    )}
                    <div className="text-2xl mb-3">{sub.emoji}</div>
                    <h3 className={`font-semibold mb-2 ${isSelected ? selectedCategory.text : 'text-white'}`}>
                      {sub.name}
                    </h3>
                    <p className="text-slate-400 text-sm">{sub.desc}</p>
                  </button>
                )
              })}
            </div>

            {/* Continue Button */}
            <div className="flex justify-center">
              <button
                onClick={handleContinue}
                disabled={!selectedSubField}
                className={`px-10 py-4 rounded-xl font-medium text-lg transition-all duration-200 flex items-center gap-3 ${
                  selectedSubField
                    ? `bg-linear-to-r ${selectedCategory.color} text-white hover:shadow-lg hover:scale-105`
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                {selectedSubField ? `${selectedSubField.name} — Davom etish` : "Yo'nalishni tanlang"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SelectField
