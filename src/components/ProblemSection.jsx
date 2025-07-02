import { motion } from 'framer-motion'

const ProblemSection = ({ language = 'en' }) => {
  const translations = {
    en: {
      title: "Problems",
      titleAction: "We Solve",
      subtitle: "Traditional rental agreements create confusion and conflict.",
      subtitleHighlight: "Here's what we're changing."
    },
    bn: {
      title: "সমস্যা",
      titleAction: "আমরা সমাধান করি",
      subtitle: "ঐতিহ্যবাহী ভাড়া চুক্তি বিভ্রান্তি এবং দ্বন্দ্ব সৃষ্টি করে।",
      subtitleHighlight: "এখানে আমরা যা পরিবর্তন করছি।"
    }
  }

  const t = translations[language]
  const problems = [
    {
      icon: "📄",
      title: "No rent receipt? No proof.",
      description: "Paper receipts get lost, handwritten records fade, and disputes arise without proper documentation."
    },
    {
      icon: "🔧", 
      title: "Verbal repair requests get ignored.",
      description: "Maintenance issues mentioned in passing often get forgotten, leading to frustration and deteriorating conditions."
    },
    {
      icon: "📅",
      title: "Landlords forget rent due or repairs.",
      description: "Without a centralized system, important dates and commitments slip through the cracks on both sides."
    },
    {
      icon: "⚖️",
      title: "Disputes happen due to no record.",
      description: "When disagreements arise, there's no reliable record to reference, making resolution difficult and unfair."
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Sophisticated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-gray-50 to-blue-50">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23475569' fill-opacity='0.3'%3E%3Cpath d='m0 40 40-40h-20l-20 20m40 40v-20l-20 20'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Gentle accent shapes */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-slate-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-indigo-200/30 to-slate-200/30 rounded-full blur-3xl"></div>
        
        {/* Soft orbs */}
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl animate-slow-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-slate-300/20 rounded-full blur-2xl animate-slow-pulse" style={{animationDelay: '1s'}}></div>
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
            <span className="bg-gradient-to-r from-slate-700 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
              {t.title}
            </span>{' '}
            <span className="text-blue-600">{t.titleAction}</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
            <br />
            <span className="text-blue-700 font-medium">{t.subtitleHighlight}</span>
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-100/50"
            >
              {/* Subtle glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-slate-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="text-5xl mb-6 transform group-hover:scale-105 transition-transform duration-300">{problem.icon}</div>
                <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-blue-700 transition-colors">
                  {problem.title}
                </h3>
                <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">
                  {problem.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default ProblemSection 