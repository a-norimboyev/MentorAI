export const techOptions = {
  // Web - Frontend (CSS only)
  frontend: [
    { id: 'css', name: 'CSS', emoji: '🎨', desc: 'Dizayn va stillar berish' },
    { id: 'tailwind', name: 'Tailwind CSS', emoji: '💨', desc: 'Utility-first CSS framework' },
    { id: 'bootstrap', name: 'Bootstrap', emoji: '🟪', desc: 'Tayyor UI komponentlar to\'plami' },
    { id: 'sass', name: 'Sass/SCSS', emoji: '💅', desc: 'CSS preprocessor - kengaytirilgan stillar' },
  ],
  // Web - Backend
  backend: [
    { id: 'nodejs', name: 'Node.js', emoji: '🟩', desc: 'JavaScript bilan server yaratish' },
    { id: 'python', name: 'Python (Django/Flask)', emoji: '🐍', desc: 'Tez va qulay backend framework' },
    { id: 'java', name: 'Java (Spring)', emoji: '☕', desc: 'Korporativ darajadagi backend' },
    { id: 'php', name: 'PHP (Laravel)', emoji: '🐘', desc: 'Web uchun mashhur server tili' },
    { id: 'golang', name: 'Go', emoji: '🔵', desc: 'Tez va samarali server dasturlash' },
    { id: 'csharp', name: 'C# (.NET)', emoji: '🟣', desc: 'Microsoft ekotizimi backend' },
  ],
  // Web - Fullstack
  fullstack: [
    { id: 'mern', name: 'MERN Stack', emoji: '🟢', desc: 'MongoDB + Express + React + Node' },
    { id: 'mevn', name: 'MEVN Stack', emoji: '💚', desc: 'MongoDB + Express + Vue + Node' },
    { id: 'mean', name: 'MEAN Stack', emoji: '🅰️', desc: 'MongoDB + Express + Angular + Node' },
    { id: 'nextjs-full', name: 'Next.js Full Stack', emoji: '▲', desc: 'React asosida frontend + backend' },
    { id: 'django-full', name: 'Django Full Stack', emoji: '🐍', desc: 'Python bilan to\'liq web ilova' },
    { id: 'laravel-full', name: 'Laravel Full Stack', emoji: '🐘', desc: 'PHP bilan to\'liq web ilova' },
  ],
  // Mobile
  android: [
    { id: 'kotlin', name: 'Kotlin', emoji: '🟣', desc: 'Zamonaviy Android dasturlash tili' },
    { id: 'java-android', name: 'Java', emoji: '☕', desc: 'Klassik Android dasturlash' },
    { id: 'jetpack', name: 'Jetpack Compose', emoji: '🎨', desc: 'Deklarativ UI yaratish' },
  ],
  ios: [
    { id: 'swift', name: 'Swift', emoji: '🍎', desc: 'Apple qurilmalari uchun til' },
    { id: 'swiftui', name: 'SwiftUI', emoji: '🎨', desc: 'Zamonaviy deklarativ iOS UI' },
    { id: 'uikit', name: 'UIKit', emoji: '📱', desc: 'Klassik iOS interfeys yaratish' },
  ],
  'cross-platform': [
    { id: 'flutter', name: 'Flutter (Dart)', emoji: '💙', desc: 'Android va iOS uchun bitta kod' },
    { id: 'react-native', name: 'React Native', emoji: '⚛️', desc: 'React bilan mobil ilova yaratish' },
    { id: 'kotlin-multi', name: 'Kotlin Multiplatform', emoji: '🟣', desc: 'Kotlin bilan kross-platforma' },
  ],
  // AI & Data
  'ai-ml': [
    { id: 'tensorflow', name: 'TensorFlow', emoji: '🧠', desc: 'Google ning ML kutubxonasi' },
    { id: 'pytorch', name: 'PyTorch', emoji: '🔥', desc: 'Ilmiy tadqiqotlar uchun ML' },
    { id: 'scikit', name: 'Scikit-learn', emoji: '📊', desc: 'Klassik ML algoritmlari' },
    { id: 'opencv', name: 'OpenCV', emoji: '👁', desc: 'Kompyuter ko\'rish texnologiyasi' },
  ],
  'data-science': [
    { id: 'pandas', name: 'Pandas', emoji: '🐼', desc: 'Ma\'lumotlarni tahlil qilish' },
    { id: 'numpy', name: 'NumPy', emoji: '🔢', desc: 'Raqamli hisoblash kutubxonasi' },
    { id: 'jupyter', name: 'Jupyter Notebook', emoji: '📓', desc: 'Interaktiv kod va tahlil' },
    { id: 'sql-ds', name: 'SQL', emoji: '🗄', desc: 'Ma\'lumotlar bazasi so\'rovlari' },
  ],
  'data-analytics': [
    { id: 'excel', name: 'Excel / Google Sheets', emoji: '📊', desc: 'Jadval va hisobotlar tayyorlash' },
    { id: 'powerbi', name: 'Power BI', emoji: '📈', desc: 'Microsoft vizualizatsiya vositasi' },
    { id: 'tableau', name: 'Tableau', emoji: '📉', desc: 'Ma\'lumotlarni vizualizatsiya qilish' },
    { id: 'sql-da', name: 'SQL', emoji: '🗄', desc: 'Ma\'lumotlar bazasi so\'rovlari' },
  ],
  // Desktop
  'desktop-dev': [
    { id: 'csharp-wpf', name: 'C# (WPF)', emoji: '🟣', desc: 'Windows uchun desktop ilovalar' },
    { id: 'java-desktop', name: 'Java (JavaFX)', emoji: '☕', desc: 'Kross-platforma desktop ilovalar' },
    { id: 'cpp-qt', name: 'C++ (Qt)', emoji: '🔵', desc: 'Yuqori samarali desktop ilovalar' },
    { id: 'electron', name: 'Electron', emoji: '⚡', desc: 'Web texnologiyalar bilan desktop' },
  ],
  // Game
  unity: [
    { id: 'unity-2d', name: 'Unity 2D', emoji: '🎮', desc: '2D o\'yinlar yaratish' },
    { id: 'unity-3d', name: 'Unity 3D', emoji: '🌍', desc: '3D o\'yinlar va simulyatsiyalar' },
    { id: 'unity-vr', name: 'Unity VR/AR', emoji: '🥽', desc: 'Virtual va kengaytirilgan reallik' },
  ],
  unreal: [
    { id: 'unreal-bp', name: 'Blueprints', emoji: '🧩', desc: 'Vizual skriptlash tizimi' },
    { id: 'unreal-cpp', name: 'C++', emoji: '⚙️', desc: 'Yuqori samarali o\'yin dasturlash' },
  ],
  // QA
  'manual-testing': [
    { id: 'functional', name: 'Functional Testing', emoji: '✅', desc: 'Funksional test o\'tkazish' },
    { id: 'regression', name: 'Regression Testing', emoji: '🔄', desc: 'O\'zgarishlardan keyin qayta test' },
    { id: 'api-testing', name: 'API Testing (Postman)', emoji: '📮', desc: 'API so\'rovlarni sinash' },
  ],
  'automation-testing': [
    { id: 'selenium', name: 'Selenium', emoji: '🤖', desc: 'Brauzer avtomatik test' },
    { id: 'cypress', name: 'Cypress', emoji: '🌲', desc: 'Zamonaviy frontend testlash' },
    { id: 'playwright', name: 'Playwright', emoji: '🎭', desc: 'Microsoft ning test vositasi' },
    { id: 'appium', name: 'Appium', emoji: '📱', desc: 'Mobil ilovalarni avtomatik test' },
  ],
  // UI/UX
  'ui-design': [
    { id: 'figma', name: 'Figma', emoji: '🎨', desc: 'Zamonaviy dizayn vositasi' },
    { id: 'adobe-xd', name: 'Adobe XD', emoji: '🖌', desc: 'Adobe ning UI dizayn dasturi' },
    { id: 'sketch', name: 'Sketch', emoji: '✏️', desc: 'macOS uchun dizayn vositasi' },
  ],
  'ux-design': [
    { id: 'figma-ux', name: 'Figma', emoji: '🎨', desc: 'Prototip va dizayn yaratish' },
    { id: 'user-research', name: 'User Research', emoji: '🔍', desc: 'Foydalanuvchi ehtiyojlarini o\'rganish' },
    { id: 'prototyping', name: 'Prototyping', emoji: '📐', desc: 'Interaktiv prototiplar yaratish' },
  ],
}

