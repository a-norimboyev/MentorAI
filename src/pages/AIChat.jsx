import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import { isGeminiConfigured, sendMessageStream, startNewChat } from '../config/gemini'
import { Bot, Send, Sparkles, Code, BookOpen, Brain, RefreshCw, Trash2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const AIChat = () => {
  const { userProfile } = useAuth()
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  // Demo AI chat tarixi
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      role: 'ai',
      text: "Assalomu alaykum! Men MentorAI - sizning shaxsiy AI ustozingizman. 🤖 Dasturlash bo'yicha har qanday savollaringizga javob berishga tayorman. Qanday yordam bera olaman?",
      time: "10:00"
    }
  ])

  // Tez savollar
  const quickQuestions = [
    { icon: Code, text: "JavaScript asoslari", query: "JavaScript asoslarini tushuntiring" },
    { icon: BookOpen, text: "React o'rganish", query: "React ni qanday o'rganish kerak?" },
    { icon: Brain, text: "Algoritm masalasi", query: "Binary search algoritmini tushuntiring" },
    { icon: Sparkles, text: "Kod tekshirish", query: "Kodimni tekshirib bering" }
  ]

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory, isTyping])

  // Yangi chat boshlash uchun sessiyani reset qilish
  useEffect(() => {
    if (isGeminiConfigured) {
      startNewChat()
    }
  }, [])

  const handleSend = async () => {
    if (!message.trim() || isTyping) return

    const userMsg = message.trim()
    
    // Foydalanuvchi xabarini qo'shish
    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: userMsg,
      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
    }
    setChatHistory(prev => [...prev, userMessage])
    setMessage('')
    setIsTyping(true)

    if (isGeminiConfigured) {
      // Real AI javob - streaming
      const aiMessageId = Date.now() + 1
      const aiTime = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
      
      // Bo'sh AI xabarini qo'shish
      setChatHistory(prev => [...prev, {
        id: aiMessageId,
        role: 'ai',
        text: '',
        time: aiTime
      }])

      try {
        await sendMessageStream(userMsg, (streamedText) => {
          setChatHistory(prev => prev.map(msg => 
            msg.id === aiMessageId ? { ...msg, text: streamedText } : msg
          ))
        })
      } catch (error) {
        console.error('AI javob xatosi:', error)
        setChatHistory(prev => prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, text: "Kechirasiz, xatolik yuz berdi. Iltimos qaytadan urinib ko'ring. ❌" } 
            : msg
        ))
      }
      setIsTyping(false)
    } else {
      // Fallback - hardcoded javoblar
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          role: 'ai',
          text: getAIResponse(userMsg),
          time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
        }
        setChatHistory(prev => [...prev, aiResponse])
        setIsTyping(false)
      }, 1500)
    }
  }

  const getAIResponse = (query) => {
    const lowerQuery = query.toLowerCase()
    if (lowerQuery.includes('javascript')) {
      return "JavaScript - bu web-sahifalarni interaktiv qilish uchun ishlatiladigan dasturlash tili. U client-side va server-side (Node.js) da ishlaydi.\n\n**Asosiy tushunchalar:**\n- Variables (let, const, var)\n- Functions\n- Objects & Arrays\n- DOM manipulation\n- Event handling\n\nBoshlash uchun console.log('Hello World') dan boshlang! Qo'shimcha savollar bormi? 😊"
    } else if (lowerQuery.includes('react')) {
      return "React - bu Facebook tomonidan yaratilgan JavaScript kutubxonasi. UI komponentlarini yaratish uchun juda qulay.\n\n**O'rganish tartibi:**\n1. JavaScript asoslarini yaxshi bilish\n2. JSX sintaksisi\n3. Components va Props\n4. State va Hooks (useState, useEffect)\n5. React Router\n\nReact documentatsiyasidan boshlang: react.dev 📚"
    } else if (lowerQuery.includes('algoritm') || lowerQuery.includes('binary search')) {
      return "**Binary Search** - bu tartiblangan massivda element qidirish algoritmi. O(log n) murakkablikka ega.\n\n```javascript\nfunction binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  \n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}\n```\n\nYana qanday algoritm haqida bilmoqchisiz? 🧠"
    } else {
      return `Ajoyib savol! "${query}" haqida sizga yordam berishdan xursandman.\n\nBu mavzu bo'yicha:\n1. Avval asosiy tushunchalarni o'rganishni tavsiya qilaman\n2. Amaliy mashqlar bilan mustahkamlang\n3. Loyihalar orqali tajriba to'plang\n\nAniqroq savol berishingiz mumkin - men batafsil javob beraman! 💡`
    }
  }

  const handleQuickQuestion = (query) => {
    setMessage(query)
  }

  const handleClearChat = () => {
    setChatHistory([{
      id: 1,
      role: 'ai',
      text: "Assalomu alaykum! Men MentorAI - sizning shaxsiy AI ustozingizman. 🤖 Dasturlash bo'yicha har qanday savollaringizga javob berishga tayorman. Qanday yordam bera olaman?",
      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
    }])
    if (isGeminiConfigured) {
      startNewChat()
    }
  }

  // Markdown formatini oddiy render qilish
  const renderText = (text) => {
    // Code blocks
    const parts = text.split(/(```[\s\S]*?```)/g)
    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        const codeContent = part.replace(/```(\w*)\n?/, '').replace(/```$/, '')
        const lang = part.match(/```(\w*)/)?.[1] || ''
        return (
          <div key={i} className="my-3 rounded-lg overflow-hidden">
            {lang && <div className="bg-slate-600 px-3 py-1 text-xs text-slate-300">{lang}</div>}
            <pre className="bg-slate-900 p-3 overflow-x-auto">
              <code className="text-sm text-green-400 font-mono">{codeContent.trim()}</code>
            </pre>
          </div>
        )
      }
      // Bold text
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g)
      return (
        <span key={i}>
          {boldParts.map((bp, j) => {
            if (bp.startsWith('**') && bp.endsWith('**')) {
              return <strong key={j} className="text-white font-semibold">{bp.slice(2, -2)}</strong>
            }
            return <span key={j}>{bp}</span>
          })}
        </span>
      )
    })
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />
      
      <main className="ml-64 h-screen flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  AI Ustoz
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </h1>
                <p className="text-sm text-green-400">
                  {isGeminiConfigured ? 'Online - Gemini AI bilan ishlaydi' : 'Demo rejim - API kalitini sozlang'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClearChat}
              className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
              title="Chatni tozalash"
            >
              <Trash2 className="w-5 h-5" />
              <span className="text-sm hidden md:inline">Yangi chat</span>
            </button>
          </div>
        </div>

        {/* Quick Questions */}
        {chatHistory.length <= 1 && (
          <div className="p-4 border-b border-slate-800">
            <p className="text-sm text-slate-400 mb-3">Tez savollar:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(q.query)}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-lg text-sm text-slate-300 transition"
                >
                  <q.icon className="w-4 h-4 text-blue-400" />
                  {q.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-2xl ${msg.role === 'user' ? 'order-1' : ''}`}>
                {msg.role === 'ai' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">AI Ustoz</span>
                  </div>
                )}
                <div className={`p-4 rounded-xl ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                }`}>
                  <div className="text-sm whitespace-pre-wrap">{msg.role === 'ai' ? renderText(msg.text) : msg.text}</div>
                </div>
                <p className={`text-xs text-slate-500 mt-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}

          {/* AI Typing Indicator */}
          {isTyping && !chatHistory.some(m => m.role === 'ai' && m.text === '') && (
            <div className="flex justify-start">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-300">AI Ustoz</span>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                  <span className="text-sm text-slate-400">Yozmoqda...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-700 bg-slate-900">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Savolingizni yozing..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <button 
              onClick={handleSend}
              disabled={!message.trim() || isTyping}
              className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-xl transition"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            {isGeminiConfigured 
              ? "AI Ustoz Google Gemini bilan ishlaydi. Savollaringizga real javob beradi."
              : "Demo rejim. Haqiqiy AI javoblari uchun Gemini API kalitini .env fayliga qo'shing."
            }
          </p>
        </div>
      </main>
    </div>
  )
}

export default AIChat
