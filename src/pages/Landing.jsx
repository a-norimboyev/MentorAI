import { Link } from 'react-router-dom'
import { 
  GraduationCap, 
  MessageSquare, 
  BarChart3, 
  Calendar, 
  Users, 
  BookOpen,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react'

const Landing = () => {
  const features = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "AI Ustoz bilan Suhbat",
      description: "24/7 sun'iy intellekt yordamida savollaringizga javob oling"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Interaktiv Mashqlar",
      description: "Amaliy mashqlar bilan bilimlaringizni mustahkamlang"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Progress Kuzatuv",
      description: "O'z rivojlanishingizni real vaqtda kuzating"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Shaxsiy Reja",
      description: "AI sizga mos o'quv rejasini tuzib beradi"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Guruh Ishlari",
      description: "Boshqa o'quvchilar bilan birga o'rganing"
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Sertifikatlar",
      description: "Kurslarni tugatib, sertifikat oling"
    }
  ]

  const stats = [
    { value: "10,000+", label: "Faol O'quvchilar" },
    { value: "500+", label: "Mashqlar" },
    { value: "50+", label: "Ustozlar" },
    { value: "98%", label: "Mamnunlik" }
  ]

  const testimonials = [
    {
      name: "Aziz Karimov",
      role: "Talaba",
      text: "MentorAI orqali dasturlashni 3 oyda o'rgandim. AI ustoz har doim yordam berishga tayyor!",
      rating: 5
    },
    {
      name: "Nilufar Rahimova",
      role: "Frontend Developer",
      text: "Yangi texnologiyalarni o'rganishda eng yaxshi platforma. Mashqlar juda foydali.",
      rating: 5
    },
    {
      name: "Bobur Toshmatov",
      role: "O'qituvchi",
      text: "O'quvchilarimni kuzatish va feedback berish juda oson bo'ldi.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold text-white">MentorAI</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-300 hover:text-white transition">Xususiyatlar</a>
              <a href="#testimonials" className="text-slate-300 hover:text-white transition">Fikrlar</a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition">Narxlar</a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-slate-300 hover:text-white transition">
                Kirish
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                Ro'yxatdan o'tish
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-blue-400 text-sm">AI asosidagi ta'lim platformasi</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Sun'iy Intellekt bilan
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-cyan-500"> O'rganing</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            MentorAI - shaxsiy AI ustozingiz. Istalgan vaqtda, istalgan joyda 
            professional darajada bilim oling.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/register" 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition transform hover:scale-105"
            >
              Bepul Boshlash <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="#features" 
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition"
            >
              Batafsil
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-slate-700 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nima uchun MentorAI?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Zamonaviy texnologiyalar va AI yordamida o'rganishni yangi bosqichga olib chiqing
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition group"
              >
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-4 group-hover:bg-blue-500/20 transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Qanday ishlaydi?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold text-white mb-2">Ro'yxatdan o'ting</h3>
              <p className="text-slate-400">Bepul hisob yarating va profilingizni to'ldiring</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold text-white mb-2">Yo'nalish tanlang</h3>
              <p className="text-slate-400">O'zingizga mos kurs yoki yo'nalishni tanlang</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold text-white mb-2">O'rganishni boshlang</h3>
              <p className="text-slate-400">AI ustoz yordamida bilim oling va mashq qiling</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Foydalanuvchilar fikri
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-slate-300 mb-4">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-slate-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-linear-to-r from-blue-600 to-cyan-600 rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Hoziroq Boshlang!
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Minglab o'quvchilar allaqachon MentorAI bilan o'qimoqda. Siz ham qo'shiling!
          </p>
          <Link 
            to="/register" 
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-100 transition"
          >
            Bepul Ro'yxatdan O'tish <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-8 h-8 text-blue-500" />
                <span className="text-xl font-bold text-white">MentorAI</span>
              </div>
              <p className="text-slate-400">
                AI asosidagi zamonaviy ta'lim platformasi
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Platforma</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition">Kurslar</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Mashqlar</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">AI Ustoz</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Kompaniya</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition">Biz haqimizda</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Karyera</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Aloqa</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition">Yordam</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">info@mentorai.uz</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">+998 90 123 45 67</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
            <p>© 2026 MentorAI. Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
