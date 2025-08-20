import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'

const MaintenanceHomepage = ({ language = 'en' }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [currentLanguage, setCurrentLanguage] = useState(language)
  
  // Modal states
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showSuppliesModal, setShowSuppliesModal] = useState(false)
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null)
  
  // Form states
  const [completionForm, setCompletionForm] = useState({
    workOrderId: '',
    completionNotes: '',
    timeSpent: '',
    suppliesUsed: '',
    issuesEncountered: ''
  })
  
  const [suppliesForm, setSuppliesForm] = useState({
    item: '',
    quantity: '',
    urgency: 'medium',
    reason: ''
  })
  
  const [settingsForm, setSettingsForm] = useState({
    emailNotifications: true,
    smsNotifications: false,
    startTime: '09:00',
    endTime: '17:00',
    specialization: 'Plumbing & Electrical'
  })
  
  // Work orders state (to allow updates)
  const [workOrdersData, setWorkOrdersData] = useState([])
  
  // Team data state
  const [teamData, setTeamData] = useState({
    name: "Ahmed Maintenance Team",
    specialization: "Plumbing & Electrical",
    id: null
  })

  // Error state
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('maintenance_requests')
          .select('*')
        
        if (error) {
          console.error('Error fetching work orders:', error)
          setError('Failed to fetch work orders')
        } else {
          setWorkOrdersData(data || [])
        }
      } catch (err) {
        console.error('Error fetching work orders:', err)
        setError('Failed to fetch work orders')
      }
    }

    fetchWorkOrders()
  }, [])

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.error('Error getting user:', userError)
          setError('Failed to get user information')
          return
        }

        if (user) {
          // Fetch team data based on user ID
          const { data: teamData, error: teamError } = await supabase
            .from('maintenance_teams')
            .select('*')
            .eq('user_id', user.id)
            .single()

          if (teamError) {
            console.warn('Maintenance teams table not found, using fallback data')
            // Keep the default team data if table doesn't exist
          } else if (teamData) {
            setTeamData({
              name: teamData.team_name || "Ahmed Maintenance Team",
              specialization: teamData.specialization || "Plumbing & Electrical",
              id: teamData.id
            })
          }
        }
      } catch (error) {
        console.error('Error fetching team data:', error)
        setError('Failed to fetch team data')
      } finally {
        setLoading(false)
      }
    }

    fetchTeamData()
  }, [])

  // Update currentLanguage when language prop changes
  useEffect(() => {
    setCurrentLanguage(language)
  }, [language])

  const translations = {
    en: {
      welcome: "Welcome back",
      teamName: "Ahmed Maintenance Team",
      subtitle: "Keep properties in perfect condition",
      quickActions: "Quick Actions",
      viewWorkOrders: "View Work Orders",
      updateSchedule: "Update Schedule",
      reportCompletion: "Report Completion",
      requestSupplies: "Request Supplies",
      overview: "Overview",
      workOrders: "Work Orders",
      schedule: "Schedule",
      reports: "Reports",
      settings: "Settings",
      totalAssigned: "Total Assigned",
      completedToday: "Completed Today", 
      pendingTasks: "Pending Tasks",
      upcomingJobs: "Upcoming Jobs",
      recentActivity: "Recent Activity",
      workOrderList: "Work Order List",
      priority: "Priority",
      property: "Property",
      issue: "Issue",
      assignedDate: "Assigned Date",
      status: "Status",
      action: "Action",
      high: "High",
      medium: "Medium", 
      low: "Low",
      pending: "Pending",
      inProgress: "In Progress",
      completed: "Completed",
      markComplete: "Mark Complete",
      viewDetails: "View Details",
      mySchedule: "My Schedule",
      todaysJobs: "Today's Jobs",
      upcomingSchedule: "Upcoming Schedule",
      availability: "Availability",
      workReports: "Work Reports",
      completionReport: "Completion Report",
      issueReport: "Issue Report",
      monthlyReport: "Monthly Report",
      teamSettings: "Team Settings",
      notifications: "Notifications",
      workingHours: "Working Hours",
      specialization: "Specialization",
      // Modal translations
      completeWorkOrder: "Complete Work Order",
      completionNotes: "Completion Notes",
      timeSpent: "Time Spent (hours)",
      suppliesUsed: "Supplies Used",
      issuesEncountered: "Issues Encountered",
      markAsComplete: "Mark as Complete",
      workOrderDetails: "Work Order Details",
      tenant: "Tenant",
      phone: "Phone",
      description: "Description",
      reportCompletion: "Report Completion",
      requestSupplies: "Request Supplies",
      itemNeeded: "Item Needed",
      quantity: "Quantity",
      urgency: "Urgency",
      reason: "Reason for Request",
      submitRequest: "Submit Request",
      cancel: "Cancel",
      save: "Save",
      success: "Success!",
      workOrderCompleted: "Work order marked as completed",
      reportSubmitted: "Report submitted successfully",
      suppliesRequested: "Supplies request submitted",
      settingsUpdated: "Settings updated successfully",
      generateReport: "Generate Report",
      emailNotifications: "Email Notifications",
      smsNotifications: "SMS Notifications",
      logout: "Logout"
    },
    bn: {
      welcome: "স্বাগতম",
      teamName: "আহমেদ রক্ষণাবেক্ষণ দল",
      subtitle: "সম্পত্তিগুলো নিখুঁত অবস্থায় রাখুন",
      quickActions: "দ্রুত কাজ",
      viewWorkOrders: "কাজের অর্ডার দেখুন",
      updateSchedule: "সময়সূচী আপডেট করুন",
      reportCompletion: "সম্পন্নতার রিপোর্ট",
      requestSupplies: "সরবরাহের অনুরোধ",
      overview: "সংক্ষিপ্ত বিবরণ",
      workOrders: "কাজের অর্ডার",
      schedule: "সময়সূচী",
      reports: "রিপোর্ট",
      settings: "সেটিংস",
      totalAssigned: "মোট নির্ধারিত",
      completedToday: "আজ সম্পন্ন",
      pendingTasks: "অমীমাংসিত কাজ",
      upcomingJobs: "আসন্ন কাজ",
      recentActivity: "সাম্প্রতিক কার্যকলাপ",
      workOrderList: "কাজের অর্ডার তালিকা",
      priority: "অগ্রাধিকার",
      property: "সম্পত্তি",
      issue: "সমস্যা",
      assignedDate: "নির্ধারিত তারিখ",
      status: "অবস্থা",
      action: "কাজ",
      high: "উচ্চ",
      medium: "মাঝারি",
      low: "কম",
      pending: "অমীমাংসিত",
      inProgress: "চলমান",
      completed: "সম্পন্ন",
      markComplete: "সম্পন্ন চিহ্নিত করুন",
      viewDetails: "বিস্তারিত দেখুন",
      mySchedule: "আমার সময়সূচী",
      todaysJobs: "আজকের কাজ",
      upcomingSchedule: "আসন্ন সময়সূচী",
      availability: "উপলব্ধতা",
      workReports: "কাজের রিপোর্ট",
      completionReport: "সম্পন্নতার রিপোর্ট",
      issueReport: "সমস্যার রিপোর্ট",
      monthlyReport: "মাসিক রিপোর্ট",
      teamSettings: "দলের সেটিংস",
      notifications: "বিজ্ঞপ্তি",
      workingHours: "কাজের সময়",
      specialization: "বিশেষত্ব",
      // Modal translations
      completeWorkOrder: "কাজের অর্ডার সম্পন্ন করুন",
      completionNotes: "সম্পন্নতার নোট",
      timeSpent: "ব্যয়িত সময় (ঘন্টা)",
      suppliesUsed: "ব্যবহৃত সরবরাহ",
      issuesEncountered: "সম্মুখীন সমস্যা",
      markAsComplete: "সম্পন্ন চিহ্নিত করুন",
      workOrderDetails: "কাজের অর্ডারের বিস্তারিত",
      tenant: "ভাড়াটিয়া",
      phone: "ফোন",
      description: "বিবরণ",
      reportCompletion: "সম্পন্নতার রিপোর্ট",
      requestSupplies: "সরবরাহের অনুরোধ",
      itemNeeded: "প্রয়োজনীয় আইটেম",
      quantity: "পরিমাণ",
      urgency: "জরুরিত্ব",
      reason: "অনুরোধের কারণ",
      submitRequest: "অনুরোধ জমা দিন",
      cancel: "বাতিল",
      save: "সংরক্ষণ",
      success: "সফল!",
      workOrderCompleted: "কাজের অর্ডার সম্পন্ন চিহ্নিত",
      reportSubmitted: "রিপোর্ট সফলভাবে জমা দেওয়া হয়েছে",
      suppliesRequested: "সরবরাহের অনুরোধ জমা দেওয়া হয়েছে",
      settingsUpdated: "সেটিংস সফলভাবে আপডেট হয়েছে",
      generateReport: "রিপোর্ট তৈরি করুন",
      emailNotifications: "ইমেইল বিজ্ঞপ্তি",
      smsNotifications: "এসএমএস বিজ্ঞপ্তি",
      logout: "লগআউট"
    }
  }

  const t = translations[currentLanguage]

  // Language switching function
  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'en' ? 'bn' : 'en')
  }

  // Calculate stats from live data
  const completedToday = workOrdersData.filter(order => {
    const completionDate = new Date(order.completed_at)
    const today = new Date()
    return order.status === 'completed' && completionDate.toDateString() === today.toDateString()
  }).length

  const pendingTasks = workOrdersData.filter(order => order.status === 'pending' || order.status === 'inProgress').length

  const upcomingJobs = workOrdersData.filter(order => {
    const assignedDate = new Date(order.assigned_date)
    const today = new Date()
    return assignedDate > today
  }).length

  // Handler functions
  const handleCompleteWorkOrder = async (e) => {
    e.preventDefault()
    
    const { data, error } = await supabase
      .from('maintenance_requests')
      .update({ status: 'completed' })
      .eq('id', selectedWorkOrder.id)
      .select()

    if (error) {
      console.error('Error completing work order:', error)
      alert('Failed to complete work order.')
      return
    }

    // Update work order status
    setWorkOrdersData(prev => 
      prev.map(order => 
        order.id === selectedWorkOrder.id 
          ? { ...order, status: 'completed' }
          : order
      )
    )
    alert(t.workOrderCompleted)
    setShowCompleteModal(false)
    setCompletionForm({
      workOrderId: '',
      completionNotes: '',
      timeSpent: '',
      suppliesUsed: '',
      issuesEncountered: ''
    })
  }

  const handleViewDetails = (workOrder) => {
    setSelectedWorkOrder(workOrder)
    setShowDetailsModal(true)
  }

  const handleMarkComplete = (workOrder) => {
    setSelectedWorkOrder(workOrder)
    setCompletionForm(prev => ({ ...prev, workOrderId: workOrder.id }))
    setShowCompleteModal(true)
  }

  const handleReportCompletion = (e) => {
    e.preventDefault()
    alert(t.reportSubmitted)
    setShowReportModal(false)
  }

  const handleRequestSupplies = (e) => {
    e.preventDefault()
    alert(t.suppliesRequested)
    setShowSuppliesModal(false)
    setSuppliesForm({
      item: '',
      quantity: '',
      urgency: 'medium',
      reason: ''
    })
  }

  const handleUpdateSettings = (e) => {
    e.preventDefault()
    alert(t.settingsUpdated)
  }

  const handleGenerateReport = (reportType) => {
    alert(`${t.generateReport}: ${reportType}`)
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
        alert('Failed to log out. Please try again.')
      } else {
        // Redirect to login page
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Error during logout:', error)
      alert('An error occurred during logout. Please try again.')
    }
  }

  const todaysSchedule = [
    { time: "9:00 AM", property: "House 45, Dhanmondi", task: "Fix leaking faucet", duration: "1-2 hours" },
    { time: "11:30 AM", property: "Apt 3B, Gulshan", task: "AC repair", duration: "2-3 hours" },
    { time: "3:00 PM", property: "House 8, Uttara", task: "Install new light fixtures", duration: "1 hour" }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'inProgress': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const StatCard = ({ title, value, icon, actionButton, onClick }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl">{icon}</div>
        {actionButton && (
          <button
            onClick={onClick}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {actionButton}
          </button>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-800 mb-1">{value}</div>
      <div className="text-slate-600 text-sm">{title}</div>
    </motion.div>
  )

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t.totalAssigned}
          value={workOrdersData.length}
          icon="📋"
          actionButton={t.viewWorkOrders}
          onClick={() => setActiveTab('workOrders')}
        />
        <StatCard
          title={t.completedToday}
          value={completedToday}
          icon="✅"
        />
        <StatCard
          title={t.pendingTasks}
          value={pendingTasks}
          icon="⏳"
        />
        <StatCard
          title={t.upcomingJobs}
          value={upcomingJobs}
          icon="📅"
          actionButton={t.mySchedule}
          onClick={() => setActiveTab('schedule')}
        />
      </div>

      {/* Today's Schedule - Placeholder */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t.todaysJobs}</h3>
        <p className="text-slate-500 text-sm">Today's schedule view will be implemented here.</p>
      </div>

      {/* Recent Activity - Placeholder */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t.recentActivity}</h3>
        <p className="text-slate-500 text-sm">Recent activity feed will be implemented here.</p>
      </div>
    </div>
  )

  const renderWorkOrders = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t.workOrderList}</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-2 text-sm font-medium text-slate-600">{t.property}</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-slate-600">{t.issue}</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-slate-600">{t.priority}</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-slate-600">{t.status}</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-slate-600">{t.action}</th>
              </tr>
            </thead>
            <tbody>
              {workOrdersData.map((order) => (
                <tr key={order.id} className="border-b border-slate-100">
                  <td className="py-3 px-2 text-sm text-slate-800">{order.property}</td>
                  <td className="py-3 px-2 text-sm text-slate-800">{order.issue}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                      {t[order.priority]}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {t[order.status]}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleViewDetails(order)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        {t.viewDetails}
                      </button>
                      {order.status !== 'completed' && (
                        <button 
                          onClick={() => handleMarkComplete(order)}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          {t.markComplete}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t.mySchedule}</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-slate-700 mb-3">{t.todaysJobs}</h4>
            <div className="space-y-2">
              {todaysSchedule.map((job, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-sm">{job.time} - {job.task}</div>
                  <div className="text-xs text-slate-600">{job.property}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-3">{t.availability}</h4>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-green-800">Available Today</div>
              <div className="text-xs text-green-600">9:00 AM - 5:00 PM</div>
              <div className="text-xs text-slate-600 mt-2">Specialization: {teamData.specialization}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderReports = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t.workReports}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => handleGenerateReport(t.completionReport)}
            className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 text-left transition-all hover:shadow-md"
          >
            <div className="font-medium text-slate-800">{t.completionReport}</div>
            <div className="text-sm text-slate-600 mt-1">Generate completion summary</div>
          </button>
          <button 
            onClick={() => handleGenerateReport(t.issueReport)}
            className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 text-left transition-all hover:shadow-md"
          >
            <div className="font-medium text-slate-800">{t.issueReport}</div>
            <div className="text-sm text-slate-600 mt-1">Report issues encountered</div>
          </button>
          <button 
            onClick={() => handleGenerateReport(t.monthlyReport)}
            className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 text-left transition-all hover:shadow-md"
          >
            <div className="font-medium text-slate-800">{t.monthlyReport}</div>
            <div className="text-sm text-slate-600 mt-1">Monthly work summary</div>
          </button>
        </div>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t.teamSettings}</h3>
        <form onSubmit={handleUpdateSettings} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t.notifications}</label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="rounded" 
                  checked={settingsForm.emailNotifications}
                  onChange={(e) => setSettingsForm(prev => ({...prev, emailNotifications: e.target.checked}))}
                />
                <span className="text-sm text-slate-600">{t.emailNotifications}</span>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="rounded" 
                  checked={settingsForm.smsNotifications}
                  onChange={(e) => setSettingsForm(prev => ({...prev, smsNotifications: e.target.checked}))}
                />
                <span className="text-sm text-slate-600">{t.smsNotifications}</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t.workingHours}</label>
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="time" 
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                value={settingsForm.startTime}
                onChange={(e) => setSettingsForm(prev => ({...prev, startTime: e.target.value}))}
              />
              <input 
                type="time" 
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                value={settingsForm.endTime}
                onChange={(e) => setSettingsForm(prev => ({...prev, endTime: e.target.value}))}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t.specialization}</label>
            <input 
              type="text" 
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              value={settingsForm.specialization}
              onChange={(e) => setSettingsForm(prev => ({...prev, specialization: e.target.value}))}
            />
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  // Modal Component
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-xl"
            >
              ×
            </button>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </div>
    )
  }

  // Complete Work Order Modal
  const CompleteModal = () => (
    <Modal isOpen={showCompleteModal} onClose={() => setShowCompleteModal(false)} title={t.completeWorkOrder}>
      <form onSubmit={handleCompleteWorkOrder} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.completionNotes}</label>
          <textarea
            value={completionForm.completionNotes}
            onChange={(e) => setCompletionForm(prev => ({...prev, completionNotes: e.target.value}))}
            rows="3"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.timeSpent}</label>
          <input
            type="number"
            step="0.5"
            value={completionForm.timeSpent}
            onChange={(e) => setCompletionForm(prev => ({...prev, timeSpent: e.target.value}))}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.suppliesUsed}</label>
          <input
            type="text"
            value={completionForm.suppliesUsed}
            onChange={(e) => setCompletionForm(prev => ({...prev, suppliesUsed: e.target.value}))}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.issuesEncountered}</label>
          <textarea
            value={completionForm.issuesEncountered}
            onChange={(e) => setCompletionForm(prev => ({...prev, issuesEncountered: e.target.value}))}
            rows="2"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => setShowCompleteModal(false)}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {t.markAsComplete}
          </button>
        </div>
      </form>
    </Modal>
  )

  // Work Order Details Modal
  const DetailsModal = () => (
    <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title={t.workOrderDetails}>
      {selectedWorkOrder && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600">{t.property}</label>
              <p className="text-slate-800 font-medium">{selectedWorkOrder.property}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">{t.priority}</label>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedWorkOrder.priority)}`}>
                {t[selectedWorkOrder.priority]}
              </span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">{t.issue}</label>
            <p className="text-slate-800 font-medium">{selectedWorkOrder.issue}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">{t.description}</label>
            <p className="text-slate-800">{selectedWorkOrder.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600">{t.tenant}</label>
              <p className="text-slate-800">{selectedWorkOrder.tenant}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">{t.phone}</label>
              <p className="text-slate-800">{selectedWorkOrder.phone}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">{t.assignedDate}</label>
            <p className="text-slate-800">{selectedWorkOrder.assignedDate}</p>
          </div>
          <div className="pt-4">
            <button
              onClick={() => setShowDetailsModal(false)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}
    </Modal>
  )

  // Report Completion Modal
  const ReportModal = () => (
    <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title={t.reportCompletion}>
      <form onSubmit={handleReportCompletion} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Work Order</label>
          <select className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            {workOrdersData.filter(order => order.status === 'inProgress').map(order => (
              <option key={order.id} value={order.id}>
                {order.issue} - {order.property}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.completionNotes}</label>
          <textarea
            rows="4"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe what was completed..."
            required
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => setShowReportModal(false)}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {t.submitRequest}
          </button>
        </div>
      </form>
    </Modal>
  )

  // Request Supplies Modal
  const SuppliesModal = () => (
    <Modal isOpen={showSuppliesModal} onClose={() => setShowSuppliesModal(false)} title={t.requestSupplies}>
      <form onSubmit={handleRequestSupplies} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.itemNeeded}</label>
          <input
            type="text"
            value={suppliesForm.item}
            onChange={(e) => setSuppliesForm(prev => ({...prev, item: e.target.value}))}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.quantity}</label>
          <input
            type="number"
            value={suppliesForm.quantity}
            onChange={(e) => setSuppliesForm(prev => ({...prev, quantity: e.target.value}))}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.urgency}</label>
          <select
            value={suppliesForm.urgency}
            onChange={(e) => setSuppliesForm(prev => ({...prev, urgency: e.target.value}))}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="low">{t.low}</option>
            <option value="medium">{t.medium}</option>
            <option value="high">{t.high}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.reason}</label>
          <textarea
            value={suppliesForm.reason}
            onChange={(e) => setSuppliesForm(prev => ({...prev, reason: e.target.value}))}
            rows="3"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => setShowSuppliesModal(false)}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            {t.submitRequest}
          </button>
        </div>
      </form>
    </Modal>
  )

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading maintenance dashboard...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong</h1>
          <p className="text-slate-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Try Again
          </button>
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

      {/* Header */}
      <div className="relative z-20 bg-white/95 backdrop-blur-sm border-b-2 border-slate-300 shadow-sm mt-4">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Top Row with Language Switcher and Logout */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Welcome, {teamData.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-slate-300"
              >
                <span className="text-lg">🌐</span>
                <span>Language: {currentLanguage === 'en' ? 'EN' : 'বাং'}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span className="text-lg">🚪</span>
                <span>{t.logout}</span>
              </motion.button>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-slate-800">{t.welcome}, {teamData.name}</h1>
              <p className="text-slate-600 text-lg">{t.subtitle}</p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => setActiveTab('workOrders')}
              >
                📋 {t.viewWorkOrders}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => setShowReportModal(true)}
              >
                ✅ {t.reportCompletion}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => setShowSuppliesModal(true)}
              >
                📦 {t.requestSupplies}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="relative z-10 bg-white/60 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: t.overview },
              { id: 'workOrders', label: t.workOrders },
              { id: 'schedule', label: t.schedule },
              { id: 'reports', label: t.reports },
              { id: 'settings', label: t.settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'workOrders' && renderWorkOrders()}
          {activeTab === 'schedule' && renderSchedule()}
          {activeTab === 'reports' && renderReports()}
          {activeTab === 'settings' && renderSettings()}
        </motion.div>
      </div>

      {/* Modals */}
      <CompleteModal />
      <DetailsModal />
      <ReportModal />
      <SuppliesModal />
    </div>
  )
}

export default MaintenanceHomepage 