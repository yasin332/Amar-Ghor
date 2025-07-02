import HeroSection from '../components/HeroSection'
import ProblemSection from '../components/ProblemSection'
import FeatureSection from '../components/FeatureSection'
import Footer from '../components/Footer'

const LandingPage = ({ language }) => {
  return (
    <div className="min-h-screen">
      <HeroSection language={language} />
      <ProblemSection language={language} />
      <FeatureSection language={language} />
      <Footer language={language} />
    </div>
  )
}

export default LandingPage 