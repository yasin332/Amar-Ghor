import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getErrorMessage, isValidPassword } from '../lib/utils'
import { supabase } from '../lib/supabaseClient'

const ResetPasswordPage = ({ language = 'en' }) => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isValidToken, setIsValidToken] = useState(false)
  
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const translations = {
    en: {
      title: "Reset Your Password",
      subtitle: "Enter your new password below",
      passwordLabel: "New Password",
      passwordPlaceholder: "Enter your new password",
      confirmPasswordLabel: "Confirm New Password",
      confirmPasswordPlaceholder: "Confirm your new password",
      showPassword: "Show",
      hidePassword: "Hide",
      resetButton: "Reset Password",
      passwordRequirements: "Password must be at least 8 characters long",
      successTitle: "Password Reset Successful!",
      successMessage: "Your password has been successfully reset. You can now sign in with your new password.",
      signInLink: "Sign In",
      invalidToken: "Invalid or expired reset link. Please request a new password reset.",
      requestNewLink: "Request New Reset Link"
    },
    bn: {
      title: "আপনার পাসওয়ার্ড রিসেট করুন",
      subtitle: "নিচে আপনার নতুন পাসওয়ার্ড লিখুন",
      passwordLabel: "নতুন পাসওয়ার্ড",
      passwordPlaceholder: "আপনার নতুন পাসওয়ার্ড লিখুন",
      confirmPasswordLabel: "নতুন পাসওয়ার্ড নিশ্চিত করুন",
      confirmPasswordPlaceholder: "আপনার নতুন পাসওয়ার্ড নিশ্চিত করুন",
      showPassword: "দেখান",
      hidePassword: "লুকান",
      resetButton: "পাসওয়ার্ড রিসেট করুন",
      passwordRequirements: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে",
      successTitle: "পাসওয়ার্ড সফলভাবে রিসেট হয়েছে!",
      successMessage: "আপনার পাসওয়ার্ড সফলভাবে রিসেট হয়েছে। আপনি এখন আপনার নতুন পাসওয়ার্ড দিয়ে সাইন ইন করতে পারেন।",
      signInLink: "সাইন ইন করুন",
      invalidToken: "অবৈধ বা মেয়াদোত্তীর্ণ রিসেট লিংক। অনুগ্রহ করে একটি নতুন পাসওয়ার্ড রিসেট অনুরোধ করুন।",
      requestNewLink: "নতুন রিসেট লিংক অনুরোধ করুন"
    }
  }

  const t = translations[language]

  useEffect(() => {
    // Check if we have a valid session (user clicked reset link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsValidToken(true)
      } else {
        // Check if we have access_token in URL params (from email link)
        const accessToken = searchParams.get('access_token')
        if (accessToken) {
          // Set the session manually
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: searchParams.get('refresh_token') || ''
          })
          if (data.session && !error) {
            setIsValidToken(true)
          }
        }
      }
    }
    
    checkSession()
  }, [searchParams])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      })

      if (error) {
        throw error
      }

      setIsSuccess(true)
      // Sign out the user after successful password reset
      await supabase.auth.signOut()
    } catch (error) {
      setErrors({ general: getErrorMessage(error) })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestNewLink = () => {
    navigate('/login')
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-slate-200/30 to-blue-200/20 rounded-full backdrop-blur-sm animate-slow-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-indigo-200/20 to-slate-200/30 rounded-full backdrop-blur-sm animate-float"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
              <div className="text-red-600 text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                {t.invalidToken}
              </h2>
              <button
                onClick={handleRequestNewLink}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                {t.requestNewLink}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-slate-200/30 to-blue-200/20 rounded-full backdrop-blur-sm animate-slow-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-indigo-200/20 to-slate-200/30 rounded-full backdrop-blur-sm animate-float"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
              <div className="text-green-600 text-4xl mb-4">✅</div>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                {t.successTitle}
              </h2>
              <p className="text-slate-600 mb-6">
                {t.successMessage}
              </p>
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-block"
              >
                {t.signInLink}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-slate-200/30 to-blue-200/20 rounded-full backdrop-blur-sm animate-slow-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-indigo-200/20 to-slate-200/30 rounded-full backdrop-blur-sm animate-float"></div>
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

          {/* Reset Password Form Card */}
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
              {/* Error Message */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}
              
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
                <p className="text-slate-500 text-xs mt-1">{t.passwordRequirements}</p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.confirmPasswordLabel}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder={t.confirmPasswordPlaceholder}
                    className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/70 backdrop-blur-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 text-sm font-medium"
                  >
                    {showConfirmPassword ? t.hidePassword : t.showPassword}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Reset Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Resetting...' : t.resetButton}
              </motion.button>

              {/* Back to Login */}
              <p className="text-center text-sm text-slate-600">
                Remember your password?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  {t.signInLink}
                </Link>
              </p>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
