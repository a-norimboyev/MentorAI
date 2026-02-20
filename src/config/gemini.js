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

// Chat sessiyasi
let chatSession = null

export const resetChat = () => {
  chatSession = null
}

export const startNewChat = () => {
  if (!model) return null
  chatSession = model.startChat({
    history: [],
  })
  return chatSession
}

export const sendMessage = async (message) => {
  if (!model) {
    throw new Error('Gemini API kaliti sozlanmagan')
  }
  
  if (!chatSession) {
    startNewChat()
  }

  const result = await chatSession.sendMessage(message)
  const response = result.response
  return response.text()
}

export const sendMessageStream = async (message, onChunk) => {
  if (!model) {
    throw new Error('Gemini API kaliti sozlanmagan')
  }
  
  if (!chatSession) {
    startNewChat()
  }

  const result = await chatSession.sendMessageStream(message)
  let fullText = ''
  
  for await (const chunk of result.stream) {
    const chunkText = chunk.text()
    fullText += chunkText
    onChunk(fullText)
  }
  
  return fullText
}
