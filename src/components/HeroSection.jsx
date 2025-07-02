import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const HeroSection = ({ language = 'en' }) => {
  const navigate = useNavigate()
  
  const translations = {
    en: {
      title: "A Digital Bridge of",
      titleHighlight: "Trust",
      subtitle: "Between Landlord and Tenant",
      tagline: "Ditch paper ledgers and verbal promises.",
      taglineHighlight: "Step into clarity and shared accountability.",
      primaryButton: "Get Started",
      secondaryButton: "Learn More"
    },
    bn: {
      title: "ডিজিটাল সেতু",
      titleHighlight: "বিশ্বাসের",
      subtitle: "বাড়িওয়ালা এবং ভাড়াটের মধ্যে",
      tagline: "কাগজের খাতা ও মৌখিক প্রতিশ্রুতি ছেড়ে দিন।",
      taglineHighlight: "স্বচ্ছতা এবং পারস্পরিক দায়বদ্ধতায় প্রবেশ করুন।",
      primaryButton: "শুরু করুন",
      secondaryButton: "আরও জানুন"
    }
  }

  const t = translations[language]
  return (
    <section className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-20 pt-32">
      {/* Sophisticated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Subtle floating shapes */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-slate-200/40 to-slate-100/30 rounded-full backdrop-blur-sm animate-float"></div>
        <div className="absolute top-32 right-10 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-indigo-200/20 rounded-full backdrop-blur-sm animate-slow-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-gradient-to-br from-gray-200/25 to-slate-200/20 rounded-full backdrop-blur-sm animate-float" style={{animationDelay: '2s'}}></div>
        
        {/* Refined geometric patterns */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 border-2 border-slate-300/40 rounded-lg rotate-45 animate-slow-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 border-2 border-blue-300/40 rounded-full animate-slow-pulse" style={{animationDelay: '3s'}}></div>
        
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-white/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent"></div>
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-slate-800 leading-tight mb-6">
            {t.title}{' '}
            <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-700 bg-clip-text text-transparent">
              {t.titleHighlight}
            </span>
            <br />
            <span className="text-3xl md:text-5xl font-medium text-slate-700">
              {t.subtitle}
            </span>
          </h1>
          
          {/* Visual separator */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 200 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-1 bg-gradient-to-r from-blue-500 to-slate-600 mx-auto rounded-full mb-8"
          ></motion.div>
          
          {/* Tagline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed"
          >
            {t.tagline}
            <br className="hidden md:block" />
            <span className="text-blue-700 font-medium">{t.taglineHighlight}</span>
          </motion.p>
          
          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button 
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300"
            >
              {t.primaryButton}
            </button>
            <button className="bg-white border-2 border-slate-300 text-slate-700 font-medium text-lg px-8 py-4 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-300">
              {t.secondaryButton}
            </button>
          </motion.div>
          
          {/* Visual indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="pt-16"
          >
            <div className="flex justify-center">
              <div className="w-6 h-6 border-2 border-primary-500 rounded-full animate-bounce"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection 