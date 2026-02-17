import { useState, useEffect } from 'react'
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
    { value: "5", label: "Faol O'quvchilar" },
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
    },
    {
      name: "Dilshod Aliyev",
      role: "Backend Developer",
      text: "AI bilan kod yozishni o'rganish juda qiziqarli bo'ldi. Har bir mavzuni chuqur tushuntiradi.",
      rating: 5
    },
    {
      name: "Madina Usmonova",
      role: "Talaba",
      text: "Matematika va fizikadan mashqlar juda yaxshi tuzilgan. Tushunish oson!",
      rating: 5
    },
    {
      name: "Jasur Xolmatov",
      role: "Full Stack Developer",
      text: "Guruh ishlari va loyiha asosida o'rganish metodikasi ajoyib natija beradi.",
      rating: 5
    },
    {
      name: "Sevara Qodirova",
      role: "UX Designer",
      text: "Dizayn kurslarini AI yordamida o'rganish yangi tajriba bo'ldi. Tavsiya qilaman!",
      rating: 5
    },
    {
      name: "Otabek Nazarov",
      role: "Talaba",
      text: "Shaxsiy o'quv rejasi tuzib berishi eng katta afzallik. Vaqtni tejaydi.",
      rating: 5
    },
    {
      name: "Kamola Mirzayeva",
      role: "Data Analyst",
      text: "Python va data science bo'yicha mashqlar professional darajada tayyorlangan.",
      rating: 5
    },
    {
      name: "Sardor Rahmatullayev",
      role: "Mobile Developer",
      text: "React Native kursini MentorAI orqali tugatdim. Sertifikat ham oldim!",
      rating: 5
    }
  ]

  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % (testimonials.length - 2))
    }, 4000)
    return () => clearInterval(interval)
  }, [testimonials.length])

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
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-1500 ease-in-out gap-8"
              style={{ transform: `translateX(-${currentTestimonial * (100 / 3 + 2.67)}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 min-w-[calc(33.333%-1.34rem)] shrink-0">
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
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(testimonials.length - 2)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentTestimonial === index ? 'bg-blue-500 w-6' : 'bg-slate-600 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400 text-sm">MentorAI — Barcha huquqlar himoyalangan</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
