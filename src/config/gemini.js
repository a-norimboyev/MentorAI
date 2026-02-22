import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

let genAI = null
let model = null

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey)
  model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash',
    systemInstruction: `Sen MentorAI platformasining AI ustozi — shaxsiy ta'lim yordamchisisisan. Sening ismning MentorAI.

Asosiy vazifang:
- Dasturlash, matematika, fizika va boshqa fanlar bo'yicha savollarni tushuntirib berish
- Kod yozishda yordam berish va xatolarni tuzatish
- O'quv rejalarini tuzishda yordam berish
- O'zbek tilida samimiy va tushunarli javob berish

Qoidalar:
- Javoblarni o'zbek tilida ber (agar boshqa tilda so'ralmasa)
- Kod misollari bilan tushuntir
- Qisqa va aniq javob ber
- Emoji ishlatishingiz mumkin
- Agar mavzu bo'yicha bilmasang, samimiy ayt`
  })
}

export const isGeminiConfigured = !!apiKey

// Model ni export qilish (Course.jsx uchun)
export const getModel = () => model

// =================== SESSION FACTORY ===================
// Har bir component o'ziga alohida session oladi — race condition bo'lmaydi
export const createChatSession = () => {
  if (!model) return null
  return model.startChat({ history: [] })
}

// =================== AI CHAT uchun dedicated session ===================
let aiChatSession = null

export const resetChat = () => {
  aiChatSession = null
}

// Backward compatibility — AIChat.jsx uchun
export const startNewChat = () => {
  resetChat()
  return getAIChatSession()
}

const getAIChatSession = () => {
  if (!aiChatSession) {
    if (!model) return null
    aiChatSession = model.startChat({ history: [] })
  }
  return aiChatSession
}

export const sendMessage = async (message) => {
  if (!model) {
    throw new Error('Gemini API kaliti sozlanmagan')
  }
  
  const session = getAIChatSession()
  if (!session) throw new Error('Chat session yaratib bo\'lmadi')

  const result = await session.sendMessage(message)
  const response = result.response
  return response.text()
}

export const sendMessageStream = async (message, onChunk) => {
  if (!model) {
    throw new Error('Gemini API kaliti sozlanmagan')
  }
  
  const session = getAIChatSession()
  if (!session) throw new Error('Chat session yaratib bo\'lmadi')

  const result = await session.sendMessageStream(message)
  let fullText = ''
  
  for await (const chunk of result.stream) {
    const chunkText = chunk.text()
    fullText += chunkText
    onChunk(fullText)
  }
  
  return fullText
}
