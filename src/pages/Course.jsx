import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import { useSidebar } from '../context/SidebarContext'
import { 
  BookOpen, Play, CheckCircle2, Lock, ChevronRight, ChevronDown, 
  Clock, ArrowLeft, ArrowRight, Loader2, Sparkles, 
  GraduationCap, Target, Lightbulb, ExternalLink, RotateCcw, Menu, X
} from 'lucide-react'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Roadmap ma'lumotlari — har bir yo'nalish uchun kurs tuzilmasi
const courseStructure = {
  frontend: [
    { id: 1, title: 'HTML', emoji: '🌐', desc: 'Web sahifalarning asosi', duration: '1-2 hafta', color: 'from-orange-500 to-red-500',
      lessons: [
        { id: 'html-1', title: 'HTML nima va qanday ishlaydi', duration: '15 min' },
        { id: 'html-2', title: 'Asosiy teglar: h1-h6 p div span', duration: '20 min' },
        { id: 'html-3', title: 'Formalar va input elementlar', duration: '25 min' },
        { id: 'html-4', title: 'Semantik HTML: header nav main footer', duration: '20 min' },
        { id: 'html-5', title: 'Jadvallar va ro\'yxatlar', duration: '15 min' },
      ]
    },
    { id: 2, title: 'CSS', emoji: '🎨', desc: 'Dizayn va stillar', duration: '2-3 hafta', color: 'from-blue-500 to-cyan-500',
      lessons: [
        { id: 'css-1', title: 'CSS asoslari: selektorlar va xossalar', duration: '20 min' },
        { id: 'css-2', title: 'Box Model va margin padding', duration: '20 min' },
        { id: 'css-3', title: 'Flexbox layout', duration: '30 min' },
        { id: 'css-4', title: 'CSS Grid', duration: '30 min' },
        { id: 'css-5', title: 'Responsive Design va Media Queries', duration: '25 min' },
        { id: 'css-6', title: 'Animatsiyalar va Transitions', duration: '20 min' },
      ]
    },
    { id: 3, title: 'JavaScript', emoji: '⚡', desc: 'Dasturlash asoslari', duration: '4-6 hafta', color: 'from-yellow-500 to-amber-500',
      lessons: [
        { id: 'js-1', title: 'JavaScript nima va console.log', duration: '15 min' },
        { id: 'js-2', title: 'O\'zgaruvchilar: let const var', duration: '20 min' },
        { id: 'js-3', title: 'Ma\'lumot turlari va operatorlar', duration: '25 min' },
        { id: 'js-4', title: 'Funksiyalar va arrow functions', duration: '25 min' },
        { id: 'js-5', title: 'Array va Array metodlari', duration: '30 min' },
        { id: 'js-6', title: 'DOM manipulyatsiya', duration: '30 min' },
        { id: 'js-7', title: 'Events va Event Listeners', duration: '25 min' },
        { id: 'js-8', title: 'Async/Await va Fetch API', duration: '30 min' },
      ]
    },
    { id: 4, title: 'Git & GitHub', emoji: '🐙', desc: 'Versiya boshqaruvi', duration: '1 hafta', color: 'from-gray-500 to-slate-600',
      lessons: [
        { id: 'git-1', title: 'Git nima va nega kerak', duration: '15 min' },
        { id: 'git-2', title: 'git init add commit push', duration: '20 min' },
        { id: 'git-3', title: 'Branch yaratish va merge qilish', duration: '25 min' },
        { id: 'git-4', title: 'GitHub bilan ishlash', duration: '20 min' },
      ]
    },
    { id: 5, title: 'Tailwind CSS', emoji: '💨', desc: 'Zamonaviy CSS framework', duration: '1-2 hafta', color: 'from-teal-500 to-cyan-500',
      lessons: [
        { id: 'tw-1', title: 'Tailwind CSS nima va o\'rnatish', duration: '15 min' },
        { id: 'tw-2', title: 'Utility classlar bilan ishlash', duration: '25 min' },
        { id: 'tw-3', title: 'Responsive dizayn Tailwind bilan', duration: '20 min' },
        { id: 'tw-4', title: 'Dark mode va rang palitralari', duration: '20 min' },
      ]
    },
    { id: 6, title: 'TypeScript', emoji: '🔷', desc: 'JavaScript + tiplar', duration: '2-3 hafta', color: 'from-blue-600 to-blue-800',
      lessons: [
        { id: 'ts-1', title: 'TypeScript nima va nega kerak', duration: '15 min' },
        { id: 'ts-2', title: 'Asosiy tiplar: string number boolean', duration: '20 min' },
        { id: 'ts-3', title: 'Interface va Type Alias', duration: '25 min' },
        { id: 'ts-4', title: 'Generics', duration: '25 min' },
      ]
    },
    { id: 7, title: 'React.js', emoji: '⚛️', desc: 'UI kutubxona', duration: '4-6 hafta', color: 'from-cyan-400 to-blue-500',
      lessons: [
        { id: 'react-1', title: 'React nima va komponentlar', duration: '20 min' },
        { id: 'react-2', title: 'JSX va Props', duration: '25 min' },
        { id: 'react-3', title: 'useState Hook', duration: '25 min' },
        { id: 'react-4', title: 'useEffect Hook', duration: '25 min' },
        { id: 'react-5', title: 'React Router', duration: '25 min' },
        { id: 'react-6', title: 'Context API va State Management', duration: '30 min' },
        { id: 'react-7', title: 'Custom Hooks yaratish', duration: '25 min' },
      ]
    },
    { id: 8, title: 'Next.js', emoji: '▲', desc: 'Full-stack framework', duration: '3-4 hafta', color: 'from-slate-700 to-slate-900',
      lessons: [
        { id: 'next-1', title: 'Next.js nima va loyiha yaratish', duration: '20 min' },
        { id: 'next-2', title: 'App Router va sahifalar', duration: '25 min' },
        { id: 'next-3', title: 'Server va Client komponentlar', duration: '25 min' },
        { id: 'next-4', title: 'API Routes yaratish', duration: '25 min' },
      ]
    },
    { id: 9, title: 'REST API', emoji: '🔗', desc: 'Backend bilan ishlash', duration: '1-2 hafta', color: 'from-green-500 to-emerald-600',
      lessons: [
        { id: 'api-1', title: 'REST API nima va qanday ishlaydi', duration: '15 min' },
        { id: 'api-2', title: 'Fetch va Axios bilan GET POST', duration: '25 min' },
        { id: 'api-3', title: 'CRUD operatsiyalar', duration: '25 min' },
        { id: 'api-4', title: 'Error handling va Loading states', duration: '20 min' },
      ]
    },
    { id: 10, title: 'Portfolio', emoji: '🚀', desc: 'Loyiha va deploy', duration: '2-3 hafta', color: 'from-purple-500 to-violet-600',
      lessons: [
        { id: 'port-1', title: 'Portfolio sayt yaratish', duration: '30 min' },
        { id: 'port-2', title: 'Vercel va Netlify ga deploy', duration: '20 min' },
        { id: 'port-3', title: 'GitHub profil bezash', duration: '15 min' },
      ]
    },
  ],
  backend: [
    { id: 1, title: 'Dasturlash asoslari', emoji: '📚', desc: 'Python yoki Node.js', duration: '2-3 hafta', color: 'from-green-500 to-emerald-600',
      lessons: [
        { id: 'be-1', title: 'Dasturlash tili tanlash va o\'rnatish', duration: '15 min' },
        { id: 'be-2', title: 'O\'zgaruvchilar va ma\'lumot turlari', duration: '20 min' },
        { id: 'be-3', title: 'Funksiyalar va OOP', duration: '30 min' },
      ]
    },
    { id: 2, title: 'Git & GitHub', emoji: '🐙', desc: 'Versiya boshqaruvi', duration: '1 hafta', color: 'from-gray-500 to-slate-600',
      lessons: [
        { id: 'be-git-1', title: 'Git asoslari', duration: '20 min' },
        { id: 'be-git-2', title: 'GitHub bilan ishlash', duration: '20 min' },
      ]
    },
    { id: 3, title: 'SQL & Database', emoji: '🗄', desc: 'Ma\'lumotlar bazasi', duration: '2-3 hafta', color: 'from-blue-500 to-cyan-500',
      lessons: [
        { id: 'be-sql-1', title: 'SQL nima va SELECT', duration: '20 min' },
        { id: 'be-sql-2', title: 'INSERT UPDATE DELETE', duration: '20 min' },
        { id: 'be-sql-3', title: 'JOIN va murakkab so\'rovlar', duration: '25 min' },
      ]
    },
    { id: 4, title: 'REST API', emoji: '🔗', desc: 'API yaratish', duration: '3-4 hafta', color: 'from-yellow-500 to-amber-500',
      lessons: [
        { id: 'be-api-1', title: 'Express/Django bilan server yaratish', duration: '25 min' },
        { id: 'be-api-2', title: 'REST API routing', duration: '25 min' },
        { id: 'be-api-3', title: 'CRUD API yaratish', duration: '30 min' },
      ]
    },
    { id: 5, title: 'Authentication', emoji: '🔐', desc: 'Autentifikatsiya', duration: '1-2 hafta', color: 'from-red-500 to-orange-500',
      lessons: [
        { id: 'be-auth-1', title: 'JWT nima va qanday ishlaydi', duration: '20 min' },
        { id: 'be-auth-2', title: 'Login Register tizimi', duration: '30 min' },
      ]
    },
    { id: 6, title: 'Docker & Deploy', emoji: '🐳', desc: 'Deploy', duration: '2-3 hafta', color: 'from-purple-500 to-violet-600',
      lessons: [
        { id: 'be-docker-1', title: 'Docker asoslari', duration: '25 min' },
        { id: 'be-docker-2', title: 'Deploy qilish', duration: '25 min' },
      ]
    },
  ],
  fullstack: [
    { id: 1, title: 'HTML & CSS', emoji: '🌐', desc: 'Web asoslari', duration: '2 hafta', color: 'from-orange-500 to-red-500',
      lessons: [
        { id: 'fs-1', title: 'HTML asoslari', duration: '20 min' },
        { id: 'fs-2', title: 'CSS Flexbox va Grid', duration: '25 min' },
      ]
    },
    { id: 2, title: 'JavaScript', emoji: '⚡', desc: 'Dasturlash tili', duration: '4-6 hafta', color: 'from-yellow-500 to-amber-500',
      lessons: [
        { id: 'fs-3', title: 'JavaScript asoslari', duration: '25 min' },
        { id: 'fs-4', title: 'ES6+ va Async', duration: '30 min' },
      ]
    },
    { id: 3, title: 'React.js', emoji: '⚛️', desc: 'Frontend framework', duration: '4 hafta', color: 'from-cyan-400 to-blue-500',
      lessons: [
        { id: 'fs-5', title: 'React komponentlar va Hooks', duration: '30 min' },
        { id: 'fs-6', title: 'React Router va State', duration: '25 min' },
      ]
    },
    { id: 4, title: 'Node.js & Express', emoji: '🟩', desc: 'Backend', duration: '3-4 hafta', color: 'from-green-500 to-emerald-600',
      lessons: [
        { id: 'fs-7', title: 'Node.js va Express asoslari', duration: '25 min' },
        { id: 'fs-8', title: 'REST API yaratish', duration: '30 min' },
      ]
    },
    { id: 5, title: 'MongoDB', emoji: '🍃', desc: 'Database', duration: '2 hafta', color: 'from-green-600 to-green-800',
      lessons: [
        { id: 'fs-9', title: 'MongoDB va Mongoose', duration: '25 min' },
        { id: 'fs-10', title: 'CRUD operatsiyalar', duration: '25 min' },
      ]
    },
    { id: 6, title: 'Full Stack loyiha', emoji: '🚀', desc: 'MERN Stack', duration: '4 hafta', color: 'from-purple-500 to-violet-600',
      lessons: [
        { id: 'fs-11', title: 'To\'liq loyiha yaratish', duration: '40 min' },
        { id: 'fs-12', title: 'Deploy va Portfolio', duration: '25 min' },
      ]
    },
  ],
  android: [
    { id: 1, title: 'Kotlin asoslari', emoji: '🟣', desc: 'Dasturlash tili', duration: '3-4 hafta', color: 'from-purple-500 to-violet-600',
      lessons: [
        { id: 'and-1', title: 'Kotlin sintaksisi', duration: '25 min' },
        { id: 'and-2', title: 'OOP va Null Safety', duration: '30 min' },
      ]
    },
    { id: 2, title: 'Android Studio', emoji: '🤖', desc: 'IDE', duration: '1 hafta', color: 'from-green-500 to-emerald-600',
      lessons: [
        { id: 'and-3', title: 'Android Studio o\'rnatish', duration: '15 min' },
        { id: 'and-4', title: 'Loyiha tuzilmasi', duration: '20 min' },
      ]
    },
    { id: 3, title: 'Jetpack Compose', emoji: '🎨', desc: 'UI yaratish', duration: '3-4 hafta', color: 'from-cyan-400 to-blue-500',
      lessons: [
        { id: 'and-5', title: 'Composable funksiyalar', duration: '25 min' },
        { id: 'and-6', title: 'Layout va Navigation', duration: '30 min' },
      ]
    },
    { id: 4, title: 'API & Database', emoji: '🗄', desc: 'Ma\'lumotlar', duration: '2-3 hafta', color: 'from-yellow-500 to-amber-500',
      lessons: [
        { id: 'and-7', title: 'Retrofit bilan API', duration: '25 min' },
        { id: 'and-8', title: 'Room Database', duration: '25 min' },
      ]
    },
    { id: 5, title: 'Play Store', emoji: '🚀', desc: 'Nashr qilish', duration: '3-4 hafta', color: 'from-red-500 to-orange-500',
      lessons: [
        { id: 'and-9', title: 'MVVM arxitektura', duration: '30 min' },
        { id: 'and-10', title: 'Play Store ga joylash', duration: '20 min' },
      ]
    },
  ],
  ios: [
    { id: 1, title: 'Swift asoslari', emoji: '🍎', desc: 'Dasturlash tili', duration: '3-4 hafta', color: 'from-blue-500 to-cyan-500',
      lessons: [{ id: 'ios-1', title: 'Swift sintaksisi va OOP', duration: '30 min' }]
    },
    { id: 2, title: 'SwiftUI', emoji: '🎨', desc: 'UI yaratish', duration: '3-4 hafta', color: 'from-purple-500 to-violet-600',
      lessons: [{ id: 'ios-2', title: 'SwiftUI Views va Modifiers', duration: '30 min' }]
    },
    { id: 3, title: 'Networking', emoji: '🔗', desc: 'API va ma\'lumotlar', duration: '2-3 hafta', color: 'from-green-500 to-emerald-600',
      lessons: [{ id: 'ios-3', title: 'URLSession va CoreData', duration: '30 min' }]
    },
    { id: 4, title: 'App Store', emoji: '🚀', desc: 'Nashr qilish', duration: '2 hafta', color: 'from-red-500 to-orange-500',
      lessons: [{ id: 'ios-4', title: 'App Store ga joylash', duration: '25 min' }]
    },
  ],
  'cross-platform': [
    { id: 1, title: 'Dart asoslari', emoji: '💙', desc: 'Flutter tili', duration: '2-3 hafta', color: 'from-blue-500 to-cyan-500',
      lessons: [{ id: 'cp-1', title: 'Dart sintaksisi', duration: '25 min' }, { id: 'cp-2', title: 'OOP va Async', duration: '25 min' }]
    },
    { id: 2, title: 'Flutter UI', emoji: '🎨', desc: 'Widget va Layout', duration: '3-4 hafta', color: 'from-cyan-400 to-blue-500',
      lessons: [{ id: 'cp-3', title: 'Widgets va Layout', duration: '30 min' }, { id: 'cp-4', title: 'Navigation va Animatsiya', duration: '25 min' }]
    },
    { id: 3, title: 'State Management', emoji: '📦', desc: 'Holatni boshqarish', duration: '2 hafta', color: 'from-purple-500 to-violet-600',
      lessons: [{ id: 'cp-5', title: 'Provider va Riverpod', duration: '30 min' }]
    },
    { id: 4, title: 'API & Firebase', emoji: '🔥', desc: 'Backend', duration: '2-3 hafta', color: 'from-yellow-500 to-amber-500',
      lessons: [{ id: 'cp-6', title: 'REST API va Firebase', duration: '30 min' }]
    },
    { id: 5, title: 'Deploy', emoji: '🚀', desc: 'Nashr qilish', duration: '2 hafta', color: 'from-green-500 to-emerald-600',
      lessons: [{ id: 'cp-7', title: 'Play Store va App Store', duration: '25 min' }]
    },
  ],
  'ai-ml': [
    { id: 1, title: 'Python', emoji: '🐍', desc: 'Dasturlash tili', duration: '3-4 hafta', color: 'from-green-500 to-emerald-600',
      lessons: [{ id: 'ml-1', title: 'Python asoslari', duration: '25 min' }, { id: 'ml-2', title: 'Libraries va OOP', duration: '25 min' }]
    },
    { id: 2, title: 'Matematika', emoji: '📐', desc: 'ML uchun math', duration: '2-3 hafta', color: 'from-blue-500 to-cyan-500',
      lessons: [{ id: 'ml-3', title: 'Linear Algebra va Statistika', duration: '30 min' }]
    },
    { id: 3, title: 'Data Analysis', emoji: '📊', desc: 'Tahlil', duration: '2-3 hafta', color: 'from-yellow-500 to-amber-500',
      lessons: [{ id: 'ml-4', title: 'Pandas va NumPy', duration: '30 min' }, { id: 'ml-5', title: 'Matplotlib bilan vizualizatsiya', duration: '25 min' }]
    },
    { id: 4, title: 'Machine Learning', emoji: '🧠', desc: 'ML algoritmlari', duration: '4-6 hafta', color: 'from-purple-500 to-violet-600',
      lessons: [{ id: 'ml-6', title: 'Scikit-learn va Regression', duration: '30 min' }, { id: 'ml-7', title: 'Classification va Clustering', duration: '30 min' }]
    },
    { id: 5, title: 'Deep Learning', emoji: '🔥', desc: 'Neyron tarmoqlar', duration: '4-6 hafta', color: 'from-red-500 to-orange-500',
      lessons: [{ id: 'ml-8', title: 'TensorFlow va PyTorch', duration: '35 min' }]
    },
  ],
  'data-science': [
    { id: 1, title: 'Python', emoji: '🐍', desc: 'Asosiy til', duration: '3 hafta', color: 'from-green-500 to-emerald-600',
      lessons: [{ id: 'ds-1', title: 'Python va Jupyter Notebook', duration: '25 min' }]
    },
    { id: 2, title: 'Pandas & NumPy', emoji: '🐼', desc: 'Ma\'lumotlar bilan ishlash', duration: '2-3 hafta', color: 'from-blue-500 to-cyan-500',
      lessons: [{ id: 'ds-2', title: 'DataFrame va Series', duration: '30 min' }]
    },
    { id: 3, title: 'SQL', emoji: '🗄', desc: 'Database', duration: '2 hafta', color: 'from-yellow-500 to-amber-500',
      lessons: [{ id: 'ds-3', title: 'SQL asoslari', duration: '25 min' }]
    },
    { id: 4, title: 'Vizualizatsiya', emoji: '📈', desc: 'Grafiklar', duration: '1-2 hafta', color: 'from-purple-500 to-violet-600',
      lessons: [{ id: 'ds-4', title: 'Matplotlib va Seaborn', duration: '25 min' }]
    },
    { id: 5, title: 'ML asoslari', emoji: '🧠', desc: 'Machine Learning', duration: '3-4 hafta', color: 'from-red-500 to-orange-500',
      lessons: [{ id: 'ds-5', title: 'Scikit-learn bilan ML', duration: '30 min' }]
    },
  ],
  'data-analytics': [
    { id: 1, title: 'Excel', emoji: '📊', desc: 'Jadvallar', duration: '2 hafta', color: 'from-green-500 to-emerald-600',
      lessons: [{ id: 'da-1', title: 'Excel formulalar va Pivot Table', duration: '25 min' }]
    },
    { id: 2, title: 'SQL', emoji: '🗄', desc: 'Database so\'rovlari', duration: '2-3 hafta', color: 'from-blue-500 to-cyan-500',
      lessons: [{ id: 'da-2', title: 'SQL SELECT JOIN GROUP BY', duration: '30 min' }]
    },
    { id: 3, title: 'Power BI', emoji: '📈', desc: 'Vizualizatsiya', duration: '2-3 hafta', color: 'from-yellow-500 to-amber-500',
      lessons: [{ id: 'da-3', title: 'Dashboard yaratish', duration: '30 min' }]
    },
    { id: 4, title: 'Python', emoji: '🐍', desc: 'Analitika', duration: '2-3 hafta', color: 'from-purple-500 to-violet-600',
      lessons: [{ id: 'da-4', title: 'Pandas bilan tahlil', duration: '25 min' }]
    },
  ],
  'desktop-dev': [
    { id: 1, title: 'C# asoslari', emoji: '🟣', desc: 'Dasturlash tili', duration: '3-4 hafta', color: 'from-purple-500 to-violet-600',
      lessons: [{ id: 'dd-1', title: 'C# sintaksisi va OOP', duration: '30 min' }]
    },
    { id: 2, title: 'WPF', emoji: '🖥', desc: 'Desktop UI', duration: '3-4 hafta', color: 'from-blue-500 to-cyan-500',
      lessons: [{ id: 'dd-2', title: 'XAML va WPF asoslari', duration: '30 min' }]
    },
    { id: 3, title: 'Database', emoji: '🗄', desc: 'Ma\'lumotlar bazasi', duration: '2 hafta', color: 'from-green-500 to-emerald-600',
      lessons: [{ id: 'dd-3', title: 'Entity Framework', duration: '25 min' }]
    },
    { id: 4, title: 'Deploy', emoji: '🚀', desc: 'Tarqatish', duration: '1 hafta', color: 'from-red-500 to-orange-500',
      lessons: [{ id: 'dd-4', title: 'Installer yaratish', duration: '20 min' }]
    },
  ],
  unity: [
    { id: 1, title: 'C# asoslari', emoji: '🟣', desc: 'Dasturlash', duration: '3-4 hafta', color: 'from-purple-500 to-violet-600',
      lessons: [{ id: 'u-1', title: 'C# va Unity uchun OOP', duration: '30 min' }]
    },
    { id: 2, title: 'Unity Editor', emoji: '🎮', desc: 'Editor', duration: '1-2 hafta', color: 'from-gray-500 to-slate-600',
      lessons: [{ id: 'u-2', title: 'Unity interfeysi va Scene', duration: '25 min' }]
    },
    { id: 3, title: '2D O\'yin', emoji: '🕹', desc: '2D game', duration: '3-4 hafta', color: 'from-green-500 to-emerald-600',
      lessons: [{ id: 'u-3', title: 'Sprite va Physics 2D', duration: '30 min' }]
    },
    { id: 4, title: '3D O\'yin', emoji: '🌍', desc: '3D game', duration: '4-6 hafta', color: 'from-blue-500 to-cyan-500',
      lessons: [{ id: 'u-4', title: '3D modellar va fizika', duration: '35 min' }]
    },
  ],
  unreal: [
    { id: 1, title: 'C++ asoslari', emoji: '🔵', desc: 'Dasturlash', duration: '4-6 hafta', color: 'from-blue-600 to-blue-800',
      lessons: [{ id: 'ue-1', title: 'C++ sintaksisi va OOP', duration: '35 min' }]
    },
    { id: 2, title: 'Unreal Editor', emoji: '🎮', desc: 'Editor', duration: '2 hafta', color: 'from-gray-500 to-slate-600',
      lessons: [{ id: 'ue-2', title: 'Unreal interfeysi', duration: '25 min' }]
    },
    { id: 3, title: 'Blueprints', emoji: '📘', desc: 'Visual scripting', duration: '3-4 hafta', color: 'from-purple-500 to-violet-600',
      lessons: [{ id: 'ue-3', title: 'Blueprint asoslari', duration: '30 min' }]
    },
  ],
  'manual-testing': [
    { id: 1, title: 'QA asoslari', emoji: '🔍', desc: 'Testlash nima', duration: '2 hafta', color: 'from-green-500 to-emerald-600',
      lessons: [{ id: 'mt-1', title: 'QA va SDLC', duration: '20 min' }, { id: 'mt-2', title: 'Test turlari', duration: '20 min' }]
    },
    { id: 2, title: 'Test Case', emoji: '📝', desc: 'Test yozish', duration: '2-3 hafta', color: 'from-blue-500 to-cyan-500',
      lessons: [{ id: 'mt-3', title: 'Test case va bug report', duration: '25 min' }]
    },
    { id: 3, title: 'API Testing', emoji: '🔗', desc: 'Postman', duration: '1-2 hafta', color: 'from-yellow-500 to-amber-500',
      lessons: [{ id: 'mt-4', title: 'Postman bilan API test', duration: '25 min' }]
    },
  ],
  'automation-testing': [
    { id: 1, title: 'Dasturlash', emoji: '💻', desc: 'Python yoki Java', duration: '3-4 hafta', color: 'from-green-500 to-emerald-600',
      lessons: [{ id: 'at-1', title: 'Dasturlash asoslari', duration: '30 min' }]
    },
    { id: 2, title: 'Selenium', emoji: '🌐', desc: 'Web automation', duration: '3-4 hafta', color: 'from-blue-500 to-cyan-500',
      lessons: [{ id: 'at-2', title: 'Selenium WebDriver', duration: '30 min' }]
    },
    { id: 3, title: 'CI/CD', emoji: '🔄', desc: 'Avtomatlashtirish', duration: '2 hafta', color: 'from-purple-500 to-violet-600',
      lessons: [{ id: 'at-3', title: 'Jenkins va GitHub Actions', duration: '25 min' }]
    },
  ],
  'ui-design': [
    { id: 1, title: 'Dizayn asoslari', emoji: '🎨', desc: 'Asosiy tamoyillar', duration: '2 hafta', color: 'from-pink-500 to-rose-600',
      lessons: [{ id: 'uid-1', title: 'Ranglar va tipografiya', duration: '20 min' }, { id: 'uid-2', title: 'Layout va composition', duration: '25 min' }]
    },
    { id: 2, title: 'Figma', emoji: '🖌', desc: 'Dizayn asbob', duration: '3-4 hafta', color: 'from-purple-500 to-violet-600',
      lessons: [{ id: 'uid-3', title: 'Figma asoslari', duration: '30 min' }]
    },
    { id: 3, title: 'UI Components', emoji: '📦', desc: 'Komponentlar', duration: '2-3 hafta', color: 'from-blue-500 to-cyan-500',
      lessons: [{ id: 'uid-4', title: 'Dizayn tizimi yaratish', duration: '30 min' }]
    },
  ],
  'ux-design': [
    { id: 1, title: 'UX asoslari', emoji: '🧩', desc: 'Foydalanuvchi tajribasi', duration: '2 hafta', color: 'from-teal-500 to-cyan-500',
      lessons: [{ id: 'uxd-1', title: 'UX nima va nima uchun kerak', duration: '20 min' }]
    },
    { id: 2, title: 'Research', emoji: '🔍', desc: 'Tadqiqot', duration: '2-3 hafta', color: 'from-purple-500 to-violet-600',
      lessons: [{ id: 'uxd-2', title: 'User Research va Persona', duration: '25 min' }]
    },
    { id: 3, title: 'Prototyping', emoji: '📐', desc: 'Prototip yaratish', duration: '2-3 hafta', color: 'from-blue-500 to-cyan-500',
      lessons: [{ id: 'uxd-3', title: 'Wireframe va Prototype', duration: '30 min' }]
    },
  ],
}

