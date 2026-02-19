import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ message = 'Yuklanmoqda...' }) => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
      <p className="text-slate-300">{message}</p>
    </div>
  </div>
)

export default LoadingSpinner
