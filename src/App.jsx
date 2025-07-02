import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Header from './components/Header'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import LandlordHomepage from './pages/LandlordHomepage'
import TenantHomepage from './pages/TenantHomepage'
import MaintenanceHomepage from './pages/MaintenanceHomepage'

function AppContent() {
  const [language, setLanguage] = useState('en')
  const location = useLocation()
  
  // Hide header on maintenance page
  const showHeader = location.pathname !== '/maintenance'

  return (
    <div className="App">
      {showHeader && <Header language={language} setLanguage={setLanguage} />}
      <Routes>
        <Route path="/" element={<LandingPage language={language} />} />
        <Route path="/login" element={<LoginPage language={language} />} />
        <Route path="/signup" element={<SignupPage language={language} />} />
        <Route path="/landlord" element={<LandlordHomepage language={language} />} />
        <Route path="/tenant" element={<TenantHomepage language={language} />} />
        <Route path="/maintenance" element={<MaintenanceHomepage language={language} />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App 