import Sidebar from '../components/Sidebar'
import { useSidebar } from '../context/SidebarContext'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'
import { MessageSquare, Send, Search, Users, User, MoreVertical, Check, CheckCheck, Plus, Loader2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { db } from '../config/firebase'
import { 
  collection, addDoc, query, where, orderBy, onSnapshot, 
  doc, getDoc, getDocs, serverTimestamp, updateDoc 
} from 'firebase/firestore'

const Messages = () => {
  const { user, userProfile } = useAuth()
  const { collapsed } = useSidebar()
  const { groups } = useAppData()
  const isTeacher = userProfile?.userType === 'teacher'
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [chats, setChats] = useState([])
  const [messages, setMessages] = useState([])
  const [loadingChats, setLoadingChats] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const messagesEndRef = useRef(null)

  // Foydalanuvchi cache
  const userCacheRef = useRef({})

  // Chatlarni Firestore dan yuklash (real-time)
  useEffect(() => {
    if (!user) return
    setLoadingChats(true)

    const chatsRef = collection(db, 'chats')
    const q = query(
      chatsRef,
      where('members', 'array-contains', user.uid),
      orderBy('lastMessageAt', 'desc')
    )

    const unsub = onSnapshot(q, async (snapshot) => {
      // Barcha kerakli user ID larni yig'ib, bir vaqtda yuklash
      const otherUids = new Set()
      snapshot.docs.forEach(docSnap => {
        const data = docSnap.data()
        if ((data.type || 'private') === 'private' && data.members) {
          const otherUid = data.members.find(m => m !== user.uid)
          if (otherUid && !userCacheRef.current[otherUid]) otherUids.add(otherUid)
        }
      })

      // Parallel user lookups
      if (otherUids.size > 0) {
        const lookups = await Promise.all(
          [...otherUids].map(async uid => {
            try {
              const userDoc = await getDoc(doc(db, 'users', uid))
              if (userDoc.exists()) return { uid, data: userDoc.data() }
            } catch (e) { /* ignore */ }
            return { uid, data: null }
          })
        )
        lookups.forEach(({ uid, data }) => {
          if (data) userCacheRef.current[uid] = data
        })
      }

      const chatList = snapshot.docs.map(docSnap => {
        const data = docSnap.data()
        let chatName = data.name || 'Chat'
        let avatar = null
        let chatType = data.type || 'private'

        if (chatType === 'private' && data.members) {
          const otherUid = data.members.find(m => m !== user.uid)
          const ud = userCacheRef.current[otherUid]
          if (ud) {
            chatName = ud.name || ud.email || 'Foydalanuvchi'
            avatar = (chatName[0] || 'F').toUpperCase()
            if (ud.userType === 'teacher') chatType = 'teacher'
          }
        }

        return {
          id: docSnap.id,
          name: chatName,
          type: chatType,
          lastMessage: data.lastMessage || '',
          time: data.lastMessageAt?.toDate?.()?.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) || '',
          unread: data.unreadCount?.[user.uid] || 0,
          members: data.members?.length || 0,
          avatar: avatar || (chatName[0] || 'G').toUpperCase()
        }
      })
      setChats(chatList)
      setLoadingChats(false)

      if (chatList.length > 0 && !selectedChat) {
        setSelectedChat(chatList[0].id)
      }
    }, (error) => {
      console.error('Error loading chats:', error)
      setLoadingChats(false)
    })

    return () => unsub()
  }, [user])

  // Tanlangan chatning xabarlarini real-time yuklash
  useEffect(() => {
    if (!selectedChat || !user) {
      setMessages([])
      return
    }
    setLoadingMessages(true)

    const msgsRef = collection(db, 'chats', selectedChat, 'messages')
    const q = query(msgsRef, orderBy('createdAt', 'asc'))

    const unsub = onSnapshot(q, (snapshot) => {
      const msgList = snapshot.docs.map(d => {
        const data = d.data()
        return {
          id: d.id,
          sender: data.senderUid === user.uid ? 'me' : (data.senderName || 'Foydalanuvchi'),
          senderUid: data.senderUid,
          text: data.text || '',
          time: data.createdAt?.toDate?.()?.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) || '',
          avatar: (data.senderName?.[0] || 'F').toUpperCase(),
          status: data.status || 'sent',
          isSystem: data.isSystem || false
        }
      })
      setMessages(msgList)
      setLoadingMessages(false)

      // Unread ni 0 ga tushirish
      const chatRef = doc(db, 'chats', selectedChat)
      updateDoc(chatRef, {
        [`unreadCount.${user.uid}`]: 0
      }).catch(() => {})
    })

    return () => unsub()
  }, [selectedChat, user])

  // Xabarlar oxiriga scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Xabar yuborish
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat || !user) return

    const text = message.trim()
    setMessage('')

    try {
      // Xabarni qo'shish
      await addDoc(collection(db, 'chats', selectedChat, 'messages'), {
        text,
        senderUid: user.uid,
        senderName: userProfile?.name || user.displayName || 'Foydalanuvchi',
        createdAt: serverTimestamp(),
        status: 'sent'
      })

      // Chatni yangilash
      const chatRef = doc(db, 'chats', selectedChat)
      const chatSnap = await getDoc(chatRef)
      if (chatSnap.exists()) {
        const chatData = chatSnap.data()
        const unreadCount = { ...(chatData.unreadCount || {}) }
        // Boshqa a'zolar uchun unread++
        chatData.members?.forEach(m => {
          if (m !== user.uid) {
            unreadCount[m] = (unreadCount[m] || 0) + 1
          }
        })
        await updateDoc(chatRef, {
          lastMessage: text,
          lastMessageAt: serverTimestamp(),
          unreadCount
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessage(text) // Restore message on error
    }
  }

  // Yangi chat yaratish (guruh yoki private)
  const handleCreateGroupChat = async () => {
    if (!user || groups.length === 0) return

    // Guruh chatlarini yaratish (agar hali yaratilmagan bo'lsa)
    for (const group of groups) {
      // Guruh chat allaqachon mavjudmi tekshirish
      const existingChat = chats.find(c => c.name === group.name && c.type === 'group')
      if (existingChat) continue

      try {
        await addDoc(collection(db, 'chats'), {
          name: group.name,
          type: 'group',
          members: group.members || [user.uid],
          lastMessage: 'Guruh chati yaratildi',
          lastMessageAt: serverTimestamp(),
          unreadCount: {},
          groupId: group.id,
          createdBy: user.uid
        })
      } catch (e) {
        console.error('Error creating group chat:', e)
      }
    }
  }

  // Enter tugmasini bosish
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Chatlarni qidirish
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedChatData = chats.find(c => c.id === selectedChat)

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />
      
      <main className={`${collapsed ? 'ml-21.25' : 'ml-64'} h-screen flex transition-all duration-300`}>
        {/* Chat List */}
        <div className="w-80 border-r border-slate-700 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-bold text-white">Xabarlar</h1>
              {groups.length > 0 && (
                <button
                  onClick={handleCreateGroupChat}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
                  title="Guruh chatlarini yaratish"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
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
            {loadingChats ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="text-center py-8 px-4">
                <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Hali chatlar yo'q</p>
                {groups.length > 0 && (
                  <button
                    onClick={handleCreateGroupChat}
                    className="mt-3 text-blue-400 text-sm hover:text-blue-300"
                  >
                    Guruh chatlarini yaratish
                  </button>
                )}
              </div>
            ) : (
              filteredChats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
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
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {!selectedChat ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">Chatni tanlang</p>
              </div>
            </div>
          ) : (
            <>
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
                      <h2 className="font-semibold text-white">{selectedChatData?.name || 'Chat'}</h2>
                      {selectedChatData?.type === 'teacher' && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Ustoz</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400">
                      {selectedChatData?.type === 'group' ? `${selectedChatData?.members} ta a'zo` : 'Chat'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loadingMessages ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-400">Hali xabarlar yo'q. Birinchi xabarni yozing!</p>
                  </div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : msg.isSystem ? 'justify-center' : 'justify-start'}`}>
                      {msg.isSystem ? (
                        <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
                          {msg.text}
                        </span>
                      ) : (
                        <div className={`max-w-md ${msg.sender === 'me' ? 'order-1' : ''}`}>
                          {msg.sender !== 'me' && (
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white bg-slate-600">
                                {msg.avatar}
                              </div>
                              <span className="text-xs text-slate-400">{msg.sender}</span>
                            </div>
                          )}
                          <div className={`p-3 rounded-xl ${
                            msg.sender === 'me' 
                              ? 'bg-blue-600 text-white rounded-br-none'
                              : 'bg-slate-800 text-white rounded-bl-none'
                          }`}>
                            <p className="text-sm">{msg.text}</p>
                          </div>
                          <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-xs text-slate-500">{msg.time}</span>
                            {msg.sender === 'me' && (
                              <Check className="w-3 h-3 text-slate-400" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
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
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default Messages
