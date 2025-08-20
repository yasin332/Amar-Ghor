import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { getErrorMessage, isValidEmail, isValidPassword } from '../lib/utils'
import { supabase } from '../lib/supabaseClient'
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator'

const SignupPage = ({ language = 'en' }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    userType: '',
    area: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  
  const navigate = useNavigate()

  const translations = {
    en: {
      title: "Join আমার ঘর",
      subtitle: "Create your account and start building trust",
      firstNameLabel: "First Name",
      firstNamePlaceholder: "Enter your first name",
      lastNameLabel: "Last Name", 
      lastNamePlaceholder: "Enter your last name",
      emailLabel: "Email Address",
      emailPlaceholder: "Enter your email",
      phoneLabel: "Phone Number",
      phonePlaceholder: "Enter your mobile number",
      userTypeLabel: "I am a...",
      landlordOption: "Landlord (Property Owner)",
      tenantOption: "Tenant (Renter)",
      maintenanceOption: "Maintenance Team",
      areaLabel: "Area in Dhaka",
      areaPlaceholder: "e.g., Dhanmondi, Gulshan, Uttara",
      passwordLabel: "Password",
      passwordPlaceholder: "Create a strong password",
      confirmPasswordLabel: "Confirm Password",
      confirmPasswordPlaceholder: "Re-enter your password",
      showPassword: "Show",
      hidePassword: "Hide",
      agreeToTerms: "I agree to the Terms of Service and Privacy Policy",
      signupButton: "Create Account",
      haveAccount: "Already have an account?",
      loginLink: "Sign in here",
      securityNote: "Your personal information is encrypted and secure"
    },
    bn: {
      title: "আমার ঘরে যোগ দিন",
      subtitle: "আপনার অ্যাকাউন্ট তৈরি করুন এবং বিশ্বাস গড়ে তুলুন",
      firstNameLabel: "নামের প্রথম অংশ",
      firstNamePlaceholder: "আপনার প্রথম নাম লিখুন",
      lastNameLabel: "নামের শেষ অংশ",
      lastNamePlaceholder: "আপনার শেষ নাম লিখুন", 
      emailLabel: "ইমেল ঠিকানা",
      emailPlaceholder: "আপনার ইমেল লিখুন",
      phoneLabel: "ফোন নম্বর",
      phonePlaceholder: "আপনার মোবাইল নম্বর লিখুন",
      userTypeLabel: "আমি একজন...",
      landlordOption: "বাড়িওয়ালা (সম্পত্তির মালিক)",
      tenantOption: "ভাড়াটে (ভাড়াটিয়া)",
      maintenanceOption: "রক্ষণাবেক্ষণ দল",
      areaLabel: "ঢাকার এলাকা",
      areaPlaceholder: "যেমন: ধানমন্ডি, গুলশান, উত্তরা",
      passwordLabel: "পাসওয়ার্ড",
      passwordPlaceholder: "একটি শক্তিশালী পাসওয়ার্ড তৈরি করুন",
      confirmPasswordLabel: "পাসওয়ার্ড নিশ্চিত করুন",
      confirmPasswordPlaceholder: "আপনার পাসওয়ার্ড আবার লিখুন",
      showPassword: "দেখান",
      hidePassword: "লুকান",
      agreeToTerms: "আমি সেবার শর্তাবলী এবং গোপনীয়তা নীতিতে সম্মত",
      signupButton: "অ্যাকাউন্ট তৈরি করুন",
      haveAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে?",
      loginLink: "এখানে সাইন ইন করুন",
      securityNote: "আপনার ব্যক্তিগত তথ্য এনক্রিপ্ট করা এবং নিরাপদ"
    }
  }

  const t = translations[language]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!isValidEmail(formData.email)) newErrors.email = 'Please enter a valid email'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.userType) newErrors.userType = 'Please select your role'
    if (!formData.area.trim()) newErrors.area = 'Area is required'
    if (!isValidPassword(formData.password)) newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setErrors({})

    try {
      const { user, error } = await supabase.auth.signUp(
        {
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              user_type: formData.userType,
              phone: formData.phone,
              area: formData.area
            }
          }
        }
      )

      if (error) {
        throw error
      }
      
      // Show success message and redirect
      navigate('/login', { 
        state: { 
          message: 'Account created successfully! Please check your email to verify your account and sign in.' 
        }
      })
    } catch (error) {
      setErrors({ general: getErrorMessage(error) })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
          className="w-full max-w-lg"
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

          {/* Signup Form Card */}
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
              
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.firstNameLabel}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder={t.firstNamePlaceholder}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/70 backdrop-blur-sm"
                    required
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.lastNameLabel}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    placeholder={t.lastNamePlaceholder}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/70 backdrop-blur-sm"
                    required
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* User Type Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  {t.userTypeLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.userType === 'landlord' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-slate-300 hover:border-slate-400'
                  }`}>
                    <input
                      type="radio"
                      name="userType"
                      value="landlord"
                      checked={formData.userType === 'landlord'}
                      onChange={handleInputChange}
                      className="text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-slate-800">🏠 {t.landlordOption}</div>
                    </div>
                  </label>
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.userType === 'tenant' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-slate-300 hover:border-slate-400'
                  }`}>
                    <input
                      type="radio"
                      name="userType"
                      value="tenant"
                      checked={formData.userType === 'tenant'}
                      onChange={handleInputChange}
                      className="text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-slate-800">👤 {t.tenantOption}</div>
                    </div>
                  </label>
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.userType === 'maintenance' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-slate-300 hover:border-slate-400'
                  }`}>
                    <input
                      type="radio"
                      name="userType"
                      value="maintenance"
                      checked={formData.userType === 'maintenance'}
                      onChange={handleInputChange}
                      className="text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-slate-800">🔧 {t.maintenanceOption}</div>
                    </div>
                  </label>
                </div>
                {errors.userType && (
                  <p className="mt-1 text-sm text-red-600">{errors.userType}</p>
                )}
              </div>

              {/* Contact Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t.phonePlaceholder}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/70 backdrop-blur-sm"
                    required
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Area Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.areaLabel}
                </label>
                                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder={t.areaPlaceholder}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/70 backdrop-blur-sm"
                    required
                  />
                  {errors.area && (
                    <p className="mt-1 text-sm text-red-600">{errors.area}</p>
                  )}
                </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 text-xs font-medium"
                    >
                      {showPassword ? t.hidePassword : t.showPassword}
                    </button>
                  </div>
                  <PasswordStrengthIndicator password={formData.password} language={language} />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
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
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 text-xs font-medium"
                    >
                      {showConfirmPassword ? t.hidePassword : t.showPassword}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded mt-1"
                  required
                />
                <label className="text-sm text-slate-600 leading-relaxed">
                  {t.agreeToTerms}
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
              )}

              {/* Signup Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : t.signupButton}
              </motion.button>

              {/* Login Link */}
              <p className="text-center text-sm text-slate-600">
                {t.haveAccount}{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  {t.loginLink}
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

export default SignupPage 