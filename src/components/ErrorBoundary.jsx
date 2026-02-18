import { AlertCircle, RefreshCw } from 'lucide-react'
import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    })
    console.error('Error caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Xatolik yuz berdi!</h1>
            <p className="text-slate-400 mb-4">
              {this.state.error?.message || 'Noma\'lum xatolik'}
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left mb-4 text-xs text-slate-500 bg-slate-900/50 p-3 rounded">
                <summary className="cursor-pointer font-mono mb-2">Developer details</summary>
                <pre className="whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition"
            >
              <RefreshCw className="w-4 h-4" />
              Qayta yuklash
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
