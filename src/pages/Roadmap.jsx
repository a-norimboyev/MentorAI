import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { GraduationCap, CheckCircle2, Lock, ChevronRight, ChevronDown, ArrowRight, BookOpen, Target, Lightbulb, ExternalLink } from 'lucide-react'
import { roadmaps } from '../data/roadmaps'

const Roadmap = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { field, fieldName, categoryName } = location.state || {}
  const [expandedStep, setExpandedStep] = useState(null)

  const roadmap = roadmaps[field] || roadmaps.frontend

  const totalWeeks = roadmap.reduce((sum, step) => {
    const match = step.duration.match(/(\d+)/)
    return sum + (match ? parseInt(match[1]) : 2)
  }, 0)

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <GraduationCap className="w-10 h-10 text-blue-500" />
            <span className="text-2xl font-bold text-white">MentorAI</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            📍 {fieldName || 'Frontend'} — O'rganish yo'li
          </h1>
          <p className="text-slate-400">
            {categoryName && <span>{categoryName} → </span>}
            Taxminan <span className="text-white font-medium">{totalWeeks}+ hafta</span> davomida o'rganing
          </p>
        </div>

        {/* Roadmap Steps */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-700"></div>

          <div className="space-y-4">
            {roadmap.map((step, index) => {
              const isExpanded = expandedStep === step.id
              const isFirst = index === 0

              return (
                <div key={step.id} className="relative pl-20">
                  {/* Step Number */}
                  <div className={`absolute left-4 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
                    isFirst 
                      ? 'bg-linear-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30' 
                      : 'bg-slate-700 text-slate-300 border-2 border-slate-600'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Card */}
                  <button
                    onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 ${
                      isExpanded
                        ? 'bg-slate-800 border-slate-600 shadow-xl'
                        : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${step.color} flex items-center justify-center shrink-0`}>
                        <span className="text-xl">{step.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                          {isFirst && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Boshlang</span>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm">{step.desc}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-slate-500 text-xs">{step.duration}</p>
                        <ChevronRight className={`w-5 h-5 text-slate-500 mt-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-700 space-y-4">
                        {/* About */}
                        {step.details?.about && (
                          <div className="flex gap-3">
                            <BookOpen className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-blue-400 mb-1">Bu nima?</p>
                              <p className="text-slate-300 text-sm leading-relaxed">{step.details.about}</p>
                            </div>
                          </div>
                        )}

                        {/* Why */}
                        {step.details?.why && (
                          <div className="flex gap-3">
                            <Target className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-green-400 mb-1">Nega kerak?</p>
                              <p className="text-slate-300 text-sm leading-relaxed">{step.details.why}</p>
                            </div>
                          </div>
                        )}

                        {/* Topics */}
                        <div>
                          <p className="text-slate-400 text-sm mb-2">O'rganiladigan mavzular:</p>
                          <div className="flex flex-wrap gap-2">
                            {step.topics.map((topic, i) => (
                              <span
                                key={i}
                                className="px-3 py-1.5 bg-slate-700/50 text-slate-300 text-sm rounded-lg border border-slate-600/50"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Resources */}
                        {step.details?.resources && (
                          <div className="flex gap-3">
                            <ExternalLink className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-purple-400 mb-1">Foydali manbalar:</p>
                              <ul className="space-y-1">
                                {step.details.resources.map((res, i) => (
                                  <li key={i} className="text-slate-300 text-sm flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60 shrink-0"></span>
                                    {res}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Tips */}
                        {step.details?.tips && (
                          <div className="flex gap-3 bg-amber-500/5 rounded-lg p-3 border border-amber-500/10">
                            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-amber-400 mb-1">Maslahat</p>
                              <p className="text-slate-300 text-sm leading-relaxed">{step.details.tips}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Finish Line */}
          <div className="relative pl-20 mt-4">
            <div className="absolute left-4 w-9 h-9 rounded-full bg-linear-to-r from-yellow-500 to-amber-500 flex items-center justify-center z-10 shadow-lg shadow-yellow-500/30">
              🏆
            </div>
            <div className="p-5 rounded-xl bg-linear-to-r from-yellow-500/10 to-amber-500/10 border-2 border-yellow-500/30">
              <h3 className="text-lg font-semibold text-yellow-400">Tabriklaymiz!</h3>
              <p className="text-slate-400 text-sm">
                Barcha bosqichlarni tamomlab, {fieldName || 'Frontend'} bo'yicha professional bo'ling!
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate('/course', { state: { field, fieldName, category, categoryName } })}
            className="flex items-center gap-3 px-10 py-4 rounded-xl font-medium text-lg bg-linear-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Kursni boshlash
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Roadmap