const Course = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { userProfile } = useAuth()
  const { collapsed } = useSidebar()
  const contentRef = useRef(null)

  // field ma'lumotlarini olish
  const field = location.state?.field || userProfile?.field || 'frontend'
  const fieldName = location.state?.fieldName || userProfile?.fieldName || 'Frontend Development'
  const categoryName = location.state?.categoryName || userProfile?.categoryName || 'Web Dasturlash'

  const chapters = courseStructure[field] || courseStructure.frontend
  
  const [activeChapter, setActiveChapter] = useState(0)
  const [activeLesson, setActiveLesson] = useState(0)
  const [completedLessons, setCompletedLessons] = useState([])
  const [lessonContent, setLessonContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  const currentChapter = chapters[activeChapter]
  const currentLesson = currentChapter?.lessons[activeLesson]
  
  // Umumiy darslar soni va tugatilganlar
  const totalLessons = chapters.reduce((acc, ch) => acc + ch.lessons.length, 0)
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0

  // AI bilan dars kontentini generatsiya qilish
  const generateLessonContent = async () => {
    setLoading(true)
    setLessonContent('')

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      setLessonContent(`# ${currentLesson.title}\n\nAI dars kontenti uchun Gemini API kalitini .env faylga qo'shing.\n\n**VITE_GEMINI_API_KEY** o'zgaruvchisini sozlang.`)
      setLoading(false)
      return
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

      const prompt = `Sen dasturlash o'qituvchisisan. "${currentLesson.title}" mavzusida dars yoz.

Yo'nalish: ${fieldName} (${categoryName})
Bo'lim: ${currentChapter.title}

Quyidagi formatda yoz:
1. Mavzu haqida qisqacha kirish (2-3 jumla)
2. Asosiy tushunchalar (har birini alohida tushuntir)
3. Kod misollari (agar dasturlash mavzusi bo'lsa)
4. Amaliy mashq (1-2 ta topshiriq)

Qoidalar:
- O'zbek tilida yoz
- Boshlang'ich daraja uchun tushunarli bo'lsin
- Kod misollarini \`\`\` bilan o'ra
- Emoji ishlat
- Aniq va qisqa yoz
- Har bir tushunchani hayotiy misol bilan tushuntir`

      const result = await model.generateContent(prompt)
      const text = result.response.text()
      setLessonContent(text)
    } catch (err) {
      console.error('AI content error:', err)
      setLessonContent(`# ${currentLesson.title}\n\nDars kontentini yuklashda xatolik yuz berdi. Iltimos qayta urinib ko'ring.`)
    } finally {
      setLoading(false)
    }
  }

  // Dars o'zgarganda kontentni yangilash
  useEffect(() => {
    generateLessonContent()
  }, [activeChapter, activeLesson])

  // Scroll to top when lesson changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo(0, 0)
    }
  }, [activeChapter, activeLesson])

  const handleLessonComplete = () => {
    const lessonId = currentLesson.id
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons(prev => [...prev, lessonId])
    }
    // Keyingi darsga o'tish
    handleNextLesson()
  }

  const handleNextLesson = () => {
    if (activeLesson < currentChapter.lessons.length - 1) {
      setActiveLesson(activeLesson + 1)
    } else if (activeChapter < chapters.length - 1) {
      setActiveChapter(activeChapter + 1)
      setActiveLesson(0)
    }
  }

  const handlePrevLesson = () => {
    if (activeLesson > 0) {
      setActiveLesson(activeLesson - 1)
    } else if (activeChapter > 0) {
      setActiveChapter(activeChapter - 1)
      setActiveLesson(chapters[activeChapter - 1].lessons.length - 1)
    }
  }

  const selectLesson = (chapterIndex, lessonIndex) => {
    setActiveChapter(chapterIndex)
    setActiveLesson(lessonIndex)
    setShowMobileSidebar(false)
  }

  // Markdown ni oddiy HTML ga aylantirish
  const renderMarkdown = (text) => {
    if (!text) return ''
    
    let html = text
    // Headers
    html = html.replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold text-white mt-6 mb-2">$1</h3>')
    html = html.replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-white mt-8 mb-3">$1</h2>')
    html = html.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-white mt-6 mb-4">$1</h1>')
    
    // Bold and italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="text-white"><em>$1</em></strong>')
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-700 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    
    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<div class="my-4 rounded-xl overflow-hidden border border-slate-700">
        <div class="bg-slate-700/50 px-4 py-2 text-xs text-slate-400 font-mono">${lang || 'code'}</div>
        <pre class="bg-slate-800/80 p-4 overflow-x-auto"><code class="text-sm text-green-300 font-mono whitespace-pre">${code.trim()}</code></pre>
      </div>`
    })
    
    // Lists
    html = html.replace(/^- (.*$)/gm, '<li class="flex items-start gap-2 mb-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0"></span><span>$1</span></li>')
    html = html.replace(/^\d+\. (.*$)/gm, '<li class="flex items-start gap-2 mb-1.5"><span class="text-blue-400 font-medium shrink-0">•</span><span>$1</span></li>')
    
    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p class="text-slate-300 leading-relaxed mb-3">')
    html = '<p class="text-slate-300 leading-relaxed mb-3">' + html + '</p>'
    
    return html
  }

  const isFirstLesson = activeChapter === 0 && activeLesson === 0
  const isLastLesson = activeChapter === chapters.length - 1 && activeLesson === currentChapter.lessons.length - 1

  return (
    <div className={`flex h-screen bg-slate-900 ${collapsed ? 'pl-21.25' : 'pl-64'} transition-all duration-300`}>
      <Sidebar />

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-700 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setShowMobileSidebar(!showMobileSidebar)} className="text-slate-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-white font-medium text-sm truncate">{currentLesson?.title}</h1>
          <div className="w-6" />
        </div>

        {/* Course Sidebar - Bo'limlar ro'yxati */}
        <div className={`${showMobileSidebar ? 'fixed inset-0 z-40' : 'hidden'} lg:relative lg:block`}>
          {showMobileSidebar && (
            <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setShowMobileSidebar(false)} />
          )}
          <div className={`${showMobileSidebar ? 'fixed left-0 top-0 z-50 h-full' : ''} w-80 bg-slate-800/50 border-r border-slate-700 h-full flex flex-col`}>
            {/* Course Header */}
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-white font-bold text-lg truncate">{fieldName}</h2>
                {showMobileSidebar && (
                  <button onClick={() => setShowMobileSidebar(false)} className="ml-auto text-slate-400 hover:text-white lg:hidden">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <p className="text-slate-500 text-xs mb-3">{categoryName}</p>
              
              {/* Progress */}
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-linear-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-slate-400 text-xs font-medium">{progressPercent}%</span>
              </div>
              <p className="text-slate-500 text-xs mt-1">{completedLessons.length}/{totalLessons} dars</p>
            </div>

            {/* Chapters List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {chapters.map((chapter, chIdx) => {
                const chapterLessons = chapter.lessons
                const completedInChapter = chapterLessons.filter(l => completedLessons.includes(l.id)).length
                const isActiveChapter = chIdx === activeChapter

                return (
                  <div key={chapter.id} className="rounded-lg overflow-hidden">
                    <button 
                      onClick={() => {
                        if (isActiveChapter) return
                        setActiveChapter(chIdx)
                        setActiveLesson(0)
                      }}
                      className={`w-full text-left p-3 flex items-center gap-3 transition-all ${
                        isActiveChapter 
                          ? 'bg-slate-700/50' 
                          : 'hover:bg-slate-700/30'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg bg-linear-to-r ${chapter.color} flex items-center justify-center shrink-0 text-sm`}>
                        {chapter.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm truncate ${isActiveChapter ? 'text-white' : 'text-slate-300'}`}>
                          {chapter.title}
                        </p>
                        <p className="text-slate-500 text-xs">{completedInChapter}/{chapterLessons.length} dars</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isActiveChapter ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Lessons in chapter */}
                    {isActiveChapter && (
                      <div className="pb-2">
                        {chapterLessons.map((lesson, lIdx) => {
                          const isActive = chIdx === activeChapter && lIdx === activeLesson
                          const isCompleted = completedLessons.includes(lesson.id)
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => selectLesson(chIdx, lIdx)}
                              className={`w-full text-left px-3 py-2 ml-4 mr-2 flex items-center gap-2.5 rounded-lg transition-all text-sm ${
                                isActive 
                                  ? 'bg-blue-500/10 text-blue-400' 
                                  : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                              ) : isActive ? (
                                <Play className="w-4 h-4 text-blue-400 shrink-0" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                              )}
                              <span className="truncate">{lesson.title}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:pt-0 pt-14">
          {/* Top Bar */}
          <div className="border-b border-slate-700 px-6 py-3 flex items-center justify-between bg-slate-900/80 backdrop-blur shrink-0">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg bg-linear-to-r ${currentChapter.color} flex items-center justify-center text-sm`}>
                {currentChapter.emoji}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{currentLesson?.title}</p>
                <p className="text-slate-500 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {currentLesson?.duration}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={generateLessonContent}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm transition"
              >
                <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Qayta yuklash</span>
              </button>
            </div>
          </div>

          {/* Lesson Content */}
          <div ref={contentRef} className="flex-1 overflow-y-auto p-6 lg:p-10">
            <div className="max-w-3xl mx-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium mb-1">AI dars tayyorlamoqda</p>
                    <p className="text-slate-500 text-sm">Bir necha soniya kuting</p>
                  </div>
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
              ) : (
                <>
                  <div 
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(lessonContent) }}
                  />

                  {/* Bottom Actions */}
                  <div className="mt-10 pt-6 border-t border-slate-700 flex items-center justify-between">
                    <button
                      onClick={handlePrevLesson}
                      disabled={isFirstLesson}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                        isFirstLesson
                          ? 'text-slate-600 cursor-not-allowed'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span className="hidden sm:inline">Oldingi</span>
                    </button>

                    <button
                      onClick={handleLessonComplete}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-linear-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105 transition-all"
                    >
                      {isLastLesson ? (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Kursni tugatish
                        </>
                      ) : completedLessons.includes(currentLesson?.id) ? (
                        <>
                          Keyingi dars
                          <ArrowRight className="w-5 h-5" />
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Tugatish va keyingi
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Course
