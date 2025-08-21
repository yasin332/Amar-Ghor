import { useState, useEffect } from 'react'

const PasswordStrengthIndicator = ({ password, language = 'en' }) => {
  const [strength, setStrength] = useState(0)
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  })

  const translations = {
    en: {
      strength: "Password Strength",
      weak: "Weak",
      fair: "Fair", 
      good: "Good",
      strong: "Strong",
      veryStrong: "Very Strong",
      requirements: "Password Requirements",
      minLength: "At least 8 characters",
      uppercase: "One uppercase letter",
      lowercase: "One lowercase letter", 
      number: "One number",
      special: "One special character"
    },
    bn: {
      strength: "পাসওয়ার্ডের শক্তি",
      weak: "দুর্বল",
      fair: "মাঝারি",
      good: "ভালো", 
      strong: "শক্তিশালী",
      veryStrong: "খুব শক্তিশালী",
      requirements: "পাসওয়ার্ডের প্রয়োজনীয়তা",
      minLength: "কমপক্ষে ৮টি অক্ষর",
      uppercase: "একটি বড় হাতের অক্ষর",
      lowercase: "একটি ছোট হাতের অক্ষর",
      number: "একটি সংখ্যা", 
      special: "একটি বিশেষ অক্ষর"
    }
  }

  const t = translations[language]

  useEffect(() => {
    if (!password) {
      setStrength(0)
      setRequirements({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      })
      return
    }

    // Check requirements
    const newRequirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    }

    setRequirements(newRequirements)

    // Calculate strength
    let score = 0
    if (newRequirements.length) score += 1
    if (newRequirements.uppercase) score += 1
    if (newRequirements.lowercase) score += 1
    if (newRequirements.number) score += 1
    if (newRequirements.special) score += 1

    // Bonus for length
    if (password.length >= 12) score += 1
    if (password.length >= 16) score += 1

    setStrength(Math.min(score, 7))
  }, [password])

  const getStrengthText = () => {
    if (strength <= 1) return t.weak
    if (strength <= 2) return t.fair
    if (strength <= 3) return t.good
    if (strength <= 4) return t.strong
    return t.veryStrong
  }

  const getStrengthColor = () => {
    if (strength <= 1) return 'bg-red-500'
    if (strength <= 2) return 'bg-orange-500'
    if (strength <= 3) return 'bg-yellow-500'
    if (strength <= 4) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getStrengthWidth = () => {
    if (strength === 0) return 'w-0'
    if (strength === 1) return 'w-1/7'
    if (strength === 2) return 'w-2/7'
    if (strength === 3) return 'w-3/7'
    if (strength === 4) return 'w-4/7'
    if (strength === 5) return 'w-5/7'
    if (strength === 6) return 'w-6/7'
    return 'w-full'
  }

  if (!password) return null

  return (
    <div className="mt-2 space-y-3">
      {/* Strength Bar */}
      <div>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-slate-600 font-medium">{t.strength}</span>
          <span className={`font-semibold ${getStrengthColor().replace('bg-', 'text-')}`}>
            {getStrengthText()}
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()} ${getStrengthWidth()}`}
          />
        </div>
      </div>

      {/* Requirements */}
      <div>
        <p className="text-sm font-medium text-slate-600 mb-2">{t.requirements}</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${requirements.length ? 'bg-green-500' : 'bg-slate-300'}`} />
            <span className={`text-xs ${requirements.length ? 'text-green-700' : 'text-slate-500'}`}>
              {t.minLength}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${requirements.uppercase ? 'bg-green-500' : 'bg-slate-300'}`} />
            <span className={`text-xs ${requirements.uppercase ? 'text-green-700' : 'text-slate-500'}`}>
              {t.uppercase}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${requirements.lowercase ? 'bg-green-500' : 'bg-slate-300'}`} />
            <span className={`text-xs ${requirements.lowercase ? 'text-green-700' : 'text-slate-500'}`}>
              {t.lowercase}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${requirements.number ? 'bg-green-500' : 'bg-slate-300'}`} />
            <span className={`text-xs ${requirements.number ? 'text-green-700' : 'text-slate-500'}`}>
              {t.number}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${requirements.special ? 'bg-green-500' : 'bg-slate-300'}`} />
            <span className={`text-xs ${requirements.special ? 'text-green-700' : 'text-slate-500'}`}>
              {t.special}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordStrengthIndicator



