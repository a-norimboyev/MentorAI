import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Mail, Lock, Eye, EyeOff, User, CheckCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState('student')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Parollarni tekshirish
    if (formData.password !== formData.confirmPassword) {
      setError('Parollar mos kelmaydi')
      return
    }
    
    if (formData.password.length < 8) {
      setError('Parol kamida 8 ta belgidan iborat bolishi kerak')
      return
    }
    
    setLoading(true)
    
    try {
      await register(formData.email, formData.password, formData.name, userType)
      navigate('/dashboard')
    } catch (err) {
      console.error('Registration error:', err) // Xatolikni ko'rish uchun
      setError(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }
  
  const getErrorMessage = (code) => {
    console.log('Error code:', code) // Xatolik kodini ko'rish
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Bu email allaqachon royxatdan otgan'
      case 'auth/invalid-email':
        return 'Email formati notogri'
      case 'auth/weak-password':
        return 'Parol juda oddiy'
      case 'auth/invalid-api-key':
        return 'Firebase API kaliti noto\'g\'ri. .env faylini tekshiring'
      case 'auth/network-request-failed':
        return 'Internet ulanishida xatolik'
      case 'auth/configuration-not-found':
        return 'Firebase sozlanmagan. .env faylini yarating'
      default:
        return `Xatolik: ${code || 'Firebase sozlanmagan. Console ni tekshiring'}`
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
          <h1 className="text-2xl font-bold text-white text-center mb-2">Ro'yxatdan o'tish</h1>
          <p className="text-slate-400 text-center mb-8">Yangi hisob yarating</p>

          {/* User Type Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setUserType('student')}
              className={`p-4 rounded-xl border-2 transition ${
                userType === 'student' 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              <div className="text-center">
                <User className={`w-8 h-8 mx-auto mb-2 ${userType === 'student' ? 'text-blue-500' : 'text-slate-400'}`} />
                <span className={`font-medium ${userType === 'student' ? 'text-white' : 'text-slate-400'}`}>
                  O'quvchi
                </span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setUserType('teacher')}
              className={`p-4 rounded-xl border-2 transition ${
                userType === 'teacher' 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              <div className="text-center">
                <GraduationCap className={`w-8 h-8 mx-auto mb-2 ${userType === 'teacher' ? 'text-blue-500' : 'text-slate-400'}`} />
                <span className={`font-medium ${userType === 'teacher' ? 'text-white' : 'text-slate-400'}`}>
                  Ustoz
                </span>
              </div>
            </button>
          </div>

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
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
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
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                  placeholder="Parolni qayta kiriting"
                  required
                />
                {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Ro'yxatdan o'tish"}
            </button>
          </form>

          {/* Terms */}
          <p className="text-xs text-slate-400 text-center mt-6">
            Ro'yxatdan o'tish orqali siz bizning{' '}
            <a href="#" className="text-blue-400 hover:underline">Foydalanish shartlari</a> va{' '}
            <a href="#" className="text-blue-400 hover:underline">Maxfiylik siyosati</a>ga rozilik bildirasiz.
          </p>

          {/* Login Link */}
          <p className="text-center text-slate-400 mt-6">
            Hisobingiz bormi?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 transition font-medium">
              Kirish
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
