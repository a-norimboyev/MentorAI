import Sidebar from '../components/Sidebar'
import { useSidebar } from '../context/SidebarContext'
import { useAuth } from '../context/AuthContext'
import { MessageSquare, Send, Search, Users, User, MoreVertical, Check, CheckCheck } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const Messages = () => {
  const { userProfile } = useAuth()
  const { collapsed } = useSidebar()
  const isTeacher = userProfile?.userType === 'teacher'
  const [selectedChat, setSelectedChat] = useState(1)
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef(null)

  // O'qituvchi uchun chatlar
  const teacherChats = [
    {
      id: 1,
      name: "Frontend Guruh",
      type: "group",
      lastMessage: "Dars 5-soatda boshlanadi",
      time: "10:30",
      unread: 2,
      members: 15
    },
    {
      id: 2,
      name: "Ali Valiyev",
      type: "private",
      lastMessage: "Rahmat, ustoz!",
      time: "09:45",
      unread: 0,
      avatar: "A"
    },
    {
      id: 3,
      name: "Backend Guruh",
      type: "group",
      lastMessage: "Vazifa qachon topshiriladi?",
      time: "Kecha",
      unread: 5,
      members: 12
    },
    {
      id: 4,
      name: "Dilnoza Karimova",
      type: "private",
      lastMessage: "Mashqni bajardim",
      time: "Kecha",
      unread: 0,
      avatar: "D"
    }
  ]

  // O'quvchi uchun chatlar - faqat ustoz va guruh
  const studentChats = [
    {
      id: 1,
      name: "Frontend Guruh",
      type: "group",
      lastMessage: "Dars 5-soatda boshlanadi",
      time: "10:30",
      unread: 2,
      members: 15
    },
    {
      id: 5,
      name: "Sardor Usmonov",
      type: "teacher",
      lastMessage: "Mashqni bajardingizmi?",
      time: "11:00",
      unread: 1,
      avatar: "S"
    }
  ]

  // Demo chatlar - state orqali boshqarish
  const [chats, setChats] = useState(isTeacher ? teacherChats : studentChats)

  // Demo xabarlar - har bir chat uchun alohida
  const [chatMessages, setChatMessages] = useState({
    1: [
      { id: 1, sender: "system", text: "Frontend Guruh yaratildi", time: "09:00" },
      { id: 2, sender: "Ali Valiyev", text: "Assalomu alaykum, ustoz. Bugungi dars haqida savolim bor edi.", time: "09:15", avatar: "A" },
      { id: 3, sender: isTeacher ? "me" : "Sardor Usmonov (Ustoz)", text: "Vaalaykum assalom. Marhamat, savolingizni bering.", time: "09:20", status: "read", avatar: isTeacher ? null : "S" },
      { id: 4, sender: "Ali Valiyev", text: "React Hooks mavzusida useEffect qachon ishlatiladi?", time: "09:22", avatar: "A" },
      { id: 5, sender: isTeacher ? "me" : "Sardor Usmonov (Ustoz)", text: "useEffect - bu side effect larni bajarish uchun ishlatiladi. Masalan, API dan ma'lumot olish, DOM ni o'zgartirish yoki subscription lar bilan ishlash.", time: "09:25", status: "read", avatar: isTeacher ? null : "S" },
      { id: 6, sender: "Dilnoza Karimova", text: "Ustoz, men ham tushunmagan edim, rahmat!", time: "09:30", avatar: "D" },
      { id: 7, sender: isTeacher ? "me" : "Sardor Usmonov (Ustoz)", text: "Bugungi dars 5-soatda boshlanadi. Tayyor bo'ling!", time: "10:30", status: "sent", avatar: isTeacher ? null : "S" }
    ],
    2: [
      { id: 1, sender: "Ali Valiyev", text: "Assalomu alaykum, ustoz!", time: "09:00", avatar: "A" },
      { id: 2, sender: "me", text: "Vaalaykum assalom!", time: "09:05", status: "read" },
      { id: 3, sender: "Ali Valiyev", text: "Rahmat, ustoz!", time: "09:45", avatar: "A" }
    ],
    3: [
      { id: 1, sender: "system", text: "Backend Guruh yaratildi", time: "08:00" },
      { id: 2, sender: "Sardor", text: "Vazifa qachon topshiriladi?", time: "Kecha", avatar: "S" }
    ],
    4: [
      { id: 1, sender: "Dilnoza Karimova", text: "Assalomu alaykum!", time: "Kecha", avatar: "D" },
      { id: 2, sender: "me", text: "Vaalaykum assalom!", time: "Kecha", status: "read" },
      { id: 3, sender: "Dilnoza Karimova", text: "Mashqni bajardim", time: "Kecha", avatar: "D" }
    ],
    5: [
      { id: 1, sender: "Sardor Usmonov", text: "Assalomu alaykum! Darsga tayyormisiz?", time: "10:00", avatar: "S" },
      { id: 2, sender: "me", text: "Vaalaykum assalom, ustoz! Ha, tayyor.", time: "10:05", status: "read" },
      { id: 3, sender: "Sardor Usmonov", text: "Mashqni bajardingizmi?", time: "11:00", avatar: "S" }
    ]
  })

  // Xabarlar oxiriga scroll qilish
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, selectedChat])

  // Xabar yuborish
  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: message,
      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      status: "sent"
    }

    // Xabarni qo'shish
    setChatMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage]
    }))

    // Chatlar ro'yxatini yangilash
    setChats(prev => prev.map(chat => 
      chat.id === selectedChat 
        ? { ...chat, lastMessage: message, time: newMessage.time, unread: 0 }
        : chat
    ))

    setMessage('')
  }

  // Enter tugmasini bosish
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Chatni tanlash va unread ni 0 qilish
  const handleSelectChat = (chatId) => {
    setSelectedChat(chatId)
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, unread: 0 } : chat
    ))
  }

  // Chatlarni qidirish
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedChatData = chats.find(c => c.id === selectedChat)
  const currentMessages = chatMessages[selectedChat] || []

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />
      
      <main className={`${collapsed ? 'ml-21.25' : 'ml-64'} h-screen flex transition-all duration-300`}>
        {/* Chat List */}
        <div className="w-80 border-r border-slate-700 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-700">
            <h1 className="text-xl font-bold text-white mb-3">Xabarlar</h1>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Qidirish..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={`p-4 cursor-pointer border-b border-slate-800 hover:bg-slate-800/50 transition ${
                  selectedChat === chat.id ? 'bg-slate-800' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                    chat.type === 'group' ? 'bg-blue-600' : chat.type === 'teacher' ? 'bg-green-600' : 'bg-slate-600'
                  } text-white`}>
                    {chat.type === 'group' ? <Users className="w-5 h-5" /> : chat.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white truncate">{chat.name}</h3>
                        {chat.type === 'teacher' && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Ustoz</span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">{chat.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-400 truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                    {chat.type === 'group' && (
                      <p className="text-xs text-slate-500 mt-1">{chat.members} ta a'zo</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                selectedChatData?.type === 'group' ? 'bg-blue-600' : selectedChatData?.type === 'teacher' ? 'bg-green-600' : 'bg-slate-600'
              } text-white`}>
                {selectedChatData?.type === 'group' ? <Users className="w-5 h-5" /> : selectedChatData?.avatar || 'F'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-white">{selectedChatData?.name || 'Frontend Guruh'}</h2>
                  {selectedChatData?.type === 'teacher' && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Ustoz</span>
                  )}
                </div>
                <p className="text-sm text-slate-400">
                  {selectedChatData?.type === 'group' ? `${selectedChatData?.members} ta a'zo` : 'Online'}
                </p>
              </div>
            </div>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition">
              <MoreVertical className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentMessages.map(msg => {
              const isTeacherMessage = msg.sender?.includes('(Ustoz)') || (selectedChatData?.type === 'teacher' && msg.sender !== 'me' && msg.sender !== 'system')
              return (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'}`}>
                {msg.sender === 'system' ? (
                  <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
                    {msg.text}
                  </span>
                ) : (
                  <div className={`max-w-md ${msg.sender === 'me' ? 'order-1' : ''}`}>
                    {msg.sender !== 'me' && (
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${isTeacherMessage ? 'bg-green-600' : 'bg-slate-600'}`}>
                          {msg.avatar}
                        </div>
                        <span className="text-xs text-slate-400">{msg.sender}</span>
                        {isTeacherMessage && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">Ustoz</span>
                        )}
                      </div>
                    )}
                    <div className={`p-3 rounded-xl ${
                      msg.sender === 'me' 
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : isTeacherMessage 
                          ? 'bg-green-600/20 border border-green-500/30 text-white rounded-bl-none'
                          : 'bg-slate-800 text-white rounded-bl-none'
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-xs text-slate-500">{msg.time}</span>
                      {msg.sender === 'me' && (
                        msg.status === 'read' 
                          ? <CheckCheck className="w-3 h-3 text-blue-400" />
                          : <Check className="w-3 h-3 text-slate-400" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )})}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Xabar yozing..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-xl transition"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Messages
