import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const LoginPage = ({ language = 'en' }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const translations = {
    en: {
      title: "Welcome Back",
      subtitle: "Sign in to your Amar Ghor account",
      emailLabel: "Email Address",
      emailPlaceholder: "Enter your email",
      passwordLabel: "Password", 
      passwordPlaceholder: "Enter your password",
      showPassword: "Show",
      hidePassword: "Hide",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      loginButton: "Sign In",
      noAccount: "Don't have an account?",
      signUpLink: "Sign up here",
      securityNote: "Your data is protected with bank-level security",
      orDivider: "Or continue with",
      phoneLogin: "Phone Number",
      phoneLoginDesc: "Sign in with your mobile number"
    },
    bn: {
      title: "আবার স্বাগতম",
      subtitle: "আপনার আমার ঘর অ্যাকাউন্টে সাইন ইন করুন",
      emailLabel: "ইমেল ঠিকানা",
      emailPlaceholder: "আপনার ইমেল লিখুন",
      passwordLabel: "পাসওয়ার্ড",
      passwordPlaceholder: "আপনার পাসওয়ার্ড লিখুন", 
      showPassword: "দেখান",
      hidePassword: "লুকান",
      rememberMe: "আমাকে মনে রাখুন",
      forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
      loginButton: "সাইন ইন",
      noAccount: "কোন অ্যাকাউন্ট নেই?",
      signUpLink: "এখানে সাইন আপ করুন",
      securityNote: "আপনার তথ্য ব্যাংক-স্তরের নিরাপত্তায় সুরক্ষিত",
      orDivider: "অথবা এটি দিয়ে চালিয়ে যান",
      phoneLogin: "ফোন নম্বর",
      phoneLoginDesc: "আপনার মোবাইল নম্বর দিয়ে সাইন ইন করুন"
    }
  }

  const t = translations[language]

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Login attempt:', formData)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Subtle floating shapes */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-slate-200/30 to-blue-200/20 rounded-full backdrop-blur-sm animate-slow-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-indigo-200/20 to-slate-200/30 rounded-full backdrop-blur-sm animate-float"></div>
        <div className="absolute top-1/2 left-10 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl animate-slow-pulse"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Logo Section */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-700 bg-clip-text text-transparent mb-2">
                Amar Ghor
              </h1>
            </Link>
            <p className="text-slate-500 text-sm">
              {language === 'en' ? 'Digital Bridge of Trust' : 'বিশ্বাসের ডিজিটাল সেতু'}
            </p>
          </div>

          {/* Login Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {t.title}
              </h2>
              <p className="text-slate-600">
                {t.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t.emailPlaceholder}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/70 backdrop-blur-sm"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.passwordLabel}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={t.passwordPlaceholder}
                    className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/70 backdrop-blur-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 text-sm font-medium"
                  >
                    {showPassword ? t.hidePassword : t.showPassword}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                  <span className="ml-2 text-sm text-slate-600">{t.rememberMe}</span>
                </label>
                <button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  {t.forgotPassword}
                </button>
              </div>

              {/* Login Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                {t.loginButton}
              </motion.button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">{t.orDivider}</span>
                </div>
              </div>

              {/* Phone Login Option */}
              <button
                type="button"
                className="w-full bg-white border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span className="text-lg">📱</span>
                {t.phoneLogin}
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-slate-600">
                {t.noAccount}{' '}
                <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                  {t.signUpLink}
                </Link>
              </p>
            </form>
          </motion.div>

          {/* Security Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-6"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <span className="text-green-600">🔒</span>
              {t.securityNote}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage 