import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const Header = ({ language, setLanguage }) => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Check if user is on dashboard (logged in)
  const isLoggedIn = location.pathname === '/landlord' || location.pathname === '/tenant'
  
  const translations = {
    en: {
      tagline: "Digital Bridge of Trust",
      language: "Language:",
      login: "Log In",
      signup: "Sign Up",
      dashboard: "Dashboard",
      logout: "Log Out",
      profile: "Profile"
    },
    bn: {
      tagline: "বিশ্বাসের ডিজিটাল সেতু",
      language: "ভাষা:",
      login: "লগ ইন",
      signup: "সাইন আপ",
      dashboard: "ড্যাশবোর্ড",
      logout: "লগ আউট",
      profile: "প্রোফাইল"
    }
  }

  const currentLang = translations[language]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-700 bg-clip-text text-transparent">
                Amar Ghor
              </h1>
              <p className="text-sm text-slate-500 font-medium">{currentLang.tagline}</p>
            </Link>
          </motion.div>
          
          {/* Right side: Auth + Language */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-6"
          >
            {/* Auth Buttons / User Menu */}
            {!isLoggedIn ? (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate('/login')}
                  className="text-slate-700 hover:text-blue-700 font-medium text-sm transition-colors"
                >
                  {currentLang.login}
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm transition-colors"
                >
                  {currentLang.signup}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate(location.pathname === '/tenant' ? '/tenant' : '/landlord')}
                  className="text-slate-700 hover:text-blue-700 font-medium text-sm transition-colors"
                >
                  {currentLang.dashboard}
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="text-slate-700 hover:text-red-700 font-medium text-sm transition-colors"
                >
                  {currentLang.logout}
                </button>
              </div>
            )}
            
            {/* Language Switcher */}
            <div className="hidden sm:flex items-center gap-3 border-l border-slate-200 pl-6">
              <span className="text-sm text-slate-600 font-medium">{currentLang.language}</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    language === 'en' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLanguage('bn')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    language === 'bn' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  বাং
                </button>
              </div>
            </div>
            
            {/* Mobile Language Switcher */}
            <div className="sm:hidden flex gap-1">
              <button 
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  language === 'en' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('bn')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  language === 'bn' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                বাং
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  )
}

export default Header 