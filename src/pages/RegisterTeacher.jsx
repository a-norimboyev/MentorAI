import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Mail, Lock, Eye, EyeOff, User, Loader2, ArrowLeft, Briefcase } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const RegisterTeacher = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    password: '',
    confirmPassword: ''
  })
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const validateForm = () => {
    const errors = []
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const nameRegex = /^[a-zA-Za-z\s]{2,}$/
    
    if (!formData.name.trim()) errors.push('Ism kiritish majbur')
    else if (!nameRegex.test(formData.name.trim())) errors.push('Ism kamida 2 ta harf bo\'lishi kerak')
    
    if (!formData.email.trim()) errors.push('Email kiritish majbur')
    else if (!emailRegex.test(formData.email)) errors.push('Email formati noto\'g\'ri')
    
    if (!formData.subject.trim()) errors.push('Fanni tanlash majbur')
    
    if (!formData.password.trim()) errors.push('Parol kiritish majbur')
    else if (formData.password.length < 8) errors.push('Parol kamida 8 ta belgidan iborat bo\'lishi kerak')
    
    if (!formData.confirmPassword.trim()) errors.push('Parolni tasdiqlash majbur')
    else if (formData.password !== formData.confirmPassword) errors.push('Parollar mos kelmaydi')
    
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const errors = validateForm()
    if (errors.length > 0) {
      setError(errors[0])
      return
    }

    setError('')
    setLoading(true)
    
    try {
      await register(formData.email, formData.password, formData.name, 'teacher')
      navigate('/dashboard')
    } catch (err) {
      console.error('Registration error:', err)
      setError(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }
  
  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Bu email allaqachon ro\'yxatdan o\'tgan'
      case 'auth/invalid-email':
        return 'Email formati noto\'g\'ri'
      case 'auth/weak-password':
        return 'Parol juda oddiy'
      case 'auth/invalid-api-key':
        return 'Firebase API kaliti noto\'g\'ri'
      default:
        return `Xatolik: ${code || 'Noma\'lum xatolik'}`
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <GraduationCap className="w-10 h-10 text-blue-500" />
            <span className="text-2xl font-bold text-white">MentorAI</span>
          </Link>
        </div>

        {/* Register Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          {/* Back button */}
          <Link 
            to="/register" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Orqaga</span>
          </Link>

          {/* Header with icon */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-green-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Ustoz</h1>
              <p className="text-slate-400">Yangi hisob yarating</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                To'liq ism
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                  placeholder="Ismingiz"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Fan yo'nalishi
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                  placeholder="Masalan: Matematika, Dasturlash"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Parol
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-12 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                  placeholder="Kamida 8 ta belgi"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Parolni tasdiqlang
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-12 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                  placeholder="Parolni qayta kiriting"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Kutilmoqda...
                </>
              ) : (
                "Ro'yxatdan o'tish"
              )}
            </button>
          </form>

          <p className="text-center text-slate-400 mt-6">
            Hisobingiz bormi?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium">
              Kirish
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterTeacher
