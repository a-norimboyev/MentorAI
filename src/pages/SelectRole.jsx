import { Link } from 'react-router-dom'
import { GraduationCap, User, ArrowRight, BookOpen } from 'lucide-react'

const SelectRole = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <GraduationCap className="w-10 h-10 text-blue-500" />
            <span className="text-2xl font-bold text-white">MentorAI</span>
          </Link>
        </div>

        {/* Selection Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white text-center mb-2">Ro'yxatdan o'tish</h1>
          <p className="text-slate-400 text-center mb-8">Kim sifatida ro'yxatdan o'tmoqchisiz?</p>

          <div className="space-y-4">
            {/* Student Option */}
            <Link
              to="/register/student"
              className="flex items-center justify-between p-6 rounded-xl border-2 border-slate-600 hover:border-blue-500 hover:bg-blue-500/10 transition group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <User className="w-7 h-7 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">O'quvchi</h3>
                  <p className="text-slate-400 text-sm">Yangi bilimlar o'rganing</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition" />
            </Link>

            {/* Teacher Option */}
            <Link
              to="/register/teacher"
              className="flex items-center justify-between p-6 rounded-xl border-2 border-slate-600 hover:border-blue-500 hover:bg-blue-500/10 transition group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Ustoz</h3>
                  <p className="text-slate-400 text-sm">O'quvchilaringizni boshqaring</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition" />
            </Link>

            {/* Self-learner Option */}
            <Link
              to="/register/self-learner"
              className="flex items-center justify-between p-6 rounded-xl border-2 border-slate-600 hover:border-purple-500 hover:bg-purple-500/10 transition group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Mustaqil o'rganuvchi</h3>
                  <p className="text-slate-400 text-sm">O'zingiz mustaqil o'rganing</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-purple-500 transition" />
            </Link>
          </div>

          <p className="text-center text-slate-400 mt-8">
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

export default SelectRole
