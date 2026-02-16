import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { GraduationCap, CheckCircle2, Lock, ChevronRight, ChevronDown, ArrowRight, BookOpen, Target, Lightbulb, ExternalLink } from 'lucide-react'

const roadmaps = {
  frontend: [
    {
      id: 1, title: 'HTML', emoji: '🌐',
      desc: 'Web sahifalarning asosi. Tuzilish va elementlarni o\'rganing',
      duration: '1-2 hafta',
      topics: ['Teglar va atributlar', 'Formalar', 'Semantik HTML', 'Jadvallar', 'Media elementlar'],
      color: 'from-orange-500 to-red-500',
      details: {
        about: 'HTML (HyperText Markup Language) — bu barcha web sahifalarning asosi. Brauzer ko\'radigan har bir sahifa HTML dan tuzilgan. Siz teglar yordamida matn, rasm, video, havolalar va formalarni joylashtirasiz',
        why: 'HTMLsiz birorta ham web sahifa mavjud emas. Bu frontend yo\'lining birinchi va eng muhim qadami. Barcha boshqa texnologiyalar (CSS, JS, React) HTML ustiga quriladi',
        resources: ['MDN Web Docs — HTML', 'W3Schools HTML Tutorial', 'freeCodeCamp — HTML kurs', 'YouTube: HTML Crash Course'],
        tips: 'Har kuni kamida 1 ta yangi teg o\'rganing. Amaliyot muhim — har bir mavzuni o\'zingiz yozib ko\'ring. Semantik teglarni (header, nav, main, footer) boshidanoq o\'rganing'
      }
    },
    {
      id: 2, title: 'CSS', emoji: '🎨',
      desc: 'Sahifalarni chiroyli qilish. Dizayn va stillar',
      duration: '2-3 hafta',
      topics: ['Selektorlar', 'Flexbox', 'Grid', 'Responsive Design', 'Animatsiyalar', 'Pozitsiyalash'],
      color: 'from-blue-500 to-cyan-500',
      details: {
        about: 'CSS (Cascading Style Sheets) — web sahifalarning ko\'rinishini boshqaradi. Ranglar, shriftlar, joylashuv, animatsiyalar — bularning barchasi CSS orqali yaratiladi',
        why: 'HTML faqat tuzilmani beradi, CSS esa chiroyli dizayn yaratadi. Flexbox va Grid yordamida murakkab layoutlarni osongina yaratish mumkin. Responsive design mobil qurilmalarda to\'g\'ri ko\'rinish uchun zarur',
        resources: ['MDN — CSS bo\'limi', 'CSS-Tricks — Flexbox Guide', 'freeCodeCamp — Responsive Design', 'YouTube: Kevin Powell CSS'],
        tips: 'Flexbox va Grid ni yaxshi o\'rganing — bu eng ko\'p ishlatiladigan layoutlar. Chrome DevTools orqali stillarni tekshirib o\'rganing. Mobile-first yondashuvni boshidanoq qo\'llang'
      }
    },
    {
      id: 3, title: 'JavaScript', emoji: '⚡',
      desc: 'Sahifalarni interaktiv qilish. Dasturlash asoslari',
      duration: '4-6 hafta',
      topics: ['O\'zgaruvchilar va tiplar', 'Funksiyalar', 'DOM manipulyatsiya', 'Async/Await', 'ES6+ sintaksis', 'Array metodlari'],
      color: 'from-yellow-500 to-amber-500',
      details: {
        about: 'JavaScript — web ning dasturlash tili. Sahifaga interaktivlik qo\'shadi: tugmalar bosilganda javob berish, ma\'lumotlarni dinamik ko\'rsatish, API dan ma\'lumot olish va hokazo',
        why: 'JavaScript frontend ning yuragi. React, Vue, Angular — bularning barchasi JS da yozilgan. Uni yaxshi bilmasangiz, framework larni o\'rganish juda qiyin bo\'ladi. Shuningdek backend (Node.js) da ham ishlatiladi',
        resources: ['JavaScript.info — to\'liq qo\'llanma', 'freeCodeCamp — JS Algorithms', 'Eloquent JavaScript (kitob)', 'YouTube: Traversy Media JS Crash Course'],
        tips: 'Har kuni kamida 2-3 soat amaliyot qiling. Console.log bilan tajriba qiling. Array metodlari (map, filter, reduce) ni yaxshi o\'rganing — React da juda ko\'p ishlatiladi'
      }
    },
    {
      id: 4, title: 'Git & GitHub', emoji: '🐙',
      desc: 'Kodni boshqarish va jamoaviy ishlash',
      duration: '1 hafta',
      topics: ['Git asoslari', 'Branch strategiyasi', 'Merge va Rebase', 'Pull Request', 'GitHub profil'],
      color: 'from-gray-500 to-slate-600',
      details: {
        about: 'Git — kodni versiyalash tizimi. Har bir o\'zgarishni saqlaydi va kerak bo\'lsa eski holatga qaytarish mumkin. GitHub — bu kodingizni onlayn saqlash va boshqalar bilan ulashish platformasi',
        why: 'Hamma kompaniyalar Git ishlatadi. Portfolio loyihalaringizni GitHub da saqlaysiz — bu sizning dasturchi rezyumeingiz. Jamoaviy ishlashda Git bilmaslik mumkin emas',
        resources: ['Git rasmiy dokumentatsiyasi', 'GitHub Learning Lab', 'YouTube: Git va GitHub boshlang\'ich kurs', 'Atlassian Git Tutorial'],
        tips: 'Har bir loyihangizni GitHub ga yuklang. Commit xabarlarini aniq yozing. Branch yaratishni odat qiling — main branch ga to\'g\'ridan-to\'g\'ri yozmang'
      }
    },
    {
      id: 5, title: 'Tailwind CSS', emoji: '💨',
      desc: 'Zamonaviy CSS framework. Tez va chiroyli dizayn',
      duration: '1-2 hafta',
      topics: ['Utility classlar', 'Responsive dizayn', 'Komponentlar yaratish', 'Dark mode', 'Animatsiyalar'],
      color: 'from-teal-500 to-cyan-500',
      details: {
        about: 'Tailwind CSS — utility-first yondashuvga asoslangan CSS framework. Tayyor class larni HTML ga qo\'shib tezda chiroyli dizayn yaratish mumkin. CSS yozish hajmini 80% ga kamaytiradi',
        why: 'Hozirgi kunda eng mashhur CSS framework. Ko\'p kompaniyalar Tailwind ishlatadi. React bilan juda yaxshi ishlaydi. Loyiha tezligini oshiradi va kod hajmini kamaytiradi',
        resources: ['Tailwind CSS rasmiy docs', 'Tailwind UI — tayyor komponentlar', 'YouTube: Tailwind CSS Full Course', 'Headless UI — interaktiv komponentlar'],
        tips: 'Tailwind CSS IntelliSense VSCode extension ni o\'rnating. Classlarni yodlashga urinmang — docs dan foydalaning. cn() utility funksiyasini o\'rganing'
      }
    },
    {
      id: 6, title: 'TypeScript', emoji: '🔷',
      desc: 'JavaScript + tiplar. Xatolarni kamaytirish',
      duration: '2-3 hafta',
      topics: ['Asosiy tiplar', 'Interfeys va Type', 'Generics', 'Enum', 'Utility Types'],
      color: 'from-blue-600 to-blue-800',
      details: {
        about: 'TypeScript — bu JavaScript ning kengaytirilgan versiyasi. Tip xavfsizligini qo\'shadi: o\'zgaruvchilar va funksiyalar qanday ma\'lumot qabul qilishini oldindan belgilaysiz. Xatolar kod yozish paytida topiladi',
        why: 'Katta loyihalarda TypeScript siz ishlab bo\'lmaydi. Ko\'p kompaniyalar TypeScript talab qiladi. React + TypeScript — zamonaviy standart. Bug larni 40% gacha kamaytiradi',
        resources: ['TypeScript rasmiy handbook', 'TypeScript Deep Dive (kitob)', 'Total TypeScript — Matt Pocock', 'YouTube: TypeScript for React'],
        tips: 'JavaScript ni yaxshi bilganingizdan keyin boshlang. Avval oddiy tiplardan boshlang (string, number, boolean). Interface va Type farqini tushunib oling'
      }
    },
    {
      id: 7, title: 'React.js', emoji: '⚛️',
      desc: 'Eng mashhur frontend kutubxona',
      duration: '4-6 hafta',
      topics: ['Komponentlar', 'Hooks (useState, useEffect)', 'State boshqaruvi', 'React Router', 'Context API', 'Custom Hooks'],
      color: 'from-cyan-400 to-blue-500',
      details: {
        about: 'React — Meta (Facebook) tomonidan yaratilgan UI kutubxona. Sahifani kichik qayta ishlatiladigan komponentlarga bo\'ladi. Virtual DOM orqali tez ishlaydi. Dunyodagi eng mashhur frontend texnologiya',
        why: 'Ish bozorida eng ko\'p talab qilinadigan frontend texnologiya. Instagram, WhatsApp, Netflix — barchasi React da. Bir marta o\'rganib, React Native bilan mobil ilova ham yaratishingiz mumkin',
        resources: ['React rasmiy docs (react.dev)', 'freeCodeCamp — React kurs', 'Scrimba — React bepul kurs', 'YouTube: React Full Course 2024'],
        tips: 'useState va useEffect ni juda yaxshi tushunib oling. Kichik loyihalar yarating (todo app, weather app). Props va State farqini aniq bilib oling'
      }
    },
    {
      id: 8, title: 'Next.js', emoji: '▲',
      desc: 'React asosidagi full-stack framework',
      duration: '3-4 hafta',
      topics: ['SSR va SSG', 'App Router', 'API Routes', 'SEO optimizatsiya', 'Server Components'],
      color: 'from-slate-700 to-slate-900',
      details: {
        about: 'Next.js — Vercel tomonidan yaratilgan React framework. Server-side rendering (SSR), statik saytlar (SSG), va API route larni bir joyda yozish imkonini beradi. SEO uchun juda yaxshi',
        why: 'React ning eng mashhur frameworki. Ko\'p kompaniyalar Next.js ga o\'tmoqda. Full-stack qilish imkoniyati bor. Vercel da bepul deploy qilish mumkin',
        resources: ['Next.js rasmiy docs', 'Next.js Learn — interaktiv kurs', 'YouTube: Next.js 14 Tutorial', 'Lee Robinson — Next.js videolari'],
        tips: 'App Router (yangi) ni o\'rganing, Pages Router (eski) emas. Server va Client komponentlar farqini tushunib oling. Kichik blog yoki portfolio loyiha yarating'
      }
    },
    {
      id: 9, title: 'REST API', emoji: '🔗',
      desc: 'Backend bilan ishlash. Ma\'lumotlar almashish',
      duration: '1-2 hafta',
      topics: ['Fetch API', 'Axios kutubxonasi', 'CRUD operatsiyalar', 'Authentication', 'Error handling'],
      color: 'from-green-500 to-emerald-600',
      details: {
        about: 'REST API — frontend va backend o\'rtasidagi aloqa tili. Ma\'lumotlarni olish (GET), yuborish (POST), yangilash (PUT), o\'chirish (DELETE) — bularning barchasi API orqali bo\'ladi',
        why: 'Haqiqiy loyihalarda ma\'lumotlar serverda saqlanadi. Frontend faqat API orqali ular bilan ishlaydi. Bu bilimni o\'rganmasdan haqiqiy ilova yaratib bo\'lmaydi',
        resources: ['MDN — Fetch API', 'Axios dokumentatsiyasi', 'Postman — API test qilish', 'YouTube: REST API tushunchasi'],
        tips: 'Postman yoki Thunder Client (VSCode) da avval API larni test qiling. JSON formatini yaxshi tushunib oling. try/catch bilan xatolarni ushlashni odat qiling'
      }
    },
    {
      id: 10, title: 'Portfolio & Deploy', emoji: '🚀',
      desc: 'Loyihalarni yaratish va joylash',
      duration: '2-3 hafta',
      topics: ['Portfolio sayt yaratish', 'Vercel deploy', 'Netlify', 'CI/CD asoslari', 'Domain ulash'],
      color: 'from-purple-500 to-violet-600',
      details: {
        about: 'O\'rganganlaringizni birlashtirib portfolio sayt yaratasiz. Loyihalaringizni internetga joylaysiz (deploy). Ish beruvchilarga ko\'rsatadigan professional profil tayyorlaysiz',
        why: 'Portfolio — bu sizning ishga kirish pasportingiz. GitHub profil + portfolio sayt = kuchli rezyume. Vercel/Netlify da bepul deploy qilish mumkin',
        resources: ['Vercel — bepul deploy', 'Netlify — bepul hosting', 'GitHub Pages', 'YouTube: Developer Portfolio yaratish'],
        tips: 'Kamida 3-5 ta loyiha qo\'shing. Har bir loyihani README bilan bezang. Live demo havolasi va GitHub linkini qo\'ying. Mobile responsive bo\'lishi shart'
      }
    },
  ],
  backend: [
    { id: 1, title: 'Dasturlash asoslari', emoji: '📚', desc: 'Python yoki Node.js tanlang', duration: '2-3 hafta', topics: ['O\'zgaruvchilar', 'Funksiyalar', 'OOP', 'Ma\'lumot tuzilmalari'], color: 'from-green-500 to-emerald-600', details: { about: 'Backend dasturlash uchun birinchi qadam — dasturlash tilini tanlash. Python (oddiy sintaksis) yoki Node.js (JavaScript bilsangiz) dan boshlashingiz mumkin', why: 'Dasturlash tili — bu asos. Frontend HTML dan boshlangani kabi backend ham dasturlash tilidan boshlanadi', resources: ['Python.org rasmiy tutorial', 'Node.js rasmiy docs', 'freeCodeCamp — Python/Node'], tips: 'Bitta tilni tanlang va chuqur o\'rganing. OOP tushunchalarini yaxshi o\'zlashtiring' } },
    { id: 2, title: 'Git & GitHub', emoji: '🐙', desc: 'Versiya boshqaruvi', duration: '1 hafta', topics: ['Git asoslari', 'Branch', 'Merge', 'GitHub'], color: 'from-gray-500 to-slate-600', details: { about: 'Kodni versiyalash va saqlash tizimi. Har bir o\'zgarishni kuzatib boradi', why: 'Hamma dasturchi Git bilishi shart. Jamoaviy ishlashda zarur', resources: ['Git rasmiy docs', 'GitHub Learning Lab'], tips: 'Har bir loyihani Git bilan boshlang' } },
    { id: 3, title: 'SQL & Ma\'lumotlar bazasi', emoji: '🗄', desc: 'PostgreSQL yoki MySQL', duration: '2-3 hafta', topics: ['SQL', 'CRUD', 'JOIN', 'Indekslar'], color: 'from-blue-500 to-cyan-500', details: { about: 'Ma\'lumotlar bazasi — barcha ilovalarning ma\'lumot saqlash joyi. SQL — bu bazaga so\'rov yuborish tili', why: 'Backend ning asosiy vazifasi ma\'lumotlarni saqlash va qayta ishlash. SQLsiz backend bo\'lmaydi', resources: ['SQLBolt — interaktiv kurs', 'PostgreSQL Tutorial', 'W3Schools SQL'], tips: 'PostgreSQL ni o\'rganing — ko\'p kompaniyalar ishlatadi. JOIN larni yaxshi tushunib oling' } },
    { id: 4, title: 'REST API', emoji: '🔗', desc: 'API yaratish', duration: '3-4 hafta', topics: ['Express/Django', 'Routing', 'Middleware', 'CRUD API'], color: 'from-yellow-500 to-amber-500', details: { about: 'REST API — frontend va mobil ilovalar bilan ma\'lumot almashish usuli. Siz server tomonini yaratasiz', why: 'API yaratish — backend dasturchining asosiy ishi. Barcha zamonaviy ilovalar API orqali ishlaydi', resources: ['Express.js Guide', 'Django REST Framework', 'Postman docs'], tips: 'Avval CRUD (Create Read Update Delete) ni to\'liq qiling. Postman da test qiling' } },
    { id: 5, title: 'Authentication', emoji: '🔐', desc: 'Foydalanuvchi autentifikatsiyasi', duration: '1-2 hafta', topics: ['JWT', 'OAuth', 'Sessions', 'Bcrypt'], color: 'from-red-500 to-orange-500', details: { about: 'Login/Register tizimi yaratish. Foydalanuvchilarni identifikatsiya qilish va himoya qilish', why: 'Deyarli barcha ilovalar foydalanuvchi tizimiga ega. Xavfsizlik juda muhim', resources: ['JWT.io', 'OAuth 2.0 tushunchasi', 'Passport.js docs'], tips: 'Parollarni hech qachon ochiq saqlamang — hash (bcrypt) ishlating' } },
    { id: 6, title: 'Docker & Deploy', emoji: '🐳', desc: 'Konteynerlashtirish va joylash', duration: '2-3 hafta', topics: ['Docker', 'Docker Compose', 'CI/CD', 'Cloud'], color: 'from-purple-500 to-violet-600', details: { about: 'Docker — ilovani konteynerga joylash. Deploy — serverni internetga chiqarish', why: 'Loyihani yaratish yetarli emas — uni serverga joylash ham bilish kerak', resources: ['Docker rasmiy docs', 'DigitalOcean tutoriallari', 'Railway.app — bepul deploy'], tips: 'Docker Compose bilan boshlang. Railway yoki Render da bepul deploy qiling' } },
  ],
  fullstack: [
    { id: 1, title: 'HTML & CSS', emoji: '🌐', desc: 'Web asoslari', duration: '2 hafta', topics: ['HTML teglar', 'CSS Flexbox/Grid', 'Responsive'], color: 'from-orange-500 to-red-500', details: { about: 'Web sahifalarning tuzilmasi (HTML) va dizayni (CSS) — fullstack yo\'lining birinchi bosqichi', why: 'Frontend qismini tushunmasdan fullstack bo\'lib bo\'lmaydi', resources: ['MDN Web Docs', 'freeCodeCamp — Responsive Design'], tips: 'Tez o\'rganing va JavaScript ga o\'ting — bu muhimroq' } },
    { id: 2, title: 'JavaScript', emoji: '⚡', desc: 'Dasturlash tili', duration: '4-6 hafta', topics: ['ES6+', 'DOM', 'Async', 'OOP'], color: 'from-yellow-500 to-amber-500', details: { about: 'JavaScript — frontend va backend (Node.js) da ishlatiladigan yagona til. Fullstack uchun ideal', why: 'Bitta til bilan frontend ham backend ham yozish mumkin — bu fullstack ning kuchi', resources: ['JavaScript.info', 'freeCodeCamp — JS Algorithms'], tips: 'Async/Await va OOP ga alohida e\'tibor bering' } },
    { id: 3, title: 'React.js', emoji: '⚛️', desc: 'Frontend framework', duration: '4 hafta', topics: ['Komponentlar', 'Hooks', 'Router', 'State'], color: 'from-cyan-400 to-blue-500', details: { about: 'React — eng mashhur frontend kutubxona. Foydalanuvchi interfeysi yaratish uchun', why: 'MERN stack ning "R" qismi. Ish bozorida eng ko\'p talab qilinadi', resources: ['react.dev', 'Scrimba — React kurs'], tips: 'Hooks va State management ni chuqur o\'rganing' } },
    { id: 4, title: 'Node.js & Express', emoji: '🟩', desc: 'Backend asoslari', duration: '3-4 hafta', topics: ['Express', 'REST API', 'Middleware'], color: 'from-green-500 to-emerald-600', details: { about: 'Node.js — serverda JavaScript ishlatish. Express — eng mashhur Node.js framework', why: 'MERN stack ning backend qismi. JavaScript bilib fullstack bo\'lish imkonini beradi', resources: ['Express.js rasmiy docs', 'Node.js Tutorial'], tips: 'REST API yaratishni yaxshi o\'rganing. Middleware tushunchasini tushunib oling' } },
    { id: 5, title: 'MongoDB', emoji: '🍃', desc: 'NoSQL ma\'lumotlar bazasi', duration: '2 hafta', topics: ['CRUD', 'Mongoose', 'Aggregation'], color: 'from-green-600 to-green-800', details: { about: 'MongoDB — JSON formatda ma\'lumot saqlaydigan NoSQL baza. JavaScript bilan juda yaxshi ishlaydi', why: 'MERN stack ning "M" qismi. Tez va moslashuvchan. Mongoose ORM orqali qulay ishlash', resources: ['MongoDB University — bepul kurslar', 'Mongoose docs'], tips: 'MongoDB Atlas (cloud) dan foydalaning — bepul. Mongoose schema validatsiyasini o\'rganing' } },
    { id: 6, title: 'Full Stack loyiha', emoji: '🚀', desc: 'MERN Stack bilan loyiha', duration: '4 hafta', topics: ['Auth', 'CRUD App', 'Deploy', 'Portfolio'], color: 'from-purple-500 to-violet-600', details: { about: 'Barcha o\'rganganlaringizni birlashtirib to\'liq loyiha yaratasiz — frontend + backend + database', why: 'Haqiqiy tajriba olish va portfolioga qo\'shish uchun. Ish beruvchilar loyihalaringizga qaraydi', resources: ['Vercel — frontend deploy', 'Railway — backend deploy', 'YouTube: MERN Stack Tutorial'], tips: 'Auth, CRUD, va responsive design bo\'lishi shart. README yozing. Live demo havolasi qo\'ying' } },
  ],
  android: [
    { id: 1, title: 'Kotlin asoslari', emoji: '🟣', desc: 'Kotlin dasturlash tili', duration: '3-4 hafta', topics: ['Sintaksis', 'OOP', 'Coroutines', 'Null Safety'], color: 'from-purple-500 to-violet-600', details: { about: 'Kotlin — Google tomonidan rasmiy Android dasturlash tili sifatida tanlangan zamonaviy til. Java ga nisbatan qisqaroq va xavfsizroq kod yozish imkonini beradi', why: 'Google rasmiy ravishda Kotlin ni tavsiya qiladi. Yangi Android loyihalarning aksariyati Kotlin da yoziladi', resources: ['Kotlin rasmiy docs', 'Android Developers — Kotlin', 'Kotlinlang.org — Koans'], tips: 'Null Safety va Coroutines ga alohida e\'tibor bering — bu Kotlin ning eng kuchli tomonlari' } },
    { id: 2, title: 'Android Studio', emoji: '🤖', desc: 'IDE va asboblar', duration: '1 hafta', topics: ['Loyiha tuzilmasi', 'Emulyator', 'Gradle'], color: 'from-green-500 to-emerald-600', details: { about: 'Android Studio — Android ilovalar yaratish uchun rasmiy IDE. Kod yozish, debug qilish va emulyatorda test qilish imkonini beradi', why: 'Bu yagona rasmiy vosita. Gradle build tizimini tushunish loyihani boshqarish uchun muhim', resources: ['Android Studio rasmiy docs', 'Android Developers — Get Started'], tips: 'Emulyator sekin bo\'lsa haqiqiy telefonni USB orqali ulang. Keyboard shortcutlarni o\'rganing' } },
    { id: 3, title: 'UI - Jetpack Compose', emoji: '🎨', desc: 'Zamonaviy UI yaratish', duration: '3-4 hafta', topics: ['Composable', 'Layout', 'State', 'Navigation'], color: 'from-cyan-400 to-blue-500', details: { about: 'Jetpack Compose — Android ning yangi deklarativ UI toolkit. XML o\'rniga Kotlin kodi bilan UI yaratish imkonini beradi', why: 'Google Compose ni kelajak deb belgilagan. Yangi loyihalarning ko\'pchiligi Compose da yozilmoqda', resources: ['Android Developers — Compose', 'Jetpack Compose Tutorial', 'Composables.com'], tips: 'State hoisting va recomposition tushunchalarini yaxshi o\'rganing' } },
    { id: 4, title: 'API & Database', emoji: '🗄', desc: 'Ma\'lumotlar bilan ishlash', duration: '2-3 hafta', topics: ['Retrofit', 'Room DB', 'Firebase'], color: 'from-yellow-500 to-amber-500', details: { about: 'Retrofit — API dan ma\'lumot olish. Room — lokal bazada saqlash. Firebase — bulutli backend xizmatlari', why: 'Har bir real ilova ma\'lumotlar bilan ishlaydi. Bu kutubxonalar Android da standart hisoblanadi', resources: ['Retrofit rasmiy docs', 'Room Database guide', 'Firebase for Android'], tips: 'Avval Retrofit bilan API ishlashni o\'rganing keyin Room va Firebase ga o\'ting' } },
    { id: 5, title: 'Loyiha & Play Store', emoji: '🚀', desc: 'Ilova yaratish va nashr qilish', duration: '3-4 hafta', topics: ['MVVM', 'Loyiha', 'Play Store'], color: 'from-red-500 to-orange-500', details: { about: 'MVVM arxitekturasi bilan to\'liq loyiha yaratib Google Play Store ga joylash', why: 'Play Store da ilova nashr qilish — bu real tajriba. Portfolio uchun juda qimmatli', resources: ['Google Play Console', 'Android App Architecture Guide'], tips: 'MVVM patternini yaxshi o\'rganing. Play Store talab qiladigan rasmlar va tavsiflarni oldindan tayyorlang' } },
  ],
  ios: [
    { id: 1, title: 'Swift asoslari', emoji: '🍎', desc: 'Swift dasturlash tili', duration: '3-4 hafta', topics: ['Sintaksis', 'OOP', 'Optionals', 'Protocols'], color: 'from-blue-500 to-cyan-500', details: { about: 'Swift — Apple tomonidan yaratilgan zamonaviy dasturlash tili. iOS, macOS, watchOS va tvOS ilovalari uchun ishlatiladi', why: 'iOS dasturchi bo\'lish uchun Swift bilish shart. Tez, xavfsiz va o\'rganishga qulay til', resources: ['Swift.org rasmiy docs', 'Apple Developer — Swift', 'Hacking with Swift'], tips: 'Optionals va Protocols ni yaxshi tushunib oling — bu Swift ning asosi' } },
    { id: 2, title: 'SwiftUI', emoji: '🎨', desc: 'UI yaratish', duration: '3-4 hafta', topics: ['Views', 'Modifiers', 'State', 'Navigation'], color: 'from-purple-500 to-violet-600', details: { about: 'SwiftUI — Apple ning yangi deklarativ UI framework. Kam kod bilan chiroyli interfeys yaratish imkonini beradi', why: 'Apple SwiftUI ni kelajak deb ko\'rsatmoqda. Yangi loyihalar uchun tavsiya etiladi', resources: ['Apple Developer — SwiftUI', 'Hacking with Swift — SwiftUI', 'SwiftUI by Example'], tips: '@State @Binding @ObservedObject farqlarini yaxshi tushunib oling' } },
    { id: 3, title: 'Networking & Data', emoji: '🔗', desc: 'API va ma\'lumotlar', duration: '2-3 hafta', topics: ['URLSession', 'CoreData', 'Firebase'], color: 'from-green-500 to-emerald-600', details: { about: 'URLSession bilan API dan ma\'lumot olish. CoreData bilan lokal saqlash. Firebase bilan bulutli xizmatlar', why: 'Har bir ilova ma\'lumotlar bilan ishlaydi. Bu iOS dasturlashning muhim qismi', resources: ['Apple Developer — Networking', 'CoreData Tutorial', 'Firebase iOS docs'], tips: 'Avval URLSession bilan API ishlashni o\'rganing. Async/await sintaksisini qo\'llang' } },
    { id: 4, title: 'App Store', emoji: '🚀', desc: 'Ilova nashr qilish', duration: '2 hafta', topics: ['MVVM', 'TestFlight', 'App Store'], color: 'from-red-500 to-orange-500', details: { about: 'Ilovani TestFlight orqali test qilish va App Store ga joylash jarayoni', why: 'App Store da ilova nashr qilish — iOS dasturchi sifatida eng muhim qadam', resources: ['Apple Developer Program', 'App Store Connect guide', 'TestFlight docs'], tips: 'Apple Developer hisobiga yiliga $99 to\'lash kerak. TestFlight bilan avval test qiling' } },
  ],
  'cross-platform': [
    { id: 1, title: 'Dart asoslari', emoji: '💙', desc: 'Flutter uchun dasturlash tili', duration: '2-3 hafta', topics: ['Sintaksis', 'OOP', 'Async', 'Collections'], color: 'from-blue-500 to-cyan-500', details: { about: 'Dart — Google tomonidan yaratilgan dasturlash tili. Flutter framework uchun asosiy til', why: 'Flutter da ilova yozish uchun Dart bilish shart. Oddiy va o\'rganishga qulay til', resources: ['Dart.dev rasmiy docs', 'DartPad — online editor', 'freeCodeCamp — Dart kurs'], tips: 'JavaScript yoki Java bilsangiz Dart ni tez o\'rganasiz. async/await ni yaxshi o\'rganing' } },
    { id: 2, title: 'Flutter UI', emoji: '🎨', desc: 'Widget va Layout', duration: '3-4 hafta', topics: ['Widgets', 'Layout', 'Navigation', 'Animatsiya'], color: 'from-cyan-400 to-blue-500', details: { about: 'Flutter da har narsa Widget. Tayyor widgetlar yordamida chiroyli va tez ishlaydigan ilovalar yaratish mumkin', why: 'Bitta kod bilan Android va iOS uchun ilova — bu vaqt va pul tejaydi', resources: ['Flutter.dev rasmiy docs', 'Flutter Widget Catalog', 'Flutter Cookbook'], tips: 'Stateless va Stateful widget farqini tushunib oling. Hot Reload dan foydalaning' } },
    { id: 3, title: 'State Management', emoji: '📦', desc: 'Holatni boshqarish', duration: '2 hafta', topics: ['Provider', 'Riverpod', 'BLoC'], color: 'from-purple-500 to-violet-600', details: { about: 'Ilova holatini (state) to\'g\'ri boshqarish usullari. Katta loyihalarda juda muhim', why: 'Ilova kattalashganda setState yetarli bo\'lmaydi. Professional state management kerak bo\'ladi', resources: ['Provider package docs', 'Riverpod docs', 'BLoC Library docs'], tips: 'Provider yoki Riverpod bilan boshlang — BLoC keyinroq o\'rganing' } },
    { id: 4, title: 'API & Firebase', emoji: '🔥', desc: 'Backend integratsiya', duration: '2-3 hafta', topics: ['REST API', 'Firebase', 'Auth', 'Storage'], color: 'from-yellow-500 to-amber-500', details: { about: 'REST API orqali serverdan ma\'lumot olish. Firebase bilan autentifikatsiya va bulutli saqlash', why: 'Har bir ilova backend bilan bog\'lanadi. Firebase backend yozmasdan ham ishlash imkonini beradi', resources: ['Dio package — HTTP client', 'FlutterFire docs', 'Firebase Console'], tips: 'Firebase Auth bilan login/register ni tez qiling. Cloud Firestore dan foydalaning' } },
    { id: 5, title: 'Deploy', emoji: '🚀', desc: 'Play Store va App Store', duration: '2 hafta', topics: ['Build', 'Play Store', 'App Store'], color: 'from-green-500 to-emerald-600', details: { about: 'Flutter ilovani APK/IPA ga build qilish va do\'konlarga joylash', why: 'Ilovali nashr qilish — bu real tajriba va portfolioga katta qo\'shimcha', resources: ['Flutter — Build and Release', 'Google Play Console', 'Apple Developer'], tips: 'Android uchun avval App Bundle (AAB) formatda build qiling. iOS uchun Mac kerak' } },
  ],
  'ai-ml': [
    { id: 1, title: 'Python asoslari', emoji: '🐍', desc: 'Dasturlash tili', duration: '3-4 hafta', topics: ['Sintaksis', 'OOP', 'Libraries'], color: 'from-green-500 to-emerald-600', details: { about: 'Python — AI va ML sohasida eng ko\'p ishlatiladigan til. Oddiy sintaksis va kuchli kutubxonalarga ega', why: 'TensorFlow PyTorch Scikit-learn — bularning barchasi Python da. AI/ML o\'rganish uchun Python bilish shart', resources: ['Python.org Tutorial', 'Automate the Boring Stuff', 'freeCodeCamp — Python'], tips: 'List comprehension va dictionary bilan ishlashni yaxshi o\'rganing' } },
    { id: 2, title: 'Matematika', emoji: '📐', desc: 'ML uchun zarur matematika', duration: '2-3 hafta', topics: ['Linear Algebra', 'Statistika', 'Ehtimollik'], color: 'from-blue-500 to-cyan-500', details: { about: 'Mashinali o\'rganish algoritmlarining asosida matematika yotadi. Vektorlar matritsa va statistika kerak', why: 'Matematikani bilmasangiz ML algoritmlarini tushunish va sozlash qiyin bo\'ladi', resources: ['3Blue1Brown — Linear Algebra', 'Khan Academy — Statistics', 'Mathematics for ML kitob'], tips: 'Hamma narsani chuqur bilish shart emas. Amaliy kerak bo\'lgan qismlarni o\'rganing' } },
    { id: 3, title: 'Data Analysis', emoji: '📊', desc: 'Ma\'lumotlarni tahlil qilish', duration: '2-3 hafta', topics: ['Pandas', 'NumPy', 'Matplotlib'], color: 'from-yellow-500 to-amber-500', details: { about: 'Pandas bilan jadvallar ustida ishlash. NumPy bilan raqamli hisoblash. Matplotlib bilan grafik chizish', why: 'ML dan oldin ma\'lumotlarni tozalash va tahlil qilish kerak. Bu qadam juda muhim', resources: ['Pandas rasmiy docs', 'Kaggle — Data Analysis kurslar', 'YouTube: Data Analysis with Python'], tips: 'Kaggle da tayyor datasetlar bilan mashq qiling' } },
    { id: 4, title: 'Machine Learning', emoji: '🧠', desc: 'ML algoritmlari', duration: '4-6 hafta', topics: ['Scikit-learn', 'Regression', 'Classification', 'Clustering'], color: 'from-purple-500 to-violet-600', details: { about: 'Mashinali o\'rganish — kompyuterga ma\'lumotlardan o\'rganib bashorat qilishni o\'rgatish', why: 'ML — sun\'iy intellektning asosi. Regression va Classification eng ko\'p ishlatiladigan algoritmlar', resources: ['Scikit-learn docs', 'Andrew Ng — ML kurs (Coursera)', 'Kaggle Learn — ML'], tips: 'Har bir algoritmni avval nazariy tushunib keyin Kaggle da amaliy qo\'llang' } },
    { id: 5, title: 'Deep Learning', emoji: '🔥', desc: 'Neyron tarmoqlar', duration: '4-6 hafta', topics: ['TensorFlow', 'PyTorch', 'CNN', 'RNN'], color: 'from-red-500 to-orange-500', details: { about: 'Chuqur o\'rganish — murakkab neyron tarmoqlar bilan ishlash. Rasm tanish ovoz tanish matn generatsiya qilish', why: 'ChatGPT DALL-E va boshqa zamonaviy AI lar Deep Learning asosida ishlaydi', resources: ['TensorFlow rasmiy docs', 'PyTorch tutorials', 'Fast.ai — bepul kurs', 'Deep Learning Book'], tips: 'TensorFlow yoki PyTorch dan birini tanlang. CNN dan boshlang keyin RNN va Transformer o\'rganing' } },
  ],
  'data-science': [
    { id: 1, title: 'Python', emoji: '🐍', desc: 'Asosiy dasturlash tili', duration: '3 hafta', topics: ['Sintaksis', 'Funksiyalar', 'OOP'], color: 'from-green-500 to-emerald-600', details: { about: 'Python — data science sohasining asosiy tili. Kuchli kutubxonalar va sodda sintaksga ega', why: 'Ma\'lumotlar bilan ishlash uchun Python eng qulay va eng mashhur tanlov', resources: ['Python.org', 'DataCamp — Python kurs', 'Kaggle Learn — Python'], tips: 'Jupyter Notebook da ishlashni o\'rganing — data science uchun standart vosita' } },
    { id: 2, title: 'Pandas & NumPy', emoji: '🐼', desc: 'Ma\'lumotlar bilan ishlash', duration: '2-3 hafta', topics: ['DataFrame', 'Series', 'Array', 'Operatsiyalar'], color: 'from-blue-500 to-cyan-500', details: { about: 'Pandas — jadvallar (DataFrame) bilan ishlash. NumPy — tez raqamli hisoblash kutubxonasi', why: 'Data Science ning 80% i ma\'lumotlarni tayyorlash va tozalash. Pandas bu ishning asosiy vositasi', resources: ['Pandas rasmiy docs', 'NumPy rasmiy docs', 'Kaggle — Pandas kurs'], tips: 'groupby merge pivot_table larni yaxshi o\'rganing — real loyihalarda ko\'p ishlatiladi' } },
    { id: 3, title: 'SQL', emoji: '🗄', desc: 'Ma\'lumotlar bazasi', duration: '2 hafta', topics: ['SELECT', 'JOIN', 'GROUP BY', 'Sub-query'], color: 'from-yellow-500 to-amber-500', details: { about: 'SQL — ma\'lumotlar bazasidan kerakli ma\'lumotlarni olish tili. Data scientist uchun muhim', why: 'Ko\'p kompaniyalarda ma\'lumotlar bazada saqlanadi. SQL bilmasangiz ma\'lumotlarga kirish qiyin', resources: ['SQLBolt', 'Mode Analytics — SQL Tutorial', 'Kaggle — SQL kurs'], tips: 'JOIN va GROUP BY ni yaxshi o\'rganing. Window Functions ham juda foydali' } },
    { id: 4, title: 'Vizualizatsiya', emoji: '📈', desc: 'Grafik va diagrammalar', duration: '1-2 hafta', topics: ['Matplotlib', 'Seaborn', 'Plotly'], color: 'from-purple-500 to-violet-600', details: { about: 'Ma\'lumotlarni grafik va diagrammalar orqali vizual ko\'rsatish. Tahlil natijalarini boshqalarga tushuntirish', why: 'Yaxshi grafik ming so\'z o\'rnini bosadi. Topilmalarni boshqalarga tushuntirishda muhim', resources: ['Matplotlib docs', 'Seaborn Tutorial', 'Plotly docs'], tips: 'Seaborn bilan boshlang — Matplotlib dan chiroyliroq. Plotly interaktiv grafiklar uchun' } },
    { id: 5, title: 'ML asoslari', emoji: '🧠', desc: 'Mashinali o\'rganish', duration: '3-4 hafta', topics: ['Scikit-learn', 'Regression', 'Classification'], color: 'from-red-500 to-orange-500', details: { about: 'Data Science ning yuqori bosqichi — ma\'lumotlardan bashorat qilish. Regression va Classification asosiy usullar', why: 'ML bilgan Data Scientist bozorda ancha qimmatroq va ko\'p talab qilinadi', resources: ['Scikit-learn docs', 'Kaggle — ML kurs', 'Andrew Ng — ML kurs'], tips: 'Kaggle musobaqalarida ishtirok eting — real tajriba olasiz' } },
  ],
  'data-analytics': [
    { id: 1, title: 'Excel', emoji: '📊', desc: 'Jadvallar bilan ishlash', duration: '2 hafta', topics: ['Formulalar', 'Pivot Table', 'Charts', 'VLOOKUP'], color: 'from-green-500 to-emerald-600', details: { about: 'Excel yoki Google Sheets — ma\'lumotlarni jadvalda tahlil qilish vositasi. Formulalar va diagrammalar yaratish', why: 'Hamma kompaniyalarda Excel ishlatiladi. Data Analyst uchun birinchi va eng muhim vosita', resources: ['Excel Easy — bepul tutorial', 'Google Sheets docs', 'YouTube: Excel for Data Analysis'], tips: 'Pivot Table va VLOOKUP ni yaxshi o\'rganing — bu eng ko\'p ishlatiladigan funksiyalar' } },
    { id: 2, title: 'SQL', emoji: '🗄', desc: 'Ma\'lumotlar bazasi so\'rovlari', duration: '2-3 hafta', topics: ['SELECT', 'JOIN', 'Aggregation', 'Window Functions'], color: 'from-blue-500 to-cyan-500', details: { about: 'SQL — bazadagi katta ma\'lumotlardan kerakli qismini olish uchun so\'rov tili', why: 'Data Analyst ning kundalik ishi SQL yozish. Bu eng muhim texnik ko\'nikma', resources: ['SQLBolt', 'Mode Analytics SQL Tutorial', 'W3Schools SQL'], tips: 'Har kuni kamida 5 ta SQL masala yeching. LeetCode va HackerRank da mashq qiling' } },
    { id: 3, title: 'Power BI / Tableau', emoji: '📈', desc: 'Vizualizatsiya asboblari', duration: '2-3 hafta', topics: ['Dashboard', 'Report', 'DAX', 'Filtrlash'], color: 'from-yellow-500 to-amber-500', details: { about: 'Power BI va Tableau — ma\'lumotlarni interaktiv dashboard va hisobotlarga aylantirish vositalari', why: 'Rahbarlarga ma\'lumotlarni tushunarli ko\'rsatish kerak. Dashboard yaratish Data Analyst ning asosiy ishi', resources: ['Power BI Learning Path', 'Tableau Public — bepul', 'YouTube: Power BI Tutorial'], tips: 'Power BI bepul versiyasini o\'rnatib mashq qiling. Tableau Public da o\'z dashboardingizni nashr qiling' } },
    { id: 4, title: 'Python (asoslar)', emoji: '🐍', desc: 'Analitika uchun Python', duration: '2-3 hafta', topics: ['Pandas', 'Matplotlib', 'Jupyter'], color: 'from-purple-500 to-violet-600', details: { about: 'Python bilan kattaroq va murakkab tahlillar qilish. Pandas va Matplotlib asosiy kutubxonalar', why: 'Python bilgan Data Analyst ancha ko\'p ish topadi va yuqoriroq maosh oladi', resources: ['DataCamp — Python for Data Analysis', 'Kaggle — Python kurs', 'YouTube: Python for Data Analysis'], tips: 'Pandas bilan boshlang. Jupyter Notebook da mashq qiling' } },
  ],
  'desktop-dev': [
    { id: 1, title: 'C# asoslari', emoji: '🟣', desc: 'Dasturlash tili', duration: '3-4 hafta', topics: ['Sintaksis', 'OOP', 'LINQ', 'Async'], color: 'from-purple-500 to-violet-600', details: { about: 'C# — Microsoft tomonidan yaratilgan kuchli dasturlash tili. Windows desktop ilovalar va o\'yinlar uchun ishlatiladi', why: 'WPF va WinForms bilan desktop ilova yaratish uchun C# bilish shart', resources: ['Microsoft Learn — C#', 'C# docs', 'freeCodeCamp — C# kurs'], tips: 'OOP va LINQ ni yaxshi o\'rganing — desktop loyihalarda ko\'p ishlatiladi' } },
    { id: 2, title: 'WPF / WinForms', emoji: '🖥', desc: 'Desktop UI', duration: '3-4 hafta', topics: ['XAML', 'Binding', 'MVVM', 'Controls'], color: 'from-blue-500 to-cyan-500', details: { about: 'WPF — zamonaviy Windows desktop ilovalar yaratish uchun framework. XAML bilan UI yoziladi', why: 'Windows da ishlaydigan professional ilovalar yaratish uchun WPF eng yaxshi tanlov', resources: ['Microsoft Learn — WPF', 'WPF Tutorial.net', 'YouTube: WPF Crash Course'], tips: 'Data Binding va MVVM patternini yaxshi o\'rganing — bu WPF ning kuchi' } },
    { id: 3, title: 'Database', emoji: '🗄', desc: 'Ma\'lumotlar bazasi', duration: '2 hafta', topics: ['SQLite', 'Entity Framework', 'CRUD'], color: 'from-green-500 to-emerald-600', details: { about: 'Entity Framework — C# da database bilan ishlash uchun ORM. SQLite — yengil lokal baza', why: 'Ko\'p desktop ilovalar lokal bazada ma\'lumot saqlaydi. EF Code First yondashuvni o\'rganing', resources: ['Entity Framework docs', 'SQLite docs', 'Microsoft Learn — EF Core'], tips: 'EF Core — Code First yondashuvini o\'rganing. Migration lar bilan ishlashni bilib oling' } },
    { id: 4, title: 'Deploy', emoji: '🚀', desc: 'Ilovani tarqatish', duration: '1 hafta', topics: ['Installer', 'MSIX', 'Auto-update'], color: 'from-red-500 to-orange-500', details: { about: 'Desktop ilovani foydalanuvchilarga yetkazish — installer yaratish va yangilanishlarni boshqarish', why: 'Ilovani yaratish yetarli emas — uni foydalanuvchiga qulay tarzda yetkazish ham kerak', resources: ['MSIX Packaging docs', 'Inno Setup', 'ClickOnce deployment'], tips: 'MSIX zamonaviy yondoshuv. Kichik loyihalar uchun ClickOnce ham yetarli' } },
  ],
  unity: [
    { id: 1, title: 'C# asoslari', emoji: '🟣', desc: 'Unity uchun dasturlash', duration: '3 hafta', topics: ['Sintaksis', 'OOP', 'Events'], color: 'from-purple-500 to-violet-600', details: { about: 'C# — Unity ning dasturlash tili. O\'yin logikasi skriptlar va komponentlar C# da yoziladi', why: 'Unity da o\'yin yaratish uchun C# bilish shart. OOP va Events tushunchalarini o\'rganing', resources: ['Unity Learn — C# Scripting', 'Microsoft Learn — C#', 'Brackeys — C# Tutorial'], tips: 'Unity kontekstida o\'rganing — umuman C# emas balki Unity C# scripting' } },
    { id: 2, title: 'Unity Editor', emoji: '🎮', desc: 'Muhit bilan tanishish', duration: '1-2 hafta', topics: ['Scene', 'Inspector', 'Prefab', 'Asset'], color: 'from-gray-500 to-slate-600', details: { about: 'Unity Editor — o\'yinlar yaratish uchun visual muhit. Scene Inspector va Hierarchy panellari bilan ishlash', why: 'Unity Editor ni yaxshi bilish ish tezligini oshiradi. Prefab tizimini tushunish muhim', resources: ['Unity Manual', 'Unity Learn — Editor Essentials', 'YouTube: Unity Beginner Guide'], tips: 'Keyboard shortcutlarni o\'rganing. Scene va Game view farqini tushunib oling' } },
    { id: 3, title: 'Fizika & Harakatlar', emoji: '🏃', desc: 'O\'yin mexanikasi', duration: '2-3 hafta', topics: ['Rigidbody', 'Collider', 'Input', 'Animation'], color: 'from-green-500 to-emerald-600', details: { about: 'Unity ning fizika tizimi bilan ishlash — gravitatsiya to\'qnashuvlar va harakatlar', why: 'O\'yin mexanikasi — bu o\'yinning yuragi. Fizika va animatsiyalar o\'yinni qiziqarli qiladi', resources: ['Unity Manual — Physics', 'Unity Learn — Physics', 'Brackeys — Physics Tutorial'], tips: 'Rigidbody va Collider farqini tushunib oling. FixedUpdate ni fizika uchun ishlating' } },
    { id: 4, title: 'UI & Audio', emoji: '🎵', desc: 'Interfeys va ovoz', duration: '1-2 hafta', topics: ['Canvas', 'Buttons', 'Audio', 'Particles'], color: 'from-blue-500 to-cyan-500', details: { about: 'O\'yin ichidagi menyu tugmalar ball ko\'rsatkichlari va ovoz effektlari yaratish', why: 'Yaxshi UI va audio o\'yin tajribasini sezilarli yaxshilaydi', resources: ['Unity Manual — UI', 'Unity Audio docs', 'GameDev.tv — Unity UI'], tips: 'Canvas Scaler ni o\'rnating — turli ekran o\'lchamlarida to\'g\'ri ko\'rinishi uchun' } },
    { id: 5, title: 'O\'yin yaratish', emoji: '🚀', desc: 'To\'liq loyiha', duration: '4 hafta', topics: ['Game Loop', 'Level Design', 'Build', 'Publish'], color: 'from-red-500 to-orange-500', details: { about: 'O\'rganganlaringizni birlashtirib to\'liq o\'yin yaratish — dizayndan nashr qilishgacha', why: 'Portfolio uchun tayyor o\'yin kerak. itch.io da bepul nashr qilish mumkin', resources: ['Unity Learn — Create a Game', 'itch.io — o\'yin nashr', 'GameDev.tv kurslar'], tips: 'Kichik va tugallash mumkin bo\'lgan o\'yin tanlang. Katta loyihadan boshlang' } },
  ],
  unreal: [
    { id: 1, title: 'C++ asoslari', emoji: '⚙️', desc: 'Dasturlash tili', duration: '4-5 hafta', topics: ['Sintaksis', 'OOP', 'Pointerlar', 'Memory'], color: 'from-blue-500 to-cyan-500', details: { about: 'C++ — yuqori samarali dasturlash tili. Unreal Engine da gameplay va tizim kodi C++ da yoziladi', why: 'AAA o\'yinlar va professional o\'yin ishlab chiqish uchun C++ bilish kerak', resources: ['LearnCpp.com', 'Unreal Engine — C++ Programming', 'YouTube: C++ for Unreal'], tips: 'Pointerlar va memory management ni yaxshi o\'rganing — bu C++ ning eng qiyin va muhim qismi' } },
    { id: 2, title: 'Unreal Editor', emoji: '🎮', desc: 'Muhit va Blueprints', duration: '2-3 hafta', topics: ['Level Editor', 'Blueprints', 'Materials'], color: 'from-gray-500 to-slate-600', details: { about: 'Unreal Editor — professional o\'yin muhiti. Blueprints vizual dasturlash tizimi bilan kod yozmasdan logika yaratish mumkin', why: 'Blueprints tez prototip yaratish uchun ideal. Materiallar va Level Editor professional o\'yinlar uchun muhim', resources: ['Unreal Engine Learning Portal', 'Unreal Sensei — YouTube', 'Blueprint docs'], tips: 'Avval Blueprints bilan boshlang keyin C++ ga o\'ting. Ikkalasini birgalikda ishlating' } },
    { id: 3, title: 'Gameplay', emoji: '🏃', desc: 'O\'yin mexanikasi', duration: '3-4 hafta', topics: ['Character', 'AI', 'Physics', 'Animation'], color: 'from-purple-500 to-violet-600', details: { about: 'O\'yin mexanikalarini yaratish — karakter harakati sun\'iy intellekt fizika va animatsiyalar', why: 'Gameplay — bu o\'yinchining tajribasi. Yaxshi mexanikalar o\'yinni qiziqarli qiladi', resources: ['Unreal Engine — Gameplay framework', 'AI Navigation docs', 'Animation Blueprint'], tips: 'Character Movement Component dan boshlang. Behavior Tree bilan AI yarating' } },
    { id: 4, title: 'Loyiha', emoji: '🚀', desc: 'O\'yin yaratish va nashr', duration: '4 hafta', topics: ['Level Design', 'Packaging', 'Optimization'], color: 'from-red-500 to-orange-500', details: { about: 'To\'liq o\'yin yaratish — level dizayndan optimizatsiyagacha. Keyin package qilib tarqatish', why: 'Tayyor o\'yin portfolio uchun zarur. Epic Games Store yoki itch.io da nashr qilish mumkin', resources: ['Unreal — Packaging Projects', 'itch.io', 'Epic Games Store publishing'], tips: 'Optimizatsiyaga e\'tibor bering — Unreal o\'yinlari og\'ir bo\'lishi mumkin. LOD va Culling o\'rganing' } },
  ],
  'manual-testing': [
    { id: 1, title: 'QA asoslari', emoji: '✅', desc: 'Testing nazariyasi', duration: '2 hafta', topics: ['Testing turlari', 'Test case', 'Bug report', 'SDLC'], color: 'from-green-500 to-emerald-600', details: { about: 'QA (Quality Assurance) — dasturiy ta\'minot sifatini tekshirish. Test case yozish va xatolarni topish', why: 'Har bir dasturiy mahsulot testdan o\'tishi kerak. QA dasturchilar bilan birga ishlaydi', resources: ['ISTQB Foundation syllabus', 'Guru99 — Software Testing', 'YouTube: QA Tutorial'], tips: 'Test case yozishni yaxshi o\'rganing. Bug report ni aniq va batafsil yozing' } },
    { id: 2, title: 'Functional Testing', emoji: '🔍', desc: 'Funksional testlash', duration: '2-3 hafta', topics: ['Black box', 'White box', 'Boundary', 'Equivalence'], color: 'from-blue-500 to-cyan-500', details: { about: 'Dasturning funksiyalarini tekshirish usullari — black box va white box testing texniklari', why: 'Funksional testlash QA ning asosiy ishi. Boundary va Equivalence texniklari test case soni ni kamaytiradi', resources: ['ISTQB — Test Techniques', 'Software Testing Help', 'Testing tutorials'], tips: 'Boundary Value Analysis va Equivalence Partitioning ni yaxshi o\'rganing' } },
    { id: 3, title: 'API Testing', emoji: '📮', desc: 'Postman bilan ishlash', duration: '2 hafta', topics: ['Postman', 'REST API', 'Status kodlar', 'Collection'], color: 'from-yellow-500 to-amber-500', details: { about: 'Postman vositasi bilan API so\'rovlarni yuborish va javoblarni tekshirish', why: 'Ko\'p ilovalar API orqali ishlaydi. API ni testlash UI test dan tezroq va ishonchliroq', resources: ['Postman Learning Center', 'Postman Academy', 'YouTube: API Testing with Postman'], tips: 'Collection va Environment yaratishni o\'rganing. Automated test scripts yozishni ham bilib oling' } },
    { id: 4, title: 'Agile & Jira', emoji: '📋', desc: 'Jamoaviy ishlash', duration: '1 hafta', topics: ['Scrum', 'Jira', 'Sprint', 'Kanban'], color: 'from-purple-500 to-violet-600', details: { about: 'Agile — zamonaviy dasturiy ta\'minot ishlab chiqish metodologiyasi. Jira — loyiha boshqarish vositasi', why: 'Ko\'p kompaniyalar Scrum yoki Kanban bilan ishlaydi. Jira bilish ish topishda muhim', resources: ['Atlassian — Agile Guide', 'Scrum.org', 'Jira Tutorial'], tips: 'Sprint Planning va Daily Standup qanday ishlashini tushunib oling' } },
  ],
  'automation-testing': [
    { id: 1, title: 'Dasturlash asoslari', emoji: '💻', desc: 'Python yoki Java', duration: '3 hafta', topics: ['Sintaksis', 'OOP', 'Funksiyalar'], color: 'from-green-500 to-emerald-600', details: { about: 'Avtomatik testlar yozish uchun dasturlash tili kerak. Python (oddiy) yoki Java (mashhur) tanlang', why: 'Automation QA dasturlash bilishi shart. Tilni bilmasangiz test skript yozolmaysiz', resources: ['Python.org Tutorial', 'Java Tutorial — Oracle', 'Automate the Boring Stuff'], tips: 'Python tezroq o\'rganiladi. Java esa korporativ muhitda ko\'proq ishlatiladi' } },
    { id: 2, title: 'Selenium', emoji: '🤖', desc: 'Web avtomatlash', duration: '3-4 hafta', topics: ['Locators', 'WebDriver', 'Waits', 'POM'], color: 'from-blue-500 to-cyan-500', details: { about: 'Selenium — web brauzerda avtomatik test o\'tkazish vositasi. Element topish harakatlar bajarish va tekshirish', why: 'Selenium — automation testing ning standart vositasi. Ko\'p kompaniyalar ishlatadi', resources: ['Selenium docs', 'Selenium University', 'YouTube: Selenium Tutorial'], tips: 'Page Object Model (POM) patternini boshidanoq qo\'llang. Explicit wait ishlating' } },
    { id: 3, title: 'Testing Frameworks', emoji: '🧪', desc: 'Test frameworklari', duration: '2 hafta', topics: ['pytest', 'TestNG', 'JUnit'], color: 'from-yellow-500 to-amber-500', details: { about: 'Test frameworklari — testlarni tashkil qilish hisobot yaratish va parallel bajarish uchun', why: 'Framework testlarni professional tarzda yozish va boshqarish imkonini beradi', resources: ['pytest docs', 'TestNG docs', 'JUnit 5 User Guide'], tips: 'Python tanlasangiz pytest Java tanlasangiz TestNG o\'rganing' } },
    { id: 4, title: 'CI/CD', emoji: '🔄', desc: 'Uzluksiz integratsiya', duration: '1-2 hafta', topics: ['Jenkins', 'GitHub Actions', 'Pipeline'], color: 'from-purple-500 to-violet-600', details: { about: 'CI/CD — testlarni avtomatik ravishda har bir kod o\'zgarishida ishga tushirish tizimi', why: 'Zamonaviy loyihalarda testlar CI/CD pipeline da avtomatik ishlaydi', resources: ['Jenkins docs', 'GitHub Actions docs', 'YouTube: CI/CD for Testing'], tips: 'GitHub Actions bilan boshlang — sozlash oson va bepul' } },
  ],
  'ui-design': [
    { id: 1, title: 'Dizayn asoslari', emoji: '🎨', desc: 'Ranglar, tipografiya, kompozitsiya', duration: '2 hafta', topics: ['Ranglar', 'Tipografiya', 'Grid', 'Spacing'], color: 'from-pink-500 to-rose-600', details: { about: 'Dizayn nazariyasi — ranglar harmoniyasi shrift tanlash layout yaratish va vizual ierarxiya', why: 'Asbobni bilish yetarli emas — dizayn prinsiplarini bilmasangiz chiroyli natija chiqmaydi', resources: ['Refactoring UI (kitob)', 'Google Material Design', 'Color Hunt — ranglar'], tips: 'Refactoring UI kitobini o\'qing — eng yaxshi amaliy dizayn qo\'llanma' } },
    { id: 2, title: 'Figma', emoji: '🖌', desc: 'Asosiy dizayn asbob', duration: '3-4 hafta', topics: ['Frames', 'Components', 'Auto Layout', 'Prototyping'], color: 'from-purple-500 to-violet-600', details: { about: 'Figma — eng mashhur dizayn vositasi. UI dizayn prototip va jamoa bilan ishlash uchun', why: 'Figma bozorda standart. Deyarli barcha kompaniyalar Figma ishlatadi', resources: ['Figma Learn', 'Figma YouTube channel', 'UI Design Daily'], tips: 'Auto Layout va Components ni yaxshi o\'rganing — bu Figma ning eng kuchli xususiyatlari' } },
    { id: 3, title: 'Design System', emoji: '📐', desc: 'Dizayn tizimi yaratish', duration: '2-3 hafta', topics: ['Tokens', 'Components', 'Documentation'], color: 'from-blue-500 to-cyan-500', details: { about: 'Design System — qayta ishlatiladigan komponentlar va qoidalar to\'plami. Katta loyihalar uchun muhim', why: 'Professional dizaynerlar Design System bilan ishlaydi. Bu sifat va izchillikni ta\'minlaydi', resources: ['Material Design', 'Apple HIG', 'Figma — Design Systems'], tips: 'Mavjud Design System larni o\'rganing (Material Ant Design) keyin o\'zingiznikini yarating' } },
    { id: 4, title: 'Portfolio', emoji: '🚀', desc: 'Loyihalar to\'plami', duration: '2 hafta', topics: ['Case Study', 'Behance', 'Dribbble'], color: 'from-green-500 to-emerald-600', details: { about: 'Ishlaringizni ko\'rsatadigan portfolio tayyorlash — case study yozish va Behance/Dribbble da nashr qilish', why: 'Dizayner uchun portfolio rezyumedan muhimroq. Ish beruvchilar portfolio ga qaraydi', resources: ['Behance.net', 'Dribbble.com', 'YouTube: Design Portfolio Tips'], tips: 'Har bir loyiha uchun case study yozing — muammo yechim va natija ko\'rsating' } },
  ],
  'ux-design': [
    { id: 1, title: 'UX asoslari', emoji: '🧩', desc: 'Foydalanuvchi tajribasi', duration: '2 hafta', topics: ['UX prinsiplari', 'Heuristics', 'Accessibility'], color: 'from-purple-500 to-violet-600', details: { about: 'UX (User Experience) — foydalanuvchi mahsulotni qanchalik qulay va yoqimli ishlatishi haqida', why: 'Chiroyli dizayn yetarli emas — foydalanuvchi qulay ishlata olishi kerak. UX bu muammoni hal qiladi', resources: ['NN Group — UX Articles', 'Laws of UX', 'Don Norman — Design of Everyday Things'], tips: 'Nielsen ning 10 ta heuristic qoidasini yodlab oling' } },
    { id: 2, title: 'User Research', emoji: '🔍', desc: 'Foydalanuvchi tadqiqoti', duration: '2-3 hafta', topics: ['Intervyu', 'Survey', 'Persona', 'User Journey'], color: 'from-blue-500 to-cyan-500', details: { about: 'Foydalanuvchilarni tadqiq qilish — ularning ehtiyojlari muammolari va xulqini tushunish', why: 'Taxminlar asosida emas haqiqiy foydalanuvchilar fikri asosida dizayn qilish kerak', resources: ['UX Research Methods — NN Group', 'Google UX Design Course', 'Maze.co — Research tools'], tips: 'Kamida 5 ta foydalanuvchi bilan intervyu o\'tkazing. Persona va User Journey Map yarating' } },
    { id: 3, title: 'Wireframe & Prototype', emoji: '📐', desc: 'Prototip yaratish', duration: '2-3 hafta', topics: ['Wireframe', 'Figma', 'Prototype', 'Testing'], color: 'from-green-500 to-emerald-600', details: { about: 'Wireframe — sahifaning eskizi. Prototype — interaktiv model. Figma da ikkalasini ham yaratish mumkin', why: 'Dizayn qilishdan oldin wireframe bilan tuzilmani rejalashtirish xatolarni kamaytiradi', resources: ['Figma — Prototyping', 'Wireframe.cc', 'YouTube: UX Wireframing'], tips: 'Low-fidelity wireframe dan boshlang keyin high-fidelity prototipga o\'ting' } },
    { id: 4, title: 'Usability Testing', emoji: '🧪', desc: 'Foydalanuvchanlik testi', duration: '1-2 hafta', topics: ['A/B Test', 'Heatmap', 'Analytics'], color: 'from-yellow-500 to-amber-500', details: { about: 'Yaratilgan dizaynni haqiqiy foydalanuvchilar bilan test qilish va takomillashtirish', why: 'Test qilmasangiz dizayn yaxshi ishlayotganini bilolmaysiz', resources: ['Hotjar — Heatmaps', 'Maze.co — Usability Testing', 'Google Analytics'], tips: '5 ta foydalanuvchi bilan test qilish muammolarning 85% ini topadi' } },
  ],
}

const Roadmap = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { field, fieldName, categoryName } = location.state || {}
  const [expandedStep, setExpandedStep] = useState(null)

  const roadmap = roadmaps[field] || roadmaps.frontend

  const totalWeeks = roadmap.reduce((sum, step) => {
    const match = step.duration.match(/(\d+)/)
    return sum + (match ? parseInt(match[1]) : 2)
  }, 0)

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <GraduationCap className="w-10 h-10 text-blue-500" />
            <span className="text-2xl font-bold text-white">MentorAI</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            📍 {fieldName || 'Frontend'} — O'rganish yo'li
          </h1>
          <p className="text-slate-400">
            {categoryName && <span>{categoryName} → </span>}
            Taxminan <span className="text-white font-medium">{totalWeeks}+ hafta</span> davomida o'rganing
          </p>
        </div>

        {/* Roadmap Steps */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-700"></div>

          <div className="space-y-4">
            {roadmap.map((step, index) => {
              const isExpanded = expandedStep === step.id
              const isFirst = index === 0

              return (
                <div key={step.id} className="relative pl-20">
                  {/* Step Number */}
                  <div className={`absolute left-4 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
                    isFirst 
                      ? 'bg-linear-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30' 
                      : 'bg-slate-700 text-slate-300 border-2 border-slate-600'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Card */}
                  <button
                    onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 ${
                      isExpanded
                        ? 'bg-slate-800 border-slate-600 shadow-xl'
                        : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${step.color} flex items-center justify-center shrink-0`}>
                        <span className="text-xl">{step.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                          {isFirst && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Boshlang</span>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm">{step.desc}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-slate-500 text-xs">{step.duration}</p>
                        <ChevronRight className={`w-5 h-5 text-slate-500 mt-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-700 space-y-4">
                        {/* About */}
                        {step.details?.about && (
                          <div className="flex gap-3">
                            <BookOpen className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-blue-400 mb-1">Bu nima?</p>
                              <p className="text-slate-300 text-sm leading-relaxed">{step.details.about}</p>
                            </div>
                          </div>
                        )}

                        {/* Why */}
                        {step.details?.why && (
                          <div className="flex gap-3">
                            <Target className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-green-400 mb-1">Nega kerak?</p>
                              <p className="text-slate-300 text-sm leading-relaxed">{step.details.why}</p>
                            </div>
                          </div>
                        )}

                        {/* Topics */}
                        <div>
                          <p className="text-slate-400 text-sm mb-2">O'rganiladigan mavzular:</p>
                          <div className="flex flex-wrap gap-2">
                            {step.topics.map((topic, i) => (
                              <span
                                key={i}
                                className="px-3 py-1.5 bg-slate-700/50 text-slate-300 text-sm rounded-lg border border-slate-600/50"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Resources */}
                        {step.details?.resources && (
                          <div className="flex gap-3">
                            <ExternalLink className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-purple-400 mb-1">Foydali manbalar:</p>
                              <ul className="space-y-1">
                                {step.details.resources.map((res, i) => (
                                  <li key={i} className="text-slate-300 text-sm flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60 shrink-0"></span>
                                    {res}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Tips */}
                        {step.details?.tips && (
                          <div className="flex gap-3 bg-amber-500/5 rounded-lg p-3 border border-amber-500/10">
                            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-amber-400 mb-1">Maslahat</p>
                              <p className="text-slate-300 text-sm leading-relaxed">{step.details.tips}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Finish Line */}
          <div className="relative pl-20 mt-4">
            <div className="absolute left-4 w-9 h-9 rounded-full bg-linear-to-r from-yellow-500 to-amber-500 flex items-center justify-center z-10 shadow-lg shadow-yellow-500/30">
              🏆
            </div>
            <div className="p-5 rounded-xl bg-linear-to-r from-yellow-500/10 to-amber-500/10 border-2 border-yellow-500/30">
              <h3 className="text-lg font-semibold text-yellow-400">Tabriklaymiz!</h3>
              <p className="text-slate-400 text-sm">
                Barcha bosqichlarni tamomlab, {fieldName || 'Frontend'} bo'yicha professional bo'ling!
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate('/course', { state: { field, fieldName, category, categoryName } })}
            className="flex items-center gap-3 px-10 py-4 rounded-xl font-medium text-lg bg-linear-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Kursni boshlash
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Roadmap