export const hourOptions = [
  { id: '1-2', label: '1-2 soat', desc: 'Kunlik oddiy mashg\'ul', emoji: '🕐' },
  { id: '2-4', label: '2-4 soat', desc: 'O\'rtacha jadval', emoji: '🕑' },
  { id: '4-6', label: '4-6 soat', desc: 'Jiddiy o\'rganish', emoji: '🕓' },
  { id: '6+', label: '6+ soat', desc: 'To\'liq vaqtli', emoji: '🔥' },
]

export const englishOptions = [
  { id: 'a1', label: 'A1 — Beginner', desc: "Ingliz tilini endigina boshlayman", emoji: '🌱' },
  { id: 'a2', label: 'A2 — Elementary', desc: "Oddiy so'zlar va iboralarni tushunaman", emoji: '📗' },
  { id: 'b1', label: 'B1 — Intermediate', desc: "Texnik hujjatlarni qisman o'qiy olaman", emoji: '📘' },
  { id: 'b2', label: 'B2 — Upper Intermediate', desc: "Texnik dokumentatsiyani erkin o'qiyman", emoji: '📙' },
  { id: 'c1', label: 'C1 — Advanced', desc: "Ingliz tilida erkin muloqot qilaman", emoji: '📕' },
  { id: 'c2', label: 'C2 — Proficient', desc: "Ona tilidek bilaman", emoji: '🏆' },
]

export const experienceOptions = [
  { id: 'no', label: "Yo'q", desc: "Umuman o'qimaganman", emoji: '🆕' },
  { id: 'little', label: 'Biroz', desc: "Ozgina bilaman, video ko'rganman", emoji: '📖' },
  { id: 'yes', label: 'Ha', desc: "Oldin o'qiganman va tajribam bor", emoji: '✅' },
  { id: 'working', label: 'Ishlayman', desc: 'Hozir shu sohada ishlayman', emoji: '💼' },
]

export const ageOptions = [
  { id: '14-17', label: '14-17 yosh', emoji: '🎒' },
  { id: '18-24', label: '18-24 yosh', emoji: '🎓' },
  { id: '25-34', label: '25-34 yosh', emoji: '💼' },
  { id: '35+', label: '35+ yosh', emoji: '🌟' },
]

