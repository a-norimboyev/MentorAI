import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../config/firebase'
import toast from 'react-hot-toast'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      toast.error('Email kiriting')
      return
    }
    
    if (!emailRegex.test(email)) {
      toast.error('To\'g\'ri email formatini kiriting')
      return
    }

    setLoading(true)

    try {
      await sendPasswordResetEmail(auth, email)
      setEmailSent(true)
      toast.success('Parolni tiklash havolasi emailingizga yuborildi!')
    } catch (error) {
      console.error('Password reset error:', error)
      
      if (error.code === 'auth/user-not-found') {
        toast.error('Bu email bilan foydalanuvchi topilmadi')
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Noto\'g\'ri email format')
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Juda ko\'p urinish. Keyinroq qaytadan urinib ko\'ring')
      } else {
        toast.error('Xatolik yuz berdi. Qaytadan urinib ko\'ring')
      }
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              Email yuborildi!
            </h2>
            
            <p className="text-slate-300 mb-6">
              <strong>{email}</strong> manziliga parolni tiklash havolasi yuborildi.
              <br/><br/>
              Agar email kelmasa, Spam/Junk papkasini tekshiring.
            </p>
            
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Login sahifasiga qaytish
            </Link>
            
            <button
              onClick={() => setEmailSent(false)}
              className="block w-full mt-4 text-slate-400 hover:text-white transition"
            >
              Qayta yuborish
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Login sahifasiga qaytish
        </Link>

        {/* Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Parolni unutdingizmi?
            </h1>
            <p className="text-slate-400">
              Email manzilingizni kiriting, sizga parolni tiklash havolasi yuboramiz
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Yuborilmoqda...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Tiklash havolasini yuborish
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Parolingizni esladingizmi?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 transition">
                Login qilish
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
