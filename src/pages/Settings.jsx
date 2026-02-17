import Sidebar from '../components/Sidebar'
import { useSidebar } from '../context/SidebarContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useAppData } from '../context/AppDataContext'
import { User, Bell, Shield, Globe, Palette, LogOut, Camera, Save, Moon, Sun, Mail, Phone, Check, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { auth } from '../config/firebase'
import { useNavigate } from 'react-router-dom'

const Settings = () => {
  const { user, userProfile, updateUserProfile } = useAuth()
  const { theme, setTheme } = useTheme()
  const { collapsed } = useSidebar()
  const navigate = useNavigate()
  const isTeacher = userProfile?.userType === 'teacher'
  
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    fullName: userProfile?.fullName || userProfile?.name || '',
    email: user?.email || '',
    phone: userProfile?.phone || '',
    bio: userProfile?.bio || ''
  })
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    newStudent: true,
    lessonReminder: true
  })

  const tabs = [
    { id: 'profile', icon: User, label: 'Profil' },
    { id: 'notifications', icon: Bell, label: 'Bildirishnomalar' },
    { id: 'security', icon: Shield, label: 'Xavfsizlik' },
    { id: 'appearance', icon: Palette, label: "Ko'rinish" }
  ]

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/')
    } catch (error) {
      console.error("Chiqish xatosi:", error)
    }
  }

  const [saveStatus, setSaveStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const { addActivity, addNotification } = useAppData()

  const handleSave = async () => {
    setSaving(true)
    try {
      if (updateUserProfile) {
        await updateUserProfile({
          fullName: formData.fullName,
          name: formData.fullName,
          phone: formData.phone,
          bio: formData.bio
        })
      }
      setSaveStatus('success')
      addActivity({ title: 'Profil yangilandi', type: 'success' })
      setTimeout(() => setSaveStatus(''), 3000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(''), 3000)
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />
      
      <main className={`${collapsed ? 'ml-[85px]' : 'ml-64'} p-8 transition-all duration-300`}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sozlamalar</h1>
          <p className="text-slate-400">Profilingiz va hisobingizni boshqaring</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Tabs */}
          <div className="w-64 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
            
            <hr className="border-slate-700 my-4" />
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition"
            >
              <LogOut className="w-5 h-5" />
              Chiqish
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Profil ma'lumotlari</h2>
                
                {/* Avatar */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                      {userProfile?.fullName?.charAt(0) || userProfile?.name?.charAt(0) || 'U'}
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{userProfile?.fullName || userProfile?.name || 'Foydalanuvchi'}</h3>
                    <p className="text-slate-400">{isTeacher ? "O'qituvchi" : "O'quvchi"}</p>
                    {isTeacher && (
                      <span className="inline-block mt-2 px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
                        Mentor
                      </span>
                    )}
                  </div>
                </div>

                {/* Form */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">To'liq ism</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-slate-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Telefon</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+998 90 123 45 67"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Mutaxassislik</label>
                    <input
                      type="text"
                      defaultValue={isTeacher ? userProfile?.subject : userProfile?.field || ''}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-slate-400 mb-2">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      placeholder="O'zingiz haqingizda qisqacha..."
                      rows={3}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-end mt-6">
                  {saveStatus === 'success' && (
                    <span className="flex items-center gap-1 text-green-400 text-sm"><Check className="w-4 h-4" /> Saqlandi!</span>
                  )}
                  {saveStatus === 'error' && (
                    <span className="text-red-400 text-sm">Xatolik yuz berdi</span>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Bildirishnoma sozlamalari</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-white">Email bildirishnomalar</p>
                      <p className="text-sm text-slate-400">Yangi xabarlar haqida email orqali xabar berish</p>
                    </div>
                    <button
                      onClick={() => setNotifications({...notifications, email: !notifications.email})}
                      className={`w-12 h-6 rounded-full transition ${
                        notifications.email ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        notifications.email ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-white">Push bildirishnomalar</p>
                      <p className="text-sm text-slate-400">Brauzer orqali tezkor xabarnomalar</p>
                    </div>
                    <button
                      onClick={() => setNotifications({...notifications, push: !notifications.push})}
                      className={`w-12 h-6 rounded-full transition ${
                        notifications.push ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        notifications.push ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  {isTeacher && (
                    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div>
                        <p className="font-medium text-white">Yangi o'quvchi so'rovlari</p>
                        <p className="text-sm text-slate-400">Guruhga qo'shilish so'rovlari haqida xabar</p>
                      </div>
                      <button
                        onClick={() => setNotifications({...notifications, newStudent: !notifications.newStudent})}
                        className={`w-12 h-6 rounded-full transition ${
                          notifications.newStudent ? 'bg-blue-600' : 'bg-slate-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          notifications.newStudent ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-white">Dars eslatmalari</p>
                      <p className="text-sm text-slate-400">Darslar boshlanishidan oldin eslatma</p>
                    </div>
                    <button
                      onClick={() => setNotifications({...notifications, lessonReminder: !notifications.lessonReminder})}
                      className={`w-12 h-6 rounded-full transition ${
                        notifications.lessonReminder ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        notifications.lessonReminder ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Xavfsizlik sozlamalari</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-white mb-4">Parolni o'zgartirish</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-slate-400 mb-2">Joriy parol</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-2">Yangi parol</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-2">Yangi parolni tasdiqlash</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                        Parolni yangilash
                      </button>
                    </div>
                  </div>

                  <hr className="border-slate-700" />

                  <div>
                    <h3 className="font-medium text-white mb-4">Ikki bosqichli autentifikatsiya</h3>
                    <div className="p-4 bg-slate-700/50 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-slate-300">2FA hozir o'chirilgan</p>
                        <p className="text-sm text-slate-400">Hisobingizni yanada xavfsiz qiling</p>
                      </div>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
                        Yoqish
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Ko'rinish sozlamalari</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-white mb-4">Mavzu</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <button 
                        onClick={() => setTheme('dark')}
                        className={`p-4 bg-slate-700 rounded-xl text-center transition ${theme === 'dark' ? 'border-2 border-blue-500' : 'border border-slate-600 hover:border-slate-500'}`}
                      >
                        <Moon className={`w-8 h-8 mx-auto mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-slate-400'}`} />
                        <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-400'}`}>Qorong'i</p>
                      </button>
                      <button 
                        onClick={() => setTheme('light')}
                        className={`p-4 bg-slate-700 rounded-xl text-center transition ${theme === 'light' ? 'border-2 border-blue-500' : 'border border-slate-600 hover:border-slate-500'}`}
                      >
                        <Sun className={`w-8 h-8 mx-auto mb-2 ${theme === 'light' ? 'text-yellow-400' : 'text-slate-400'}`} />
                        <p className={`text-sm ${theme === 'light' ? 'text-white' : 'text-slate-400'}`}>Yorug'</p>
                      </button>
                      <button 
                        onClick={() => setTheme('system')}
                        className={`p-4 bg-slate-700 rounded-xl text-center transition ${theme === 'system' ? 'border-2 border-blue-500' : 'border border-slate-600 hover:border-slate-500'}`}
                      >
                        <Globe className={`w-8 h-8 mx-auto mb-2 ${theme === 'system' ? 'text-blue-400' : 'text-slate-400'}`} />
                        <p className={`text-sm ${theme === 'system' ? 'text-white' : 'text-slate-400'}`}>Tizim</p>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-white mb-4">Til</h3>
                    <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                      <option value="uz">O'zbekcha</option>
                      <option value="ru">Русский</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <h3 className="font-medium text-white mb-4">Accent rangi</h3>
                    <div className="flex gap-3">
                      {['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-red-500'].map((color, idx) => (
                        <button
                          key={idx}
                          className={`w-10 h-10 rounded-full ${color} ${idx === 0 ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800' : ''}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Settings
