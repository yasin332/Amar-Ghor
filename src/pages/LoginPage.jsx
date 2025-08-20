import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { getErrorMessage, isValidEmail } from '../lib/utils'
import { supabase } from '../lib/supabaseClient'

const LoginPage = ({ language = 'en' }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get success message from signup
  const successMessage = location.state?.message

  const translations = {
    en: {
      title: "Welcome Back",
      subtitle: "Sign in to your আমার ঘর account",
      emailLabel: "Email Address",
      emailPlaceholder: "Enter your email",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      showPassword: "Show",
      hidePassword: "Hide",
      loginButton: "Sign In",
      forgotPassword: "Forgot your password?",
      orDivider: "OR",
      phoneLogin: "Continue with Phone",
      noAccount: "Don't have an account?",
      signUpLink: "Sign up here",
      securityNote: "Your connection is secure and encrypted",
      forgotPasswordTitle: "Reset Your Password",
      forgotPasswordSubtitle: "Enter your email address and we'll send you a link to reset your password.",
      sendResetLink: "Send Reset Link",
      sending: "Sending...",
      resetLinkSent: "Password reset link has been sent to your email!",
      close: "Close",
      cancel: "Cancel"
    },
    bn: {
      title: "স্বাগতম",
      subtitle: "আপনার আমার ঘর অ্যাকাউন্টে সাইন ইন করুন",
      emailLabel: "ইমেল ঠিকানা", 
      emailPlaceholder: "আপনার ইমেল লিখুন",
      passwordLabel: "পাসওয়ার্ড",
      passwordPlaceholder: "আপনার পাসওয়ার্ড লিখুন",
      showPassword: "দেখান",
      hidePassword: "লুকান", 
      loginButton: "সাইন ইন",
      forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
      orDivider: "অথবা",
      phoneLogin: "ফোন দিয়ে চালিয়ে যান",
      noAccount: "অ্যাকাউন্ট নেই?",
      signUpLink: "এখানে সাইন আপ করুন",
      securityNote: "আপনার সংযোগ নিরাপদ এবং এনক্রিপ্ট করা",
      forgotPasswordTitle: "আপনার পাসওয়ার্ড রিসেট করুন",
      forgotPasswordSubtitle: "আপনার ইমেল ঠিকানা লিখুন এবং আমরা আপনাকে পাসওয়ার্ড রিসেট করার জন্য একটি লিংক পাঠাব।",
      sendResetLink: "রিসেট লিংক পাঠান",
      sending: "পাঠানো হচ্ছে...",
      resetLinkSent: "পাসওয়ার্ড রিসেট লিংক আপনার ইমেলে পাঠানো হয়েছে!",
      close: "বন্ধ করুন",
      cancel: "বাতিল"
    }
  }

  const t = translations[language]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setErrors({})

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        throw error
      }

      if (!data.user) {
        throw new Error('Login successful, but no user data received.')
      }

      // Fetch the user's profile to get their role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        throw profileError
      }
      
      if (!profile || !profile.user_type) {
        // This can happen if the trigger failed or if the user exists in auth but not profiles
        setErrors({ general: 'Could not find a user profile. Please try signing up again or contact support.' })
        await supabase.auth.signOut() // Log the user out to prevent a confusing state
        setIsLoading(false)
        return
      }

      const userType = profile.user_type
      
      // Redirect based on user type
      switch (userType) {
        case 'landlord':
          navigate('/landlord')
          break
        case 'tenant':
          navigate('/tenant')
          break
        case 'maintenance':
          navigate('/maintenance')
          break
        default:
          // Default redirect if user type is not set
          navigate('/')
      }
    } catch (error) {
      setErrors({ general: getErrorMessage(error) })
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    
    if (!isValidEmail(forgotPasswordEmail)) {
      setErrors({ forgotPassword: 'Please enter a valid email address' })
      return
    }
    
    setForgotPasswordLoading(true)
    setErrors({ forgotPassword: null })
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) {
        throw error
      }
      
      setForgotPasswordSuccess(true)
      setForgotPasswordEmail('')
    } catch (error) {
      setErrors({ forgotPassword: getErrorMessage(error) })
    } finally {
      setForgotPasswordLoading(false)
    }
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
                আমার ঘর
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
              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  {successMessage}
                </div>
              )}
              
              {/* Error Message */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}
              
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
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
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
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
                
                {/* Forgot Password Link */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    {t.forgotPassword}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : t.loginButton}
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

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowForgotPassword(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                {t.forgotPasswordTitle}
              </h3>
              <p className="text-slate-600 text-sm">
                {t.forgotPasswordSubtitle}
              </p>
            </div>

            {!forgotPasswordSuccess ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                  {errors.forgotPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.forgotPassword}</p>
                  )}
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false)
                      setForgotPasswordEmail('')
                      setErrors({ forgotPassword: null })
                      setForgotPasswordSuccess(false)
                    }}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {forgotPasswordLoading ? t.sending : t.sendResetLink}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-green-600 text-4xl">✅</div>
                <p className="text-slate-700">{t.resetLinkSent}</p>
                <button
                  onClick={() => {
                    setShowForgotPassword(false)
                    setForgotPasswordSuccess(false)
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {t.close}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default LoginPage 