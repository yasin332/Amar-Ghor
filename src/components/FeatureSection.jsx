import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const FeatureSection = ({ language = 'en' }) => {
  const navigate = useNavigate()
  
  const translations = {
    en: {
      title: "Why Choose",
      titleHighlight: "আমার ঘর",
      subtitle: "Built specifically for the unique needs of",
      subtitleHighlight: "Bangladesh's rental market.",
      ctaButton: "Start Building Trust Today"
    },
    bn: {
      title: "কেন বেছে নিবেন",
      titleHighlight: "আমার ঘর",
      subtitle: "বিশেষভাবে তৈরি করা হয়েছে",
      subtitleHighlight: "বাংলাদেশের ভাড়া বাজারের জন্য।",
      ctaButton: "আজই বিশ্বাস গড়ে তুলুন"
    }
  }

  const t = translations[language]
  const features = [
    {
      icon: "✅",
      title: "Shared System of Record",
      subtitle: "Shared digital ledger for both parties",
      description: "A single source of truth that both landlords and tenants can access, update, and rely on for all rental transactions and communications.",
      highlight: "Transparency at its core"
    },
    {
      icon: "📱", 
      title: "Purpose-Built",
      subtitle: "Built for mobile & low-bandwidth users",
      description: "Designed specifically for the Bangladeshi market with mobile-first approach and optimized for areas with limited internet connectivity.",
      highlight: "Bangladesh-focused design"
    },
    {
      icon: "🔔",
      title: "Radically Simple",
      subtitle: "Real-time updates with optional SMS alerts",
      description: "Clean, intuitive interface that anyone can use, with instant notifications and SMS backup to ensure nothing gets missed.",
      highlight: "Simple yet powerful"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8
      }
    }
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Refined Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-50">
        {/* Gentle animated overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-100/30 via-transparent to-blue-100/30"></div>
        
        {/* Subtle floating elements */}
        <div className="absolute top-10 left-1/4 w-3 h-3 bg-blue-400/40 rounded-full animate-slow-pulse"></div>
        <div className="absolute top-32 right-1/4 w-2 h-2 bg-indigo-400/40 rounded-full animate-slow-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-4 h-4 bg-slate-400/30 rounded-full animate-slow-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-blue-500/40 rounded-full animate-slow-pulse" style={{animationDelay: '3s'}}></div>
        
        {/* Elegant pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23475569' fill-opacity='0.4'%3E%3Cpath d='M10 10h40v40H10V10zm5 5v30h30V15H15zm5 5h20v20H20V20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Soft mesh gradients */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/20 via-transparent to-indigo-100/20"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-slate-100/10 to-transparent"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            {t.title}{' '}
            <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-700 bg-clip-text text-transparent">
              {t.titleHighlight}
            </span>?
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}{' '}
            <span className="text-blue-700 font-semibold">{t.subtitleHighlight}</span>
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`flex flex-col lg:flex-row items-center gap-8 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Feature Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-5xl bg-gradient-to-br from-slate-100 to-blue-100 p-4 rounded-2xl border border-slate-200 shadow-sm">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-slate-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-blue-700 font-semibold text-lg">
                      {feature.subtitle}
                    </p>
                  </div>
                </div>
                
                <p className="text-slate-600 leading-relaxed text-lg">
                  {feature.description}
                </p>
                
                <div className="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 text-blue-800 px-6 py-3 rounded-full font-medium">
                  {feature.highlight}
                </div>
              </div>

              {/* Feature Visual */}
              <div className="flex-1 flex justify-center">
                <div className="w-80 h-80 bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-xl border border-slate-200 flex items-center justify-center relative overflow-hidden">
                  {/* Subtle animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 animate-slow-pulse"></div>
                  
                  {/* Large icon */}
                  <div className="text-8xl text-slate-600 relative z-10 animate-float">{feature.icon}</div>
                  
                  {/* Gentle floating elements */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-blue-400/60 rounded-full animate-slow-pulse"></div>
                  <div className="absolute bottom-6 left-6 w-2 h-2 bg-indigo-400/60 rounded-full animate-slow-pulse" style={{animationDelay: '1s'}}></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <button 
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xl px-12 py-5 rounded-2xl shadow-xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 border border-blue-500/20"
          >
            {t.ctaButton}
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default FeatureSection 