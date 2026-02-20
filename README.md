# MentorAI — AI Asosidagi Ta'lim Platformasi

O'qituvchi va o'quvchilar uchun sun'iy intellektga asoslangan ta'lim boshqaruv tizimi.

## Xususiyatlar

- **AI Chat** — Gemini AI bilan real-vaqt suhbat, dars bo'yicha yordam
- **Guruhlar** — O'qituvchi guruh yaratadi, o'quvchi kod orqali qo'shiladi (Firestore)
- **Darslar** — Progress tracking, bo'limma-bo'lim o'tish, Firestore ga saqlash
- **Mashqlar** — Qiyinlik darajalari, ball tizimi, Firestore ga completion saqlash
- **Testlar (Quiz)** — Taymerli test tizimi, natijalar tarixi
- **O'quv Rejasi** — Kunlik/haftalik vazifalar, Firestore schedule events
- **So'rovlar** — O'quvchi join request → o'qituvchi approve/reject (Firestore)
- **Bildirishnomalar** — Real-time Firestore notifications (onSnapshot)
- **Qidiruv** — Global search: darslar, mashqlar, guruhlar, foydalanuvchilar
- **Sozlamalar** — Profil, parol o'zgartirish, tema (dark/light/system)
- **Email tasdiqlash** — Ro'yxatdan o'tishda email verification majburiy

## Texnologiyalar

| Texnologiya | Versiya | Maqsad |
| --- | --- | --- |
| React | 19.2.0 | UI framework |
| Vite | 7.3.1 | Build tool |
| TailwindCSS | 4.1.18 | Styling |
| Firebase | 12.9.0 | Auth, Firestore, Storage |
| @google/generative-ai | 0.24.1 | Gemini AI chat |
| react-router-dom | 7.13.0 | Routing |
| react-hot-toast | 2.6.0 | Notifications UI |
| lucide-react | 0.563.0 | Icons |

## Foydalanuvchi rollari

| Rol | Imkoniyatlar |
| --- | --- |
| **O'qituvchi (teacher)** | Guruh yaratish, dars/mashq qo'shish, so'rovlarni boshqarish, o'quvchilarni kuzatish |
| **O'quvchi (student)** | Guruhga qo'shilish, dars o'tish, mashq bajarish, test yechish, AI chat |
| **Mustaqil o'quvchi (self-learner)** | Barcha o'quv materiallar, AI chat, shaxsiy progress |

## O'rnatish

```bash
# Repozitoriyani klonlash
git clone https://github.com/a-norimboyev/MentorAI.git
cd MentorAI

# Dependencylarni o'rnatish
npm install

# .env faylini yaratish
cp .env.example .env
# Firebase va Gemini API kalitlarini kiriting
```

## Environment o'zgaruvchilari

`.env` faylida quyidagilarni sozlang:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## Ishga tushirish

```bash
# Development server
npm run dev

# Production build
npm run build

# Build preview
npm run preview
```

## Loyiha tuzilmasi

```text
src/
├── components/       # Qayta ishlatiladigan komponentlar (Sidebar, ErrorBoundary, LoadingSpinner)
├── config/           # Firebase va Gemini konfiguratsiyasi
├── context/          # React Context (Auth, AppData, Sidebar, Theme)
├── pages/            # Sahifalar (Dashboard, AIChat, Groups, Lessons, ...)
└── utils/            # Firestore servislar (groupService, scheduleService, searchService)
```

## Firestore kolleksiyalar

```text
users/{uid}                          — Foydalanuvchi profili
users/{uid}/notifications/{id}       — Bildirishnomalar (real-time)
users/{uid}/lessonProgress/{id}      — Dars progressi
users/{uid}/exerciseCompletion/{id}  — Mashq natijalari
users/{uid}/scheduleEvents/{id}      — O'quv rejasi
users/{uid}/activities/{id}          — Faoliyat tarixi
groups/{id}                          — Guruhlar
groups/{id}/requests/{id}            — Qo'shilish so'rovlari
```

## Litsenziya

MIT
